import { useState, useEffect, useCallback, useMemo } from "react";
import { ProjectKnowledgeEntry, KnowledgeEntryType, DecisionStatus } from "../types/project-knowledge";
import { getInitialKnowledge } from "../data/project-knowledge";
import { MOCK_PROJECTS_DIRECTORY } from "../data/projects";
import { useToast } from "../components/ui/Toast";

// In-memory session store
let inMemoryKnowledge: Record<string, ProjectKnowledgeEntry[]> = {};
let isKnowledgeStoreInitialized = false;

const ensureKnowledgeStoreInitialized = () => {
  if (!isKnowledgeStoreInitialized) {
    inMemoryKnowledge = getInitialKnowledge();
    isKnowledgeStoreInitialized = true;
  }
};

export const useProjectKnowledge = (projectId: string) => {
  const { toast } = useToast();
  ensureKnowledgeStoreInitialized();

  // Find project details to resolve slugs to IDs
  const project = MOCK_PROJECTS_DIRECTORY.find(
    (p) => p.id === projectId || p.slug === projectId
  );
  const cleanProjectId = project ? project.id : projectId;

  // Initialize if empty for this project
  if (!inMemoryKnowledge[cleanProjectId]) {
    inMemoryKnowledge[cleanProjectId] = [];
  }

  // React local states
  const [entries, setEntries] = useState<ProjectKnowledgeEntry[]>([]);
  
  // Filtering & Sorting states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [decisionStatusFilter, setDecisionStatusFilter] = useState<string>("All");
  const [tagFilter, setTagFilter] = useState<string>("All");
  const [phaseFilter, setPhaseFilter] = useState<string>("All");
  const [taskFilter, setTaskFilter] = useState<string>("All");
  const [pinnedFilter, setPinnedFilter] = useState<string>("All"); // "All" | "Pinned"
  const [archivedFilter, setArchivedFilter] = useState<string>("Active"); // "Active" | "Archived" | "All"
  const [sortBy, setSortBy] = useState<string>("pinnedFirst"); // "pinnedFirst" | "updatedAt" | "createdAt" | "title" | "type"

  const syncState = useCallback(() => {
    setEntries([...(inMemoryKnowledge[cleanProjectId] || [])]);
  }, [cleanProjectId]);

  useEffect(() => {
    syncState();
  }, [syncState]);

  // Dynamic tags list calculated from raw entries
  const allTags = useMemo(() => {
    const rawList = inMemoryKnowledge[cleanProjectId] || [];
    const tagsSet = new Set<string>();
    rawList.forEach((e) => {
      e.tags.forEach((t) => tagsSet.add(t));
    });
    return Array.from(tagsSet).sort();
  }, [entries, cleanProjectId]);

  // Compute summary metrics based on raw (un-archived) entries
  const summary = useMemo(() => {
    const rawList = inMemoryKnowledge[cleanProjectId] || [];
    const activeList = rawList.filter((e) => !e.isArchived);

    return {
      total: activeList.length,
      decisions: activeList.filter((e) => e.type === "Decision").length,
      documentation: activeList.filter((e) => e.type === "Documentation").length,
      errorsSolved: activeList.filter((e) => e.type === "Error & Solution").length,
      pinned: activeList.filter((e) => e.isPinned).length,
    };
  }, [entries, cleanProjectId]);

  // Add knowledge entry
  const addEntry = useCallback((entryData: Partial<ProjectKnowledgeEntry>): boolean => {
    if (!entryData.title?.trim()) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "Title is required.",
      });
      return false;
    }

    if (!entryData.content?.trim()) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "Content description is required.",
      });
      return false;
    }

    // Validation based on entry type
    if (entryData.type === "Decision") {
      if (!entryData.decision?.trim() || !entryData.rationale?.trim()) {
        toast({
          type: "error",
          title: "Validation Error",
          message: "Decision entries require both an explicit Decision statement and Rationale.",
        });
        return false;
      }
    }

    if (entryData.type === "Error & Solution") {
      if (!entryData.errorMessage?.trim() || !entryData.solution?.trim()) {
        toast({
          type: "error",
          title: "Validation Error",
          message: "Error entries require an Error Message and a Solution description.",
        });
        return false;
      }
    }

    // Title duplicate warning (warning but allow or block? Let's show a warning toast and proceed or reject? User says "Duplicate active titles should show a warning" so we can show warning toast and let it complete, or warn and prevent? Usually a warning means we still allow it but alert, or reject with a warning. Let's show a warning toast and allow it)
    const rawList = inMemoryKnowledge[cleanProjectId] || [];
    const cleanTitle = entryData.title.trim();
    const isDuplicateTitle = rawList.some(
      (e) => !e.isArchived && e.title.toLowerCase() === cleanTitle.toLowerCase()
    );

    if (isDuplicateTitle) {
      toast({
        type: "warning",
        title: "Duplicate Title Warning",
        message: `An active knowledge entry with the title "${cleanTitle}" already exists.`,
      });
    }

    const newEntry: ProjectKnowledgeEntry = {
      id: `${cleanProjectId}-knowledge-${Date.now()}`,
      projectId: cleanProjectId,
      title: cleanTitle,
      content: entryData.content.trim(),
      type: entryData.type as KnowledgeEntryType,
      status: entryData.type === "Decision" ? (entryData.status as DecisionStatus || "Proposed") : undefined,
      tags: entryData.tags || [],
      isPinned: entryData.isPinned || false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      relatedPhaseId: entryData.relatedPhaseId || undefined,
      relatedTaskId: entryData.relatedTaskId || undefined,
      decision: entryData.type === "Decision" ? entryData.decision?.trim() : undefined,
      rationale: entryData.type === "Decision" ? entryData.rationale?.trim() : undefined,
      alternatives: entryData.type === "Decision" ? entryData.alternatives?.trim() : undefined,
      consequences: entryData.type === "Decision" ? entryData.consequences?.trim() : undefined,
      errorMessage: entryData.type === "Error & Solution" ? entryData.errorMessage?.trim() : undefined,
      solution: entryData.type === "Error & Solution" ? entryData.solution?.trim() : undefined,
      context: entryData.type === "Error & Solution" ? entryData.context?.trim() : undefined,
      rootCause: entryData.type === "Error & Solution" ? entryData.rootCause?.trim() : undefined,
      preventionNotes: entryData.type === "Error & Solution" ? entryData.preventionNotes?.trim() : undefined,
    };

    inMemoryKnowledge[cleanProjectId] = [newEntry, ...rawList];
    syncState();
    
    toast({
      type: "success",
      title: "Entry Created",
      message: `"${cleanTitle}" was added successfully.`,
    });
    return true;
  }, [cleanProjectId, syncState, toast]);

  // Edit knowledge entry
  const editEntry = useCallback((entryId: string, entryData: Partial<ProjectKnowledgeEntry>): boolean => {
    const rawList = inMemoryKnowledge[cleanProjectId] || [];
    const entryIndex = rawList.findIndex((e) => e.id === entryId);

    if (entryIndex === -1) {
      toast({
        type: "error",
        title: "Not Found",
        message: "The requested knowledge entry could not be found.",
      });
      return false;
    }

    if (!entryData.title?.trim()) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "Title is required.",
      });
      return false;
    }

    if (!entryData.content?.trim()) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "Content description is required.",
      });
      return false;
    }

    if (entryData.type === "Decision") {
      if (!entryData.decision?.trim() || !entryData.rationale?.trim()) {
        toast({
          type: "error",
          title: "Validation Error",
          message: "Decision entries require both an explicit Decision statement and Rationale.",
        });
        return false;
      }
    }

    if (entryData.type === "Error & Solution") {
      if (!entryData.errorMessage?.trim() || !entryData.solution?.trim()) {
        toast({
          type: "error",
          title: "Validation Error",
          message: "Error entries require an Error Message and a Solution description.",
        });
        return false;
      }
    }

    // Title duplicate warning
    const cleanTitle = entryData.title.trim();
    const isDuplicateTitle = rawList.some(
      (e) => e.id !== entryId && !e.isArchived && e.title.toLowerCase() === cleanTitle.toLowerCase()
    );

    if (isDuplicateTitle) {
      toast({
        type: "warning",
        title: "Duplicate Title Warning",
        message: `Another active knowledge entry with the title "${cleanTitle}" already exists.`,
      });
    }

    const currentEntry = rawList[entryIndex];
    const updatedEntry: ProjectKnowledgeEntry = {
      ...currentEntry,
      title: cleanTitle,
      content: entryData.content.trim(),
      type: entryData.type as KnowledgeEntryType,
      status: entryData.type === "Decision" ? (entryData.status as DecisionStatus || "Proposed") : undefined,
      tags: entryData.tags || [],
      isPinned: entryData.isPinned !== undefined ? entryData.isPinned : currentEntry.isPinned,
      relatedPhaseId: entryData.relatedPhaseId || undefined,
      relatedTaskId: entryData.relatedTaskId || undefined,
      decision: entryData.type === "Decision" ? entryData.decision?.trim() : undefined,
      rationale: entryData.type === "Decision" ? entryData.rationale?.trim() : undefined,
      alternatives: entryData.type === "Decision" ? entryData.alternatives?.trim() : undefined,
      consequences: entryData.type === "Decision" ? entryData.consequences?.trim() : undefined,
      errorMessage: entryData.type === "Error & Solution" ? entryData.errorMessage?.trim() : undefined,
      solution: entryData.type === "Error & Solution" ? entryData.solution?.trim() : undefined,
      context: entryData.type === "Error & Solution" ? entryData.context?.trim() : undefined,
      rootCause: entryData.type === "Error & Solution" ? entryData.rootCause?.trim() : undefined,
      preventionNotes: entryData.type === "Error & Solution" ? entryData.preventionNotes?.trim() : undefined,
      updatedAt: new Date().toISOString(),
    };

    const newList = [...rawList];
    newList[entryIndex] = updatedEntry;
    inMemoryKnowledge[cleanProjectId] = newList;
    syncState();

    toast({
      type: "success",
      title: "Entry Updated",
      message: `"${cleanTitle}" was updated successfully.`,
    });
    return true;
  }, [cleanProjectId, syncState, toast]);

  // Duplicate entry
  const duplicateEntry = useCallback((entryId: string): boolean => {
    const rawList = inMemoryKnowledge[cleanProjectId] || [];
    const source = rawList.find((e) => e.id === entryId);

    if (!source) {
      toast({
        type: "error",
        title: "Error",
        message: "Source entry not found.",
      });
      return false;
    }

    const duplicate: ProjectKnowledgeEntry = {
      ...source,
      id: `${cleanProjectId}-knowledge-${Date.now()}`,
      title: `${source.title} Copy`,
      isPinned: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryKnowledge[cleanProjectId] = [duplicate, ...rawList];
    syncState();

    toast({
      type: "success",
      title: "Entry Duplicated",
      message: `"${duplicate.title}" was created.`,
    });
    return true;
  }, [cleanProjectId, syncState, toast]);

  // Toggle Pinned status
  const togglePin = useCallback((entryId: string) => {
    const rawList = inMemoryKnowledge[cleanProjectId] || [];
    const entry = rawList.find((e) => e.id === entryId);

    if (!entry) return;

    const updated = { ...entry, isPinned: !entry.isPinned, updatedAt: new Date().toISOString() };
    inMemoryKnowledge[cleanProjectId] = rawList.map((e) => (e.id === entryId ? updated : e));
    syncState();

    toast({
      type: "success",
      title: updated.isPinned ? "Entry Pinned" : "Entry Unpinned",
      message: `"${entry.title}" was ${updated.isPinned ? "pinned to top" : "unpinned"}.`,
    });
  }, [cleanProjectId, syncState, toast]);

  // Toggle Archive status
  const toggleArchive = useCallback((entryId: string) => {
    const rawList = inMemoryKnowledge[cleanProjectId] || [];
    const entry = rawList.find((e) => e.id === entryId);

    if (!entry) return;

    const isArchiving = !entry.isArchived;
    const updated = { ...entry, isArchived: isArchiving, updatedAt: new Date().toISOString() };
    inMemoryKnowledge[cleanProjectId] = rawList.map((e) => (e.id === entryId ? updated : e));
    syncState();

    toast({
      type: "success",
      title: isArchiving ? "Entry Archived" : "Entry Restored",
      message: `"${entry.title}" was ${isArchiving ? "moved to archive" : "restored to active entries"}.`,
    });
  }, [cleanProjectId, syncState, toast]);

  // Delete entry
  const deleteEntry = useCallback((entryId: string) => {
    const rawList = inMemoryKnowledge[cleanProjectId] || [];
    const entry = rawList.find((e) => e.id === entryId);

    if (!entry) return;

    inMemoryKnowledge[cleanProjectId] = rawList.filter((e) => e.id !== entryId);
    syncState();

    toast({
      type: "success",
      title: "Entry Deleted",
      message: `"${entry.title}" was deleted permanently from memory.`,
    });
  }, [cleanProjectId, syncState, toast]);

  // Reset entries to initial pre-seeded values
  const resetToSeed = useCallback(() => {
    const allInitial = getInitialKnowledge();
    inMemoryKnowledge[cleanProjectId] = [...(allInitial[cleanProjectId] || [])];
    syncState();

    toast({
      type: "success",
      title: "Reset Successful",
      message: "Knowledge base has been reset to default pre-seeded entries.",
    });
  }, [cleanProjectId, syncState, toast]);

  // Change decision status directly
  const changeDecisionStatus = useCallback((entryId: string, status: DecisionStatus) => {
    const rawList = inMemoryKnowledge[cleanProjectId] || [];
    const entry = rawList.find((e) => e.id === entryId);

    if (!entry || entry.type !== "Decision") return;

    const updated = { ...entry, status, updatedAt: new Date().toISOString() };
    inMemoryKnowledge[cleanProjectId] = rawList.map((e) => (e.id === entryId ? updated : e));
    syncState();

    toast({
      type: "success",
      title: "Status Updated",
      message: `Decision "${entry.title}" status changed to "${status}".`,
    });
  }, [cleanProjectId, syncState, toast]);

  // Filtered and Sorted entries
  const filteredEntries = useMemo(() => {
    let result = [...(inMemoryKnowledge[cleanProjectId] || [])];

    // Archived filter
    if (archivedFilter === "Active") {
      result = result.filter((e) => !e.isArchived);
    } else if (archivedFilter === "Archived") {
      result = result.filter((e) => e.isArchived);
    }

    // Pinned filter
    if (pinnedFilter === "Pinned") {
      result = result.filter((e) => e.isPinned);
    }

    // Entry type filter
    if (typeFilter !== "All") {
      result = result.filter((e) => e.type === typeFilter);
    }

    // Decision status filter
    if (decisionStatusFilter !== "All") {
      result = result.filter((e) => e.type === "Decision" && e.status === decisionStatusFilter);
    }

    // Tag filter
    if (tagFilter !== "All") {
      result = result.filter((e) => e.tags.includes(tagFilter));
    }

    // Phase filter
    if (phaseFilter !== "All") {
      result = result.filter((e) => e.relatedPhaseId === phaseFilter);
    }

    // Task filter
    if (taskFilter !== "All") {
      result = result.filter((e) => e.relatedTaskId === taskFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((e) => {
        const inTitle = e.title.toLowerCase().includes(q);
        const inContent = e.content.toLowerCase().includes(q);
        const inTags = e.tags.some((t) => t.toLowerCase().includes(q));
        const inRationale = e.rationale?.toLowerCase().includes(q) || false;
        const inDecision = e.decision?.toLowerCase().includes(q) || false;
        const inError = e.errorMessage?.toLowerCase().includes(q) || false;
        const inSolution = e.solution?.toLowerCase().includes(q) || false;

        return inTitle || inContent || inTags || inRationale || inDecision || inError || inSolution;
      });
    }

    // Sorting
    result.sort((a, b) => {
      // Pinned First option
      if (sortBy === "pinnedFirst") {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        // tiebreaker: updatedAt desc
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      if (sortBy === "updatedAt") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      if (sortBy === "createdAt") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "type") {
        return a.type.localeCompare(b.type);
      }

      return 0;
    });

    return result;
  }, [
    entries,
    cleanProjectId,
    searchQuery,
    typeFilter,
    decisionStatusFilter,
    tagFilter,
    phaseFilter,
    taskFilter,
    pinnedFilter,
    archivedFilter,
    sortBy,
  ]);

  return {
    entries: filteredEntries,
    allEntriesCount: (inMemoryKnowledge[cleanProjectId] || []).length,
    allTags,
    summary,
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
    addEntry,
    editEntry,
    duplicateEntry,
    togglePin,
    toggleArchive,
    deleteEntry,
    resetToSeed,
    changeDecisionStatus,
  };
};
