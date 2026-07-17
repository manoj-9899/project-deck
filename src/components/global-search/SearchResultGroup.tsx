/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Button } from "../ui/Button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SearchResultGroupProps {
  title: string;
  totalCount: number;
  visibleCount: number;
  isExpanded: boolean;
  onViewAllToggle?: () => void;
  children: React.ReactNode;
}

export const SearchResultGroup: React.FC<SearchResultGroupProps> = ({
  title,
  totalCount,
  visibleCount,
  isExpanded,
  onViewAllToggle,
  children,
}) => {
  const hasMore = totalCount > visibleCount;

  return (
    <div className="flex flex-col gap-1.5 border-b border-border-subtle/50 last:border-b-0 pb-3 pt-2">
      {/* Group Header */}
      <div className="flex items-center justify-between px-2 py-1 select-none">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-text-tertiary tracking-wider uppercase">
            {title}
          </span>
          <span className="text-[10px] font-medium text-text-tertiary bg-muted-surface border border-border-subtle/40 px-1.5 py-0.5 rounded-full">
            {totalCount}
          </span>
        </div>

        {/* View All / Expand Trigger */}
        {onViewAllToggle && (hasMore || isExpanded) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewAllToggle();
            }}
            className="text-[10px] h-6 py-0.5 px-2 rounded-md hover:bg-muted-surface text-text-secondary border-transparent flex items-center gap-1 font-normal"
          >
            {isExpanded ? (
              <>
                Show less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                View all ({totalCount}) <ChevronDown className="w-3 h-3" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Group Children List */}
      <div className="flex flex-col gap-1" role="group" aria-label={title}>
        {children}
      </div>
    </div>
  );
};
