/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { WorkspaceOutletContext } from "../project-workspace/ProjectWorkspaceLayout";
import { useProjectPrompts } from "../../hooks/useProjectPrompts";
import { useProjectRoadmap } from "../../hooks/useProjectRoadmap";
import { useProjectTasks } from "../../hooks/useProjectTasks";
import { ProjectPrompt } from "../../types/project-prompt";

// Sub-component imports
import PromptsSummary from "./PromptsSummary";
import PromptsToolbar from "./PromptsToolbar";
import FavoritePrompts from "./FavoritePrompts";
import PromptList from "./PromptList";
import PromptDetails from "./PromptDetails";
import PromptFormSheet from "./PromptFormSheet";
import PromptVersionDialog from "./PromptVersionDialog";

// UI imports
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";

export default function ProjectPromptsPage() {
  const { project } = useOutletContext<WorkspaceOutletContext>();

  // Load state stores
  const promptsState = useProjectPrompts(project.id);
  const roadmapState = useProjectRoadmap(project.id);
  const tasksState = useProjectTasks(project.id);

  const isReadOnly = project.isArchived;
  const isEditable = !isReadOnly;

  // Sheets and dialog triggers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<ProjectPrompt | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeDetailsPrompt, setActiveDetailsPrompt] = useState<ProjectPrompt | null>(null);

  const [isVersionDialogOpen, setIsVersionDialogOpen] = useState(false);
  const [versionDialogPrompt, setVersionDialogPrompt] = useState<ProjectPrompt | null>(null);

  // Common dynamic confirmation dialog state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    confirmVariant?: "primary" | "danger" | "warning";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmLabel: "Confirm",
    confirmVariant: "primary",
    onConfirm: () => {},
  });

  // Action: Open Create Prompt
  const handleOpenCreateForm = () => {
    if (!isEditable) return;
    setEditingPrompt(null);
    setIsFormOpen(true);
  };

  // Action: Open Edit Prompt
  const handleOpenEditForm = (prompt: ProjectPrompt) => {
    if (!isEditable) return;
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  // Action: Submit Create or Edit
  const handleFormSubmit = (data: Partial<ProjectPrompt>) => {
    if (!isEditable) return;

    let success = false;
    if (editingPrompt) {
      success = promptsState.editPrompt(editingPrompt.id, data);
    } else {
      success = promptsState.addPrompt(data);
    }

    if (success) {
      setIsFormOpen(false);
      setEditingPrompt(null);
    }
  };

  // Action: Open Details Sheet
  const handleOpenDetails = (prompt: ProjectPrompt) => {
    // Resolve fresh memory reference
    const freshRef = promptsState.prompts.find((p) => p.id === prompt.id) || prompt;
    setActiveDetailsPrompt(freshRef);
    setIsDetailsOpen(true);
  };

  // Action: Open Quick Version Dialog
  const handleOpenVersionDialog = (prompt: ProjectPrompt) => {
    if (!isEditable) return;
    setVersionDialogPrompt(prompt);
    setIsVersionDialogOpen(true);
  };

  // Action: Submit Quick Version
  const handleVersionSubmit = (newPromptText: string, changeSummary: string) => {
    if (!isEditable || !versionDialogPrompt) return;
    promptsState.createNewVersion(versionDialogPrompt.id, newPromptText, changeSummary);
    
    // If details sheet is open on the modified prompt, update details reference
    if (activeDetailsPrompt?.id === versionDialogPrompt.id) {
      const freshRef = promptsState.prompts.find((p) => p.id === versionDialogPrompt.id);
      if (freshRef) {
        setActiveDetailsPrompt(freshRef);
      }
    }
  };

  // Action: Handle version restoration
  const handleVersionRestore = (id: string, versionNum: number) => {
    if (!isEditable) return;
    promptsState.restoreOlderVersion(id, versionNum);
    
    // If details is open, sync
    if (activeDetailsPrompt?.id === id) {
      const freshRef = promptsState.prompts.find((p) => p.id === id);
      if (freshRef) {
        setActiveDetailsPrompt(freshRef);
      }
    }
  };

  // Action: Toggle Archive with confirm
  const handleToggleArchiveWithConfirm = (id: string) => {
    if (!isEditable) return;
    const item = promptsState.prompts.find((p) => p.id === id);
    if (!item) return;

    const isArchiving = !item.isArchived;

    setConfirmState({
      isOpen: true,
      title: isArchiving ? "Archive Prompt Template?" : "Restore Prompt Template?",
      description: isArchiving
        ? `Are you sure you want to archive "${item.title}"? This will hide it from active lists and favorite cards, keeping it in the Archive lane.`
        : `Are you sure you want to restore "${item.title}"? This will bring it back to active prompt lists and favorites.`,
      confirmLabel: isArchiving ? "Archive Prompt" : "Restore Prompt",
      confirmVariant: "primary",
      onConfirm: () => {
        promptsState.toggleArchive(id);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        
        // Close details if we archived it
        if (activeDetailsPrompt?.id === id) {
          setIsDetailsOpen(false);
        }
      },
    });
  };

  // Action: Delete prompt with confirm
  const handleDeleteWithConfirm = (id: string) => {
    if (!isEditable) return;
    const item = promptsState.prompts.find((p) => p.id === id);
    if (!item) return;

    setConfirmState({
      isOpen: true,
      title: "Delete AI Prompt?",
      description: `Are you sure you want to permanently delete "${item.title}"? All versions and handover contexts will be cleared. This action cannot be undone, but default prompts will reappear if you refresh the page.`,
      confirmLabel: "Delete Prompt",
      confirmVariant: "danger",
      onConfirm: () => {
        promptsState.deletePrompt(id);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        
        if (activeDetailsPrompt?.id === id) {
          setIsDetailsOpen(false);
        }
      },
    });
  };

  // Action: Reset seeds with confirm
  const handleResetToSeedsWithConfirm = () => {
    if (!isEditable) return;

    setConfirmState({
      isOpen: true,
      title: "Reset Prompt Library?",
      description: "Are you sure you want to reset all modifications in this project and reload the initial default seeded prompt templates?",
      confirmLabel: "Reset Data",
      confirmVariant: "danger",
      onConfirm: () => {
        promptsState.resetToSeed();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setIsDetailsOpen(false);
      },
    });
  };

  // Lookups for relations lists
  const phasesOptions = useMemo(() => {
    return roadmapState.phases.map((p) => ({
      id: p.id,
      title: p.title,
    }));
  }, [roadmapState.phases]);

  const tasksOptions = useMemo(() => {
    return tasksState.allTasks.map((t) => ({
      id: t.id,
      title: t.title,
    }));
  }, [tasksState.allTasks]);

  // Filters favorite prompts
  const favoritePrompts = useMemo(() => {
    return promptsState.prompts.filter((p) => p.isFavorite && !p.isArchived);
  }, [promptsState.prompts]);

  return (
    <div className="space-y-6 animate-fade-in py-1" id="project-prompts-page-root">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 animate-fade-in-down">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            AI Prompt Library & Context Handover
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed mt-0.5">
            Organize structured prompt templates, model response summaries, and truncated session handover packages mapped directly to roadmap phases.
          </p>
        </div>

        {isReadOnly && (
          <div className="bg-amber-50 text-amber-800 border border-amber-100 rounded-lg p-2 px-3 text-xs font-semibold shrink-0">
            Archived Project — Read-Only Mode
          </div>
        )}
      </div>

      {/* 2. Bento Tally Metrics */}
      <PromptsSummary summary={promptsState.summary} />

      {/* 3. Filter Actions & Sorting Toolbar */}
      <PromptsToolbar
        searchQuery={promptsState.searchQuery}
        setSearchQuery={promptsState.setSearchQuery}
        toolFilter={promptsState.toolFilter}
        setToolFilter={promptsState.setToolFilter}
        categoryFilter={promptsState.categoryFilter}
        setCategoryFilter={promptsState.setCategoryFilter}
        statusFilter={promptsState.statusFilter}
        setStatusFilter={promptsState.setStatusFilter}
        phaseFilter={promptsState.phaseFilter}
        setPhaseFilter={promptsState.setPhaseFilter}
        taskFilter={promptsState.taskFilter}
        setTaskFilter={promptsState.setTaskFilter}
        favoritesOnlyFilter={promptsState.favoritesOnlyFilter}
        setFavoritesOnlyFilter={promptsState.setFavoritesOnlyFilter}
        archivedFilter={promptsState.archivedFilter}
        setArchivedFilter={promptsState.setArchivedFilter}
        sortBy={promptsState.sortBy}
        setSortBy={promptsState.setSortBy}
        clearFilters={() => {
          promptsState.setSearchQuery("");
          promptsState.setToolFilter("All");
          promptsState.setCategoryFilter("All");
          promptsState.setStatusFilter("All");
          promptsState.setPhaseFilter("All");
          promptsState.setTaskFilter("All");
          promptsState.setFavoritesOnlyFilter(false);
          promptsState.setArchivedFilter("Active");
          promptsState.setSortBy("recentlyUpdated");
        }}
        phases={phasesOptions}
        tasks={tasksOptions}
        onAddPrompt={handleOpenCreateForm}
        onResetDemo={handleResetToSeedsWithConfirm}
        isEditable={isEditable}
        resultCount={promptsState.prompts.length}
      />

      {/* 4. Horizontal Pinned Favorites Board */}
      {promptsState.archivedFilter !== "Archived" && !promptsState.favoritesOnlyFilter && (
        <FavoritePrompts
          favorites={favoritePrompts}
          onOpenDetails={handleOpenDetails}
        />
      )}

      {/* 5. Central Prompt Grid/List */}
      <PromptList
        prompts={promptsState.prompts}
        allPromptsCount={promptsState.allPromptsCount}
        searchQuery={promptsState.searchQuery}
        hasFilters={
          promptsState.toolFilter !== "All" ||
          promptsState.categoryFilter !== "All" ||
          promptsState.statusFilter !== "All" ||
          promptsState.phaseFilter !== "All" ||
          promptsState.taskFilter !== "All"
        }
        favoritesOnlyFilter={promptsState.favoritesOnlyFilter}
        phases={phasesOptions}
        tasks={tasksOptions}
        onOpenDetails={handleOpenDetails}
        onEdit={handleOpenEditForm}
        onDuplicate={promptsState.duplicatePrompt}
        onToggleFavorite={promptsState.toggleFavorite}
        onMarkUsed={promptsState.markPromptUsed}
        onToggleArchive={handleToggleArchiveWithConfirm}
        onNewVersion={handleOpenVersionDialog}
        onDelete={handleDeleteWithConfirm}
        isEditable={isEditable}
        onAddPrompt={handleOpenCreateForm}
        onClearFilters={() => {
          promptsState.setSearchQuery("");
          promptsState.setToolFilter("All");
          promptsState.setCategoryFilter("All");
          promptsState.setStatusFilter("All");
          promptsState.setPhaseFilter("All");
          promptsState.setTaskFilter("All");
          promptsState.setFavoritesOnlyFilter(false);
          promptsState.setArchivedFilter("Active");
        }}
        archivedFilter={promptsState.archivedFilter}
      />

      {/* 6. Form Create/Edit Sheet drawer */}
      <PromptFormSheet
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPrompt(null);
        }}
        initialData={editingPrompt}
        phases={phasesOptions}
        tasks={tasksOptions}
        onSubmit={handleFormSubmit}
      />

      {/* 7. Read/Mutation Details Sheet */}
      <PromptDetails
        prompt={activeDetailsPrompt}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setActiveDetailsPrompt(null);
        }}
        projectName={project.name}
        phases={phasesOptions}
        tasks={tasksOptions}
        isEditable={isEditable}
        onEdit={handleOpenEditForm}
        onDuplicate={promptsState.duplicatePrompt}
        onToggleFavorite={promptsState.toggleFavorite}
        onMarkUsed={promptsState.markPromptUsed}
        onToggleArchive={handleToggleArchiveWithConfirm}
        onNewVersion={handleOpenVersionDialog}
        onRestoreVersion={handleVersionRestore}
        onDelete={handleDeleteWithConfirm}
      />

      {/* 8. Quick version addition Dialog */}
      <PromptVersionDialog
        isOpen={isVersionDialogOpen}
        onClose={() => {
          setIsVersionDialogOpen(false);
          setVersionDialogPrompt(null);
        }}
        promptItem={versionDialogPrompt}
        onSubmit={handleVersionSubmit}
      />

      {/* 9. Context Action Confirm Dialog */}
      <Dialog
        id="prompt-action-confirm-dialog"
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        title={confirmState.title}
        description={confirmState.description}
        footer={
          <div className="flex justify-end gap-2 px-1">
            <Button
              id="confirm-btn-cancel"
              type="button"
              variant="secondary"
              onClick={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              id="confirm-btn-action"
              type="button"
              variant={confirmState.confirmVariant === "danger" ? "danger" : "primary"}
              onClick={confirmState.onConfirm}
            >
              {confirmState.confirmLabel}
            </Button>
          </div>
        }
      />
    </div>
  );
}
