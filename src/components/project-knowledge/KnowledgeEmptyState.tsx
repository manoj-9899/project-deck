import React from "react";
import { BookOpen, Search, Filter, Pin, Archive, Plus } from "lucide-react";
import { Button } from "../ui/Button";

interface KnowledgeEmptyStateProps {
  type: "empty-base" | "search-miss" | "filter-miss" | "no-pinned" | "no-archived";
  isEditable: boolean;
  onCreateClick?: () => void;
  onClearFilters?: () => void;
}

export default function KnowledgeEmptyState({
  type,
  isEditable,
  onCreateClick,
  onClearFilters,
}: KnowledgeEmptyStateProps) {
  const getDetails = () => {
    switch (type) {
      case "empty-base":
        return {
          icon: <BookOpen className="w-12 h-12 text-gray-400" />,
          title: "Knowledge base is empty",
          description: "Start capturing decisions, technical documentations, error solutions, research, or notes for this project.",
          action: isEditable && onCreateClick && (
            <Button onClick={onCreateClick} variant="primary" size="md" className="gap-2">
              <Plus className="w-4 h-4" />
              Create First Entry
            </Button>
          ),
        };
      case "search-miss":
        return {
          icon: <Search className="w-12 h-12 text-gray-400" />,
          title: "No search matches found",
          description: "We couldn't find any entries matching your search query. Try checking your spelling or using different keywords.",
          action: onClearFilters && (
            <Button onClick={onClearFilters} variant="secondary" size="md">
              Clear Search Query
            </Button>
          ),
        };
      case "filter-miss":
        return {
          icon: <Filter className="w-12 h-12 text-gray-400" />,
          title: "No matching entries",
          description: "No entries match your active combination of filters.",
          action: onClearFilters && (
            <Button onClick={onClearFilters} variant="secondary" size="md">
              Reset Filters
            </Button>
          ),
        };
      case "no-pinned":
        return {
          icon: <Pin className="w-8 h-8 text-gray-400" />,
          title: "No pinned entries",
          description: "Pin frequently referenced architecture decisions or documentation guides to keep them pinned at the top.",
          action: null,
        };
      case "no-archived":
        return {
          icon: <Archive className="w-12 h-12 text-gray-400" />,
          title: "No archived entries",
          description: "Archived knowledge entries will appear here. Archiving lets you hide obsolete or superseded details without deleting them permanently.",
          action: null,
        };
    }
  };

  const details = getDetails();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
      <div className="mb-4 p-3 bg-white rounded-full shadow-sm border border-gray-100">
        {details.icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{details.title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
        {details.description}
      </p>
      {details.action}
    </div>
  );
}
