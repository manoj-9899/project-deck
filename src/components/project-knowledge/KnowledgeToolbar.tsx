import React, { useState } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Plus, 
  RotateCcw,
  Pin,
  Archive,
  BookOpen
} from "lucide-react";
import { Button } from "../ui/Button";
import { Sheet } from "../ui/Sheet";

interface KnowledgeToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  decisionStatusFilter: string;
  setDecisionStatusFilter: (ds: string) => void;
  tagFilter: string;
  setTagFilter: (tag: string) => void;
  phaseFilter: string;
  setPhaseFilter: (p: string) => void;
  taskFilter: string;
  setTaskFilter: (t: string) => void;
  pinnedFilter: string;
  setPinnedFilter: (p: string) => void;
  archivedFilter: string;
  setArchivedFilter: (a: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  clearFilters: () => void;
  allTags: string[];
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  onAddEntry: () => void;
  onResetDemo: () => void;
  isEditable: boolean;
  resultCount: number;
}

export default function KnowledgeToolbar({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  decisionStatusFilter,
  setDecisionStatusFilter,
  tagFilter,
  setTagFilter,
  phaseFilter,
  setPhaseFilter,
  taskFilter,
  setTaskFilter,
  pinnedFilter,
  setPinnedFilter,
  archivedFilter,
  setArchivedFilter,
  sortBy,
  setSortBy,
  clearFilters,
  allTags,
  phases,
  tasks,
  onAddEntry,
  onResetDemo,
  isEditable,
  resultCount,
}: KnowledgeToolbarProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const hasActiveFilters = 
    typeFilter !== "All" ||
    decisionStatusFilter !== "All" ||
    tagFilter !== "All" ||
    phaseFilter !== "All" ||
    taskFilter !== "All" ||
    pinnedFilter !== "All" ||
    archivedFilter !== "Active" ||
    searchQuery !== "";

  // Common styling for dropdown menus
  const selectClass = "h-9 text-xs bg-white border border-gray-200 hover:border-gray-300 rounded-lg px-2.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-500 shrink-0 transition-colors cursor-pointer shadow-sm";

  const renderFilterControls = (isMobile: boolean = false) => {
    const containerClass = isMobile 
      ? "flex flex-col gap-4 font-sans" 
      : "hidden lg:flex items-center gap-2 flex-wrap";

    return (
      <div className={containerClass}>
        {/* Entry Type */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Entry Type</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-type`}
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              if (e.target.value !== "Decision") {
                setDecisionStatusFilter("All");
              }
            }}
            className={selectClass}
          >
            <option value="All">All Types</option>
            <option value="Note">Note</option>
            <option value="Decision">Decision</option>
            <option value="Documentation">Documentation</option>
            <option value="Error & Solution">Error & Solution</option>
            <option value="Research">Research</option>
            <option value="Meeting">Meeting</option>
            <option value="Implementation Summary">Implementation Summary</option>
          </select>
        </div>

        {/* Decision Status (Visible only if type is Decision) */}
        {(typeFilter === "Decision" || isMobile) && (
          <div className="flex flex-col gap-1 lg:block">
            {isMobile && <label className="text-[11px] font-semibold text-gray-500">Decision Status</label>}
            <select
              id={`${isMobile ? 'mobile-' : 'desktop-'}filter-decision-status`}
              value={decisionStatusFilter}
              onChange={(e) => setDecisionStatusFilter(e.target.value)}
              disabled={typeFilter !== "Decision" && !isMobile}
              className={`${selectClass} ${typeFilter !== "Decision" && isMobile ? "opacity-50" : ""}`}
            >
              <option value="All">All Decision Statuses</option>
              <option value="Proposed">Proposed</option>
              <option value="Accepted">Accepted</option>
              <option value="Superseded">Superseded</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        )}

        {/* Tag Selector */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Tag</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-tag`}
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        </div>

        {/* Pinned filter */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Pin State</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-pinned`}
            value={pinnedFilter}
            onChange={(e) => setPinnedFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Items</option>
            <option value="Pinned">Pinned Only</option>
          </select>
        </div>

        {/* Archived filter */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Archive State</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-archived`}
            value={archivedFilter}
            onChange={(e) => setArchivedFilter(e.target.value)}
            className={selectClass}
          >
            <option value="Active">Active Entries</option>
            <option value="Archived">Archived Entries</option>
            <option value="All">All Entries (Inc. Archived)</option>
          </select>
        </div>

        {/* Related Phase */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Linked Phase</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-phase`}
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className={`${selectClass} max-w-[200px]`}
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
            className={`${selectClass} max-w-[200px]`}
          >
            <option value="All">All Linked Tasks</option>
            {tasks.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 pb-2 border-b border-gray-100">
      {/* Dynamic Mode Notice */}
      <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 rounded-lg p-2 px-3 text-slate-600">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
          <span><strong>Interactive Demo State:</strong> Knowledge entries are stored in-memory. Refreshing resets state.</span>
        </div>
        {isEditable && (
          <button 
            onClick={onResetDemo}
            className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 hover:underline transition-colors focus:outline-none"
            title="Reset knowledge base mock data"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Data
          </button>
        )}
      </div>

      {/* Main Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Side: Search & Filter Sheet button */}
        <div className="flex items-center gap-2 grow max-w-lg">
          <div className="relative grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="search-knowledge"
              type="text"
              placeholder="Search by title, content, tags, rationale..."
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
          
          {/* Mobile Filter Sheet Button */}
          <Button
            id="mobile-filters-trigger"
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

        {/* Right Side: Sorting & Create Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 hidden sm:inline">Sort:</span>
            <select
              id="sort-knowledge"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9.5 text-xs bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-2.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-500 shadow-sm cursor-pointer"
            >
              <option value="pinnedFirst">Pinned first</option>
              <option value="updatedAt">Recently updated</option>
              <option value="createdAt">Recently created</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="type">Entry Type (A-Z)</option>
            </select>
          </div>

          {isEditable && (
            <Button 
              id="create-knowledge-trigger"
              variant="primary" 
              onClick={onAddEntry}
              className="h-9.5 rounded-xl px-4 gap-2 font-semibold shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              Create Entry
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Filter Row */}
      {renderFilterControls(false)}

      {/* Results Count & Clear Button */}
      <div className="flex items-center justify-between text-xs py-1 text-gray-500 font-medium">
        <div>
          Showing <span className="font-semibold text-gray-700">{resultCount}</span> matching {resultCount === 1 ? 'entry' : 'entries'}
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 hover:underline transition-colors focus:outline-none"
          >
            <X className="w-3 h-3" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Mobile Filter Sheet */}
      <Sheet
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        title="Knowledge Base Filters"
        size="md"
      >
        <div className="flex flex-col justify-between h-full py-4">
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
