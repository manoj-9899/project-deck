import React from "react";
import { cn } from "../../lib/cn";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, helperText, error, id, disabled, ...props }, ref) => {
    const selectId = id || React.useId();
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-medium text-text-secondary select-none"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={cn(
              "w-full font-sans text-sm text-text-primary bg-surface border border-border-strong rounded-md transition-all duration-200 outline-none appearance-none cursor-pointer",
              "py-2 pl-3 pr-10",
              "focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/20",
              error && "border-status-danger focus:border-status-danger focus:ring-status-danger/20",
              disabled && "bg-muted-surface text-text-tertiary cursor-not-allowed border-border-subtle",
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-surface text-text-primary">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 text-text-tertiary pointer-events-none flex items-center justify-center">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        {error && (
          <p className="text-[11px] font-medium text-status-danger" id={`${selectId}-error`}>
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-[11px] text-text-tertiary" id={`${selectId}-helper`}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
