import React from "react";
import { cn } from "../../lib/cn";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, description, id, disabled, checked, onChange, ...props }, ref) => {
    const switchId = id || React.useId();
    return (
      <label
        htmlFor={switchId}
        className={cn(
          "inline-flex items-start gap-3 cursor-pointer text-sm text-text-primary select-none",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <div className="relative top-0.5">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              "w-9 h-5 rounded-full bg-border-strong transition-colors duration-200",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-accent-primary/45 peer-focus-visible:ring-offset-1",
              "peer-checked:bg-accent-primary",
              disabled && "bg-border-subtle"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
                "peer-checked:translate-x-4"
              )}
            />
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="font-sans font-medium text-text-primary text-sm">{label}</span>}
            {description && <span className="font-sans text-xs text-text-tertiary mt-0.5">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = "Switch";
