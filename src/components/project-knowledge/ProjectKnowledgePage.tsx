import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { WorkspaceOutletContext } from "../project-workspace/ProjectWorkspaceLayout";
import { useProjectKnowledge } from "../../hooks/useProjectKnowledge";
import { useProjectRoadmap } from "../../hooks/useProjectRoadmap";
import { useProjectTasks } from "../../hooks/useProjectTasks";
import { ProjectKnowledgeEntry, DecisionStatus } from "../../types/project-knowledge";

// Sub-component imports
import KnowledgeSummary from "./KnowledgeSummary";
import KnowledgeToolbar from "./KnowledgeToolbar";
import PinnedKnowledge from "./PinnedKnowledge";
import KnowledgeList from "./KnowledgeList";
import KnowledgeEntryDetails from "./KnowledgeEntryDetails";
import KnowledgeEntryFormSheet from "./KnowledgeEntryFormSheet";

// UI imports
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";

export default function ProjectKnowledgePage() {
  const { project } = useOutletContext<WorkspaceOutletContext>();

  // Load custom states for knowledge, roadmap phases, and tasks
  const knowledgeState = useProjectKnowledge(project.id);
  const roadmapState = useProjectRoadmap(project.id);
  const tasksState = useProjectTasks(project.id);

  const isReadOnly = project.isArchived;
  const isEditable = !isReadOnly;

  // Active form state and active details sheets
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ProjectKnowledgeEntry | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeDetailsEntry, setActiveDetailsEntry] = useState<ProjectKnowledgeEntry | null>(null);

  // Custom in-app confirmation dialog state
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

  // Action: Open Create Entry
  const handleOpenCreateForm = () => {
    if (!isEditable) return;
    setEditingEntry(null);
    setIsFormOpen(true);
  };

  // Action: Open Edit Entry
  const handleOpenEditForm = (entry: ProjectKnowledgeEntry) => {
    if (!isEditable) return;
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  // Action: Submit Create or Edit
  const handleFormSubmit = (data: Partial<ProjectKnowledgeEntry>) => {
    if (!isEditable) return;

    let success = false;
    if (editingEntry) {
      success = knowledgeState.editEntry(editingEntry.id, data);
    } else {
      success = knowledgeState.addEntry(data);
    }

    if (success) {
      setIsFormOpen(false);
      setEditingEntry(null);
    }
  };

  // Action: Open Details Sheet
  const handleOpenDetails = (entry: ProjectKnowledgeEntry) => {
    // Sync with the latest version in memory
    const freshRef = knowledgeState.entries.find((e) => e.id === entry.id) || entry;
    setActiveDetailsEntry(freshRef);
    setIsDetailsOpen(true);
  };

  // Action: Confirm Archive/Restore
  const handleToggleArchiveWithConfirm = (id: string) => {
    if (!isEditable) return;
    const entry = knowledgeState.entries.find((e) => e.id === id);
    if (!entry) return;

    const isArchiving = !entry.isArchived;

    setConfirmState({
      isOpen: true,
      title: isArchiving ? "Archive Knowledge Document?" : "Restore Knowledge Document?",
      description: isArchiving
        ? `Are you sure you want to archive "${entry.title}"? This will hide it from active list views but preserve it in the archive filter.`
        : `Are you sure you want to restore "${entry.title}"? This will bring it back to active list views.`,
      confirmLabel: isArchiving ? "Archive Document" : "Restore Document",
      confirmVariant: "primary",
      onConfirm: () => {
        knowledgeState.toggleArchive(id);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        
        // If details panel is open for this entry, sync its state
        if (activeDetailsEntry?.id === id) {
          setIsDetailsOpen(false);
        }
      },
    });
  };

  // Action: Confirm Delete
  const handleDeleteWithConfirm = (id: string) => {
    if (!isEditable) return;
    const entry = knowledgeState.entries.find((e) => e.id === id);
    if (!entry) return;

    setConfirmState({
      isOpen: true,
      title: "Delete Knowledge Document?",
      description: `Are you sure you want to permanently delete "${entry.title}"? This action cannot be undone within this session, but the document will reappear if you refresh the browser page.`,
      confirmLabel: "Delete Document",
      confirmVariant: "danger",
      onConfirm: () => {
        knowledgeState.deleteEntry(id);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        
        // If details panel is open for this entry, close it
        if (activeDetailsEntry?.id === id) {
          setIsDetailsOpen(false);
        }
      },
    });
  };

  // Action: Confirm Reset to Seeds
  const handleResetToSeedsWithConfirm = () => {
    if (!isEditable) return;

    setConfirmState({
      isOpen: true,
      title: "Reset Knowledge Base Data?",
      description: "Are you sure you want to reset all modifications made in this session and restore the default pre-seeded knowledge documents?",
      confirmLabel: "Reset Data",
      confirmVariant: "danger",
      onConfirm: () => {
        knowledgeState.resetToSeed();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setIsDetailsOpen(false);
      },
    });
  };

  // Prepare select options for Phase and Task dropdowns
  const phasesOptions = React.useMemo(() => {
    return roadmapState.phases.map((p) => ({
      id: p.id,
      title: p.title,
    }));
  }, [roadmapState.phases]);

  const tasksOptions = React.useMemo(() => {
    return tasksState.allTasks.map((t) => ({
      id: t.id,
      title: t.title,
    }));
  }, [tasksState.allTasks]);

  // Filter active, pinned entries specifically for the top pinning banner
  const pinnedEntries = React.useMemo(() => {
    return knowledgeState.entries.filter((e) => e.isPinned && !e.isArchived);
  }, [knowledgeState.entries]);

  return (
    <div className="space-y-6 animate-fade-in py-1">
      {/* 1. Header Information Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Knowledge Base & Decisions
          </h2>
          <p className="text-sm text-gray-500 max-w-2xl leading-relaxed mt-0.5">
            Maintain high-density records detailing architecture decisions, solved engineering roadblocks, guidelines, and wiki resources linked directly to roadmap scheduling.
          </p>
        </div>

        {isReadOnly && (
          <div className="bg-amber-50 text-amber-800 border border-amber-100 rounded-lg p-2 px-3 text-xs font-semibold shrink-0">
            Archived Project — Read-Only Mode
          </div>
        )}
      </div>

      {/* 2. Visual summary metric boards */}
      <KnowledgeSummary summary={knowledgeState.summary} />

      {/* 3. Filtering and searching toolbar */}
      <KnowledgeToolbar
        searchQuery={knowledgeState.searchQuery}
        setSearchQuery={knowledgeState.setSearchQuery}
        typeFilter={knowledgeState.typeFilter}
        setTypeFilter={knowledgeState.setTypeFilter}
        decisionStatusFilter={knowledgeState.decisionStatusFilter}
        setDecisionStatusFilter={knowledgeState.setDecisionStatusFilter}
        tagFilter={knowledgeState.tagFilter}
        setTagFilter={knowledgeState.setTagFilter}
        phaseFilter={knowledgeState.phaseFilter}
        setPhaseFilter={knowledgeState.setPhaseFilter}
        taskFilter={knowledgeState.taskFilter}
        setTaskFilter={knowledgeState.setTaskFilter}
        pinnedFilter={knowledgeState.pinnedFilter}
        setPinnedFilter={knowledgeState.setPinnedFilter}
        archivedFilter={knowledgeState.archivedFilter}
        setArchivedFilter={knowledgeState.setArchivedFilter}
        sortBy={knowledgeState.sortBy}
        setSortBy={knowledgeState.setSortBy}
        clearFilters={() => {
          knowledgeState.setSearchQuery("");
          knowledgeState.setTypeFilter("All");
          knowledgeState.setDecisionStatusFilter("All");
          knowledgeState.setTagFilter("All");
          knowledgeState.setPhaseFilter("All");
          knowledgeState.setTaskFilter("All");
          knowledgeState.setPinnedFilter("All");
          knowledgeState.setArchivedFilter("Active");
          knowledgeState.setSortBy("pinnedFirst");
        }}
        allTags={knowledgeState.allTags}
        phases={phasesOptions}
        tasks={tasksOptions}
        onAddEntry={handleOpenCreateForm}
        onResetDemo={handleResetToSeedsWithConfirm}
        isEditable={isEditable}
        resultCount={knowledgeState.entries.length}
      />

      {/* 4. Compact Pin Banner (Visible only for active listings and active entries) */}
      {knowledgeState.archivedFilter !== "Archived" && (
        <PinnedKnowledge
          pinnedEntries={pinnedEntries}
          onOpenDetails={handleOpenDetails}
        />
      )}

      {/* 5. Main lists and cards */}
      <KnowledgeList
        entries={knowledgeState.entries}
        allEntriesCount={knowledgeState.allEntriesCount}
        searchQuery={knowledgeState.searchQuery}
        hasFilters={
          knowledgeState.typeFilter !== "All" ||
          knowledgeState.decisionStatusFilter !== "All" ||
          knowledgeState.tagFilter !== "All" ||
          knowledgeState.phaseFilter !== "All" ||
          knowledgeState.taskFilter !== "All" ||
          knowledgeState.pinnedFilter !== "All"
        }
        phases={phasesOptions}
        tasks={tasksOptions}
        onOpenDetails={handleOpenDetails}
        onEdit={handleOpenEditForm}
        onDuplicate={knowledgeState.duplicateEntry}
        onTogglePin={knowledgeState.togglePin}
        onToggleArchive={handleToggleArchiveWithConfirm}
        onDelete={handleDeleteWithConfirm}
        onChangeDecisionStatus={knowledgeState.changeDecisionStatus}
        isEditable={isEditable}
        onAddEntry={handleOpenCreateForm}
        onClearFilters={() => {
          knowledgeState.setSearchQuery("");
          knowledgeState.setTypeFilter("All");
          knowledgeState.setDecisionStatusFilter("All");
          knowledgeState.setTagFilter("All");
          knowledgeState.setPhaseFilter("All");
          knowledgeState.setTaskFilter("All");
          knowledgeState.setPinnedFilter("All");
          knowledgeState.setArchivedFilter("Active");
        }}
        archivedFilter={knowledgeState.archivedFilter}
      />

      {/* 6. Create/Edit Document side Sheet */}
      <KnowledgeEntryFormSheet
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEntry(null);
        }}
        initialData={editingEntry}
        phases={phasesOptions}
        tasks={tasksOptions}
        onSubmit={handleFormSubmit}
      />

      {/* 7. Entry details slide-out Sheet */}
      <KnowledgeEntryDetails
        entry={activeDetailsEntry}
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setActiveDetailsEntry(null);
        }}
        onEdit={handleOpenEditForm}
        phases={phasesOptions}
        tasks={tasksOptions}
        isEditable={isEditable}
      />

      {/* 8. Double Confirmation Dialog popup */}
      <Dialog
        id="knowledge-action-confirmation-dialog"
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        title={confirmState.title}
        description={confirmState.description}
        footer={
          <div className="flex justify-end gap-2 px-1">
            <Button
              id="confirm-cancel-btn"
              type="button"
              variant="secondary"
              onClick={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              id="confirm-action-btn"
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
