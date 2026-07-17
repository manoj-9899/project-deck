import React from "react";
import { ProjectTask, TaskStatus } from "../../types/project-task";
import TaskListItem from "./TaskListItem";
import TasksEmptyState from "./TasksEmptyState";

interface TaskListProps {
  tasks: ProjectTask[];
  allTasks: ProjectTask[];
  phases: Array<{ id: string; title: string }>;
  searchQuery: string;
  hasActiveFilters: boolean;
  archivedFilter: string;
  isEditable: boolean;
  onAddTask: () => void;
  onClearFilters: () => void;
  onOpenDetails: (task: ProjectTask) => void;
  onEdit: (task: ProjectTask) => void;
  onDuplicate: (taskId: string) => void;
  onChangeStatus: (taskId: string, status: TaskStatus) => void;
  onToggleArchive: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskList({
  tasks,
  allTasks,
  phases,
  searchQuery,
  hasActiveFilters,
  archivedFilter,
  isEditable,
  onAddTask,
  onClearFilters,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onChangeStatus,
  onToggleArchive,
  onDelete,
}: TaskListProps) {
  
  if (tasks.length === 0) {
    let emptyType: "no-tasks" | "no-search" | "no-filters" | "no-archived" = "no-tasks";
    
    if (allTasks.length === 0) {
      emptyType = "no-tasks";
    } else if (searchQuery.trim()) {
      emptyType = "no-search";
    } else if (archivedFilter === "Archived") {
      emptyType = "no-archived";
    } else if (hasActiveFilters) {
      emptyType = "no-filters";
    }

    return (
      <TasksEmptyState
        type={emptyType}
        isEditable={isEditable}
        onAction={onAddTask}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <div id="tasks-list-view" className="flex flex-col gap-2.5">
      {tasks.map((task) => (
        <TaskListItem
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
      ))}
    </div>
  );
}
