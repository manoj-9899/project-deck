import React from "react";
import { 
  ProjectMilestone, 
  MilestoneStatus,
  PhaseStatus
} from "../../types/project-roadmap";
import { Priority } from "../../types";
import { Badge } from "../ui/Badge";
import { 
  ArrowUp, 
  ArrowDown, 
  Edit, 
  Trash2, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Play,
  CheckCircle,
  FastForward
} from "lucide-react";

interface MilestoneItemProps {
  milestone: ProjectMilestone;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onStatusChange: (status: MilestoneStatus) => void;
  isFirst: boolean;
  isLast: boolean;
  isReadOnly: boolean;
}

export const MilestoneItem: React.FC<MilestoneItemProps> = ({
  milestone,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onStatusChange,
  isFirst,
  isLast,
  isReadOnly
}) => {
  // Map priorities to badge colors
  const priorityColors: Record<Priority, "danger" | "warning" | "info" | "neutral"> = {
    Critical: "danger",
    High: "warning",
    Medium: "info",
    Low: "neutral"
  };

  const statusIcons: Record<MilestoneStatus, React.ReactNode> = {
    Pending: <HelpCircle className="w-3.5 h-3.5 text-text-tertiary" />,
    "In progress": <Play className="w-3.5 h-3.5 text-accent-primary animate-pulse" />,
    Blocked: <AlertCircle className="w-3.5 h-3.5 text-status-danger" />,
    Completed: <CheckCircle className="w-3.5 h-3.5 text-status-success" />,
    Skipped: <FastForward className="w-3.5 h-3.5 text-text-tertiary" />
  };

  const handleToggleComplete = () => {
    if (isReadOnly) return;
    const nextStatus: MilestoneStatus = milestone.status === "Completed" ? "Pending" : "Completed";
    onStatusChange(nextStatus);
  };

  return (
    <div 
      id={`milestone-item-${milestone.id}`}
      className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-bg-primary border border-border-subtle hover:border-border-strong rounded-xl gap-3 transition-all ${
        milestone.status === "Completed" ? "opacity-85" : ""
      }`}
    >
      {/* Left section: checkbox & details */}
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <input
          type="checkbox"
          checked={milestone.status === "Completed"}
          disabled={isReadOnly}
          onChange={handleToggleComplete}
          className="mt-1 rounded border-border-subtle text-accent-primary focus:ring-accent-primary focus:ring-opacity-20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          title={milestone.status === "Completed" ? "Mark incomplete" : "Mark completed"}
        />
        
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span 
              className={`text-xs font-semibold text-text-primary leading-tight truncate ${
                milestone.status === "Completed" ? "line-through text-text-tertiary font-medium" : ""
              }`}
            >
              {milestone.title}
            </span>
            
            <span className="flex items-center gap-1 shrink-0">
              <Badge variant={priorityColors[milestone.priority]} size="sm">
                {milestone.priority}
              </Badge>
              <span className="text-[10px] text-text-tertiary font-mono ml-1">MILESTONE</span>
            </span>
          </div>

          {milestone.description && (
            <p className="text-[11px] text-text-secondary leading-normal pr-4">
              {milestone.description}
            </p>
          )}

          {/* Date Context */}
          {milestone.targetDate && (
            <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary mt-0.5">
              <Calendar className="w-3 h-3" />
              <span>Target: {milestone.targetDate}</span>
              {milestone.completedDate && milestone.status === "Completed" && (
                <>
                  <span>&bull;</span>
                  <span className="text-status-success font-medium">Finished: {milestone.completedDate}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Status switcher, move controls, action buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t border-border-subtle sm:border-0 pt-2.5 sm:pt-0 shrink-0">
        {/* Status indicator selector */}
        {!isReadOnly ? (
          <div className="flex items-center gap-1.5 p-1 bg-muted-surface border border-border-subtle rounded-lg">
            <div className="shrink-0 pl-1">{statusIcons[milestone.status]}</div>
            <select
              value={milestone.status}
              onChange={(e) => onStatusChange(e.target.value as MilestoneStatus)}
              className="bg-transparent border-0 text-[10px] font-semibold text-text-primary pr-2 focus:ring-0 cursor-pointer outline-none"
              title="Change milestone status"
            >
              <option value="Pending">Pending</option>
              <option value="In progress">In progress</option>
              <option value="Blocked">Blocked</option>
              <option value="Completed">Completed</option>
              <option value="Skipped">Skipped</option>
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted-surface border border-border-subtle rounded-lg text-[10px] font-semibold text-text-secondary">
            {statusIcons[milestone.status]}
            <span className="capitalize">{milestone.status}</span>
          </div>
        )}

        {/* Move up / down controls */}
        {!isReadOnly && (
          <div className="flex items-center border border-border-subtle rounded-lg overflow-hidden shrink-0">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="p-1.5 text-text-secondary hover:text-text-primary bg-bg-primary hover:bg-muted-surface disabled:opacity-30 disabled:hover:bg-bg-primary focus:outline-none transition-colors border-r border-border-subtle"
              title="Move milestone upward"
              aria-label="Move milestone up"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="p-1.5 text-text-secondary hover:text-text-primary bg-bg-primary hover:bg-muted-surface disabled:opacity-30 disabled:hover:bg-bg-primary focus:outline-none transition-colors"
              title="Move milestone downward"
              aria-label="Move milestone down"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Edit / Delete Actions */}
        {!isReadOnly && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onEdit}
              className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-muted-surface border border-transparent rounded-lg transition-colors focus:outline-none"
              title="Edit Milestone"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-status-danger hover:bg-status-danger/10 border border-transparent rounded-lg transition-colors focus:outline-none"
              title="Delete Milestone"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
