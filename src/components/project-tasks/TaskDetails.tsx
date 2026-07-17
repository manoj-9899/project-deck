import React from "react";
import { 
  Calendar, 
  AlertTriangle, 
  Bookmark, 
  Clock, 
  Tag, 
  CheckCircle2, 
  StickyNote,
  Pencil,
  Copy,
  Archive,
  Trash2
} from "lucide-react";
import { Sheet } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { ProjectTask, TaskStatus } from "../../types/project-task";
import { Priority } from "../../types";
import { Badge } from "../ui/Badge";

interface TaskDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  task: ProjectTask | null;
  phases: Array<{ id: string; title: string }>;
  onEdit: (task: ProjectTask) => void;
  onDuplicate: (taskId: string) => void;
  onChangeStatus: (taskId: string, status: TaskStatus) => void;
  onToggleArchive: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  isEditable: boolean;
}

export default function TaskDetails({
  isOpen,
  onClose,
  task,
  phases,
  onEdit,
  onDuplicate,
  onChangeStatus,
  onToggleArchive,
  onDelete,
  isEditable,
}: TaskDetailsProps) {
  
  if (!task) return null;

  // Find mapped phase title
  const phaseTitle = React.useMemo(() => {
    if (!task.phaseId) return null;
    const match = phases.find((p) => p.id === task.phaseId);
    return match ? match.title : "Unassigned phase";
  }, [task.phaseId, phases]);

  // Priority layout helpers
  const getPriorityColor = (prio: Priority) => {
    switch (prio) {
      case "Critical": return "danger" as const;
      case "High": return "warning" as const;
      case "Medium": return "info" as const;
      case "Low":
      default: return "secondary" as const;
    }
  };

  // Status badge styles
  const getStatusBadgeClass = (status: TaskStatus) => {
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

  const formatDate = (isoString?: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return "No target date set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = React.useMemo(() => {
    if (!task.dueDate || task.status === "Completed") return false;
    const todayStr = new Date().toISOString().split("T")[0];
    return task.dueDate < todayStr;
  }, [task.dueDate, task.status]);

  return (
    <Sheet
      id="task-details-drawer"
      isOpen={isOpen}
      onClose={onClose}
      title="Task Detailed Overview"
      side="right"
      description="View full parameters, engineering checklists, and phase linkage details."
      footer={
        isEditable ? (
          <div className="flex items-center justify-between w-full font-sans">
            <Button
              id="details-delete-btn"
              variant="ghost"
              size="sm"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="text-text-tertiary hover:text-status-danger hover:bg-status-danger/10 border-transparent text-xs font-semibold"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete Task
            </Button>
            <div className="flex items-center gap-2">
              <Button
                id="details-duplicate-btn"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onDuplicate(task.id);
                  onClose();
                }}
                className="text-xs font-semibold"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                Duplicate
              </Button>
              <Button
                id="details-edit-btn"
                size="sm"
                onClick={() => {
                  onEdit(task);
                  onClose();
                }}
                className="text-xs font-semibold"
              >
                <Pencil className="w-3.5 h-3.5 mr-1" />
                Edit Task
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-xs text-text-tertiary italic text-center w-full font-mono">
            Archived/Frozen workspace — view-only privileges active
          </div>
        )
      }
    >
      <div className="space-y-6 font-sans text-xs">
        {/* Title and Archive Notice */}
        <div>
          {task.isArchived && (
            <div className="bg-bg-secondary border border-border-subtle rounded-lg px-3 py-2 mb-3 text-text-tertiary flex items-center gap-2 font-mono">
              <Archive className="w-3.5 h-3.5" />
              <span>This task has been archived. Controls are frozen.</span>
            </div>
          )}
          <h3 className="text-sm font-sans font-bold text-text-primary leading-snug tracking-tight">
            {task.title}
          </h3>
        </div>

        {/* Status and Priority Block */}
        <div className="grid grid-cols-2 gap-4 border-t border-b border-border-subtle py-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">Current Status</span>
            <span className={`inline-flex items-center border rounded px-2.5 py-1 w-max font-semibold text-[11px] leading-none ${getStatusBadgeClass(task.status)}`}>
              {task.status}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">Priority tier</span>
            <Badge variant={getPriorityColor(task.priority)} className="w-max px-2.5 py-1 text-[11px] h-max">
              {task.priority}
            </Badge>
          </div>
        </div>

        {/* Linked Roadmap Phase */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">Roadmap linkage</span>
          {phaseTitle ? (
            <div className="flex items-start gap-2.5 p-3 border border-border-subtle bg-bg-secondary rounded-lg">
              <Bookmark className="w-4 h-4 text-accent-primary mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-text-primary block">{phaseTitle}</span>
                <span className="text-[11px] text-text-tertiary mt-0.5 block leading-relaxed">
                  Linked deliverables contribute to this phase completion parameters.
                </span>
              </div>
            </div>
          ) : (
            <p className="text-text-tertiary italic">Unassigned (Not linked to any roadmap phase)</p>
          )}
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">Target due date</span>
          <div className="flex items-center gap-2 text-text-secondary">
            <Calendar className={`w-4 h-4 shrink-0 ${isOverdue ? "text-status-danger" : "text-text-tertiary"}`} />
            <span className={`font-semibold ${isOverdue ? "text-status-danger" : ""}`}>
              {formatDueDate(task.dueDate)}
            </span>
            {isOverdue && (
              <span className="text-[9px] uppercase tracking-wider bg-status-danger/10 text-status-danger px-1.5 py-0.5 rounded font-mono font-bold">
                OVERDUE
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">Detailed Deliverables</span>
          {task.description ? (
            <p className="text-text-secondary leading-relaxed bg-bg-secondary p-3 border border-border-subtle rounded-lg whitespace-pre-wrap font-medium">
              {task.description}
            </p>
          ) : (
            <p className="text-text-tertiary italic">No detailed deliverables logged.</p>
          )}
        </div>

        {/* Blocker alert if active */}
        {task.isBlocked && task.blockerReason && (
          <div className="bg-status-danger/[0.03] border border-status-danger/30 rounded-lg p-3.5 flex items-start gap-2.5 text-status-danger">
            <AlertTriangle className="w-4.5 h-4.5 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-[10px] uppercase tracking-wide block">Active blocker logged</span>
              <p className="mt-1 text-text-secondary leading-relaxed font-semibold">{task.blockerReason}</p>
            </div>
          </div>
        )}

        {/* Labels / Tags */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">Custom Labels</span>
          {task.labels.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {task.labels.map((l) => (
                <span
                  key={l}
                  className="inline-flex items-center gap-1 bg-bg-secondary text-text-secondary border border-border-subtle px-2 py-0.5 rounded-full font-sans font-medium text-[10px]"
                >
                  <Tag className="w-2.5 h-2.5 text-text-tertiary" />
                  <span>{l}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-text-tertiary italic">No custom labels mapped.</p>
          )}
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary">Engineering logs / Notes</span>
          {task.notes ? (
            <div className="flex items-start gap-2 p-3 bg-status-warning/5 border border-status-warning/20 text-text-secondary rounded-lg">
              <StickyNote className="w-4 h-4 text-status-warning mt-0.5 shrink-0" />
              <p className="whitespace-pre-wrap leading-relaxed font-medium flex-1 min-w-0">
                {task.notes}
              </p>
            </div>
          ) : (
            <p className="text-text-tertiary italic">No technical logs or references stored.</p>
          )}
        </div>

        {/* Timeline Metas */}
        <div className="border-t border-border-subtle pt-4 space-y-2 text-[10px] font-mono text-text-tertiary">
          <div className="flex justify-between">
            <span>CREATED:</span>
            <span>{formatDate(task.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span>LAST MODIFIED:</span>
            <span>{formatDate(task.updatedAt)}</span>
          </div>
          {task.completedAt && (
            <div className="flex justify-between text-status-success font-semibold">
              <span>COMPLETED:</span>
              <span>{formatDate(task.completedAt)}</span>
            </div>
          )}
        </div>
      </div>
    </Sheet>
  );
}
