/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SearchX, Plus, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";

interface ResourcesEmptyStateProps {
  hasFilters: boolean;
  searchQuery: string;
  onClearFilters: () => void;
  onAddResource: () => void;
  isEditable: boolean;
}

export default function ResourcesEmptyState({
  hasFilters,
  searchQuery,
  onClearFilters,
  onAddResource,
  isEditable,
}: ResourcesEmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-100 rounded-3xl bg-white max-w-xl mx-auto my-12"
      id="resources-empty-state-view"
    >
      <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 mb-4">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
        {searchQuery ? "No Matching Resources Found" : "No Resources Defined"}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
        {searchQuery
          ? `We couldn't find any resource matching "${searchQuery}". Try revising your search keywords or adjusting your filters.`
          : hasFilters
          ? "No resources match your active filter settings. Reset filters to see all stored items."
          : "Organize repositories, deployment environments, API docs, local workspaces, and AI conversations in this personal workspace."}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {(searchQuery || hasFilters) && (
          <Button
            id="empty-btn-clear-filters"
            variant="secondary"
            onClick={onClearFilters}
            className="flex items-center gap-1.5 h-10 px-4 text-xs font-semibold rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Filter Options
          </Button>
        )}

        {isEditable && (
          <Button
            id="empty-btn-add-resource"
            variant="primary"
            onClick={onAddResource}
            className="flex items-center gap-1.5 h-10 px-4 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
          >
            <Plus className="w-4 h-4" />
            Add First Resource
          </Button>
        )}
      </div>
    </div>
  );
}
