/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Terminal, Search, Filter, Heart, Archive, Plus } from "lucide-react";
import { Button } from "../ui/Button";

interface PromptsEmptyStateProps {
  type: "empty-base" | "search-miss" | "filter-miss" | "no-favorites" | "no-archived";
  isEditable: boolean;
  onCreateClick?: () => void;
  onClearFilters?: () => void;
}

export default function PromptsEmptyState({
  type,
  isEditable,
  onCreateClick,
  onClearFilters,
}: PromptsEmptyStateProps) {
  const getDetails = () => {
    switch (type) {
      case "empty-base":
        return {
          icon: <Terminal className="w-12 h-12 text-gray-400" />,
          title: "Prompt library is empty",
          description: "Start organizing your AI prompts, system instructions, and design guidelines for this project.",
          action: isEditable && onCreateClick && (
            <Button onClick={onCreateClick} variant="primary" size="md" className="gap-2" id="btn-create-first-prompt">
              <Plus className="w-4 h-4" />
              Create First Prompt
            </Button>
          ),
        };
      case "search-miss":
        return {
          icon: <Search className="w-12 h-12 text-gray-400" />,
          title: "No search matches found",
          description: "We couldn't find any prompts matching your search query. Check your spelling or try different keywords.",
          action: onClearFilters && (
            <Button onClick={onClearFilters} variant="secondary" size="md" id="btn-clear-search-miss">
              Clear Search Query
            </Button>
          ),
        };
      case "filter-miss":
        return {
          icon: <Filter className="w-12 h-12 text-gray-400" />,
          title: "No matching prompts",
          description: "No prompts match your active combination of tools, categories, status, or related targets.",
          action: onClearFilters && (
            <Button onClick={onClearFilters} variant="secondary" size="md" id="btn-clear-filter-miss">
              Reset Filters
            </Button>
          ),
        };
      case "no-favorites":
        return {
          icon: <Heart className="w-8 h-8 text-gray-400" />,
          title: "No favorite prompts",
          description: "Favorite prompts to keep them highlighted in the top favorites bar for instant access and swift copying.",
          action: null,
        };
      case "no-archived":
        return {
          icon: <Archive className="w-12 h-12 text-gray-400" />,
          title: "No archived prompts",
          description: "Archived prompts will appear here. Archiving lets you hide obsolete drafts without losing version history.",
          action: null,
        };
    }
  };

  const details = getDetails();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 border border-dashed border-gray-200 rounded-xl bg-gray-50/50" id={`prompts-empty-${type}`}>
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
