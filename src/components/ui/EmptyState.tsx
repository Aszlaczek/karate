import type { ReactNode } from "react";

interface EmptyStateProps {
  children: ReactNode;
  className?: string;
}

export default function EmptyState({ children, className = "" }: EmptyStateProps) {
  return <div className={`empty-state ${className}`}>{children}</div>;
}