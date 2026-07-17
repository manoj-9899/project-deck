/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Search, CornerDownLeft, ArrowUpDown } from "lucide-react";

interface SearchEmptyStateProps {
  query: string;
}

export const SearchEmptyState: React.FC<SearchEmptyStateProps> = ({ query }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-10 w-10 rounded-lg bg-muted-surface border border-border-subtle flex items-center justify-center text-text-tertiary mb-4">
        <Search className="w-5 h-5 animate-pulse" />
      </div>
      <h3 className="text-sm font-medium text-text-primary">No results found</h3>
      <p className="text-xs text-text-tertiary mt-1 max-w-xs">
        No projects, tasks, roadmaps, knowledge entries, or prompts matched &ldquo;
        <span className="text-text-secondary font-medium break-all">{query}</span>
        &rdquo;.
      </p>

      {/* Keyboard guide */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[10px] text-text-tertiary border-t border-border-subtle pt-6 w-full max-w-xs">
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-muted-surface border border-border-subtle rounded-md font-mono text-[9px] shadow-xs text-text-secondary">
            Esc
          </kbd>
          <span>to close</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-1 py-0.5 bg-muted-surface border border-border-subtle rounded-md font-mono text-[9px] shadow-xs text-text-secondary flex items-center gap-0.5">
            <ArrowUpDown className="w-2.5 h-2.5" />
          </kbd>
          <span>to navigate</span>
        </div>
        <div className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-muted-surface border border-border-subtle rounded-md font-mono text-[9px] shadow-xs text-text-secondary flex items-center gap-0.5">
            <CornerDownLeft className="w-2.5 h-2.5" />
          </kbd>
          <span>to select</span>
        </div>
      </div>
    </div>
  );
};
