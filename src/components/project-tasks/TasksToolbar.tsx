import React, { useState } from "react";
import { 
  Search, 
  Grid, 
  List, 
  SlidersHorizontal, 
  X, 
  Plus, 
  RotateCcw,
  Archive
} from "lucide-react";
import { Button } from "../ui/Button";
import { Sheet } from "../ui/Sheet";

interface TasksToolbarProps {
  viewMode: "list" | "board";
  setViewMode: (v: "list" | "board") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  priorityFilter: string;
  setPriorityFilter: (p: string) => void;
  phaseFilter: string;
  setPhaseFilter: (p: string) => void;
  blockedFilter: string;
  setBlockedFilter: (b: string) => void;
  dueFilter: string;
  setDueFilter: (d: string) => void;
  archivedFilter: string;
  setArchivedFilter: (a: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  clearFilters: () => void;
  phases: Array<{ id: string; title: string }>;
  onAddTask: () => void;
  onResetDemo: () => void;
  isEditable: boolean;
  resultCount: number;
}

export default function TasksToolbar({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
  phaseFilter,
  setPhaseFilter,
  blockedFilter,
  setBlockedFilter,
  dueFilter,
  setDueFilter,
  archivedFilter,
  setArchivedFilter,
  sortBy,
  setSortBy,
  clearFilters,
  phases,
  onAddTask,
  onResetDemo,
  isEditable,
  resultCount,
}: TasksToolbarProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const hasActiveFilters = 
    statusFilter !== "All" ||
    priorityFilter !== "All" ||
    phaseFilter !== "All" ||
    blockedFilter !== "All" ||
    dueFilter !== "All" ||
    archivedFilter !== "Active" ||
    searchQuery !== "";

  // Common styles for select elements
  const selectClass = "h-8.5 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-md px-2.5 font-sans font-medium text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary shrink-0 transition-colors cursor-pointer";

  const renderFilterControls = (isMobile: boolean = false) => {
    const containerClass = isMobile 
      ? "flex flex-col gap-4 font-sans" 
      : "hidden lg:flex items-center gap-2 flex-wrap";

    return (
      <div className={containerClass}>
        {/* Status */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-sans font-semibold text-text-tertiary">Status</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-status`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Statuses</option>
            <option value="Backlog">Backlog</option>
            <option value="To do">To do</option>
            <option value="In progress">In progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-sans font-semibold text-text-tertiary">Priority</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-priority`}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Roadmap Phase */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-sans font-semibold text-text-tertiary">Roadmap Phase</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-phase`}
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className={`${selectClass} max-w-[180px]`}
          >
            <option value="All">All Phases</option>
            <option value="Unassigned">Unassigned Tasks</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title.split(" — ")[0] || p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Blocked */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-sans font-semibold text-text-tertiary">Blocker State</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-blocked`}
            value={blockedFilter}
            onChange={(e) => setBlockedFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Blocker States</option>
            <option value="Blocked">Blocked Only</option>
            <option value="Unblocked">Unblocked Only</option>
          </select>
        </div>

        {/* Due State */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-sans font-semibold text-text-tertiary">Due Date</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-due`}
            value={dueFilter}
            onChange={(e) => setDueFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Due States</option>
            <option value="Overdue">Overdue Only</option>
            <option value="Due Soon">Due Soon (3 Days)</option>
            <option value="No Due Date">No Due Date</option>
          </select>
        </div>

        {/* Archive scope */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-sans font-semibold text-text-tertiary">Archive State</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-archive`}
            value={archivedFilter}
            onChange={(e) => setArchivedFilter(e.target.value)}
            className={selectClass}
          >
            <option value="Active">Active Tasks</option>
            <option value="Archived">Archived Tasks</option>
            <option value="All">All (Active + Archived)</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <div id="tasks-toolbar" className="flex flex-col gap-3 font-sans">
      {/* Primary Toolbar Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg-secondary p-3 border border-border-subtle rounded-xl shadow-xs">
        
        {/* Search Input Box */}
        <div className="relative flex-1 min-w-0 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
          <input
            id="task-search-input"
            type="text"
            placeholder="Search title, details, notes, labels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-8 text-xs font-sans font-medium bg-bg-primary border border-border-subtle hover:border-border-strong focus:border-accent-primary focus:outline-none rounded-lg text-text-primary placeholder:text-text-tertiary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-text-tertiary hover:text-text-primary rounded-full hover:bg-muted-surface transition-colors"
              aria-label="Clear search input"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Secondary controls row */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-end shrink-0">
          
          {/* Sorting Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-text-tertiary font-medium font-mono hidden sm:inline">SORT BY:</span>
            <select
              id="task-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg px-2.5 font-sans font-semibold text-text-secondary focus:outline-none transition-colors cursor-pointer"
            >
              <option value="updatedAt">Recently Updated</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority Order</option>
              <option value="status">Status Lanes</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>

          {/* Toggle Mobile Filters Panel */}
          <button
            onClick={() => setIsMobileFiltersOpen(true)}
            id="mobile-filters-trigger"
            className="lg:hidden h-9 px-3 bg-bg-primary border border-border-subtle hover:border-border-strong text-text-secondary rounded-lg flex items-center gap-1.5 text-xs font-semibold focus:outline-none transition-colors relative"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-accent-primary animate-pulse" />
            )}
          </button>

          {/* View Toggles (List vs Board) */}
          <div className="bg-bg-primary border border-border-subtle rounded-lg p-0.5 flex items-center shrink-0">
            <button
              onClick={() => setViewMode("list")}
              id="view-list-toggle"
              aria-label="List view"
              className={`p-1.5 rounded-md focus:outline-none transition-colors ${
                viewMode === "list"
                  ? "bg-muted-surface text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("board")}
              id="view-board-toggle"
              aria-label="Kanban board view"
              className={`p-1.5 rounded-md focus:outline-none transition-colors ${
                viewMode === "board"
                  ? "bg-muted-surface text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {/* Create Task button */}
          {isEditable && (
            <Button
              id="toolbar-create-task-btn"
              onClick={onAddTask}
              size="sm"
              className="h-9 font-semibold flex items-center gap-1 text-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </Button>
          )}

          {/* Reset button hidden in dropdown on small screen but inline here */}
          {isEditable && (
            <Button
              id="toolbar-reset-demo-btn"
              variant="ghost"
              onClick={onResetDemo}
              className="h-9 px-2 text-text-tertiary hover:text-status-warning hover:bg-status-warning/10 border-transparent rounded-lg hidden md:flex items-center gap-1.5 text-xs shrink-0"
              title="Reset tasks to initial state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          )}

        </div>
      </div>

      {/* Desktop Filters Row (Visible only on Large screens) */}
      <div className="hidden lg:flex items-center justify-between gap-3 py-1 px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-text-tertiary font-medium font-mono">FILTERS:</span>
          {renderFilterControls(false)}
        </div>

        {/* Clear Filters Indicator */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            id="desktop-clear-filters-btn"
            className="text-xs text-accent-primary hover:text-accent-primary-hover hover:underline flex items-center gap-1 font-semibold transition-colors focus:outline-none"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear filters ({resultCount} matches)</span>
          </button>
        )}
      </div>

      {/* Mini Active Filter Badges for medium screens */}
      {hasActiveFilters && (
        <div className="lg:hidden flex flex-wrap items-center gap-1.5 px-1 py-0.5">
          <span className="text-[10px] text-text-tertiary font-mono font-medium">ACTIVE:</span>
          {statusFilter !== "All" && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-bg-secondary text-text-secondary border border-border-subtle rounded-md px-1.5 py-0.5">
              Status: {statusFilter}
            </span>
          )}
          {priorityFilter !== "All" && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-bg-secondary text-text-secondary border border-border-subtle rounded-md px-1.5 py-0.5">
              Priority: {priorityFilter}
            </span>
          )}
          {phaseFilter !== "All" && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-bg-secondary text-text-secondary border border-border-subtle rounded-md px-1.5 py-0.5">
              Phase Filtered
            </span>
          )}
          {blockedFilter !== "All" && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-bg-secondary text-text-secondary border border-border-subtle rounded-md px-1.5 py-0.5">
              {blockedFilter === "Blocked" ? "Blocked Only" : "Unblocked Only"}
            </span>
          )}
          {dueFilter !== "All" && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-bg-secondary text-text-secondary border border-border-subtle rounded-md px-1.5 py-0.5">
              Due: {dueFilter}
            </span>
          )}
          {archivedFilter !== "Active" && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-bg-secondary text-text-secondary border border-border-subtle rounded-md px-1.5 py-0.5">
              Scope: {archivedFilter}
            </span>
          )}
          <button
            onClick={clearFilters}
            id="mobile-clear-filters-pill"
            className="text-[10px] text-accent-primary hover:underline font-semibold flex items-center gap-0.5 focus:outline-none"
          >
            Clear ({resultCount})
          </button>
        </div>
      )}

      {/* 4. Accessible Sheet Drawer for Mobile Filters */}
      <Sheet
        id="mobile-filters-drawer"
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        title="Filter Projects Tasks"
        side="bottom"
        description="Configure precise parameters to filter project task lists."
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              id="mobile-filters-reset"
              variant="secondary"
              size="sm"
              onClick={() => {
                clearFilters();
                setIsMobileFiltersOpen(false);
              }}
              className="text-text-secondary hover:text-text-primary"
            >
              Reset Filters
            </Button>
            <Button
              id="mobile-filters-apply"
              size="sm"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              Apply Filter Parameters
            </Button>
          </div>
        }
      >
        {renderFilterControls(true)}
      </Sheet>
    </div>
  );
}
