import React from "react";
import { cn } from "../../lib/cn";
import { motion } from "motion/react";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTabId: string;
  onChange: (id: string) => void;
  variant?: "underline" | "pills";
  className?: string;
  id?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTabId,
  onChange,
  variant = "underline",
  className,
  id,
}) => {
  return (
    <div
      id={id}
      className={cn(
        "flex items-center font-sans overflow-x-auto scrollbar-none",
        variant === "underline" && "border-b border-border-subtle gap-5",
        variant === "pills" && "bg-muted-surface p-1 rounded-lg border border-border-subtle gap-1 w-fit",
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-1 py-2 text-xs font-medium cursor-pointer transition-colors duration-200 outline-none select-none shrink-0",
              variant === "underline" && [
                "pb-2.5 pt-1.5",
                isActive ? "text-accent-primary" : "text-text-secondary hover:text-text-primary",
              ],
              variant === "pills" && [
                "px-3 py-1.5 rounded-md",
                isActive ? "text-text-primary font-semibold" : "text-text-secondary hover:text-text-primary",
              ]
            )}
          >
            {/* Sliding background for pills, sliding line for underline */}
            {isActive && variant === "underline" && (
              <motion.div
                layoutId="active-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-primary rounded-full"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            {isActive && variant === "pills" && (
              <motion.div
                layoutId="active-tab-pill"
                className="absolute inset-0 bg-surface shadow-subtle border border-border-subtle/50 rounded-md -z-1"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}

            {tab.icon && <span className="w-3.5 h-3.5 flex items-center justify-center opacity-75">{tab.icon}</span>}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
