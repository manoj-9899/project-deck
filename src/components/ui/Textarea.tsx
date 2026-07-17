import React from "react";
import { cn } from "../../lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, id, disabled, rows = 3, ...props }, ref) => {
    const textareaId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium text-text-secondary select-none"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          rows={rows}
          className={cn(
            "w-full font-sans text-sm text-text-primary bg-surface border border-border-strong rounded-md transition-all duration-200 outline-none placeholder:text-text-tertiary",
            "py-2 px-3 resize-y min-h-[80px]",
            "focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20",
            error && "border-status-danger focus:border-status-danger focus:ring-status-danger/20",
            disabled && "bg-muted-surface text-text-tertiary cursor-not-allowed border-border-subtle",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[11px] font-medium text-status-danger" id={`${textareaId}-error`}>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-[11px] text-text-tertiary" id={`${textareaId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
