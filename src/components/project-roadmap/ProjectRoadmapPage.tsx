import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { WorkspaceOutletContext } from "../project-workspace/ProjectWorkspaceLayout";
import { useProjectRoadmap } from "../../hooks/useProjectRoadmap";
import { RoadmapSummary } from "./RoadmapSummary";
import { RoadmapPhaseList } from "./RoadmapPhaseList";
import { RoadmapTimeline } from "./RoadmapTimeline";
import { PhaseFormDialog } from "./PhaseFormDialog";
import { ArchivedRoadmapNotice } from "./ArchivedRoadmapNotice";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { useToast } from "../ui/Toast";
import { 
  Plus, 
  RotateCcw, 
  Layers, 
  Milestone, 
  List, 
  CalendarDays,
  Info,
  ChevronDown
} from "lucide-react";

export default function ProjectRoadmapPage() {
  const { project } = useOutletContext<WorkspaceOutletContext>();
  const roadmap = useProjectRoadmap(project.id);
  const { toast } = useToast();

  // Form dialogues states
  const [isPhaseFormOpen, setIsPhaseFormOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState<any>(null);

  // Menu popover trigger (for options)
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // Custom confirmation dialog state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    confirmVariant?: "primary" | "danger";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmLabel: "",
    confirmVariant: "primary",
    onConfirm: () => {},
  });

  const handleAddPhaseSubmit = (data: any) => {
    roadmap.addPhase(data);
    setIsPhaseFormOpen(false);
  };

  const handleEditPhaseSubmit = (data: any) => {
    if (editingPhase) {
      roadmap.editPhase(editingPhase.id, data);
    }
    setIsPhaseFormOpen(false);
    setEditingPhase(null);
  };

  // Skip confirm
  const handleSkipPhase = (phaseId: string) => {
    const p = roadmap.phases.find((x) => x.id === phaseId);
    if (!p) return;
    setConfirmState({
      isOpen: true,
      title: "Skip Phase",
      description: `Are you sure you want to bypass and mark "${p.title}" as Skipped?`,
      confirmLabel: "Skip Phase",
      confirmVariant: "danger",
      onConfirm: () => {
        roadmap.skipPhase(phaseId);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Complete confirm warning
  const handleCompletePhase = (phaseId: string) => {
    const result = roadmap.markPhaseCompleted(phaseId);
    if (result && result.hasWarnings) {
      setConfirmState({
        isOpen: true,
        title: "Complete Phase with Pending Criteria",
        description: `Some completion criteria (${result.pendingCount}) are still pending. Mark this phase completed anyway?`,
        confirmLabel: "Mark Completed",
        confirmVariant: "primary",
        onConfirm: () => {
          if (result.proceed) result.proceed();
          setConfirmState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    }
  };

  // Delete phase confirm
  const handleDeletePhase = (phaseId: string) => {
    const p = roadmap.phases.find((x) => x.id === phaseId);
    if (!p) return;
    setConfirmState({
      isOpen: true,
      title: "Delete Phase",
      description: `Are you sure you want to permanently delete "${p.title}"? This is temporary and resets on refresh.`,
      confirmLabel: "Delete Phase",
      confirmVariant: "danger",
      onConfirm: () => {
        const res = roadmap.deletePhase(phaseId);
        if (res && !res.success) {
          toast({
            type: "error",
            title: "Phase Deletion Failed",
            message: res.errorReason,
            duration: 5000,
          });
        }
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Milestone delete confirm
  const handleDeleteMilestone = (phaseId: string, milestoneId: string) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Milestone",
      description: "Are you sure you want to delete this milestone? (Changes reset after page refresh)",
      confirmLabel: "Delete Milestone",
      confirmVariant: "danger",
      onConfirm: () => {
        roadmap.deleteMilestone(phaseId, milestoneId);
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Reset Demo confirm
  const handleResetDemo = () => {
    setConfirmState({
      isOpen: true,
      title: "Reset Demo Changes?",
      description: "Are you sure you want to restore the roadmap to original mock values? Any temporary changes you made will be discarded.",
      confirmLabel: "Reset Roadmap",
      confirmVariant: "danger",
      onConfirm: () => {
        roadmap.resetDemoState();
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Select timeline node callback
  const handleSelectTimelineNode = (phaseId: string) => {
    roadmap.setViewMode("list");
    roadmap.togglePhaseExpanded(phaseId);
    // Scroll list down to phase
    const element = document.getElementById(`phase-card-${phaseId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const isReadOnly = project.isArchived;
  const isPaused = project.status === "Paused";

  return (
    <div id="project-roadmap-page" className="flex flex-col gap-6 font-sans">
      
      {/* 1. Header Banner & Warnings */}
      <ArchivedRoadmapNotice 
        isArchived={project.isArchived} 
        isPaused={isPaused} 
        projectName={project.name} 
      />

      {/* 2. Page Sub-Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold font-mono text-text-tertiary uppercase tracking-wider">
            Project planning
          </span>
          <h2 className="text-base font-bold text-text-primary tracking-tight">
            Roadmap
          </h2>
          <p className="text-xs text-text-secondary">
            Plan project phases, milestones, dependencies, and delivery progress.
          </p>
        </div>

        {/* Toolbar primary buttons */}
        {!isReadOnly && (
          <div className="flex items-center gap-2">
            <Button
              id="roadmap-add-phase-btn"
              variant="primary"
              size="sm"
              onClick={() => {
                setEditingPhase(null);
                setIsPhaseFormOpen(true);
              }}
              className="flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Phase</span>
            </Button>

            {/* Options Dropdown button */}
            <div className="relative">
              <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary bg-bg-primary hover:bg-muted-surface border border-border-subtle rounded-lg transition-all focus:outline-none"
                id="roadmap-options-menu-btn"
                aria-label="Toggle roadmap options"
              >
                <span>Roadmap Options</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isOptionsOpen && (
                <div 
                  id="roadmap-options-menu-dropdown"
                  className="absolute right-0 mt-1 w-48 bg-surface border border-border-strong rounded-xl shadow-floating py-1.5 z-20 text-xs text-text-secondary flex flex-col font-medium"
                >
                  <button
                    onClick={() => {
                      setIsOptionsOpen(false);
                      roadmap.expandAllPhases();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-muted-surface hover:text-text-primary"
                  >
                    Expand all phases
                  </button>
                  <button
                    onClick={() => {
                      setIsOptionsOpen(false);
                      roadmap.collapseAllPhases();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-muted-surface hover:text-text-primary"
                  >
                    Collapse all phases
                  </button>
                  
                  <div className="border-t border-border-subtle my-1.5" />

                  <button
                    onClick={() => {
                      setIsOptionsOpen(false);
                      handleResetDemo();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-muted-surface text-status-warning hover:text-status-warning font-semibold flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-status-warning" />
                    <span>Reset demo changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Demo Mode Notice Banner (Subtle but visible) */}
      <div className="flex items-center gap-2 p-2 px-3 bg-muted-surface border border-border-subtle rounded-lg text-[10px] text-text-tertiary font-medium">
        <Info className="w-3.5 h-3.5 text-text-tertiary" />
        <span>Demo mode: roadmap changes are temporary and reset after browser refresh. No localStorage or db hooks loaded.</span>
        {!isReadOnly && (
          <button 
            onClick={handleResetDemo}
            className="text-accent-primary hover:underline font-semibold ml-auto"
          >
            Reset Now
          </button>
        )}
      </div>

      {/* 4. Dense derived Summary strip */}
      <RoadmapSummary project={project} summary={roadmap.summary} />

      {/* 5. View Mode tab selection strip */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
        <div className="flex bg-muted-surface p-1 rounded-lg border border-border-subtle">
          <button
            onClick={() => roadmap.setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none ${
              roadmap.viewMode === "list"
                ? "bg-bg-primary text-text-primary shadow-xs"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Phase List</span>
          </button>
          
          <button
            onClick={() => roadmap.setViewMode("timeline")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all focus:outline-none ${
              roadmap.viewMode === "timeline"
                ? "bg-bg-primary text-text-primary shadow-xs"
                : "text-text-tertiary hover:text-text-secondary"
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Chronological Timeline</span>
          </button>
        </div>

        <span className="text-[10px] text-text-tertiary font-mono">
          PHASE ORDER STABLE BY DEFAULT
        </span>
      </div>

      {/* 6. Active view container */}
      <main id="roadmap-active-view-frame" className="min-h-[250px]">
        {roadmap.viewMode === "list" ? (
          <RoadmapPhaseList
            phases={roadmap.phases}
            allPhases={roadmap.phases}
            expandedPhases={roadmap.expandedPhases}
            onTogglePhaseExpand={roadmap.togglePhaseExpanded}
            isReadOnly={isReadOnly}
            onAddPhaseClick={() => setIsPhaseFormOpen(true)}
            onEditPhase={(phase) => {
              setEditingPhase(phase);
              setIsPhaseFormOpen(true);
            }}
            onDeletePhase={handleDeletePhase}
            onMovePhaseUp={(id) => roadmap.reorderPhase(id, "up")}
            onMovePhaseDown={(id) => roadmap.reorderPhase(id, "down")}
            onDuplicatePhase={roadmap.duplicatePhase}
            onSetPhaseCurrent={(id) => {
              const targetPhase = roadmap.phases.find(p => p.id === id);
              const keepStatus = targetPhase && ["Completed", "Blocked", "Paused", "Skipped"].includes(targetPhase.status);
              roadmap.editPhase(id, { 
                isCurrent: true, 
                ...(keepStatus ? {} : { status: "In progress" }) 
              });
              roadmap.togglePhaseExpanded(id, true);
            }}
            onMarkPhaseCompleted={handleCompletePhase}
            onPausePhase={roadmap.pausePhase}
            onSkipPhase={handleSkipPhase}
            // Milestones
            onAddMilestone={roadmap.addMilestone}
            onEditMilestone={roadmap.editMilestone}
            onDeleteMilestone={handleDeleteMilestone}
            onReorderMilestone={roadmap.reorderMilestone}
            onMilestoneStatusChange={roadmap.editMilestone}
            // Criteria
            onAddCriterion={roadmap.addCriterion}
            onEditCriterion={roadmap.editCriterion}
            onToggleCriterion={roadmap.toggleCriterion}
            onDeleteCriterion={roadmap.deleteCriterion}
          />
        ) : (
          <RoadmapTimeline
            phases={roadmap.phases}
            onSelectPhase={handleSelectTimelineNode}
          />
        )}
      </main>

      {/* 7. Dialog form overlay (Handles both Add & Edit) */}
      <PhaseFormDialog
        isOpen={isPhaseFormOpen}
        onClose={() => {
          setIsPhaseFormOpen(false);
          setEditingPhase(null);
        }}
        initialData={editingPhase || undefined}
        allPhases={roadmap.phases}
        onSubmit={editingPhase ? handleEditPhaseSubmit : handleAddPhaseSubmit}
      />

      {/* 8. Reusable In-App Confirmation Dialog */}
      <Dialog
        id="roadmap-confirm-dialog"
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        title={confirmState.title}
        description={confirmState.description}
        footer={
          <div className="flex justify-end gap-2.5">
            <Button
              id="roadmap-confirm-cancel-btn"
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              id="roadmap-confirm-action-btn"
              type="button"
              variant={confirmState.confirmVariant || "primary"}
              size="sm"
              onClick={confirmState.onConfirm}
            >
              {confirmState.confirmLabel}
            </Button>
          </div>
        }
      >
        <p className="text-xs text-text-secondary leading-relaxed">
          Are you sure you want to proceed with this operation? This action is temporarily saved in memory and will reset upon page refresh.
        </p>
      </Dialog>

    </div>
  );
}
export type ProjectRoadmapPageProps = {};
