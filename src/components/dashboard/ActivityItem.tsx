import React from "react";
import { PlayCircle, Layers, ShieldCheck, FileText, Globe, PauseCircle, CheckSquare } from "lucide-react";
import { ActivityItem as ActivityItemType } from "../../types";

interface ActivityItemProps {
  activity: ActivityItemType;
  isLast?: boolean;
  key?: React.Key;
}

export default function ActivityItem({ activity, isLast = false }: ActivityItemProps) {
  const icons = {
    phase_started: <PlayCircle className="w-3.5 h-3.5 text-accent-primary" />,
    shell_completed: <Layers className="w-3.5 h-3.5 text-status-info" />,
    test_passed: <ShieldCheck className="w-3.5 h-3.5 text-status-success" />,
    doc_updated: <FileText className="w-3.5 h-3.5 text-text-secondary" />,
    deployed: <Globe className="w-3.5 h-3.5 text-status-success" />,
    paused: <PauseCircle className="w-3.5 h-3.5 text-status-warning" />,
    task_completed: <CheckSquare className="w-3.5 h-3.5 text-status-success" />,
  };

  const iconBgs = {
    phase_started: "bg-accent-soft/40 border-accent-primary/20",
    shell_completed: "bg-status-info/5 border-status-info/10",
    test_passed: "bg-status-success/5 border-status-success/10",
    doc_updated: "bg-muted-surface border-border-subtle",
    deployed: "bg-status-success/5 border-status-success/10",
    paused: "bg-status-warning/5 border-status-warning/10",
    task_completed: "bg-status-success/5 border-status-success/10",
  };

  return (
    <div className="flex gap-4 font-sans relative">
      {/* Visual Timeline connector line */}
      {!isLast && (
        <span className="absolute left-[13px] top-7 bottom-0 w-0.5 bg-border-subtle/60" aria-hidden="true" />
      )}
      
      {/* Icon node */}
      <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 z-10 ${iconBgs[activity.type]}`}>
        {icons[activity.type] || <FileText className="w-3.5 h-3.5 text-text-secondary" />}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-0.5 pb-5 flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs text-text-primary leading-tight font-medium">
            {activity.action}
          </p>
          <span className="text-[10px] font-mono text-text-tertiary shrink-0">
            {activity.timeContext}
          </span>
        </div>
        <span className="text-[10px] font-mono text-text-tertiary">
          Project: <span className="text-text-secondary font-medium">{activity.projectName}</span>
        </span>
      </div>
    </div>
  );
}
