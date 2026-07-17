import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "../../lib/cn";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  toast: (props: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      {/* Toast Portal Area */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((item) => (
            <ToastCard key={item.id} item={item} onClose={() => removeToast(item.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// Internal Card Component for individual toasts
const ToastCard: React.FC<{ item: ToastItem; onClose: () => void }> = ({ item, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-status-success" />,
    warning: <AlertTriangle className="w-4 h-4 text-status-warning" />,
    error: <XCircle className="w-4 h-4 text-status-danger" />,
    info: <Info className="w-4 h-4 text-status-info" />,
  };

  const borders = {
    success: "border-status-success/20 bg-surface",
    warning: "border-status-warning/20 bg-surface",
    error: "border-status-danger/20 bg-surface",
    info: "border-status-info/20 bg-surface",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className={cn(
        "pointer-events-auto flex gap-3 p-4 rounded-lg border shadow-floating overflow-hidden relative max-w-md w-full",
        borders[item.type]
      )}
    >
      <div className="flex items-start gap-3 w-full">
        <div className="mt-0.5 shrink-0">{icons[item.type]}</div>
        <div className="flex-1 flex flex-col gap-0.5">
          <h3 className="text-xs font-semibold text-text-primary tracking-tight">{item.title}</h3>
          {item.message && <p className="text-xs text-text-secondary leading-normal">{item.message}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-0.5 rounded text-text-tertiary hover:bg-muted-surface hover:text-text-primary transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
