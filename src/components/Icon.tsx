import type { ReactNode } from "react";

export type IconName = "arrow" | "book" | "check" | "chevron" | "close" | "menu" | "search" | "target";

const paths: Record<IconName, ReactNode> = {
  arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v17H6.5A2.5 2.5 0 0 0 4 22.5z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v17h4.5a2.5 2.5 0 0 1 2.5 2.5z" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
};

const Icon = ({ name, size = 20 }: { name: IconName; size?: number }) => (
  <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>
    <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8">{paths[name]}</g>
  </svg>
);

export default Icon;
