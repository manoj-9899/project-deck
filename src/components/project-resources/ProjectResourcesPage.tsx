/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { WorkspaceOutletContext } from "../project-workspace/ProjectWorkspaceLayout";
import { useProjectResources } from "../../hooks/useProjectResources";
import { ProjectResource, ResourceStatus } from "../../types/project-resource";

// Sub-component imports
import ResourcesSummary from "./ResourcesSummary";
import ResourcesToolbar from "./ResourcesToolbar";
import FavoriteResources from "./FavoriteResources";
import ResourceList from "./ResourceList";
import ResourceDetails from "./ResourceDetails";
import ResourceFormSheet from "./ResourceFormSheet";

// UI imports
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";

export default function ProjectResourcesPage() {
  const { project } = useOutletContext<WorkspaceOutletContext>();

  // Load custom state store
  const resourcesState = useProjectResources(project.id);

  const isReadOnly = project.isArchived;
  const isEditable = !isReadOnly;

  // View state (defaults to grid view)
  const [isGridView, setIsGridView] = useState(true);

  // Sheets and dialog triggers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<ProjectResource | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeDetailsResource, setActiveDetailsResource] = useState<ProjectResource | null>(null);

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

  // Action: Open Add Resource
  const handleOpenCreateForm = () => {
    if (!isEditable) return;
    setEditingResource(null);
    setIsFormOpen(true);
  };

  // Action: Open Edit Resource
  const handleOpenEditForm = (res: ProjectResource) => {
    if (!isEditable) return;
    setEditingResource(res);
    setIsFormOpen(true);
  };

  // Action: Submit Create or Edit form
  const handleFormSubmit = (data: Partial<ProjectResource>) => {
    if (!isEditable) return;

    let success = false;
    if (editingResource) {
      success = resourcesState.editResource(editingResource.id, data);
    } else {
      success = resourcesState.addResource(data);
    }

    if (success) {
      setIsFormOpen(false);
      setEditingResource(null);
    }
  };

  // Action: Open Details Sheet
  const handleOpenDetails = (res: ProjectResource) => {
    // Resolve fresh state reference to show updated values
    const freshRef = resourcesState.resources.find((r) => r.id === res.id) || res;
    setActiveDetailsResource(freshRef);
    setIsDetailsOpen(true);
  };

  // Action: Handle Duplicating
  const handleDuplicate = (id: string) => {
    if (!isEditable) return;
    resourcesState.duplicateResource(id);
  };

  // Action: Handle toggling favorite pinning
  const handleToggleFavorite = (id: string) => {
    if (!isEditable) return;
    resourcesState.toggleFavorite(id);

    // Sync active details sheet if open on this resource
    if (activeDetailsResource?.id === id) {
      const freshRef = resourcesState.resources.find((r) => r.id === id);
      if (freshRef) {
        setActiveDetailsResource({ ...freshRef });
      }
    }
  };

  // Action: Handle updating status value
  const handleChangeStatus = (id: string, newStatus: ResourceStatus) => {
    if (!isEditable) return;
    resourcesState.markStatus(id, newStatus);

    // Sync active details sheet if open on this resource
    if (activeDetailsResource?.id === id) {
      const freshRef = resourcesState.resources.find((r) => r.id === id);
      if (freshRef) {
        setActiveDetailsResource({ ...freshRef });
      }
    }
  };

  // Action: Toggle Archive status with Dialog confirmation
  const handleToggleArchiveWithConfirm = (id: string) => {
    if (!isEditable) return;
    const item = resourcesState.resources.find((r) => r.id === id);
    if (!item) return;

    const isArchiving = !item.isArchived;

    setConfirmState({
      isOpen: true,
      title: isArchiving ? "Archive Resource Reference?" : "Restore Resource Reference?",
      description: isArchiving
        ? `Are you sure you want to archive "${item.title}"? This will hide it from active dashboards and favorite grids, keeping it safely stored in the Archive lane.`
        : `Are you sure you want to restore "${item.title}"? This will return this resource reference to active workspace dashboards and bento cards.`,
      confirmLabel: isArchiving ? "Archive Reference" : "Restore Reference",
      confirmVariant: "primary",
      onConfirm: () => {
        resourcesState.toggleArchive(id);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        
        // Close details sheet if we archived it
        if (activeDetailsResource?.id === id) {
          setIsDetailsOpen(false);
        }
      },
    });
  };

  // Action: Delete reference with dialog confirmation
  const handleDeleteWithConfirm = (id: string) => {
    if (!isEditable) return;
    const item = resourcesState.resources.find((r) => r.id === id);
    if (!item) return;

    setConfirmState({
      isOpen: true,
      title: "Delete Resource Reference?",
      description: `Are you sure you want to permanently delete "${item.title}"? This will clear all tracked details. This action cannot be undone, though initial defaults will reappear if you reload the application.`,
      confirmLabel: "Delete Reference",
      confirmVariant: "danger",
      onConfirm: () => {
        resourcesState.deleteResource(id);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        
        // Close details sheet if we deleted it
        if (activeDetailsResource?.id === id) {
          setIsDetailsOpen(false);
        }
      },
    });
  };

  // Action: Reset references with confirm
  const handleResetToSeedsWithConfirm = () => {
    if (!isEditable) return;

    setConfirmState({
      isOpen: true,
      title: "Reset Resource Library?",
      description: "Are you sure you want to revert all custom additions or edits in this project and reload the initial default seeded resources?",
      confirmLabel: "Reset Data",
      confirmVariant: "danger",
      onConfirm: () => {
        resourcesState.resetToSeed();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setIsDetailsOpen(false);
      },
    });
  };

  // Filter pinned favorites
  const favoriteResources = useMemo(() => {
    return resourcesState.resources.filter((r) => r.isFavorite && !r.isArchived);
  }, [resourcesState.resources]);

  return (
    <div className="space-y-6 animate-fade-in py-1" id="project-resources-page-root">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4 animate-fade-in-down">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Project Resources, Links & Local Paths
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed mt-0.5">
            Organize high-fidelity reference links for git repositories, live deployments, design canvases, database servers, and local folder paths.
          </p>
        </div>

        {isReadOnly && (
          <div className="bg-amber-50 text-amber-800 border border-amber-100 rounded-lg p-2 px-3 text-xs font-semibold shrink-0">
            Archived Project — Read-Only Mode
          </div>
        )}
      </div>

      {/* 2. Bento Tally Metrics Summary */}
      <ResourcesSummary summary={resourcesState.summary} />

      {/* 3. Filtering & Sorting toolbar */}
      <ResourcesToolbar
        searchQuery={resourcesState.searchQuery}
        setSearchQuery={resourcesState.setSearchQuery}
        typeFilter={resourcesState.typeFilter}
        setTypeFilter={resourcesState.setTypeFilter}
        providerFilter={resourcesState.providerFilter}
        setProviderFilter={resourcesState.setProviderFilter}
        envFilter={resourcesState.envFilter}
        setEnvFilter={resourcesState.setEnvFilter}
        statusFilter={resourcesState.statusFilter}
        setStatusFilter={resourcesState.setStatusFilter}
        favoritesOnlyFilter={resourcesState.favoritesOnlyFilter}
        setFavoritesOnlyFilter={resourcesState.setFavoritesOnlyFilter}
        archivedFilter={resourcesState.archivedFilter}
        setArchivedFilter={resourcesState.setArchivedFilter}
        sortBy={resourcesState.sortBy}
        setSortBy={resourcesState.setSortBy}
        isGridView={isGridView}
        setIsGridView={setIsGridView}
        clearFilters={() => {
          resourcesState.setSearchQuery("");
          resourcesState.setTypeFilter("All");
          resourcesState.setProviderFilter("All");
          resourcesState.setEnvFilter("All");
          resourcesState.setStatusFilter("All");
          resourcesState.setFavoritesOnlyFilter(false);
          resourcesState.setArchivedFilter("Active");
          resourcesState.setSortBy("recentlyUpdated");
        }}
        allProviders={resourcesState.allProviders}
        onAddResource={handleOpenCreateForm}
        onResetDemo={handleResetToSeedsWithConfirm}
        isEditable={isEditable}
        resultCount={resourcesState.resources.length}
      />

      {/* 4. Favorites Bento Horizontal Board */}
      {resourcesState.archivedFilter !== "Archived" && !resourcesState.favoritesOnlyFilter && (
        <FavoriteResources
          favorites={favoriteResources}
          onOpenDetails={handleOpenDetails}
          onOpenResource={resourcesState.openResource}
        />
      )}

      {/* 5. Main Resource list wrapper */}
      <ResourceList
        resources={resourcesState.resources}
        allResourcesCount={resourcesState.allResourcesCount}
        searchQuery={resourcesState.searchQuery}
        hasFilters={
          resourcesState.typeFilter !== "All" ||
          resourcesState.providerFilter !== "All" ||
          resourcesState.envFilter !== "All" ||
          resourcesState.statusFilter !== "All"
        }
        isGridView={isGridView}
        onOpenDetails={handleOpenDetails}
        onEdit={handleOpenEditForm}
        onDuplicate={handleDuplicate}
        onToggleFavorite={handleToggleFavorite}
        onToggleArchive={handleToggleArchiveWithConfirm}
        onChangeStatus={handleChangeStatus}
        onDelete={handleDeleteWithConfirm}
        onOpenResource={resourcesState.openResource}
        isEditable={isEditable}
        onAddResource={handleOpenCreateForm}
        onClearFilters={() => {
          resourcesState.setSearchQuery("");
          resourcesState.setTypeFilter("All");
          resourcesState.setProviderFilter("All");
          resourcesState.setEnvFilter("All");
          resourcesState.setStatusFilter("All");
          resourcesState.setFavoritesOnlyFilter(false);
          resourcesState.setArchivedFilter("Active");
        }}
      />

      {/* 6. Form Slide sheet */}
      <ResourceFormSheet
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingResource(null);
        }}
        initialData={editingResource}
        onSubmit={handleFormSubmit}
      />

      {/* 7. Details sheet */}
      <ResourceDetails
        resource={activeDetailsResource}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setActiveDetailsResource(null);
        }}
        onEdit={handleOpenEditForm}
        isEditable={isEditable}
      />

      {/* 8. Context Confirmation Overlays */}
      <Dialog
        id="resource-action-confirm-dialog"
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        title={confirmState.title}
        description={confirmState.description}
        footer={
          <div className="flex justify-end gap-2 px-1 font-sans">
            <Button
              id="res-confirm-btn-cancel"
              type="button"
              variant="secondary"
              onClick={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              id="res-confirm-btn-action"
              type="button"
              variant={confirmState.confirmVariant === "danger" ? "danger" : "primary"}
              onClick={confirmState.onConfirm}
              className={confirmState.confirmVariant === "danger" ? "bg-red-600 hover:bg-red-700 text-white border-none shadow-md" : "bg-slate-900 hover:bg-slate-800 text-white"}
            >
              {confirmState.confirmLabel}
            </Button>
          </div>
        }
      />
    </div>
  );
}
