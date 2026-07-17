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
  Link2,
  Heart,
  Grid,
  List
} from "lucide-react";
import { Button } from "../ui/Button";
import { Sheet } from "../ui/Sheet";
import { ResourceType, ResourceEnvironment, ResourceStatus } from "../../types/project-resource";

interface ResourcesToolbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  typeFilter: string;
  setTypeFilter: (t: string) => void;
  providerFilter: string;
  setProviderFilter: (p: string) => void;
  envFilter: string;
  setEnvFilter: (e: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  favoritesOnlyFilter: boolean;
  setFavoritesOnlyFilter: (f: boolean) => void;
  archivedFilter: string;
  setArchivedFilter: (a: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  clearFilters: () => void;
  allProviders: string[];
  isGridView: boolean;
  setIsGridView: (g: boolean) => void;
  onAddResource: () => void;
  onResetDemo: () => void;
  isEditable: boolean;
  resultCount: number;
}

export default function ResourcesToolbar({
  searchQuery,
  setSearchQuery,
  typeFilter,
  setTypeFilter,
  providerFilter,
  setProviderFilter,
  envFilter,
  setEnvFilter,
  statusFilter,
  setStatusFilter,
  favoritesOnlyFilter,
  setFavoritesOnlyFilter,
  archivedFilter,
  setArchivedFilter,
  sortBy,
  setSortBy,
  clearFilters,
  allProviders,
  isGridView,
  setIsGridView,
  onAddResource,
  onResetDemo,
  isEditable,
  resultCount,
}: ResourcesToolbarProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const hasActiveFilters = 
    typeFilter !== "All" ||
    providerFilter !== "All" ||
    envFilter !== "All" ||
    statusFilter !== "All" ||
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
        {/* Type Filter */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Resource Type</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-type`}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Types</option>
            <option value="Repository">Repository</option>
            <option value="Deployment">Deployment</option>
            <option value="Documentation">Documentation</option>
            <option value="Design">Design</option>
            <option value="Database">Database</option>
            <option value="Hosting">Hosting</option>
            <option value="AI Conversation">AI Conversation</option>
            <option value="Local Path">Local Path</option>
            <option value="API Reference">API Reference</option>
            <option value="Reference Website">Reference Website</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Provider Filter */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Provider</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-provider`}
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Providers</option>
            {allProviders.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Environment Filter */}
        <div className="flex flex-col gap-1 lg:block">
          {isMobile && <label className="text-[11px] font-semibold text-gray-500">Environment</label>}
          <select
            id={`${isMobile ? 'mobile-' : 'desktop-'}filter-environment`}
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className={selectClass}
          >
            <option value="All">All Environments</option>
            <option value="Local">Local</option>
            <option value="Development">Development</option>
            <option value="Preview">Preview</option>
            <option value="Production">Production</option>
            <option value="Not applicable">Not applicable</option>
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Broken">Broken</option>
            <option value="Pending">Pending</option>
            <option value="Archived">Archived</option>
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
            <option value="Active">Active Resources</option>
            <option value="Archived">Archived Resources</option>
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
    <div className="flex flex-col gap-3 pb-2 border-b border-gray-100" id="resources-toolbar-root">
      {/* Dynamic Demo Warning banner */}
      <div className="flex items-center justify-between text-xs bg-slate-50 border border-slate-100 rounded-lg p-2 px-3 text-slate-600">
        <div className="flex items-center gap-1.5">
          <Link2 className="w-3.5 h-3.5 text-slate-400" />
          <span><strong>Security Policy Note:</strong> Store references only. Never save credentials or secret values in ProjectDock.</span>
        </div>
        {isEditable && (
          <button 
            onClick={onResetDemo}
            className="flex items-center gap-1 font-semibold text-slate-700 hover:text-slate-900 hover:underline transition-colors focus:outline-none"
            title="Reset resources mock data"
            id="btn-reset-resources-data"
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
              id="search-resources"
              type="text"
              placeholder="Search references, providers, tags, URLs, paths..."
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
            id="mobile-resources-filters-trigger"
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

        {/* Sorting, Layout Toggle, & Action Triggers */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Layout Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-1 shrink-0">
            <button
              onClick={() => setIsGridView(true)}
              className={`p-1 px-2 rounded-md transition-colors ${
                isGridView ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
              title="Grid View"
              id="btn-layout-grid"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsGridView(false)}
              className={`p-1 px-2 rounded-md transition-colors ${
                !isGridView ? "bg-white text-gray-800 shadow-sm" : "text-gray-400 hover:text-gray-600"
              }`}
              title="List View"
              id="btn-layout-list"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-xs text-gray-400 hidden sm:inline">Sort:</span>
            <select
              id="sort-resources"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-9.5 text-xs bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-2.5 font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-slate-500 shadow-sm cursor-pointer"
            >
              <option value="recentlyUpdated">Recently updated</option>
              <option value="recentlyOpened">Recently opened</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="type">Type (A-Z)</option>
              <option value="environment">Environment (A-Z)</option>
              <option value="favoritesFirst">Favorites first</option>
            </select>
          </div>

          {isEditable && (
            <Button 
              id="create-resource-trigger"
              variant="primary" 
              onClick={onAddResource}
              className="h-9.5 rounded-xl px-4 gap-2 font-semibold shadow-md shrink-0 bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Plus className="w-4 h-4" />
              Add Resource
            </Button>
          )}
        </div>
      </div>

      {/* Desktop filters container */}
      {renderFilterControls(false)}

      {/* Matched Count & Reset filters banner */}
      <div className="flex items-center justify-between text-xs py-1 text-gray-500 font-medium">
        <div>
          Showing <span className="font-semibold text-gray-700">{resultCount}</span> matching {resultCount === 1 ? 'resource' : 'resources'}
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 font-semibold text-slate-600 hover:text-slate-900 hover:underline transition-colors focus:outline-none"
            id="btn-clear-all-resource-filters"
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
        title="Resource Filters"
        size="md"
      >
        <div className="flex flex-col justify-between h-full py-4" id="mobile-resources-filters-sheet">
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
              id="btn-reset-mobile-resource-filters"
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
