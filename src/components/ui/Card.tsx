import React from "react";
import { cn } from "../../lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "elevated" | "compact";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface border border-border-subtle rounded-lg overflow-hidden font-sans",
          variant === "default" && "shadow-subtle border-border-strong/70",
          variant === "interactive" && "shadow-subtle border-border-strong/70 hover:border-accent-primary hover:shadow-elevated transition-all duration-200 cursor-pointer",
          variant === "elevated" && "shadow-elevated border-border-strong/80",
          variant === "compact" && "shadow-subtle p-3 text-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("px-5 py-4 border-b border-border-subtle flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  );
};

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("px-5 py-3 bg-muted-surface border-t border-border-subtle flex items-center justify-end gap-3", className)} {...props}>
      {children}
    </div>
  );
};
