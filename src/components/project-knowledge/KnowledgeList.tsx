import React from "react";
import { ProjectKnowledgeEntry, DecisionStatus } from "../../types/project-knowledge";
import KnowledgeEntryCard from "./KnowledgeEntryCard";
import KnowledgeEmptyState from "./KnowledgeEmptyState";

interface KnowledgeListProps {
  entries: ProjectKnowledgeEntry[];
  allEntriesCount: number;
  searchQuery: string;
  hasFilters: boolean;
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  onOpenDetails: (entry: ProjectKnowledgeEntry) => void;
  onEdit: (entry: ProjectKnowledgeEntry) => void;
  onDuplicate: (id: string) => void;
  onTogglePin: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeDecisionStatus: (id: string, status: DecisionStatus) => void;
  isEditable: boolean;
  onAddEntry: () => void;
  onClearFilters: () => void;
  archivedFilter: string;
}

export default function KnowledgeList({
  entries,
  allEntriesCount,
  searchQuery,
  hasFilters,
  phases,
  tasks,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onTogglePin,
  onToggleArchive,
  onDelete,
  onChangeDecisionStatus,
  isEditable,
  onAddEntry,
  onClearFilters,
  archivedFilter,
}: KnowledgeListProps) {
  
  if (entries.length === 0) {
    if (allEntriesCount === 0) {
      return (
        <KnowledgeEmptyState
          type="empty-base"
          isEditable={isEditable}
          onCreateClick={onAddEntry}
        />
      );
    }
    
    if (archivedFilter === "Archived") {
      return (
        <KnowledgeEmptyState
          type="no-archived"
          isEditable={isEditable}
        />
      );
    }

    if (searchQuery.trim() !== "") {
      return (
        <KnowledgeEmptyState
          type="search-miss"
          isEditable={isEditable}
          onClearFilters={onClearFilters}
        />
      );
    }

    if (hasFilters) {
      return (
        <KnowledgeEmptyState
          type="filter-miss"
          isEditable={isEditable}
          onClearFilters={onClearFilters}
        />
      );
    }

    return (
      <KnowledgeEmptyState
        type="empty-base"
        isEditable={isEditable}
        onCreateClick={onAddEntry}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entries.map((entry) => (
        <KnowledgeEntryCard
          key={entry.id}
          entry={entry}
          phases={phases}
          tasks={tasks}
          onOpenDetails={() => onOpenDetails(entry)}
          onEdit={() => onEdit(entry)}
          onDuplicate={() => onDuplicate(entry.id)}
          onTogglePin={() => onTogglePin(entry.id)}
          onToggleArchive={() => onToggleArchive(entry.id)}
          onDelete={() => onDelete(entry.id)}
          onChangeDecisionStatus={(status) => onChangeDecisionStatus(entry.id, status)}
          isEditable={isEditable}
        />
      ))}
    </div>
  );
}
