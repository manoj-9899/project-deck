import React from "react";
import { ProjectTask, TaskStatus } from "../../types/project-task";
import TaskBoardColumn from "./TaskBoardColumn";
import TasksEmptyState from "./TasksEmptyState";

interface TaskBoardProps {
  tasks: ProjectTask[];
  allTasks: ProjectTask[];
  phases: Array<{ id: string; title: string }>;
  searchQuery: string;
  hasActiveFilters: boolean;
  statusFilter: string;
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

export default function TaskBoard({
  tasks,
  allTasks,
  phases,
  searchQuery,
  hasActiveFilters,
  statusFilter,
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
}: TaskBoardProps) {

  // If there are literally zero tasks matching filters
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

  // Columns we want to render
  const columnsList: TaskStatus[] = ["Backlog", "To do", "In progress", "Blocked", "Completed"];

  // Filter columns list if status filter is active
  const activeColumns = statusFilter === "All" 
    ? columnsList 
    : columnsList.filter(col => col === statusFilter);

  return (
    <div
      id="tasks-board-viewport"
      className="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-4 flex items-start gap-4"
    >
      {activeColumns.map((colTitle) => {
        // Filter tasks belonging to this column status
        const columnTasks = tasks.filter(t => t.status === colTitle);
        
        return (
          <TaskBoardColumn
            key={colTitle}
            title={colTitle}
            tasks={columnTasks}
            phases={phases}
            onOpenDetails={onOpenDetails}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onChangeStatus={onChangeStatus}
            onToggleArchive={onToggleArchive}
            onDelete={onDelete}
            isEditable={isEditable}
          />
        );
      })}
    </div>
  );
}
