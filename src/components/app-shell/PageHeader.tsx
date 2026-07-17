import React from "react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";

export interface PageHeaderAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
}

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  primaryAction?: PageHeaderAction;
  secondaryAction?: PageHeaderAction;
  metadata?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  eyebrow,
  primaryAction,
  secondaryAction,
  metadata,
  className,
}: PageHeaderProps) {
  return (
    <div 
      className={cn(
        "flex flex-col gap-4 border-b border-border-subtle pb-5 md:flex-row md:items-start md:justify-between md:gap-8",
        className
      )}
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        {eyebrow && (
          <span className="text-[10px] font-mono text-accent-primary uppercase tracking-wider font-semibold">
            {eyebrow}
          </span>
        )}
        
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-xl md:text-2xl font-bold font-sans text-text-primary tracking-tight">
            {title}
          </h1>
          {metadata && (
            <div className="flex items-center shrink-0">
              {metadata}
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-xs md:text-sm text-text-secondary leading-relaxed max-w-2xl font-sans mt-0.5">
            {description}
          </p>
        )}
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="flex flex-wrap items-center gap-2 md:mt-1 shrink-0">
          {secondaryAction && (
            <Button
              variant={secondaryAction.variant || "secondary"}
              size="sm"
              onClick={secondaryAction.onClick}
              className="px-3.5"
            >
              {secondaryAction.icon && <span className="mr-1.5">{secondaryAction.icon}</span>}
              {secondaryAction.label}
            </Button>
          )}
          
          {primaryAction && (
            <Button
              variant={primaryAction.variant || "primary"}
              size="sm"
              onClick={primaryAction.onClick}
              className="px-3.5"
            >
              {primaryAction.icon && <span className="mr-1.5">{primaryAction.icon}</span>}
              {primaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
