/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ProjectPrompt } from "../../types/project-prompt";
import PromptCard from "./PromptCard";
import PromptsEmptyState from "./PromptsEmptyState";

interface PromptListProps {
  prompts: ProjectPrompt[];
  allPromptsCount: number;
  searchQuery: string;
  hasFilters: boolean;
  favoritesOnlyFilter: boolean;
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  onOpenDetails: (prompt: ProjectPrompt) => void;
  onEdit: (prompt: ProjectPrompt) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onMarkUsed: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onNewVersion: (prompt: ProjectPrompt) => void;
  onDelete: (id: string) => void;
  isEditable: boolean;
  onAddPrompt: () => void;
  onClearFilters: () => void;
  archivedFilter: string;
}

export default function PromptList({
  prompts,
  allPromptsCount,
  searchQuery,
  hasFilters,
  favoritesOnlyFilter,
  phases,
  tasks,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onMarkUsed,
  onToggleArchive,
  onNewVersion,
  onDelete,
  isEditable,
  onAddPrompt,
  onClearFilters,
  archivedFilter,
}: PromptListProps) {

  if (prompts.length === 0) {
    if (allPromptsCount === 0) {
      return (
        <PromptsEmptyState
          type="empty-base"
          isEditable={isEditable}
          onCreateClick={onAddPrompt}
        />
      );
    }

    if (favoritesOnlyFilter) {
      return (
        <PromptsEmptyState
          type="no-favorites"
          isEditable={isEditable}
        />
      );
    }

    if (archivedFilter === "Archived") {
      return (
        <PromptsEmptyState
          type="no-archived"
          isEditable={isEditable}
        />
      );
    }

    if (searchQuery.trim() !== "") {
      return (
        <PromptsEmptyState
          type="search-miss"
          isEditable={isEditable}
          onClearFilters={onClearFilters}
        />
      );
    }

    if (hasFilters) {
      return (
        <PromptsEmptyState
          type="filter-miss"
          isEditable={isEditable}
          onClearFilters={onClearFilters}
        />
      );
    }

    return (
      <PromptsEmptyState
        type="empty-base"
        isEditable={isEditable}
        onCreateClick={onAddPrompt}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="prompts-grid-list">
      {prompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          phases={phases}
          tasks={tasks}
          onOpenDetails={() => onOpenDetails(prompt)}
          onEdit={() => onEdit(prompt)}
          onDuplicate={() => onDuplicate(prompt.id)}
          onToggleFavorite={() => onToggleFavorite(prompt.id)}
          onMarkUsed={() => onMarkUsed(prompt.id)}
          onToggleArchive={() => onToggleArchive(prompt.id)}
          onNewVersion={() => onNewVersion(prompt)}
          onDelete={() => onDelete(prompt.id)}
          isEditable={isEditable}
        />
      ))}
    </div>
  );
}
