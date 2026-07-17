import React from "react";
import { cn } from "../../lib/cn";
import { Button } from "./Button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  id,
  ...props
}) => {
  return (
    <div
      id={id}
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 border border-dashed border-border-strong rounded-xl bg-surface/50 font-sans max-w-md mx-auto",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="p-3.5 rounded-full bg-muted-surface border border-border-subtle text-text-secondary mb-4 shrink-0 shadow-subtle">
          <span className="w-6 h-6 flex items-center justify-center text-text-secondary">{icon}</span>
        </div>
      )}
      <h3 className="text-sm font-semibold text-text-primary tracking-tight">{title}</h3>
      <p className="text-xs text-text-secondary mt-1.5 leading-relaxed max-w-sm mb-5">
        {description}
      </p>

      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-3">
          {secondaryAction && (
            <Button variant="secondary" size="sm" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
          {primaryAction && (
            <Button variant="primary" size="sm" onClick={primaryAction.onClick}>
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
