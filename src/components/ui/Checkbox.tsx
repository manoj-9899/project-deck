import React from "react";
import { cn } from "../../lib/cn";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string | React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, disabled, checked, onChange, ...props }, ref) => {
    const checkboxId = id || React.useId();
    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "inline-flex items-center gap-2.5 cursor-pointer text-sm text-text-primary select-none",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              "w-4 h-4 rounded border border-border-strong bg-surface transition-all duration-150 flex items-center justify-center",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-accent-primary/45 peer-focus-visible:ring-offset-1",
              "peer-checked:bg-accent-primary peer-checked:border-accent-primary peer-checked:text-white",
              "hover:border-accent-primary/65",
              disabled && "peer-checked:bg-text-tertiary peer-checked:border-text-tertiary bg-muted-surface border-border-subtle"
            )}
          >
            <Check className="w-3 h-3 text-current stroke-[3] scale-0 transition-transform duration-150 peer-checked:scale-100" />
          </div>
        </div>
        {label && <span className="font-sans text-sm text-text-secondary peer-checked:text-text-primary">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
