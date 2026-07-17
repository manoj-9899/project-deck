import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/cn";
import { motion, AnimatePresence } from "motion/react";

export interface DropdownMenuItemType {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactElement;
  items: DropdownMenuItemType[];
  align?: "left" | "right";
  id?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = "right",
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Clone the trigger to inject the click handler
  const triggerElement = React.cloneElement(trigger, {
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsOpen((prev) => !prev);
      if (trigger.props.onClick) trigger.props.onClick(e);
    },
  });

  return (
    <div id={id} ref={containerRef} className="relative inline-block text-left">
      {triggerElement}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className={cn(
              "absolute z-40 mt-1.5 w-48 rounded-md bg-surface border border-border-strong shadow-floating p-1 focus:outline-none",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            <div className="flex flex-col">
              {items.map((item, index) => {
                // Render as separator if item is a divider placeholder (e.g., labels empty/hyphen)
                if (item.label === "---") {
                  return <div key={index} className="h-px bg-border-subtle my-1" />;
                }

                return (
                  <button
                    key={index}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      if (!item.disabled && item.onClick) {
                        item.onClick();
                      }
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2.5 w-full px-3 py-1.5 text-xs text-left rounded font-sans transition-colors cursor-pointer select-none",
                      item.destructive
                        ? "text-status-danger hover:bg-status-danger/5 hover:text-status-danger"
                        : "text-text-secondary hover:bg-muted-surface hover:text-text-primary",
                      item.disabled && "opacity-40 cursor-not-allowed hover:bg-transparent",
                      "outline-none focus-visible:bg-muted-surface focus-visible:text-text-primary"
                    )}
                  >
                    {item.icon && <span className="text-current opacity-70 w-3.5 h-3.5 flex items-center justify-center">{item.icon}</span>}
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
