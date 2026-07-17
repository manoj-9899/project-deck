import React from "react";
import { cn } from "../../lib/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "accent" | "success" | "warning" | "danger";
}

export const Progress: React.FC<ProgressProps> = ({
  className,
  value,
  showValue = false,
  size = "md",
  variant = "accent",
  id,
  ...props
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3.5",
  };

  const variants = {
    accent: "bg-accent-primary",
    success: "bg-status-success",
    warning: "bg-status-warning",
    danger: "bg-status-danger",
  };

  return (
    <div id={id} className={cn("w-full flex flex-col gap-1.5 font-sans", className)} {...props}>
      {showValue && (
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-text-secondary">Progress</span>
          <span className="text-text-primary font-mono">{clampedValue}%</span>
        </div>
      )}
      <div className={cn("w-full bg-border-subtle rounded-full overflow-hidden border border-border-subtle/40", heights[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-300 ease-out", variants[variant])}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
