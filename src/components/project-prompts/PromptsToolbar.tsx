/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Plus, 
  RotateCcw,
  Terminal,
  Heart
} from "lucide-react";
import { Button } from "../ui/Button";
import { Sheet } from "../ui/Sheet";
import { PromptTool, PromptCategory, PromptStatus } from "../../types/project-prompt";

interface PromptsToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toolFilter: string;
  setToolFilter: (t: string) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  phaseFilter: string;
  setPhaseFilter: (p: string) => void;
  taskFilter: string;
  setTaskFilter: (t: string) => void;
  favoritesOnlyFilter: boolean;
  setFavoritesOnlyFilter: (f: boolean) => void;
  archivedFilter: string;
  setArchivedFilter: (a: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  clearFilters: () => void;
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  onAddPrompt: () => void;
  onResetDemo: () => void;
  isEditable: boolean;
  resultCount: number;
}

export default function PromptsToolbar({
  searchQuery,
  setSearchQuery,
  toolFilter,
  setToolFilter,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  phaseFilter,
  setPhaseFilter,
  taskFilter,
  setTaskFilter,
  favoritesOnlyFilter,
  setFavoritesOnlyFilter,
  archivedFilter,
  setArchivedFilter,
  sortBy,
  setSortBy,
  clearFilters,
  phases,
  tasks,
  onAddPrompt,
  onResetDemo,
  isEditable,
  resultCount,
}: PromptsToolbarProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const hasActiveFilters = 
    toolFilter !== "All" ||
    categoryFilter !== "All" ||
    statusFilter !== "All" ||
    phaseFilter !== "All" ||
    taskFilter !== "All" ||
    favoritesOnlyFilter === true ||
    archivedFilter !== "Active" ||
    searchQuery !== "";

  const selectClass = "h-9 text-xs bg-white border border-gray-200 hover:border-gray-300 rounded-lg px-2.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-500 shrink-0 transition-colors cursor-pointer shadow-sm";

  const renderFilterControls = (isMobile: boolean = false) => {
    const containerClass = isMobile 
      ? "flex flex-col gap-4 font-sans" 
      : "hidden lg:flex items-center gap-2 flex-wrap";

    return (
      <div className={containerClass}>
        {/* Tool Filter */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">AI Tool</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-tool`}
            value={toolFilter}
            onChange={(e) => setToolFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Tools</option>
            <option value="Google AI Studio">Google AI Studio</option>
            <option value="Codex">Codex</option>
            <option value="ChatGPT">ChatGPT</option>
            <option value="Claude">Claude</option>
            <option value="Fable">Fable</option>
            <option value="Stitch">Stitch</option>
            <option value="Hermes">Hermes</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Category</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-category`}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Categories</option>
            <option value="Planning">Planning</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Development">Development</option>
            <option value="Debugging">Debugging</option>
            <option value="Testing">Testing</option>
            <option value="Documentation">Documentation</option>
            <option value="Research">Research</option>
            <option value="Handover">Handover</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Status</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-status`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Ready">Ready</option>
            <option value="Used">Used</option>
            <option value="Needs revision">Needs revision</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {/* Related Phase */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Linked Phase</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-phase`}
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className={`${selectClass} max-w-[180px]`}
          >
            <option value="All">All Linked Phases</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title.split(" — ")[0] || p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Related Task */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Linked Task</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-task`}
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
            className={`${selectClass} max-w-[180px]`}
          >
            <option value="All">All Linked Tasks</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Archive State */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Archive State</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-archived`}
            value={archivedFilter}
            onChange={(e) => setArchivedFilter(e.target.value)}
            className={selectClass}
          >
            <option value="Active">Active Prompts</option>
            <option value="Archived">Archived Prompts</option>
            <option value="All">All (Inc. Archived)</option>
          </select>
        </div>

        {/* Favorites Switcher */}
        <div className="flex items-center gap-2 mt-1 lg:mt-0 lg:ml-2">
          <input
            type="checkbox"
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-favorites`}
            checked={favoritesOnlyFilter}
            onChange={(e) => setFavoritesOnlyFilter(e.target.checked)}
            className="w-4 h-4 text-rose-500 border-gray-300 rounded focus:ring-rose-500 focus:ring-0 cursor-pointer"
          />
          <label htmlFor={`${isMobile ? 'mobile-' : 'desktop-'}filter-favorites`} className="text-xs font-semibold text-gray-700 cursor-pointer flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Favorites Only
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 pb-2 border-b border-gray-100" id="prompts-toolbar-root">
      {/* Dynamic Demo Warning banner */}
      <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 rounded-lg p-2 px-3 text-slate-600">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span><strong>Interactive Workspace Context:</strong> Prompts and version logs are managed in-memory per project. Refreshing resets state.</span>
        </div>
        {isEditable && (
          <button 
            onClick={onResetDemo}
            className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 hover:underline transition-colors focus:outline-none"
            title="Reset library mock data"
            id="btn-reset-prompts-data"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Data
          </button>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search & Mobile Filter button */}
        <div className="flex items-center gap-2 grow max-w-lg">
          <div className="relative grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="search-prompts"
              type="text"
              placeholder="Search prompts, descriptions, tags, handover details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9.5 pl-9 pr-4 text-sm bg-white border border-gray-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-400 rounded-xl transition-colors shadow-sm placeholder:text-gray-400 outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          <Button
            id="mobile-prompt-filters-trigger"
            variant="secondary"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="lg:hidden h-9.5 px-3 rounded-xl gap-1.5 shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-xs font-semibold">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-slate-900 rounded-full" />
            )}
          </Button>
        </div>

        {/* Sorting & Action Triggers */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 hidden sm:inline">Sort:</span>
            <select
              id="sort-prompts"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9.5 text-xs bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-2.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-500 shadow-sm cursor-pointer"
            >
              <option value="recentlyUpdated">Recently updated</option>
              <option value="recentlyUsed">Recently used</option>
              <option value="createdAt">Created date</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="tool">AI Tool (A-Z)</option>
              <option value="favoritesFirst">Favorites first</option>
            </select>
          </div>

          {isEditable && (
            <Button 
              id="create-prompt-trigger"
              variant="primary" 
              onClick={onAddPrompt}
              className="h-9.5 rounded-xl px-4 gap-2 font-semibold shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              Create Prompt
            </Button>
          )}
        </div>
      </div>

      {/* Desktop filters container */}
      {renderFilterControls(false)}

      {/* Matched Count & Reset filters banner */}
      <div className="flex items-center justify-between text-xs py-1 text-gray-500 font-medium">
        <div>
          Showing <span className="font-semibold text-gray-700">{resultCount}</span> matching {resultCount === 1 ? 'prompt' : 'prompts'}
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 hover:underline transition-colors focus:outline-none"
            id="btn-clear-all-prompt-filters"
          >
            <X className="w-3 h-3" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Mobile Filters Drawer */}
      <Sheet
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        title="Prompt Filters"
        size="md"
      >
        <div className="flex flex-col justify-between h-full py-4" id="mobile-prompt-filters-sheet">
          <div className="overflow-y-auto px-4 pb-6">
            {renderFilterControls(true)}
          </div>
          
          <div className="border-t border-gray-100 pt-4 px-4 flex gap-2">
            <Button
              onClick={() => {
                clearFilters();
                setIsMobileFiltersOpen(false);
              }}
              variant="secondary"
              className="grow h-11 font-semibold rounded-xl"
              id="btn-reset-mobile-filters"
            >
              Reset Filters
            </Button>
            <Button
              onClick={() => setIsMobileFiltersOpen(false)}
              variant="primary"
              className="grow h-11 font-semibold rounded-xl"
            >
              Apply Filters ({resultCount})
            </Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
