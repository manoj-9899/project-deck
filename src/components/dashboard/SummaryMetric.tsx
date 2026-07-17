import React from "react";
import { Card } from "../ui/Card";
import { cn } from "../../lib/cn";

interface SummaryMetricProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  context: string;
  variant?: "neutral" | "success" | "warning" | "info" | "accent";
}

export default function SummaryMetric({
  icon,
  label,
  value,
  context,
  variant = "neutral",
}: SummaryMetricProps) {
  const borderColors = {
    neutral: "border-border-subtle",
    success: "border-status-success/20",
    warning: "border-status-warning/20",
    info: "border-status-info/20",
    accent: "border-accent-primary/20",
  };

  const textColors = {
    neutral: "text-text-primary",
    success: "text-status-success",
    warning: "text-status-warning",
    info: "text-status-info",
    accent: "text-accent-primary",
  };

  const bgStyles = {
    neutral: "bg-surface",
    success: "bg-status-success/[0.02]",
    warning: "bg-status-warning/[0.02]",
    info: "bg-status-info/[0.02]",
    accent: "bg-accent-primary/[0.02]",
  };

  const iconContainerColors = {
    neutral: "bg-muted-surface border-border-subtle text-text-secondary",
    success: "bg-status-success/5 border-status-success/10 text-status-success",
    warning: "bg-status-warning/5 border-status-warning/10 text-status-warning",
    info: "bg-status-info/5 border-status-info/10 text-status-info",
    accent: "bg-accent-primary/5 border-accent-primary/10 text-accent-primary",
  };

  return (
    <Card className={cn("overflow-hidden font-sans", bgStyles[variant], borderColors[variant])}>
      <div className="p-4 flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-text-secondary uppercase tracking-wider font-semibold">
            {label}
          </span>
          <div className={cn("p-1.5 border rounded-md shrink-0", iconContainerColors[variant])}>
            {icon}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className={cn("text-2xl font-extrabold tracking-tight font-mono", textColors[variant])}>
            {value}
          </span>
          <p className="text-[11px] text-text-tertiary leading-normal font-sans">
            {context}
          </p>
        </div>
      </div>
    </Card>
  );
}
