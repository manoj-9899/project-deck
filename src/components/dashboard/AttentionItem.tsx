import React from "react";
import { Badge } from "../ui/Badge";
import { AlertCircle, HelpCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { AttentionItem as AttentionItemType } from "../../types";

interface AttentionItemProps {
  item: AttentionItemType;
  key?: React.Key;
}

export default function AttentionItem({ item }: AttentionItemProps) {
  const borderStyles = {
    danger: "border-status-danger/30 border-l-status-danger bg-status-danger/[0.01]",
    warning: "border-status-warning/30 border-l-status-warning bg-status-warning/[0.01]",
    info: "border-status-info/30 border-l-status-info bg-status-info/[0.01]",
  };

  const textStyles = {
    danger: "text-status-danger",
    warning: "text-status-warning",
    info: "text-status-info",
  };

  const bgStyles = {
    danger: "bg-status-danger/5",
    warning: "bg-status-warning/5",
    info: "bg-status-info/5",
  };

  const icons = {
    danger: <AlertCircle className="w-4 h-4 text-status-danger shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />,
    info: <HelpCircle className="w-4 h-4 text-status-info shrink-0 mt-0.5" />,
  };

  const badgeVariants = {
    danger: "danger" as const,
    warning: "warning" as const,
    info: "info" as const,
  };

  return (
    <div
      className={`flex flex-col gap-3 p-4 border border-l-4 rounded-r-lg font-sans transition-all duration-200 hover:shadow-subtle ${borderStyles[item.severity]}`}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex gap-2.5 items-start">
          {icons[item.severity]}
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-text-primary">
                {item.projectName}
              </span>
              <span className="text-[10px] font-mono text-text-tertiary">/</span>
              <Badge variant={badgeVariants[item.severity]} className="font-mono text-[8px] px-1.5 py-0 uppercase">
                {item.statusLabel}
              </Badge>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              {item.reason}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested next action advice block */}
      <div className="flex items-center gap-2 bg-muted-surface border border-border-subtle rounded-md p-2 text-[11px] text-text-secondary">
        <span className="font-mono font-bold uppercase text-text-tertiary text-[9px] shrink-0 bg-surface border border-border-subtle px-1 rounded">
          Next Action
        </span>
        <span className="truncate flex-1">{item.suggestedAction}</span>
        <ArrowRight className="w-3 h-3 text-text-tertiary shrink-0" />
      </div>
    </div>
  );
}
