import React from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { LayoutGrid, List, Plus, SlidersHorizontal, RotateCcw, X, Eye } from "lucide-react";
import { ProjectFilterState, SortOption } from "./useProjectsState";
import { ProjectStatus, ProjectHealth, Priority, ProjectCategory } from "../../types";

interface ProjectsToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  filters: ProjectFilterState;
  setFilters: React.Dispatch<React.SetStateAction<ProjectFilterState>>;
  resetFilters: () => void;
  onCreateOpen: () => void;
  onFiltersOpen: () => void; // Trigger for sheet/modal with details
  resultsCount: number;
}

export default function ProjectsToolbar({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  filters,
  setFilters,
  resetFilters,
  onCreateOpen,
  onFiltersOpen,
  resultsCount
}: ProjectsToolbarProps) {
  
  const sortOptions = [
    { value: "recently-updated", label: "Recently Updated" },
    { value: "name", label: "Project Name (A-Z)" },
    { value: "priority", label: "Priority (High to Low)" },
    { value: "progress", label: "Progress (High to Low)" },
    { value: "target-date", label: "Target Date" },
    { value: "status", label: "Project Status" }
  ];

  const archiveOptions = [
    { value: "active", label: "Active Workspace Only" },
    { value: "archived", label: "Archived Projects" },
    { value: "all", label: "All Portfolio Records" }
  ];

  // Check if any filter is active
  const hasActiveFilters = 
    filters.status !== "All" ||
    filters.health !== "All" ||
    filters.priority !== "All" ||
    filters.category !== "All" ||
    filters.archiveVisibility !== "active" ||
    searchQuery !== "";

  return (
    <div className="flex flex-col gap-3 bg-surface border border-border-subtle p-4 rounded-xl shadow-subtle font-sans">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Search projects by name, technology, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-sans placeholder:text-text-tertiary pr-24"
            trailingAction={
              <span className="text-[10px] font-mono font-medium text-text-tertiary bg-muted-surface px-1.5 py-0.5 rounded border border-border-subtle whitespace-nowrap">
                {resultsCount} match{resultsCount === 1 ? "" : "es"}
              </span>
            }
          />
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick sorting */}
          <div className="w-44 shrink-0">
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="text-xs py-1.5"
            />
          </div>

          {/* Archive visibility */}
          <div className="w-52 shrink-0">
            <Select
              options={archiveOptions}
              value={filters.archiveVisibility}
              onChange={(e) => setFilters(prev => ({ ...prev, archiveVisibility: e.target.value as any }))}
              className="text-xs py-1.5"
            />
          </div>

          {/* Advanced filters sheet trigger */}
          <Button
            variant="secondary"
            onClick={onFiltersOpen}
            className="flex items-center gap-1.5 text-xs py-1.5 px-3 h-9 rounded-md border-border-strong/40"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-text-secondary" />
            <span>Filters</span>
            {(filters.status !== "All" || filters.health !== "All" || filters.priority !== "All" || filters.category !== "All") && (
              <span className="flex items-center justify-center bg-accent-primary text-white text-[10px] h-4.5 w-4.5 rounded-full font-bold">
                {[filters.status, filters.health, filters.priority, filters.category].filter(f => f !== "All").length}
              </span>
            )}
          </Button>

          {/* View Toggles */}
          <div className="flex items-center border border-border-strong/50 rounded-md p-0.5 bg-muted-surface/10 shrink-0 h-9">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-all duration-150 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-surface text-accent-primary shadow-sm"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-all duration-150 cursor-pointer ${
                viewMode === "list"
                  ? "bg-surface text-accent-primary shadow-sm"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Create Button */}
          <Button
            variant="primary"
            onClick={onCreateOpen}
            className="flex items-center gap-1.5 text-xs py-1.5 px-3.5 h-9 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white border-transparent"
          >
            <Plus className="w-4 h-4" />
            <span className="font-semibold">New Project</span>
          </Button>
        </div>
      </div>

      {/* Filter Chips line */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-subtle/50 mt-1">
          <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider font-semibold mr-1">
            Active Queries:
          </span>

          {searchQuery !== "" && (
            <span className="flex items-center gap-1 bg-accent-soft text-accent-primary border border-accent-primary/10 rounded px-2 py-0.5 text-[10px] font-sans">
              Search: "{searchQuery}"
              <X className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100" onClick={() => setSearchQuery("")} />
            </span>
          )}

          {filters.status !== "All" && (
            <span className="flex items-center gap-1 bg-muted-surface border border-border-subtle rounded px-2 py-0.5 text-[10px] font-mono">
              Status: {filters.status}
              <X className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100" onClick={() => setFilters(prev => ({ ...prev, status: "All" }))} />
            </span>
          )}

          {filters.health !== "All" && (
            <span className="flex items-center gap-1 bg-muted-surface border border-border-subtle rounded px-2 py-0.5 text-[10px] font-mono">
              Health: {filters.health}
              <X className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100" onClick={() => setFilters(prev => ({ ...prev, health: "All" }))} />
            </span>
          )}

          {filters.priority !== "All" && (
            <span className="flex items-center gap-1 bg-muted-surface border border-border-subtle rounded px-2 py-0.5 text-[10px] font-mono">
              Priority: {filters.priority}
              <X className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100" onClick={() => setFilters(prev => ({ ...prev, priority: "All" }))} />
            </span>
          )}

          {filters.category !== "All" && (
            <span className="flex items-center gap-1 bg-muted-surface border border-border-subtle rounded px-2 py-0.5 text-[10px] font-mono">
              Category: {filters.category}
              <X className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100" onClick={() => setFilters(prev => ({ ...prev, category: "All" }))} />
            </span>
          )}

          {filters.archiveVisibility !== "active" && (
            <span className="flex items-center gap-1 bg-muted-surface border border-border-subtle rounded px-2 py-0.5 text-[10px] font-mono">
              Scope: {filters.archiveVisibility === "archived" ? "Archived" : "All Records"}
              <X className="w-3 h-3 cursor-pointer opacity-70 hover:opacity-100" onClick={() => setFilters(prev => ({ ...prev, archiveVisibility: "active" }))} />
            </span>
          )}

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-[10px] font-semibold text-text-tertiary hover:text-accent-primary transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
