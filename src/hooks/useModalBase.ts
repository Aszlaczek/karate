import { useEffect, type MouseEvent } from "react";

// Wspólna logika modali: blokada scrolla, Esc, klik w tło.
export const useModalBase = (onClose: () => void) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  const onBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  return { onBackdropMouseDown };
};
