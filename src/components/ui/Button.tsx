import React from "react";
import { cn } from "../../lib/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "icon-only";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      type = "button",
      id,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer";

    const variants = {
      primary: "bg-accent-primary text-white border border-accent-primary shadow-subtle hover:bg-accent-hover hover:border-accent-hover active:scale-[0.98]",
      secondary: "bg-surface text-text-primary border border-border-strong hover:bg-muted-surface hover:text-text-primary active:scale-[0.98]",
      ghost: "text-text-secondary hover:bg-muted-surface hover:text-text-primary active:bg-border-subtle",
      destructive: "bg-status-danger text-white border border-status-danger hover:opacity-90 active:scale-[0.98]",
      "icon-only": "p-2 text-text-secondary hover:bg-muted-surface hover:text-text-primary active:bg-border-subtle rounded-md",
    };

    const sizes = {
      sm: variant === "icon-only" ? "p-1.5 text-xs rounded-sm" : "px-3 py-1.5 text-xs rounded-sm gap-1.5",
      md: variant === "icon-only" ? "p-2.5 text-sm rounded-md" : "px-4 py-2 text-sm rounded-md gap-2",
      lg: variant === "icon-only" ? "p-3 text-base rounded-lg" : "px-5 py-2.5 text-base rounded-lg gap-2.5",
    };

    return (
      <button
        ref={ref}
        type={type}
        id={id}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && children}
      </button>
    );
  }
);

Button.displayName = "Button";
