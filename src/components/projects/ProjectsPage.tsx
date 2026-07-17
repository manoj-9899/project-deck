import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "../ui/Toast";
import { Dialog } from "../ui/Dialog";
import { EmptyState } from "../ui/EmptyState";
import { useProjectsState, ProjectFilterState } from "./useProjectsState";
import ProjectsSummary from "./ProjectsSummary";
import ProjectsToolbar from "./ProjectsToolbar";
import ProjectCard from "./ProjectCard";
import ProjectListItem from "./ProjectListItem";
import ProjectForm from "./ProjectForm";
import { Project, ProjectStatus, ProjectHealth, Priority, ProjectCategory } from "../../types";
import { FolderGit2, AlertCircle, SearchX, SlidersHorizontal, Eye } from "lucide-react";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";

export default function ProjectsPage() {
  const { toast } = useToast();
  
  const {
    filteredAndSortedProjects,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    resetFilters,
    createProject,
    editProject,
    duplicateProject,
    archiveProject,
    restoreProject,
    projectStats
  } = useProjectsState();

  // Dialog / Modal Visibility States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);

  // Focus Project States
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToArchive, setProjectToArchive] = useState<Project | null>(null);

  // Handle Form Actions
  const handleCreateSubmit = (data: any) => {
    createProject(data);
    setIsCreateOpen(false);
    toast({
      type: "success",
      title: "Project Created",
      message: `"${data.name}" has been successfully added to your workspace portfolio.`,
      duration: 3500
    });
  };

  const handleEditClick = (project: Project) => {
    setProjectToEdit(project);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (data: any) => {
    if (projectToEdit) {
      editProject(projectToEdit.id, data);
      setIsEditOpen(false);
      setProjectToEdit(null);
      toast({
        type: "success",
        title: "Project Updated",
        message: `Changes to "${data.name}" have been saved successfully.`,
        duration: 3500
      });
    }
  };

  const handleDuplicateClick = (project: Project) => {
    duplicateProject(project);
    toast({
      type: "success",
      title: "Project Duplicated",
      message: `"${project.name}" has been copied. ID prefixes updated automatically.`,
      duration: 3500
    });
  };

  const handleArchiveClick = (project: Project) => {
    setProjectToArchive(project);
    setIsArchiveConfirmOpen(true);
  };

  const handleArchiveConfirm = () => {
    if (projectToArchive) {
      archiveProject(projectToArchive.id);
      setIsArchiveConfirmOpen(false);
      setProjectToArchive(null);
      toast({
        type: "success",
        title: "Project Archived",
        message: `"${projectToArchive.name}" has been moved to archives and marked as inactive.`,
        duration: 3500
      });
    }
  };

  const handleRestoreClick = (id: string) => {
    restoreProject(id);
    const proj = filteredAndSortedProjects.find(p => p.id === id);
    toast({
      type: "success",
      title: "Project Restored",
      message: `Project has been returned to active workspace portfolio.`,
      duration: 3500
    });
  };

  // Filter Selection options inside modal
  const categoryOptions = [
    { value: "All", label: "All Categories" },
    { value: "Personal Tool", label: "Personal Tool" },
    { value: "Portfolio", label: "Portfolio" },
    { value: "Business", label: "Business" },
    { value: "Client Work", label: "Client Work" },
    { value: "SaaS Experiment", label: "SaaS Experiment" },
    { value: "Academic", label: "Academic" },
    { value: "Experimental", label: "Experimental" }
  ];

  const statusOptions = [
    { value: "All", label: "All Statuses" },
    { value: "Idea", label: "Idea" },
    { value: "Planning", label: "Planning" },
    { value: "Designing", label: "Designing" },
    { value: "Building", label: "Building" },
    { value: "Testing", label: "Testing" },
    { value: "Deployed", label: "Deployed" },
    { value: "Maintaining", label: "Maintaining" },
    { value: "Paused", label: "Paused" },
    { value: "Archived", label: "Archived" }
  ];

  const healthOptions = [
    { value: "All", label: "All Health Ranges" },
    { value: "On track", label: "On Track" },
    { value: "Needs attention", label: "Needs Attention" },
    { value: "Blocked", label: "Blocked" },
    { value: "Stable", label: "Stable" },
    { value: "Inactive", label: "Inactive" }
  ];

  const priorityOptions = [
    { value: "All", label: "All Priorities" },
    { value: "Critical", label: "Critical" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" }
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto font-sans">
      
      {/* Page Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-5">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2.5">
            <FolderGit2 className="w-5.5 h-5.5 text-accent-primary shrink-0" />
            <h1 className="text-2xl font-black text-text-primary tracking-tight">
              Engineering Directory
            </h1>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            Manage, configure, and monitor your local and production software workspaces in one dynamic database.
          </p>
        </div>
      </div>

      {/* Portfolio Compact Metrics Strip */}
      <ProjectsSummary stats={projectStats} />

      {/* Filters, Search & Layout controls toolbar */}
      <ProjectsToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        onCreateOpen={() => setIsCreateOpen(true)}
        onFiltersOpen={() => setIsFiltersOpen(true)}
        resultsCount={filteredAndSortedProjects.length}
      />

      {/* Main Listing View (Grid or List with animation container) */}
      <div className="min-h-[350px]">
        {filteredAndSortedProjects.length === 0 ? (
          <div className="py-12">
            <EmptyState
              icon={<SearchX className="w-6 h-6 text-text-tertiary" />}
              title="No Workspace Projects Match Your Search"
              description="Adjust your tech-stack, category or status query parameters, or restore archived records to reveal projects."
              primaryAction={{
                label: "Reset Search Filters",
                onClick: resetFilters
              }}
              secondaryAction={{
                label: "Add New Workspace",
                onClick: () => setIsCreateOpen(true)
              }}
            />
          </div>
        ) : (
          <motion.div
            layout="position"
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "flex flex-col gap-3.5"
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {viewMode === "grid" ? (
                    <ProjectCard
                      project={project}
                      onEdit={handleEditClick}
                      onDuplicate={handleDuplicateClick}
                      onArchive={handleArchiveClick}
                      onRestore={handleRestoreClick}
                    />
                  ) : (
                    <ProjectListItem
                      project={project}
                      onEdit={handleEditClick}
                      onDuplicate={handleDuplicateClick}
                      onArchive={handleArchiveClick}
                      onRestore={handleRestoreClick}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* MODALS / OVERLAYS */}

      {/* 1. Create Workspace Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Engineering Workspace"
        description="Add a new project to your engineering tracker. Define metadata, timelines, and technical goals."
      >
        <ProjectForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateOpen(false)}
          submitLabel="Create Workspace"
        />
      </Dialog>

      {/* 2. Edit Settings Dialog */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setProjectToEdit(null);
        }}
        title={`Edit Workspace - ${projectToEdit?.name}`}
        description="Modify current delivery phases, milestones, technical stacks, or live environment configurations."
      >
        {projectToEdit && (
          <ProjectForm
            initialData={projectToEdit}
            onSubmit={handleEditSubmit}
            onCancel={() => {
              setIsEditOpen(false);
              setProjectToEdit(null);
            }}
            submitLabel="Save Changes"
          />
        )}
      </Dialog>

      {/* 3. Advanced Filtering Dialog */}
      <Dialog
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        title="Refine Directory Portfolio"
        description="Filter your developer environment lists by health statuses, technical categories, priorities, or lifecycle stages."
      >
        <div className="flex flex-col gap-4 py-1">
          <Select
            label="Category Segment"
            options={categoryOptions}
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
            className="text-xs"
          />
          <Select
            label="Lifecycle Stage"
            options={statusOptions}
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
            className="text-xs"
          />
          <Select
            label="Health Status"
            options={healthOptions}
            value={filters.health}
            onChange={(e) => setFilters(prev => ({ ...prev, health: e.target.value as any }))}
            className="text-xs"
          />
          <Select
            label="Workspace Priority"
            options={priorityOptions}
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as any }))}
            className="text-xs"
          />

          <div className="flex items-center justify-between border-t border-border-subtle pt-4 mt-2">
            <button
              type="button"
              onClick={() => {
                resetFilters();
                setIsFiltersOpen(false);
              }}
              className="text-xs font-semibold text-text-tertiary hover:text-accent-primary cursor-pointer transition-colors"
            >
              Reset Filters
            </button>
            <Button
              variant="primary"
              onClick={() => setIsFiltersOpen(false)}
              className="text-xs py-1.5 px-4 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white border-transparent font-semibold"
            >
              Apply Filter Segment
            </Button>
          </div>
        </div>
      </Dialog>

      {/* 4. Archive Confirmation Dialog */}
      <Dialog
        isOpen={isArchiveConfirmOpen}
        onClose={() => {
          setIsArchiveConfirmOpen(false);
          setProjectToArchive(null);
        }}
        title="Confirm Project Archival"
        description={`Are you sure you want to archive "${projectToArchive?.name}"?`}
      >
        <div className="flex flex-col gap-4 font-sans">
          <div className="bg-status-warning/5 border border-status-warning/10 p-3 rounded-lg flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5 text-xs text-text-secondary leading-normal">
              <span className="font-bold text-text-primary">What happens when archived:</span>
              <p>The project will be marked as Archived, with health set to Inactive. It will be hidden from your default Active Workspaces views, but remains fully searchable in your historical portfolio records.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
            <Button
              variant="secondary"
              onClick={() => {
                setIsArchiveConfirmOpen(false);
                setProjectToArchive(null);
              }}
              className="text-xs py-1.5 px-4 rounded-md"
            >
              Keep Active
            </Button>
            <Button
              variant="primary"
              onClick={handleArchiveConfirm}
              className="text-xs py-1.5 px-5 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white border-transparent font-semibold"
            >
              Yes, Archive Project
            </Button>
          </div>
        </div>
      </Dialog>

    </div>
  );
}
