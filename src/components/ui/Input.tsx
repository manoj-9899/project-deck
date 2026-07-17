import React from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leadingIcon?: React.ReactNode;
  trailingAction?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      leadingIcon,
      trailingAction,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-text-secondary select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leadingIcon && (
            <div className="absolute left-3 text-text-tertiary flex items-center justify-center pointer-events-none">
              {leadingIcon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            id={inputId}
            disabled={disabled}
            className={cn(
              "w-full font-sans text-sm text-text-primary bg-surface border border-border-strong rounded-md transition-all duration-200 outline-none placeholder:text-text-tertiary",
              "py-2 px-3",
              leadingIcon ? "pl-9" : "pl-3",
              trailingAction ? "pr-10" : "pr-3",
              "focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20",
              error && "border-status-danger focus:border-status-danger focus:ring-status-danger/20",
              disabled && "bg-muted-surface text-text-tertiary cursor-not-allowed border-border-subtle",
              className
            )}
            {...props}
          />
          {trailingAction && (
            <div className="absolute right-3 flex items-center justify-center">
              {trailingAction}
            </div>
          )}
        </div>
        {error && (
          <p className="text-[11px] font-medium text-status-danger" id={`${inputId}-error`}>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-[11px] text-text-tertiary" id={`${inputId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
