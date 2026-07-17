import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./Button";

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  side?: "right" | "left" | "bottom";
  id?: string;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  side = "right",
  id,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Handle escape key to close sheet
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Focus trap and focus restoration
  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement as HTMLElement;
    const focusableElementsString = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const timer = setTimeout(() => {
      if (containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(focusableElementsString);
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        } else {
          containerRef.current.focus();
        }
      }
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && containerRef.current) {
        const focusableElements = Array.from(
          containerRef.current.querySelectorAll(focusableElementsString)
        ) as HTMLElement[];

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    };
  }, [isOpen]);

  const slideVariants = {
    right: {
      initial: { x: "100%" },
      animate: { x: 0 },
      exit: { x: "100%" },
      classes: "top-0 right-0 h-full w-full sm:max-w-md border-l",
    },
    left: {
      initial: { x: "-100%" },
      animate: { x: 0 },
      exit: { x: "-100%" },
      classes: "top-0 left-0 h-full w-full sm:max-w-md border-r",
    },
    bottom: {
      initial: { y: "100%" },
      animate: { y: 0 },
      exit: { y: "100%" },
      classes: "bottom-0 left-0 right-0 w-full max-h-[85vh] border-t rounded-t-xl",
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id={id} className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Sheet Container */}
          <motion.div
            ref={containerRef}
            tabIndex={-1}
            initial={slideVariants[side].initial}
            animate={slideVariants[side].animate}
            exit={slideVariants[side].exit}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className={cn(
              "fixed bg-surface border-border-strong shadow-floating flex flex-col z-10 outline-none",
              slideVariants[side].classes
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            aria-describedby={description ? "sheet-desc" : undefined}
          >
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-border-subtle flex items-start justify-between gap-4 shrink-0">
              <div className="flex flex-col gap-0.5">
                <h2 id="sheet-title" className="text-base font-semibold text-text-primary tracking-tight">
                  {title}
                </h2>
                {description && (
                  <p id="sheet-desc" className="text-xs text-text-tertiary">
                    {description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1 rounded-md h-7 w-7 text-text-secondary hover:text-text-primary hover:bg-muted-surface border-transparent"
                aria-label="Close panel"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-text-secondary leading-relaxed font-sans">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 bg-muted-surface border-t border-border-subtle flex items-center justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
