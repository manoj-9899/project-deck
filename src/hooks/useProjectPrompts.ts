/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { ProjectPrompt, PromptTool, PromptCategory, PromptStatus, PromptVersion, PromptSummaryStats } from "../types/project-prompt";
import { getInitialPrompts } from "../data/project-prompts";
import { MOCK_PROJECTS_DIRECTORY } from "../data/projects";
import { useToast } from "../components/ui/Toast";

// Module-level in-memory storage, preserving edits across sidebar navigations
let inMemoryPrompts: Record<string, ProjectPrompt[]> = {};
let isPromptsStoreInitialized = false;

const ensurePromptsStoreInitialized = () => {
  if (!isPromptsStoreInitialized) {
    inMemoryPrompts = getInitialPrompts();
    isPromptsStoreInitialized = true;
  }
};

export const useProjectPrompts = (projectId: string) => {
  const { toast } = useToast();
  ensurePromptsStoreInitialized();

  // Find project details to support slug resolution (e.g., 'projectdock')
  const project = MOCK_PROJECTS_DIRECTORY.find(
    (p) => p.id === projectId || p.slug === projectId
  );
  const cleanProjectId = project ? project.id : projectId;

  // Initialize array if not present for this project key
  if (!inMemoryPrompts[cleanProjectId]) {
    inMemoryPrompts[cleanProjectId] = [];
  }

  // React local representation of entries
  const [prompts, setPrompts] = useState<ProjectPrompt[]>([]);

  // Search & Filter state values
  const [searchQuery, setSearchQuery] = useState("");
  const [toolFilter, setToolFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [phaseFilter, setPhaseFilter] = useState<string>("All");
  const [taskFilter, setTaskFilter] = useState<string>("All");
  const [favoritesOnlyFilter, setFavoritesOnlyFilter] = useState(false);
  const [archivedFilter, setArchivedFilter] = useState<string>("Active"); // "Active" | "Archived" | "All"
  const [sortBy, setSortBy] = useState<string>("recentlyUpdated"); // "recentlyUpdated" | "recentlyUsed" | "createdAt" | "title" | "tool" | "favoritesFirst"

  // Synchronization callback
  const syncState = useCallback(() => {
    setPrompts([...(inMemoryPrompts[cleanProjectId] || [])]);
  }, [cleanProjectId]);

  useEffect(() => {
    syncState();
  }, [syncState]);

  // Derive unique tags list for filter options
  const allTags = useMemo(() => {
    const rawList = inMemoryPrompts[cleanProjectId] || [];
    const tagsSet = new Set<string>();
    rawList.forEach((p) => {
      p.tags.forEach((t) => {
        if (t.trim()) tagsSet.add(t.trim());
      });
    });
    return Array.from(tagsSet).sort();
  }, [prompts, cleanProjectId]);

  // Compute live portfolio statistics from un-archived records
  const summary = useMemo<PromptSummaryStats>(() => {
    const rawList = inMemoryPrompts[cleanProjectId] || [];
    const activeList = rawList.filter((p) => !p.isArchived);

    return {
      total: activeList.length,
      ready: activeList.filter((p) => p.status === "Ready").length,
      used: activeList.filter((p) => p.status === "Used").length,
      needsRevision: activeList.filter((p) => p.status === "Needs revision").length,
      favorites: activeList.filter((p) => p.isFavorite).length,
    };
  }, [prompts, cleanProjectId]);

  // Add new prompt
  const addPrompt = useCallback((promptData: Partial<ProjectPrompt>): boolean => {
    if (!promptData.title?.trim()) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "Title is required.",
      });
      return false;
    }

    if (!promptData.prompt?.trim()) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "Prompt text is required.",
      });
      return false;
    }

    const cleanTitle = promptData.title.trim();
    const cleanPromptText = promptData.prompt.trim();

    // Warn on duplicate title
    const rawList = inMemoryPrompts[cleanProjectId] || [];
    const isDuplicate = rawList.some(
      (p) => !p.isArchived && p.title.toLowerCase() === cleanTitle.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        type: "warning",
        title: "Duplicate Title",
        message: `An active prompt with the title "${cleanTitle}" already exists.`,
      });
    }

    const promptId = `${cleanProjectId}-prompt-${Date.now()}`;
    const initialVersion: PromptVersion = {
      id: `${promptId}-v1`,
      version: 1,
      prompt: cleanPromptText,
      changeSummary: "Initial version created.",
      createdAt: new Date().toISOString(),
    };

    const newPrompt: ProjectPrompt = {
      id: promptId,
      projectId: cleanProjectId,
      title: cleanTitle,
      prompt: cleanPromptText,
      description: promptData.description?.trim() || "",
      tool: (promptData.tool as PromptTool) || "Other",
      category: (promptData.category as PromptCategory) || "Development",
      status: (promptData.status as PromptStatus) || "Draft",
      tags: promptData.tags || [],
      relatedPhaseId: promptData.relatedPhaseId || undefined,
      relatedTaskId: promptData.relatedTaskId || undefined,
      responseSummary: promptData.responseSummary?.trim() || undefined,
      handoverContext: promptData.handoverContext?.trim() || undefined,
      version: 1,
      versions: [initialVersion],
      isFavorite: promptData.isFavorite || false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryPrompts[cleanProjectId] = [newPrompt, ...rawList];
    syncState();

    toast({
      type: "success",
      title: "Prompt Created",
      message: `"${cleanTitle}" was added successfully.`,
    });
    return true;
  }, [cleanProjectId, syncState, toast]);

  // Edit existing prompt
  const editPrompt = useCallback((promptId: string, promptData: Partial<ProjectPrompt>): boolean => {
    const rawList = inMemoryPrompts[cleanProjectId] || [];
    const promptIndex = rawList.findIndex((p) => p.id === promptId);

    if (promptIndex === -1) {
      toast({
        type: "error",
        title: "Not Found",
        message: "The requested prompt could not be found.",
      });
      return false;
    }

    if (!promptData.title?.trim()) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "Title is required.",
      });
      return false;
    }

    if (!promptData.prompt?.trim()) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "Prompt text is required.",
      });
      return false;
    }

    const cleanTitle = promptData.title.trim();
    const cleanPromptText = promptData.prompt.trim();

    // Check duplicate title
    const isDuplicate = rawList.some(
      (p) => p.id !== promptId && !p.isArchived && p.title.toLowerCase() === cleanTitle.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        type: "warning",
        title: "Duplicate Title Warning",
        message: `Another active prompt with the title "${cleanTitle}" already exists.`,
      });
    }

    const currentPrompt = rawList[promptIndex];
    let updatedVersions = [...currentPrompt.versions];
    let currentVersionNum = currentPrompt.version;

    // If the prompt text actually changed, let's append a new version automatically
    if (currentPrompt.prompt !== cleanPromptText) {
      currentVersionNum += 1;
      const autoVersion: PromptVersion = {
        id: `${promptId}-v${currentVersionNum}`,
        version: currentVersionNum,
        prompt: cleanPromptText,
        changeSummary: "Prompt content modified during edit.",
        createdAt: new Date().toISOString(),
      };
      updatedVersions.push(autoVersion);
    }

    const updatedPrompt: ProjectPrompt = {
      ...currentPrompt,
      title: cleanTitle,
      prompt: cleanPromptText,
      description: promptData.description?.trim() || "",
      tool: (promptData.tool as PromptTool) || currentPrompt.tool,
      category: (promptData.category as PromptCategory) || currentPrompt.category,
      status: (promptData.status as PromptStatus) || currentPrompt.status,
      tags: promptData.tags || [],
      relatedPhaseId: promptData.relatedPhaseId || undefined,
      relatedTaskId: promptData.relatedTaskId || undefined,
      responseSummary: promptData.responseSummary?.trim() || undefined,
      handoverContext: promptData.handoverContext?.trim() || undefined,
      isFavorite: promptData.isFavorite !== undefined ? promptData.isFavorite : currentPrompt.isFavorite,
      version: currentVersionNum,
      versions: updatedVersions,
      updatedAt: new Date().toISOString(),
    };

    const newList = [...rawList];
    newList[promptIndex] = updatedPrompt;
    inMemoryPrompts[cleanProjectId] = newList;
    syncState();

    toast({
      type: "success",
      title: "Prompt Updated",
      message: `"${cleanTitle}" has been updated.`,
    });
    return true;
  }, [cleanProjectId, syncState, toast]);

  // Duplicate prompt
  const duplicatePrompt = useCallback((promptId: string): boolean => {
    const rawList = inMemoryPrompts[cleanProjectId] || [];
    const source = rawList.find((p) => p.id === promptId);

    if (!source) {
      toast({
        type: "error",
        title: "Error",
        message: "Source prompt not found.",
      });
      return false;
    }

    const duplicateId = `${cleanProjectId}-prompt-${Date.now()}`;
    const initialVersion: PromptVersion = {
      id: `${duplicateId}-v1`,
      version: 1,
      prompt: source.prompt,
      changeSummary: "Duplicated from original prompt.",
      createdAt: new Date().toISOString(),
    };

    const duplicate: ProjectPrompt = {
      ...source,
      id: duplicateId,
      title: `${source.title} Copy`,
      status: "Draft",
      isFavorite: false,
      isArchived: false,
      version: 1,
      versions: [initialVersion],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastUsedAt: undefined,
    };

    inMemoryPrompts[cleanProjectId] = [duplicate, ...rawList];
    syncState();

    toast({
      type: "success",
      title: "Prompt Duplicated",
      message: `"${duplicate.title}" was created in draft status.`,
    });
    return true;
  }, [cleanProjectId, syncState, toast]);

  // Toggle favorite flag
  const toggleFavorite = useCallback((promptId: string) => {
    const rawList = inMemoryPrompts[cleanProjectId] || [];
    const prompt = rawList.find((p) => p.id === promptId);

    if (!prompt) return;

    const updated = { ...prompt, isFavorite: !prompt.isFavorite, updatedAt: new Date().toISOString() };
    inMemoryPrompts[cleanProjectId] = rawList.map((p) => (p.id === promptId ? updated : p));
    syncState();

    toast({
      type: "success",
      title: updated.isFavorite ? "Added to Favorites" : "Removed from Favorites",
      message: `"${prompt.title}" has been ${updated.isFavorite ? "pinned to favorites" : "removed from favorites"}.`,
    });
  }, [cleanProjectId, syncState, toast]);

  // Toggle archived status
  const toggleArchive = useCallback((promptId: string) => {
    const rawList = inMemoryPrompts[cleanProjectId] || [];
    const prompt = rawList.find((p) => p.id === promptId);

    if (!prompt) return;

    const isArchiving = !prompt.isArchived;
    const updated = { 
      ...prompt, 
      isArchived: isArchiving, 
      status: isArchiving ? ("Archived" as PromptStatus) : ("Draft" as PromptStatus), 
      updatedAt: new Date().toISOString() 
    };
    inMemoryPrompts[cleanProjectId] = rawList.map((p) => (p.id === promptId ? updated : p));
    syncState();

    toast({
      type: "success",
      title: isArchiving ? "Prompt Archived" : "Prompt Restored",
      message: `"${prompt.title}" was ${isArchiving ? "moved to archive" : "restored to active drafts"}.`,
    });
  }, [cleanProjectId, syncState, toast]);

  // Permanently delete prompt from in-memory array
  const deletePrompt = useCallback((promptId: string) => {
    const rawList = inMemoryPrompts[cleanProjectId] || [];
    const prompt = rawList.find((p) => p.id === promptId);

    if (!prompt) return;

    inMemoryPrompts[cleanProjectId] = rawList.filter((p) => p.id !== promptId);
    syncState();

    toast({
      type: "success",
      title: "Prompt Deleted",
      message: `"${prompt.title}" was deleted permanently.`,
    });
  }, [cleanProjectId, syncState, toast]);

  // Mark prompt as used
  const markPromptUsed = useCallback((promptId: string) => {
    const rawList = inMemoryPrompts[cleanProjectId] || [];
    const prompt = rawList.find((p) => p.id === promptId);

    if (!prompt) return;

    const updated = { 
      ...prompt, 
      status: "Used" as PromptStatus, 
      lastUsedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    };
    inMemoryPrompts[cleanProjectId] = rawList.map((p) => (p.id === promptId ? updated : p));
    syncState();

    toast({
      type: "success",
      title: "Marked as Used",
      message: `"${prompt.title}" has been updated to Used status.`,
    });
  }, [cleanProjectId, syncState, toast]);

  // Create new version with manual change summary
  const createNewVersion = useCallback((promptId: string, promptText: string, changeSummary: string): boolean => {
    const rawList = inMemoryPrompts[cleanProjectId] || [];
    const promptIndex = rawList.findIndex((p) => p.id === promptId);

    if (promptIndex === -1) return false;

    const currentPrompt = rawList[promptIndex];
    const newVersionNum = currentPrompt.version + 1;
    
    const newVersion: PromptVersion = {
      id: `${promptId}-v${newVersionNum}`,
      version: newVersionNum,
      prompt: promptText.trim(),
      changeSummary: changeSummary.trim() || `Created version ${newVersionNum}.`,
      createdAt: new Date().toISOString(),
    };

    const updatedPrompt: ProjectPrompt = {
      ...currentPrompt,
      prompt: promptText.trim(),
      version: newVersionNum,
      versions: [...currentPrompt.versions, newVersion],
      updatedAt: new Date().toISOString(),
    };

    const newList = [...rawList];
    newList[promptIndex] = updatedPrompt;
    inMemoryPrompts[cleanProjectId] = newList;
    syncState();

    toast({
      type: "success",
      title: "New Version Added",
      message: `Version ${newVersionNum} for "${currentPrompt.title}" was created.`,
    });
    return true;
  }, [cleanProjectId, syncState, toast]);

  // Restore older version as a new current version
  const restoreOlderVersion = useCallback((promptId: string, targetVersionNum: number): boolean => {
    const rawList = inMemoryPrompts[cleanProjectId] || [];
    const promptIndex = rawList.findIndex((p) => p.id === promptId);

    if (promptIndex === -1) return false;

    const currentPrompt = rawList[promptIndex];
    const targetVersion = currentPrompt.versions.find((v) => v.version === targetVersionNum);

    if (!targetVersion) {
      toast({
        type: "error",
        title: "Error",
        message: `Version ${targetVersionNum} could not be resolved.`,
      });
      return false;
    }

    const newVersionNum = currentPrompt.version + 1;
    const restoredVersion: PromptVersion = {
      id: `${promptId}-v${newVersionNum}`,
      version: newVersionNum,
      prompt: targetVersion.prompt,
      changeSummary: `Restored Version ${targetVersionNum} as current Version ${newVersionNum}.`,
      createdAt: new Date().toISOString(),
    };

    const updatedPrompt: ProjectPrompt = {
      ...currentPrompt,
      prompt: targetVersion.prompt,
      version: newVersionNum,
      versions: [...currentPrompt.versions, restoredVersion],
      updatedAt: new Date().toISOString(),
    };

    const newList = [...rawList];
    newList[promptIndex] = updatedPrompt;
    inMemoryPrompts[cleanProjectId] = newList;
    syncState();

    toast({
      type: "success",
      title: "Version Restored",
      message: `Version ${targetVersionNum} content restored as active Version ${newVersionNum}.`,
    });
    return true;
  }, [cleanProjectId, syncState, toast]);

  // Reset current project's prompts back to initial pre-seeded values
  const resetToSeed = useCallback(() => {
    const allInitial = getInitialPrompts();
    inMemoryPrompts[cleanProjectId] = [...(allInitial[cleanProjectId] || [])];
    syncState();

    toast({
      type: "success",
      title: "Reset Successful",
      message: "Prompt library has been reset to default pre-seeded items.",
    });
  }, [cleanProjectId, syncState, toast]);

  // Filtered and sorted prompt results
  const filteredPrompts = useMemo(() => {
    let result = [...(inMemoryPrompts[cleanProjectId] || [])];

    // Archived visibility
    if (archivedFilter === "Active") {
      result = result.filter((p) => !p.isArchived);
    } else if (archivedFilter === "Archived") {
      result = result.filter((p) => p.isArchived);
    }

    // Favorites only
    if (favoritesOnlyFilter) {
      result = result.filter((p) => p.isFavorite);
    }

    // Tool filter
    if (toolFilter !== "All") {
      result = result.filter((p) => p.tool === toolFilter);
    }

    // Category filter
    if (categoryFilter !== "All") {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "All") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Phase filter
    if (phaseFilter !== "All") {
      result = result.filter((p) => p.relatedPhaseId === phaseFilter);
    }

    // Task filter
    if (taskFilter !== "All") {
      result = result.filter((p) => p.relatedTaskId === taskFilter);
    }

    // Search query matches
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const inTitle = p.title.toLowerCase().includes(q);
        const inPromptText = p.prompt.toLowerCase().includes(q);
        const inDescription = p.description.toLowerCase().includes(q);
        const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
        const inResponse = p.responseSummary?.toLowerCase().includes(q) || false;
        const inHandover = p.handoverContext?.toLowerCase().includes(q) || false;

        return inTitle || inPromptText || inDescription || inTags || inResponse || inHandover;
      });
    }

    // Sort mappings
    result.sort((a, b) => {
      if (sortBy === "favoritesFirst") {
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        // default tie breaker
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      if (sortBy === "recentlyUpdated") {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }

      if (sortBy === "recentlyUsed") {
        const timeA = a.lastUsedAt ? new Date(a.lastUsedAt).getTime() : 0;
        const timeB = b.lastUsedAt ? new Date(b.lastUsedAt).getTime() : 0;
        return timeB - timeA;
      }

      if (sortBy === "createdAt") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "tool") {
        return a.tool.localeCompare(b.tool);
      }

      return 0;
    });

    return result;
  }, [
    prompts,
    cleanProjectId,
    archivedFilter,
    favoritesOnlyFilter,
    toolFilter,
    categoryFilter,
    statusFilter,
    phaseFilter,
    taskFilter,
    searchQuery,
    sortBy,
  ]);

  return {
    prompts: filteredPrompts,
    allPromptsCount: (inMemoryPrompts[cleanProjectId] || []).length,
    allTags,
    summary,
    searchQuery,
    setSearchQuery,
    toolFilter,
    setToolFilter,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    phaseFilter,
    setPhaseFilter,
    taskFilter,
    setTaskFilter,
    favoritesOnlyFilter,
    setFavoritesOnlyFilter,
    archivedFilter,
    setArchivedFilter,
    sortBy,
    setSortBy,
    addPrompt,
    editPrompt,
    duplicatePrompt,
    toggleFavorite,
    toggleArchive,
    deletePrompt,
    markPromptUsed,
    createNewVersion,
    restoreOlderVersion,
    resetToSeed,
  };
};
