import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: "article" | "button";
  children: ReactNode;
}

export default function Card({ as: Component = "article", className = "", children, onClick, "aria-label": ariaLabel, ...rest }: CardProps) {
  const isInteractive = typeof onClick === "function";
  const tag = isInteractive ? "button" : Component;

  return (
    <Component
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      type={tag === "button" ? "button" : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}