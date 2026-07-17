import React from "react";
import { 
  CheckSquare, 
  Search, 
  FilterX, 
  Archive, 
  AlertOctagon, 
  Plus 
} from "lucide-react";
import { Button } from "../ui/Button";

interface TasksEmptyStateProps {
  type: "no-tasks" | "no-search" | "no-filters" | "no-archived" | "no-blocked";
  isEditable: boolean;
  onAction?: () => void;
  onClearFilters?: () => void;
}

export default function TasksEmptyState({
  type,
  isEditable,
  onAction,
  onClearFilters,
}: TasksEmptyStateProps) {
  const configs = {
    "no-tasks": {
      icon: <CheckSquare className="w-10 h-10 text-text-tertiary" />,
      title: "No tasks found",
      description: "Tasks represent concrete deliverables for this project. Start building your project task list now.",
      action: isEditable && onAction ? (
        <Button
          id="empty-create-task-btn"
          size="sm"
          onClick={onAction}
          className="mt-4 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </Button>
      ) : null,
    },
    "no-search": {
      icon: <Search className="w-10 h-10 text-text-tertiary" />,
      title: "No search matches",
      description: "We couldn't find any tasks matching your keywords. Try refining your spelling or search term.",
      action: onClearFilters ? (
        <Button
          id="empty-clear-search-btn"
          variant="secondary"
          size="sm"
          onClick={onClearFilters}
          className="mt-4"
        >
          Clear Search
        </Button>
      ) : null,
    },
    "no-filters": {
      icon: <FilterX className="w-10 h-10 text-text-tertiary" />,
      title: "No filter matches",
      description: "No tasks matched the active status, priority, or phase filters. Adjust your filters or reset them.",
      action: onClearFilters ? (
        <Button
          id="empty-reset-filters-btn"
          variant="secondary"
          size="sm"
          onClick={onClearFilters}
          className="mt-4"
        >
          Reset Filters
        </Button>
      ) : null,
    },
    "no-archived": {
      icon: <Archive className="w-10 h-10 text-text-tertiary" />,
      title: "No archived tasks",
      description: "You haven't archived any tasks for this project yet. Archiving hides outdated tasks while preserving histories.",
      action: null,
    },
    "no-blocked": {
      icon: <AlertOctagon className="w-10 h-10 text-text-tertiary" />,
      title: "No blocked tasks",
      description: "Excellent! There are no active blocked tasks in this project's workspace.",
      action: null,
    },
  };

  const current = configs[type] || configs["no-tasks"];

  return (
    <div
      id={`tasks-empty-${type}`}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-border-subtle bg-bg-secondary rounded-xl min-h-[300px]"
    >
      <div className="p-3 bg-bg-primary border border-border-subtle rounded-xl shadow-sm mb-4">
        {current.icon}
      </div>
      <h3 className="text-sm font-sans font-semibold text-text-primary">
        {current.title}
      </h3>
      <p className="text-xs text-text-tertiary max-w-sm mt-1.5 leading-relaxed">
        {current.description}
      </p>
      {current.action}
    </div>
  );
}
