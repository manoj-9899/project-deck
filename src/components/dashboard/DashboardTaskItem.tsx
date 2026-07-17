import React from "react";
import { Badge } from "../ui/Badge";
import { useToast } from "../ui/Toast";
import { Circle, PlayCircle, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { Task } from "../../types";

interface DashboardTaskItemProps {
  task: Task;
  key?: React.Key;
}

export default function DashboardTaskItem({ task }: DashboardTaskItemProps) {
  const { toast } = useToast();

  const handleTaskClick = () => {
    toast({
      type: "info",
      title: "Task Management",
      message: "Task details will be introduced with task management.",
      duration: 3000,
    });
  };

  const priorityColors = {
    critical: "bg-status-danger text-status-danger",
    high: "bg-status-warning text-status-warning",
    medium: "bg-status-info text-status-info",
    low: "bg-text-tertiary text-text-tertiary",
  } as Record<string, string>;

  return (
    <div
      onClick={handleTaskClick}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 border border-border-subtle hover:border-accent-primary bg-surface hover:bg-accent-soft/5 rounded-lg transition-all duration-200 cursor-pointer font-sans"
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {/* Status Checkbox Placeholder */}
        <div className="shrink-0 mt-0.5 text-text-tertiary group-hover:text-accent-primary transition-colors">
          {task.status === "done" ? (
            <CheckCircle2 className="w-4 h-4 text-status-success" />
          ) : task.status === "in-progress" ? (
            <PlayCircle className="w-4 h-4 text-accent-primary" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
        </div>

        {/* Title and Project Context */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-xs font-bold text-text-primary group-hover:text-accent-primary transition-colors truncate">
            {task.title}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono text-text-secondary">
              {task.projectName}
            </span>
            <span className="text-[9px] font-mono text-text-tertiary">•</span>
            {/* Priority Dot */}
            <div className="flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full ${priorityColors[task.priority.toLowerCase()]?.split(" ")[0] || "bg-text-tertiary"}`} />
              <span className="text-[9px] font-mono font-semibold uppercase text-text-tertiary">
                {task.priority}
              </span>
            </div>
          </div>
          
          {/* Blocked alert */}
          {task.isBlocked && (
            <div className="mt-1.5 flex items-center gap-1.5 bg-status-danger/[0.03] border border-status-danger/10 px-2 py-0.5 rounded text-[10px] text-status-danger">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold">Blocked:</span>
              <span className="truncate">{task.blockerReason}</span>
            </div>
          )}
        </div>
      </div>

      {/* Due date badge */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <Badge
          variant={
            task.dueDateLabel === "Today"
              ? "danger"
              : task.dueDateLabel === "Tomorrow"
              ? "warning"
              : "neutral"
          }
          className="font-mono text-[9px] px-2 py-0.5"
        >
          <Clock className="w-2.5 h-2.5 mr-1" />
          {task.dueDateLabel}
        </Badge>
      </div>
    </div>
  );
}
