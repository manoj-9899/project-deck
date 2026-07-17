import React from "react";
import { ProjectTask, TaskStatus } from "../../types/project-task";
import TaskCard from "./TaskCard";

interface TaskBoardColumnProps {
  key?: React.Key;
  title: TaskStatus;
  tasks: ProjectTask[];
  phases: Array<{ id: string; title: string }>;
  onOpenDetails: (task: ProjectTask) => void;
  onEdit: (task: ProjectTask) => void;
  onDuplicate: (taskId: string) => void;
  onChangeStatus: (taskId: string, status: TaskStatus) => void;
  onToggleArchive: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  isEditable: boolean;
}

export default function TaskBoardColumn({
  title,
  tasks,
  phases,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onChangeStatus,
  onToggleArchive,
  onDelete,
  isEditable,
}: TaskBoardColumnProps) {
  
  // Header styles depending on the lane status
  const getHeaderStyles = (lane: TaskStatus) => {
    switch (lane) {
      case "Completed":
        return {
          bg: "bg-status-success/10",
          text: "text-status-success",
          border: "border-status-success/20",
        };
      case "Blocked":
        return {
          bg: "bg-status-danger/10",
          text: "text-status-danger",
          border: "border-status-danger/20",
        };
      case "In progress":
        return {
          bg: "bg-accent-subtle/20",
          text: "text-accent-primary",
          border: "border-accent-subtle",
        };
      case "To do":
        return {
          bg: "bg-bg-secondary border-border-subtle",
          text: "text-text-primary",
          border: "border-border-subtle",
        };
      case "Backlog":
      default:
        return {
          bg: "bg-muted-surface",
          text: "text-text-tertiary",
          border: "border-border-subtle",
        };
    }
  };

  const header = getHeaderStyles(title);

  return (
    <div
      id={`kanban-lane-${title.toLowerCase().replace(/\s+/g, "-")}`}
      className="flex flex-col gap-3 flex-1 min-w-[260px] sm:min-w-[280px] md:max-w-[320px] bg-bg-secondary border border-border-subtle/80 rounded-2xl p-3 shrink-0 h-full"
    >
      {/* Lane Header */}
      <div className={`flex items-center justify-between p-2 rounded-lg border ${header.bg} ${header.border}`}>
        <h3 className={`text-xs font-sans font-bold uppercase tracking-wider ${header.text}`}>
          {title}
        </h3>
        <span className="font-mono text-[10px] font-bold bg-bg-primary text-text-secondary border border-border-subtle/40 px-2 py-0.5 rounded-full shadow-2xs">
          {tasks.length}
        </span>
      </div>

      {/* Cards List container */}
      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[600px] pr-1 no-scrollbar flex-1 min-h-[150px]">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 border border-dashed border-border-subtle/40 bg-bg-primary/50 rounded-xl text-center flex-1">
            <p className="text-[10px] font-sans font-medium text-text-tertiary">No tasks in {title}</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              phases={phases}
              onOpenDetails={() => onOpenDetails(task)}
              onEdit={() => onEdit(task)}
              onDuplicate={() => onDuplicate(task.id)}
              onChangeStatus={(status) => onChangeStatus(task.id, status)}
              onToggleArchive={() => onToggleArchive(task.id)}
              onDelete={() => onDelete(task.id)}
              isEditable={isEditable}
            />
          ))
        )}
      </div>
    </div>
  );
}
