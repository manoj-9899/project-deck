import React from "react";
import { cn } from "../../lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "neutral",
  children,
  id,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-sans font-medium border select-none transition-colors duration-150 w-fit";

  const variants = {
    neutral: "bg-muted-surface text-text-secondary border-border-strong",
    accent: "bg-accent-soft text-accent-primary border-accent-primary/20",
    success: "bg-status-success/5 text-status-success border-status-success/25",
    warning: "bg-status-warning/5 text-status-warning border-status-warning/25",
    danger: "bg-status-danger/5 text-status-danger border-status-danger/25",
    info: "bg-status-info/5 text-status-info border-status-info/25",
  };

  return (
    <span id={id} className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
