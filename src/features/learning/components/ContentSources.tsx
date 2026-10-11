import type { ContentSource } from "@/data/types";

export default function ContentSources({ sources }: { sources: ContentSource[] }) {
  return (
    <div className="content-sources">
      <span>Źródła i dalsza lektura</span>
      {sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} <span aria-label="otwiera nową kartę">↗</span></a>)}
    </div>
  );
}
