import React from "react";
import { 
  Calendar, 
  AlertTriangle, 
  Bookmark, 
  Clock, 
  Tag, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { ProjectTask, TaskStatus } from "../../types/project-task";
import { Priority } from "../../types";
import { Badge } from "../ui/Badge";
import TaskMenu from "./TaskMenu";

interface TaskCardProps {
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

export default function TaskCard({
  task,
  phases,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onChangeStatus,
  onToggleArchive,
  onDelete,
  isEditable,
}: TaskCardProps) {

  // Phase Title mapping
  const phaseTitle = React.useMemo(() => {
    if (!task.phaseId) return null;
    const match = phases.find((p) => p.id === task.phaseId);
    return match ? match.title : "Unassigned phase";
  }, [task.phaseId, phases]);

  // Priority Dot colors
  const getPriorityDot = (priority: Priority) => {
    switch (priority) {
      case "Critical":
        return "bg-status-danger";
      case "High":
        return "bg-status-warning";
      case "Medium":
        return "bg-accent-primary";
      case "Low":
      default:
        return "bg-text-tertiary";
    }
  };

  const getPriorityVariant = (priority: Priority) => {
    switch (priority) {
      case "Critical": return "danger";
      case "High": return "warning";
      case "Medium": return "info";
      default: return "secondary";
    }
  };

  // Due Date Friendly
  const formatFriendlyDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Overdue Check
  const isOverdue = React.useMemo(() => {
    if (!task.dueDate || task.status === "Completed") return false;
    const todayStr = new Date().toISOString().split("T")[0];
    return task.dueDate < todayStr;
  }, [task.dueDate, task.status]);

  // Handy quick-move actions for mobile/keyboard usability without opening full dropdown
  const statusLanes: TaskStatus[] = ["Backlog", "To do", "In progress", "Blocked", "Completed"];
  const currentLaneIndex = statusLanes.indexOf(task.status);
  
  const moveLeft = () => {
    if (currentLaneIndex > 0) {
      onChangeStatus(statusLanes[currentLaneIndex - 1]);
    }
  };

  const moveRight = () => {
    if (currentLaneIndex < statusLanes.length - 1) {
      onChangeStatus(statusLanes[currentLaneIndex + 1]);
    }
  };

  return (
    <div
      id={`task-card-${task.id}`}
      onClick={onOpenDetails}
      className={`group flex flex-col justify-between p-3.5 bg-bg-primary border rounded-xl hover:shadow-xs transition-all duration-150 cursor-pointer select-none ${
        task.isBlocked 
          ? "border-status-danger/40 hover:border-status-danger/60 bg-status-danger/[0.01]" 
          : "border-border-subtle hover:border-border-strong"
      }`}
    >
      {/* Top Meta Details Row */}
      <div className="flex items-start justify-between gap-1.5 mb-1.5">
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span className={`h-2 w-2 rounded-full shrink-0 ${getPriorityDot(task.priority)}`} title={`Priority: ${task.priority}`} />
          <Badge variant={getPriorityVariant(task.priority)} className="text-[9px] py-0 px-1 leading-none h-4">
            {task.priority}
          </Badge>
          {task.isArchived && (
            <span className="text-[8px] bg-bg-secondary text-text-tertiary border border-border-subtle px-1 rounded uppercase tracking-wider scale-95">Archived</span>
          )}
        </div>

        {/* Task Menu Options */}
        <div onClick={(e) => e.stopPropagation()} className="shrink-0 -mt-1 -mr-1">
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

      {/* Task Title */}
      <h4 className={`text-xs font-sans font-semibold text-text-primary leading-snug tracking-tight mb-2 group-hover:text-accent-primary transition-colors ${
        task.status === "Completed" ? "line-through text-text-tertiary" : ""
      }`}>
        {task.title}
      </h4>

      {/* Roadmap Phase context */}
      {phaseTitle && (
        <div className="flex items-center gap-1 text-[10px] text-text-secondary bg-muted-surface border border-border-subtle rounded px-1.5 py-0.5 mb-2 w-max max-w-full">
          <Bookmark className="w-2.5 h-2.5 text-text-tertiary shrink-0" />
          <span className="truncate font-medium">{phaseTitle}</span>
        </div>
      )}

      {/* Description Preview */}
      {task.description && (
        <p className="text-[11px] text-text-tertiary line-clamp-2 mb-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Blocker alert box if blocked */}
      {task.isBlocked && task.blockerReason && (
        <div className="text-[10px] bg-status-danger/5 border border-status-danger/20 rounded p-1.5 flex gap-1.5 text-status-danger mb-2.5">
          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
          <p className="line-clamp-2 leading-normal font-medium text-text-secondary">
            {task.blockerReason}
          </p>
        </div>
      )}

      {/* Bottom status & date tags row */}
      <div className="flex items-center justify-between gap-2 border-t border-border-subtle pt-2.5 mt-auto">
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Due date badge */}
          {task.dueDate ? (
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-medium ${
              isOverdue ? "text-status-danger font-bold" : "text-text-tertiary"
            }`}>
              <Calendar className="w-3 h-3 shrink-0" />
              <span>{formatFriendlyDate(task.dueDate)}</span>
            </span>
          ) : (
            <span className="text-[9px] text-text-tertiary italic font-sans">No due date</span>
          )}
        </div>

        {/* Labels tag list */}
        {task.labels.length > 0 ? (
          <div className="flex items-center gap-1 shrink-0">
            <Tag className="w-2.5 h-2.5 text-text-tertiary" />
            <span className="text-[10px] text-text-secondary font-mono font-bold">+{task.labels.length}</span>
          </div>
        ) : null}
      </div>

      {/* Handy manual left/right move sliders (only visible when hovering on card & editable) */}
      {isEditable && (
        <div onClick={(e) => e.stopPropagation()} className="hidden group-hover:flex items-center justify-between border-t border-border-subtle/50 mt-2 pt-1.5 gap-1">
          {currentLaneIndex > 0 ? (
            <button
              onClick={moveLeft}
              type="button"
              className="text-[10px] font-mono font-bold text-text-tertiary hover:text-accent-primary flex items-center gap-0.5 hover:bg-muted-surface px-1 py-0.5 rounded transition-all focus:outline-none"
              title={`Move to ${statusLanes[currentLaneIndex - 1]}`}
            >
              <ArrowLeft className="w-3 h-3" />
              <span>{statusLanes[currentLaneIndex - 1].split(" ")[0]}</span>
            </button>
          ) : <div />}

          {currentLaneIndex < statusLanes.length - 1 ? (
            <button
              onClick={moveRight}
              type="button"
              className="text-[10px] font-mono font-bold text-text-tertiary hover:text-accent-primary flex items-center gap-0.5 hover:bg-muted-surface px-1 py-0.5 rounded transition-all focus:outline-none"
              title={`Move to ${statusLanes[currentLaneIndex + 1]}`}
            >
              <span>{statusLanes[currentLaneIndex + 1].split(" ")[0]}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : <div />}
        </div>
      )}

    </div>
  );
}
