import { useEffect } from "react";

// title = null → bez zmiany (np. strona przekierowywana).
export const useDocumentTitle = (title: string | null) => {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
};
