import { useState, useEffect, useCallback } from "react";
import { 
  ProjectPhase, 
  ProjectMilestone, 
  CompletionCriterion, 
  PhaseStatus, 
  MilestoneStatus 
} from "../types/project-roadmap";
import { getInitialRoadmaps, getFallbackRoadmap } from "../data/project-roadmaps";
import { MOCK_PROJECTS_DIRECTORY } from "../data/projects";
import { useToast } from "../components/ui/Toast";
import { Priority } from "../types";

// In-memory session store
let inMemoryRoadmaps: Record<string, ProjectPhase[]> = {};
let isStoreInitialized = false;

const ensureStoreInitialized = () => {
  if (!isStoreInitialized) {
    inMemoryRoadmaps = getInitialRoadmaps();
    isStoreInitialized = true;
  }
};

export const useProjectRoadmap = (projectId: string) => {
  const { toast } = useToast();
  ensureStoreInitialized();

  // Find project details for fallback naming
  const project = MOCK_PROJECTS_DIRECTORY.find(
    (p) => p.id === projectId || p.slug === projectId
  );
  const cleanProjectId = project ? project.id : projectId;

  // Initialize or fetch roadmap for this project
  if (!inMemoryRoadmaps[cleanProjectId]) {
    inMemoryRoadmaps[cleanProjectId] = getFallbackRoadmap(
      cleanProjectId,
      project ? project.name : projectId
    );
  }

  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "timeline">("list");
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  // Sync state with local store
  const syncState = useCallback(() => {
    const storedPhases = inMemoryRoadmaps[cleanProjectId] || [];
    // Sort by order initially
    const sorted = [...storedPhases].sort((a, b) => a.order - b.order);
    setPhases(sorted);
  }, [cleanProjectId]);

  useEffect(() => {
    syncState();
  }, [syncState]);

  // Expand the current phase by default
  useEffect(() => {
    if (phases.length > 0) {
      const currentPhase = phases.find((p) => p.isCurrent);
      if (currentPhase) {
        setExpandedPhases((prev) => ({
          ...prev,
          [currentPhase.id]: true
        }));
      }
    }
  }, [phases]);

  // Toggle phase expanded state
  const togglePhaseExpanded = useCallback((phaseId: string, forceState?: boolean) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseId]: forceState !== undefined ? forceState : !prev[phaseId]
    }));
  }, []);

  const expandAllPhases = useCallback(() => {
    const updated: Record<string, boolean> = {};
    phases.forEach((p) => {
      updated[p.id] = true;
    });
    setExpandedPhases(updated);
    toast({
      type: "info",
      title: "Expanded All",
      message: "All roadmap phases are now expanded.",
      duration: 2000
    });
  }, [phases, toast]);

  const collapseAllPhases = useCallback(() => {
    setExpandedPhases({});
    toast({
      type: "info",
      title: "Collapsed All",
      message: "All roadmap phases are now collapsed.",
      duration: 2000
    });
  }, [toast]);

  // Reset demo state
  const resetDemoState = useCallback(() => {
    const initial = getInitialRoadmaps();
    if (initial[cleanProjectId]) {
      inMemoryRoadmaps[cleanProjectId] = initial[cleanProjectId];
    } else {
      inMemoryRoadmaps[cleanProjectId] = getFallbackRoadmap(
        cleanProjectId,
        project ? project.name : projectId
      );
    }
    syncState();
    toast({
      type: "success",
      title: "Demo Reset Complete",
      message: "Roadmap restored to original mock values.",
      duration: 3000
    });
  }, [cleanProjectId, project, syncState, toast]);

  // Update helper that saves changes back to our session store
  const saveRoadmap = (updatedPhases: ProjectPhase[]) => {
    inMemoryRoadmaps[cleanProjectId] = updatedPhases;
    setPhases([...updatedPhases].sort((a, b) => a.order - b.order));
  };

  // Add Phase
  const addPhase = (newPhaseData: {
    title: string;
    description: string;
    status: PhaseStatus;
    progress: number;
    startDate?: string;
    targetDate?: string;
    dependencies: string[];
    notes?: string;
    isCurrent: boolean;
  }) => {
    const newId = `phase-${Date.now()}`;
    const newOrder = phases.length > 0 ? Math.max(...phases.map((p) => p.order)) + 1 : 1;

    let updatedPhases = phases.map((p) => {
      if (newPhaseData.isCurrent && p.isCurrent) {
        return { ...p, isCurrent: false };
      }
      return p;
    });

    const newPhase: ProjectPhase = {
      id: newId,
      projectId: cleanProjectId,
      title: newPhaseData.title,
      description: newPhaseData.description,
      order: newOrder,
      status: newPhaseData.status,
      progress: newPhaseData.progress,
      startDate: newPhaseData.startDate,
      targetDate: newPhaseData.targetDate,
      isCurrent: newPhaseData.isCurrent,
      dependencies: newPhaseData.dependencies,
      milestones: [],
      completionCriteria: [],
      notes: newPhaseData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    updatedPhases.push(newPhase);
    saveRoadmap(updatedPhases);

    // Auto-expand the newly created phase
    setExpandedPhases((prev) => ({
      ...prev,
      [newId]: true
    }));

    toast({
      type: "success",
      title: "Phase Added",
      message: `"${newPhaseData.title}" has been appended to the roadmap.`,
      duration: 3000
    });
  };

  // Edit Phase
  const editPhase = (phaseId: string, updatedFields: Partial<ProjectPhase>) => {
    let updatedPhases = phases.map((p) => {
      if (p.id === phaseId) {
        const merged = { ...p, ...updatedFields, updatedAt: new Date().toISOString() };
        // completedDate helper
        if (updatedFields.status === "Completed" && p.status !== "Completed") {
          merged.completedDate = new Date().toISOString().split("T")[0];
          merged.progress = 100;
        }
        return merged;
      }
      // If setting this one to current, unset others
      if (updatedFields.isCurrent && p.id !== phaseId && p.isCurrent) {
        return { ...p, isCurrent: false, updatedAt: new Date().toISOString() };
      }
      return p;
    });

    saveRoadmap(updatedPhases);
    toast({
      type: "success",
      title: "Phase Updated",
      message: "The phase details were saved successfully.",
      duration: 2000
    });
  };

  // Duplicate Phase
  const duplicatePhase = (phaseId: string) => {
    const sourcePhase = phases.find((p) => p.id === phaseId);
    if (!sourcePhase) return;

    const newId = `phase-dup-${Date.now()}`;
    const newOrder = Math.max(...phases.map((p) => p.order)) + 1;

    // Deep copy milestones & criteria with new IDs
    const duplicatedMilestones = sourcePhase.milestones.map((m, idx) => ({
      ...m,
      id: `milestone-dup-${Date.now()}-${idx}`,
      phaseId: newId,
      status: "Pending" as MilestoneStatus,
      completedDate: undefined
    }));

    const duplicatedCriteria = sourcePhase.completionCriteria.map((cc, idx) => ({
      ...cc,
      id: `cc-dup-${Date.now()}-${idx}`,
      isComplete: false
    }));

    const duplicatedPhase: ProjectPhase = {
      ...sourcePhase,
      id: newId,
      title: `${sourcePhase.title} (Copy)`,
      order: newOrder,
      status: "Planned" as PhaseStatus,
      progress: sourcePhase.status === "Completed" ? 100 : sourcePhase.progress,
      isCurrent: false,
      milestones: duplicatedMilestones,
      completionCriteria: duplicatedCriteria,
      completedDate: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedPhases = [...phases, duplicatedPhase];
    saveRoadmap(updatedPhases);

    setExpandedPhases((prev) => ({
      ...prev,
      [newId]: true
    }));

    toast({
      type: "success",
      title: "Phase Duplicated",
      message: `Created duplicate of "${sourcePhase.title}".`,
      duration: 3000
    });
  };

  // Delete Phase (checks dependencies first)
  const deletePhase = (phaseId: string): { success: boolean; errorReason?: string } => {
    // Check if another phase depends on this one
    const dependentPhases = phases.filter((p) => p.dependencies.includes(phaseId));
    if (dependentPhases.length > 0) {
      const titles = dependentPhases.map((p) => `"${p.title}"`).join(", ");
      return {
        success: false,
        errorReason: `Cannot delete this phase because other phases depend on it: ${titles}. Resolve those dependencies first.`
      };
    }

    if (phases.length === 1) {
      return {
        success: false,
        errorReason: "A roadmap must contain at least one phase. Deletion prevented."
      };
    }

    const updatedPhases = phases.filter((p) => p.id !== phaseId);
    // Re-index orders to keep them compact
    const reordered = updatedPhases.map((p, idx) => ({
      ...p,
      order: idx + 1
    }));

    saveRoadmap(reordered);
    toast({
      type: "success",
      title: "Phase Deleted",
      message: "The phase has been removed from the session roadmap.",
      duration: 3000
    });
    return { success: true };
  };

  // Reorder Phases (Move Up / Move Down)
  const reorderPhase = (phaseId: string, direction: "up" | "down") => {
    const idx = phases.findIndex((p) => p.id === phaseId);
    if (idx === -1) return;

    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === phases.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const updated = [...phases];

    // Swap orders
    const tempOrder = updated[idx].order;
    updated[idx].order = updated[swapIdx].order;
    updated[swapIdx].order = tempOrder;

    saveRoadmap(updated);
    toast({
      type: "info",
      title: "Phases Reordered",
      message: `Moved "${updated[idx].title}" ${direction === "up" ? "upward" : "downward"}.`,
      duration: 1500
    });
  };

  // Mark Completed Shortcut
  const markPhaseCompleted = (phaseId: string) => {
    const phase = phases.find((p) => p.id === phaseId);
    if (!phase) return;

    // Check completion criteria
    const pendingCriteria = phase.completionCriteria.filter((cc) => !cc.isComplete);
    const executeCompletion = () => {
      editPhase(phaseId, {
        status: "Completed",
        progress: 100,
        isCurrent: false,
        completedDate: new Date().toISOString().split("T")[0]
      });

      // Suggest the next planned phase
      const nextPhase = phases
        .filter((p) => p.order > phase.order && (p.status === "Planned" || p.status === "Not started"))
        .sort((a, b) => a.order - b.order)[0];

      if (nextPhase) {
        toast({
          type: "info",
          title: "Next Recommended Phase",
          message: `Phase "${phase.title}" is complete. Consider setting "${nextPhase.title}" as current.`,
          duration: 5000
        });
      }
    };

    if (pendingCriteria.length > 0) {
      // Return a warning indicator, but let the component handle the confirmation dialog
      return { hasWarnings: true, pendingCount: pendingCriteria.length, proceed: executeCompletion };
    }

    executeCompletion();
    return { hasWarnings: false };
  };

  // Pause Phase
  const pausePhase = (phaseId: string) => {
    editPhase(phaseId, { status: "Paused" });
  };

  // Skip Phase
  const skipPhase = (phaseId: string) => {
    const phase = phases.find((p) => p.id === phaseId);
    editPhase(phaseId, { status: "Skipped", isCurrent: false });

    if (phase && phase.isCurrent) {
      // Suggest the next planned phase
      const nextPhase = phases
        .filter((p) => p.order > phase.order && (p.status === "Planned" || p.status === "Not started"))
        .sort((a, b) => a.order - b.order)[0];

      if (nextPhase) {
        toast({
          type: "info",
          title: "Next Recommended Phase",
          message: `Phase "${phase.title}" has been skipped. Consider setting "${nextPhase.title}" as current.`,
          duration: 5000
        });
      }
    }
  };

  // --- MILESTONE OPERATIONS ---

  // Add Milestone
  const addMilestone = (
    phaseId: string,
    milestoneData: {
      title: string;
      description?: string;
      status: MilestoneStatus;
      priority: Priority;
      targetDate?: string;
    }
  ) => {
    const updatedPhases = phases.map((p) => {
      if (p.id === phaseId) {
        const mOrder = p.milestones.length > 0 ? Math.max(...p.milestones.map((m) => m.order)) + 1 : 1;
        const newMilestone: ProjectMilestone = {
          id: `milestone-${Date.now()}`,
          phaseId,
          title: milestoneData.title,
          description: milestoneData.description,
          status: milestoneData.status,
          priority: milestoneData.priority,
          targetDate: milestoneData.targetDate,
          order: mOrder,
          completedDate: milestoneData.status === "Completed" ? new Date().toISOString().split("T")[0] : undefined
        };
        return {
          ...p,
          milestones: [...p.milestones, newMilestone],
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    saveRoadmap(updatedPhases);
    toast({
      type: "success",
      title: "Milestone Added",
      message: `"${milestoneData.title}" has been added.`,
      duration: 2500
    });
  };

  // Edit Milestone
  const editMilestone = (
    phaseId: string,
    milestoneId: string,
    updatedFields: Partial<ProjectMilestone>
  ) => {
    const updatedPhases = phases.map((p) => {
      if (p.id === phaseId) {
        const updatedMilestones = p.milestones.map((m) => {
          if (m.id === milestoneId) {
            const merged = { ...m, ...updatedFields };
            if (updatedFields.status === "Completed" && m.status !== "Completed") {
              merged.completedDate = new Date().toISOString().split("T")[0];
            } else if (updatedFields.status && updatedFields.status !== "Completed") {
              merged.completedDate = undefined;
            }
            return merged;
          }
          return m;
        });
        return {
          ...p,
          milestones: updatedMilestones,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    saveRoadmap(updatedPhases);
    toast({
      type: "success",
      title: "Milestone Updated",
      message: "The milestone details have been saved.",
      duration: 2000
    });
  };

  // Delete Milestone
  const deleteMilestone = (phaseId: string, milestoneId: string) => {
    const updatedPhases = phases.map((p) => {
      if (p.id === phaseId) {
        const filtered = p.milestones.filter((m) => m.id !== milestoneId);
        // re-index order
        const reordered = filtered.map((m, idx) => ({ ...m, order: idx + 1 }));
        return {
          ...p,
          milestones: reordered,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    saveRoadmap(updatedPhases);
    toast({
      type: "success",
      title: "Milestone Removed",
      message: "The milestone has been removed.",
      duration: 2500
    });
  };

  // Reorder Milestones
  const reorderMilestone = (phaseId: string, milestoneId: string, direction: "up" | "down") => {
    const updatedPhases = phases.map((p) => {
      if (p.id === phaseId) {
        const idx = p.milestones.findIndex((m) => m.id === milestoneId);
        if (idx === -1) return p;
        if (direction === "up" && idx === 0) return p;
        if (direction === "down" && idx === p.milestones.length - 1) return p;

        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        const list = [...p.milestones];

        // Swap order
        const tempOrder = list[idx].order;
        list[idx].order = list[swapIdx].order;
        list[swapIdx].order = tempOrder;

        const sorted = list.sort((a, b) => a.order - b.order);
        return {
          ...p,
          milestones: sorted,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    saveRoadmap(updatedPhases);
  };

  // --- COMPLETION CRITERIA OPERATIONS ---

  // Add Criterion
  const addCriterion = (phaseId: string, label: string) => {
    if (!label.trim()) return;
    const updatedPhases = phases.map((p) => {
      if (p.id === phaseId) {
        const newCriterion: CompletionCriterion = {
          id: `cc-${Date.now()}`,
          label: label.trim(),
          isComplete: false
        };
        return {
          ...p,
          completionCriteria: [...p.completionCriteria, newCriterion],
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    saveRoadmap(updatedPhases);
    toast({
      type: "success",
      title: "Criterion Added",
      message: "New completion criterion added to phase.",
      duration: 2000
    });
  };

  // Edit Criterion Label
  const editCriterion = (phaseId: string, criterionId: string, label: string) => {
    if (!label.trim()) return;
    const updatedPhases = phases.map((p) => {
      if (p.id === phaseId) {
        const updatedCC = p.completionCriteria.map((cc) => {
          if (cc.id === criterionId) {
            return { ...cc, label: label.trim() };
          }
          return cc;
        });
        return {
          ...p,
          completionCriteria: updatedCC,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });
    saveRoadmap(updatedPhases);
  };

  // Toggle Criterion
  const toggleCriterion = (phaseId: string, criterionId: string) => {
    const updatedPhases = phases.map((p) => {
      if (p.id === phaseId) {
        const updatedCC = p.completionCriteria.map((cc) => {
          if (cc.id === criterionId) {
            return { ...cc, isComplete: !cc.isComplete };
          }
          return cc;
        });
        return {
          ...p,
          completionCriteria: updatedCC,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    saveRoadmap(updatedPhases);
  };

  // Delete Criterion
  const deleteCriterion = (phaseId: string, criterionId: string) => {
    const updatedPhases = phases.map((p) => {
      if (p.id === phaseId) {
        return {
          ...p,
          completionCriteria: p.completionCriteria.filter((cc) => cc.id !== criterionId),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    saveRoadmap(updatedPhases);
    toast({
      type: "info",
      title: "Criterion Removed",
      message: "The completion criterion was deleted.",
      duration: 2000
    });
  };

  // Derived Summary Calculations
  const summary = {
    totalPhases: phases.length,
    completedPhases: phases.filter((p) => p.status === "Completed").length,
    currentPhase: phases.find((p) => p.isCurrent) || null,
    blockedPhases: phases.filter((p) => p.status === "Blocked").length,
    overallProgress: (() => {
      const nonSkipped = phases.filter((p) => p.status !== "Skipped");
      if (nonSkipped.length === 0) return 0;
      const sum = nonSkipped.reduce((acc, p) => {
        const prog = p.status === "Completed" ? 100 : p.progress;
        return acc + prog;
      }, 0);
      const calculated = Math.round(sum / nonSkipped.length);
      return Math.min(100, Math.max(0, calculated));
    })(),
    nextPlannedPhase: phases
      .filter((p) => p.status === "Planned" || p.status === "Not started")
      .sort((a, b) => a.order - b.order)[0] || null
  };

  return {
    phases,
    viewMode,
    setViewMode,
    expandedPhases,
    togglePhaseExpanded,
    expandAllPhases,
    collapseAllPhases,
    resetDemoState,
    addPhase,
    editPhase,
    duplicatePhase,
    deletePhase,
    reorderPhase,
    markPhaseCompleted,
    pausePhase,
    skipPhase,
    addMilestone,
    editMilestone,
    deleteMilestone,
    reorderMilestone,
    addCriterion,
    editCriterion,
    toggleCriterion,
    deleteCriterion,
    summary,
    project
  };
};
