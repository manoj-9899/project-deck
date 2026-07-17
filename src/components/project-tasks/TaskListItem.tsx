import React from "react";
import { 
  Calendar, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Tag, 
  Bookmark,
  StickyNote
} from "lucide-react";
import { ProjectTask, TaskStatus } from "../../types/project-task";
import { Priority } from "../../types";
import { Badge } from "../ui/Badge";
import TaskMenu from "./TaskMenu";

interface TaskListItemProps {
  key?: React.Key;
  task: ProjectTask;
  phases: Array<{ id: string; title: string }>;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onChangeStatus: (status: TaskStatus) => void;
  onToggleArchive: () => void;
  onDelete: () => void;
  isEditable: boolean;
}

export default function TaskListItem({
  task,
  phases,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onChangeStatus,
  onToggleArchive,
  onDelete,
  isEditable,
}: TaskListItemProps) {
  
  // Find mapped phase title
  const phaseTitle = React.useMemo(() => {
    if (!task.phaseId) return null;
    const match = phases.find((p) => p.id === task.phaseId);
    return match ? match.title : "Unassigned phase";
  }, [task.phaseId, phases]);

  // Priority color mapping
  const priorityBadgeProps = (priority: Priority) => {
    switch (priority) {
      case "Critical":
        return { variant: "danger" as const, label: "Critical" };
      case "High":
        return { variant: "warning" as const, label: "High" };
      case "Medium":
        return { variant: "info" as const, label: "Medium" };
      case "Low":
      default:
        return { variant: "secondary" as const, label: "Low" };
    }
  };

  // Status color mapping
  const statusBadgeProps = (status: TaskStatus) => {
    switch (status) {
      case "Completed":
        return "bg-status-success/10 text-status-success border-status-success/30";
      case "Blocked":
        return "bg-status-danger/10 text-status-danger border-status-danger/30 animate-pulse";
      case "In progress":
        return "bg-accent-subtle/20 text-accent-primary border-accent-subtle";
      case "To do":
        return "bg-bg-primary text-text-secondary border-border-subtle";
      case "Backlog":
      default:
        return "bg-muted-surface text-text-tertiary border-border-subtle";
    }
  };

  // Helper to format dates
  const formatFriendlyDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Overdue check
  const isOverdue = React.useMemo(() => {
    if (!task.dueDate || task.status === "Completed") return false;
    const todayStr = new Date().toISOString().split("T")[0];
    return task.dueDate < todayStr;
  }, [task.dueDate, task.status]);

  const prio = priorityBadgeProps(task.priority);

  return (
    <div
      id={`task-list-item-${task.id}`}
      onClick={onOpenDetails}
      className={`group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-bg-primary border rounded-xl hover:shadow-xs transition-all duration-150 cursor-pointer ${
        task.isBlocked 
          ? "border-status-danger/40 hover:border-status-danger/60 bg-status-danger/[0.01]" 
          : "border-border-subtle hover:border-border-strong"
      }`}
    >
      
      {/* 1. Left Side Information Area */}
      <div className="flex-1 min-w-0 flex items-start gap-3">
        {/* Status Indicator */}
        <div className="mt-0.5 shrink-0">
          {task.status === "Completed" ? (
            <CheckCircle2 className="w-4.5 h-4.5 text-status-success" />
          ) : task.isBlocked ? (
            <AlertTriangle className="w-4.5 h-4.5 text-status-danger" />
          ) : (
            <div className={`w-4 h-4 rounded-full border-2 ${
              task.status === "In progress" 
                ? "border-accent-primary bg-accent-primary/10 animate-pulse" 
                : "border-text-tertiary"
            }`} />
          )}
        </div>

        {/* Text Stack */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-sm font-sans font-semibold text-text-primary ${
              task.status === "Completed" ? "line-through text-text-tertiary" : ""
            }`}>
              {task.title}
            </span>

            {/* Priority and Status badges */}
            <Badge variant={prio.variant} className="text-[10px] py-0 px-1.5 h-4.5">
              {prio.label}
            </Badge>

            <span className={`inline-flex items-center text-[10px] font-mono font-medium border rounded px-1.5 py-0 h-4.5 leading-none ${statusBadgeProps(task.status)}`}>
              {task.status}
            </span>

            {task.isArchived && (
              <span className="text-[9px] font-mono bg-bg-secondary text-text-tertiary border border-border-subtle rounded px-1 h-4.5 inline-flex items-center">
                ARCHIVED
              </span>
            )}
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-text-tertiary mt-1 line-clamp-1">
              {task.description}
            </p>
          )}

          {/* Sub-line: Phase + Blocker warnings */}
          <div className="flex flex-wrap items-center gap-2.5 mt-2 text-[11px] text-text-tertiary">
            {/* Phase tag */}
            {phaseTitle && (
              <span className="inline-flex items-center gap-1 font-sans font-medium text-text-secondary bg-muted-surface border border-border-subtle px-1.5 py-0.5 rounded">
                <Bookmark className="w-3 h-3 text-text-tertiary" />
                <span>{phaseTitle}</span>
              </span>
            )}

            {/* Due date tag */}
            {task.dueDate && (
              <span className={`inline-flex items-center gap-1 font-mono ${
                isOverdue ? "text-status-danger font-semibold" : ""
              }`}>
                <Calendar className="w-3 h-3 shrink-0" />
                <span>Due {formatFriendlyDate(task.dueDate)}</span>
                {isOverdue && <span className="text-[9px] uppercase tracking-wide bg-status-danger/10 px-1 py-0.5 rounded">Overdue</span>}
              </span>
            )}

            {/* Note tag indicator */}
            {task.notes && (
              <span className="inline-flex items-center gap-1" title={task.notes}>
                <StickyNote className="w-3 h-3 text-text-tertiary shrink-0" />
                <span className="truncate max-w-[120px]">Notes logged</span>
              </span>
            )}

            {/* Updated context */}
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-text-tertiary ml-auto sm:ml-0">
              <Clock className="w-3 h-3 shrink-0" />
              <span>Updated {new Date(task.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </span>
          </div>

          {/* Blocker reason detailed alert */}
          {task.isBlocked && task.blockerReason && (
            <div className="mt-2 text-xs bg-status-danger/5 border border-status-danger/20 rounded-md p-2 flex items-start gap-2 text-status-danger">
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-[11px] uppercase tracking-wide block">Blocked reason:</span>
                <p className="mt-0.5 text-text-secondary font-medium leading-relaxed">{task.blockerReason}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Right Side Controls Area */}
      <div className="flex items-center gap-2 justify-between md:justify-end border-t border-border-subtle pt-3 md:border-t-0 md:pt-0 shrink-0">
        {/* Custom Labels list */}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 max-w-[150px] md:max-w-[200px]">
            {task.labels.map((l) => (
              <span
                key={l}
                className="inline-flex items-center gap-0.5 text-[10px] font-sans font-medium bg-bg-secondary text-text-secondary border border-border-subtle px-1.5 py-0.5 rounded-full"
              >
                <Tag className="w-2.5 h-2.5 text-text-tertiary shrink-0" />
                <span>{l}</span>
              </span>
            ))}
          </div>
        )}

        {/* Custom contextual trigger */}
        <div onClick={(e) => e.stopPropagation()} className="ml-auto">
          <TaskMenu
            task={task}
            onOpenDetails={onOpenDetails}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onChangeStatus={onChangeStatus}
            onToggleArchive={onToggleArchive}
            onDelete={onDelete}
            isEditable={isEditable}
          />
        </div>
      </div>

    </div>
  );
}
