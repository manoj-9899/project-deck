/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../ui/Toast";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import { rankSearchResults, groupSearchResults } from "../../utils/global-search-ranking";
import { SearchResult } from "../../types/global-search";
import { STATIC_ACTION_ENTRIES } from "../../utils/global-search-index";
import { GlobalSearchInput } from "./GlobalSearchInput";
import { SearchResultGroup } from "./SearchResultGroup";
import { SearchResultItem } from "./SearchResultItem";
import { SearchEmptyState } from "./SearchEmptyState";
import { Button } from "../ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { CornerDownLeft, Info, HelpCircle } from "lucide-react";

export const GlobalSearchDialog: React.FC = () => {
  const navigate = useNavigate();
  const { projectId: currentProjectId } = useParams();
  const { toast } = useToast();

  const {
    isOpen,
    setIsOpen,
    searchQuery,
    setSearchQuery,
    recentNavigation,
    addRecentNavigation,
    clearRecentNavigation,
    searchIndex,
  } = useGlobalSearch();

  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset active index and expanded state whenever query shifts
  useEffect(() => {
    setActiveIndex(0);
    setExpandedGroups({});
  }, [searchQuery]);

  // Lock scrolling of underlying body while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Default Palette State groupings (when search box is empty)
  const emptyStateGroups = useMemo(() => {
    const groups: { title: string; type: string; items: SearchResult[] }[] = [];

    // 1. Session Navigation History
    if (recentNavigation.length > 0) {
      groups.push({
        title: "Recently Visited",
        type: "Recent",
        items: recentNavigation,
      });
    }

    // 2. Active Projects (not archived)
    const activeProjects = searchIndex.filter(
      (item) => item.type === "Project" && !item.metadata?.isArchived
    );
    if (activeProjects.length > 0) {
      groups.push({
        title: "Active Projects",
        type: "Project",
        items: activeProjects.slice(0, 5), // top 5 active projects
      });
    }

    // 3. Favorite Prompts
    const favoritePrompts = searchIndex.filter(
      (item) => item.type === "Prompt" && item.metadata?.isFavorite
    );
    if (favoritePrompts.length > 0) {
      groups.push({
        title: "Favorite AI Prompts",
        type: "Prompt",
        items: favoritePrompts.slice(0, 3),
      });
    }

    // 4. Favorite Resources
    const favoriteResources = searchIndex.filter(
      (item) => item.type === "Resource" && item.metadata?.isFavorite
    );
    if (favoriteResources.length > 0) {
      groups.push({
        title: "Favorite Links & Resources",
        type: "Resource",
        items: favoriteResources.slice(0, 3),
      });
    }

    // 5. General Actions
    groups.push({
      title: "Quick Commands",
      type: "Action",
      items: STATIC_ACTION_ENTRIES.slice(0, 6),
    });

    return groups;
  }, [recentNavigation, searchIndex]);

  // Calculate matching items based on user query
  const rankedResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return rankSearchResults(searchQuery, searchIndex);
  }, [searchQuery, searchIndex]);

  // Group search matches
  const groupedResults = useMemo(() => {
    return groupSearchResults(rankedResults);
  }, [rankedResults]);

  // Map category groups into order of priority
  const groupOrder = ["Project", "Task", "Roadmap", "Knowledge", "Prompt", "Resource", "Navigation", "Action"];

  // Compute flattened list of visible items to easily map key navigation (arrow down/up indices)
  const visibleItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return emptyStateGroups.flatMap((g) => g.items);
    }

    const flat: SearchResult[] = [];
    groupOrder.forEach((type) => {
      const items = groupedResults[type];
      if (!items) return;

      const isExpanded = expandedGroups[type] || false;
      const limit = isExpanded ? items.length : Math.min(4, items.length);
      flat.push(...items.slice(0, limit));
    });

    return flat;
  }, [searchQuery, emptyStateGroups, groupedResults, expandedGroups]);

  // Handle Arrow / Enter key actions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (visibleItems.length > 0) {
        setActiveIndex((prev) => (prev + 1) % visibleItems.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (visibleItems.length > 0) {
        setActiveIndex((prev) => (prev - 1 + visibleItems.length) % visibleItems.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (visibleItems.length > 0 && visibleItems[activeIndex]) {
        handleSelect(visibleItems[activeIndex]);
      }
    }
  };

  // Autoscroll the keyboard selection into view
  useEffect(() => {
    const activeEl = scrollContainerRef.current?.querySelector('[role="option"][aria-selected="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ block: "nearest", behavior: "auto" });
    }
  }, [activeIndex]);

  // Action / Path execution router
  const handleSelect = (item: SearchResult) => {
    // Record visited route context
    addRecentNavigation(item);
    setIsOpen(false);
    setSearchQuery("");

    if (item.type === "Action") {
      if (item.route === "create-project") {
        toast({
          type: "info",
          title: "Creation Workflow",
          message: "Creation workflows will be introduced with project and task management.",
          duration: 3500,
        });
        return;
      }

      if (item.route === "create-task") {
        if (currentProjectId) {
          toast({
            type: "info",
            title: "Creation Workflow",
            message: `Task creation is scoped within the ${currentProjectId.toUpperCase()} task manager workspace.`,
            duration: 3500,
          });
        } else {
          toast({
            type: "info",
            title: "Context Required",
            message: "Please open a project workspace first to add tasks.",
            duration: 3500,
          });
        }
        return;
      }

      // Contextual project actions
      if (
        item.route === "project-tasks" ||
        item.route === "project-roadmap" ||
        item.route === "project-knowledge" ||
        item.route === "project-prompts" ||
        item.route === "project-resources"
      ) {
        if (currentProjectId) {
          const subSection = item.route.replace("project-", "");
          navigate(`/projects/${currentProjectId}/${subSection}`);
        } else {
          toast({
            type: "warning",
            title: "No Project Context",
            message: "You are not inside a project workspace. Open a project first.",
            duration: 3500,
          });
        }
        return;
      }
    }

    // Default route navigation
    navigate(item.route);
  };

  const handleGroupToggle = (type: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus restoration to trigger
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
    return () => {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  // Helper tracking actual visual indexes to map properly with global active index
  let currentFlattenedIndexCounter = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 sm:pt-[10vh]">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/25"
          />

          {/* Palette Container Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-2xl bg-surface sm:border border-border-subtle rounded-none sm:rounded-xl shadow-floating overflow-hidden flex flex-col h-full sm:h-[650px] max-h-full sm:max-h-[80vh] z-10 outline-none"
            role="dialog"
            aria-modal="true"
          >
            {/* Command Palette Input Header */}
            <GlobalSearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onKeyDown={handleKeyDown}
            />

            {/* Scrollable Command Listings */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-4 py-2 bg-surface text-text-secondary"
              id="search-results-listbox"
              role="listbox"
            >
              {/* Scenario A: User Query is Active */}
              {searchQuery.trim() !== "" ? (
                rankedResults.length === 0 ? (
                  <SearchEmptyState query={searchQuery} />
                ) : (
                  groupOrder.map((type) => {
                    const groupItems = groupedResults[type];
                    if (!groupItems || groupItems.length === 0) return null;

                    const isExpanded = expandedGroups[type] || false;
                    const displayCount = isExpanded ? groupItems.length : Math.min(4, groupItems.length);
                    const slicedItems = groupItems.slice(0, displayCount);

                    return (
                      <SearchResultGroup
                        key={type}
                        title={type === "Navigation" ? "Navigation Routes" : `${type}s`}
                        totalCount={groupItems.length}
                        visibleCount={displayCount}
                        isExpanded={isExpanded}
                        onViewAllToggle={() => handleGroupToggle(type)}
                      >
                        {slicedItems.map((item) => {
                          const flatIdx = currentFlattenedIndexCounter++;
                          return (
                            <SearchResultItem
                              key={item.id}
                              item={item}
                              isActive={flatIdx === activeIndex}
                              onSelect={() => handleSelect(item)}
                              onMouseEnter={() => setActiveIndex(flatIdx)}
                            />
                          );
                        })}
                      </SearchResultGroup>
                    );
                  })
                )
              ) : (
                /* Scenario B: Empty query / Initial Command List */
                <div className="flex flex-col">
                  {/* Informational Toast Bar */}
                  <div className="mx-2 my-2.5 px-3 py-2.5 bg-accent-soft/85 border border-accent-primary/15 rounded-lg flex items-start gap-2.5 text-[11px] text-text-secondary">
                    <Info className="w-4 h-4 text-accent-primary mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-text-primary text-xs">ProjectDock Quick Palette</p>
                      <p className="text-text-secondary mt-0.5 leading-normal text-[11px]">
                        Type a keyword to discover documents, tasks, roadmap phases, or reusable system prompts across all indexed environments. Use <kbd className="px-1 bg-muted-surface border border-border-subtle rounded font-mono text-[9px] text-text-secondary">Ctrl</kbd>+<kbd className="px-1 bg-muted-surface border border-border-subtle rounded font-mono text-[9px] text-text-secondary">K</kbd> to toggle anytime.
                      </p>
                    </div>
                  </div>

                  {emptyStateGroups.map((group) => (
                    <SearchResultGroup
                      key={group.title}
                      title={group.title}
                      totalCount={group.items.length}
                      visibleCount={group.items.length}
                      isExpanded={true}
                    >
                      {group.items.map((item) => {
                        const flatIdx = currentFlattenedIndexCounter++;
                        return (
                          <SearchResultItem
                            key={item.id}
                            item={item}
                            isActive={flatIdx === activeIndex}
                            onSelect={() => handleSelect(item)}
                            onMouseEnter={() => setActiveIndex(flatIdx)}
                          />
                        );
                      })}
                    </SearchResultGroup>
                  ))}

                  {/* Clear recent history block if visible */}
                  {recentNavigation.length > 0 && (
                    <div className="flex justify-end p-2 border-t border-border-subtle/40">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearRecentNavigation}
                        className="text-[10px] text-status-danger hover:text-status-danger hover:bg-status-danger/5 border-transparent h-6"
                      >
                        Clear Visited History
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Bar */}
            <div className="px-4 py-2 bg-muted-surface border-t border-border-subtle flex items-center justify-between shrink-0 h-10 text-[10px] text-text-tertiary select-none">
              <div className="flex items-center gap-1">
                <HelpCircle className="w-3 h-3 text-text-tertiary" />
                <span>Search indexes are local-first and session-only.</span>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-surface border border-border-subtle rounded font-mono text-[9px] text-text-secondary shadow-2xs">
                    &uarr;&darr;
                  </kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-surface border border-border-subtle rounded font-mono text-[9px] text-text-secondary shadow-2xs flex items-center gap-0.5">
                    <CornerDownLeft className="w-2.5 h-2.5" />
                  </kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 bg-surface border border-border-subtle rounded font-mono text-[9px] text-text-secondary shadow-2xs">
                    ESC
                  </kbd>
                  <span>Close</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
