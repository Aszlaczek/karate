import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("node:fs", async (importOriginal) => {
  const actual = await importOriginal<typeof import("node:fs")>();
  return { ...actual, createReadStream: vi.fn((path: string) => `body:${path}`) };
});

import { deleteKeys, listKeys, uploadFiles } from "../r2-ops.mjs";

const client = () => ({ send: vi.fn() });

describe("operacje R2", () => {
  beforeEach(() => vi.clearAllMocks());

  it("listuje wszystkie strony i pomija wpisy bez klucza", async () => {
    const s3 = client();
    s3.send
      .mockResolvedValueOnce({ Contents: [{ Key: "a/video/1.mp4" }], NextContinuationToken: "next" })
      .mockResolvedValueOnce({ Contents: [{ Key: "b/poster/1.jpg" }, {}] });
    const keys = await listKeys(s3 as never, "bucket");
    expect([...keys]).toEqual(["a/video/1.mp4", "b/poster/1.jpg"]);
    expect(s3.send).toHaveBeenCalledTimes(2);
    expect(s3.send.mock.calls[0][0].input).toEqual({ Bucket: "bucket", ContinuationToken: undefined });
    expect(s3.send.mock.calls[1][0].input.ContinuationToken).toBe("next");
  });

  it("wysyła pliki z katalogu z poprawnym typem i cache", async () => {
    const s3 = client();
    s3.send.mockResolvedValue({});
    const done: Array<[number, number]> = [];
    await uploadFiles(s3 as never, "bucket", [
      { key: "a/video/1.mp4", file: "/build/a/video/1.mp4" },
      { key: "a/poster/1.jpg", file: "/build/a/poster/1.jpg" },
    ], (current, total) => done.push([current, total]));

    const inputs = s3.send.mock.calls.map((call: never[]) => call[0].input);
    expect(inputs).toEqual([
      {
        Bucket: "bucket",
        Key: "a/video/1.mp4",
        Body: "body:/build/a/video/1.mp4",
        ContentType: "video/mp4",
        CacheControl: "public, max-age=31536000, immutable",
      },
      {
        Bucket: "bucket",
        Key: "a/poster/1.jpg",
        Body: "body:/build/a/poster/1.jpg",
        ContentType: "image/jpeg",
        CacheControl: "public, max-age=31536000, immutable",
      },
    ]);
    expect(done).toEqual([[1, 2], [2, 2]]);
  });

  it("dzieli usuwanie na partie i zgłasza błędy z odpowiedzi", async () => {
    const s3 = client();
    s3.send.mockResolvedValue({});
    await deleteKeys(s3 as never, "bucket", Array.from({ length: 1001 }, (_, i) => `k${i}`));
    expect(s3.send).toHaveBeenCalledTimes(2);
    expect(s3.send.mock.calls[0][0].input.Delete.Objects).toHaveLength(1000);
    expect(s3.send.mock.calls[1][0].input.Delete.Objects).toHaveLength(1);
    expect(s3.send.mock.calls[0][0].input.Delete.Quiet).toBe(true);

    s3.send.mockReset();
    s3.send.mockResolvedValue({ Errors: [{ Key: "k1", Code: "AccessDenied" }] });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(deleteKeys(s3 as never, "bucket", ["k1"])).rejects.toThrow(/Usuwanie nie zostało ukończone/);
    expect(error).toHaveBeenCalledWith(" - k1: AccessDenied");
    error.mockRestore();
  });
});
