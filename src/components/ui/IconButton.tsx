import React from "react";
import { cn } from "../../lib/cn";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  label: string; // Required for accessibility tooltips
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, variant = "secondary", size = "md", label, id, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer border";

    const variants = {
      primary: "bg-accent-primary text-white border-accent-primary shadow-subtle hover:bg-accent-hover",
      secondary: "bg-surface text-text-primary border-border-strong hover:bg-muted-surface",
      ghost: "text-text-secondary hover:bg-muted-surface hover:text-text-primary border-transparent",
      destructive: "bg-status-danger text-white border-status-danger hover:opacity-95",
    };

    const sizes = {
      sm: "p-1.5 text-xs rounded-sm",
      md: "p-2 text-sm rounded-md",
      lg: "p-2.5 text-base rounded-lg",
    };

    return (
      <button
        ref={ref}
        id={id}
        aria-label={label}
        title={label}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        <span className="flex items-center justify-center w-4 h-4">{icon}</span>
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
