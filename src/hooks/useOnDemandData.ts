import { useEffect, useState } from "react";

/**
 * Ładuje dane wpisu przy montażu modalu. `empty` przekazuj jako stałą modułową,
 * żeby efekt nie uruchamiał się przy każdym renderze.
 */
export function useOnDemandData<T>(
  id: string,
  loader: (id: string) => Promise<T>,
  empty: T,
): T {
  const [value, setValue] = useState<T>(empty);

  useEffect(() => {
    let active = true;
    setValue(empty);
    loader(id).then((next) => {
      if (active) setValue(next);
    });
    return () => {
      active = false;
    };
  }, [id, loader, empty]);

  return value;
}
