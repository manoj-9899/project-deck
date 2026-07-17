/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { ProjectResource, ResourceSummaryStats, ResourceType, ResourceEnvironment, ResourceStatus } from "../types/project-resource";
import { getInitialResources } from "../data/project-resources";
import { MOCK_PROJECTS_DIRECTORY } from "../data/projects";
import { useToast } from "../components/ui/Toast";
import { isValidHttpUrl, isValidLocalPath, containsCredentials } from "../utils/resource-security";
import { filterAndSortResources } from "../utils/resource-filters";

// Module-level in-memory storage to persist updates across views
let inMemoryResources: Record<string, ProjectResource[]> = {};
let isResourcesStoreInitialized = false;

const ensureResourcesStoreInitialized = () => {
  if (!isResourcesStoreInitialized) {
    inMemoryResources = getInitialResources();
    isResourcesStoreInitialized = true;
  }
};

export const useProjectResources = (projectId: string) => {
  const { toast } = useToast();
  ensureResourcesStoreInitialized();

  // Find project details to support slug/id resolution (e.g. 'projectdock')
  const project = MOCK_PROJECTS_DIRECTORY.find(
    (p) => p.id === projectId || p.slug === projectId
  );
  const cleanProjectId = project ? project.id : projectId;

  // Initialize array if not present for this project key
  if (!inMemoryResources[cleanProjectId]) {
    inMemoryResources[cleanProjectId] = [];
  }

  // Local React state representing active list
  const [resources, setResources] = useState<ProjectResource[]>([]);

  // Search & Filter state values
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [providerFilter, setProviderFilter] = useState<string>("All");
  const [envFilter, setEnvFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [favoritesOnlyFilter, setFavoritesOnlyFilter] = useState(false);
  const [archivedFilter, setArchivedFilter] = useState<string>("Active"); // "Active" | "Archived" | "All"
  const [sortBy, setSortBy] = useState<string>("recentlyUpdated"); // "recentlyUpdated" | "recentlyOpened" | "title" | "type" | "environment" | "favoritesFirst"

  // Sync React state with in-memory store
  const syncState = useCallback(() => {
    setResources([...(inMemoryResources[cleanProjectId] || [])]);
  }, [cleanProjectId]);

  useEffect(() => {
    syncState();
  }, [syncState]);

  // Derive unique providers list for filter options
  const allProviders = useMemo(() => {
    const rawList = inMemoryResources[cleanProjectId] || [];
    const providersSet = new Set<string>();
    rawList.forEach((r) => {
      if (r.provider?.trim()) {
        providersSet.add(r.provider.trim());
      }
    });
    return Array.from(providersSet).sort();
  }, [resources, cleanProjectId]);

  // Compute live statistics from unarchived resources
  const summary = useMemo<ResourceSummaryStats>(() => {
    const rawList = inMemoryResources[cleanProjectId] || [];
    const activeList = rawList.filter((r) => !r.isArchived);

    return {
      total: activeList.length,
      repositories: activeList.filter((r) => r.type === "Repository").length,
      deployments: activeList.filter((r) => r.type === "Deployment").length,
      documentation: activeList.filter((r) => r.type === "Documentation").length,
      broken: activeList.filter((r) => r.status === "Broken").length,
    };
  }, [resources, cleanProjectId]);

  // Enforce validation and check security of fields
  const validateResource = (
    title: string,
    type: ResourceType,
    url?: string,
    localPath?: string,
    description?: string,
    provider?: string,
    currentId?: string
  ): boolean => {
    if (!title.trim()) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "Title is required.",
      });
      return false;
    }

    // Check credentials keywords in all fields
    if (
      containsCredentials(title) ||
      containsCredentials(description || "") ||
      containsCredentials(provider || "") ||
      containsCredentials(url || "") ||
      containsCredentials(localPath || "")
    ) {
      toast({
        type: "error",
        title: "Security Violation",
        message: "Resource fields must not contain passwords, secrets, API keys, or security tokens.",
      });
      return false;
    }

    const hasUrl = !!url?.trim();
    const hasPath = !!localPath?.trim();

    if (!hasUrl && !hasPath) {
      toast({
        type: "error",
        title: "Validation Error",
        message: "Either a valid URL or a safe Local Path is required.",
      });
      return false;
    }

    if (hasUrl) {
      const cleanUrl = url!.trim();
      if (!isValidHttpUrl(cleanUrl)) {
        toast({
          type: "error",
          title: "Security / Validation Error",
          message: "HTTP/S links must use valid 'http' or 'https' protocol. Unsafe scripts, data URIs, or other protocols are strictly rejected.",
        });
        return false;
      }

      // Check for active duplicates
      const rawList = inMemoryResources[cleanProjectId] || [];
      const hasDuplicateUrl = rawList.some(
        (r) =>
          !r.isArchived &&
          r.id !== currentId &&
          r.url?.trim().toLowerCase() === cleanUrl.toLowerCase()
      );

      if (hasDuplicateUrl) {
        toast({
          type: "warning",
          title: "Duplicate Reference Warning",
          message: `An active resource with the URL "${cleanUrl}" already exists in this workspace.`,
        });
      }
    }

    if (hasPath) {
      const cleanPath = localPath!.trim();
      if (!isValidLocalPath(cleanPath)) {
        toast({
          type: "error",
          title: "Validation Error",
          message: "Local path contains suspicious character patterns, potential credentials, or has an invalid path format.",
        });
        return false;
      }
    }

    return true;
  };

  // 1. Add Resource
  const addResource = useCallback((resourceData: Partial<ProjectResource>): boolean => {
    const title = resourceData.title || "";
    const type = (resourceData.type as ResourceType) || "Other";
    const url = resourceData.url;
    const localPath = resourceData.localPath;
    const description = resourceData.description;
    const provider = resourceData.provider;

    if (!validateResource(title, type, url, localPath, description, provider)) {
      return false;
    }

    const newId = `${cleanProjectId}-res-${Date.now()}`;
    const isoString = new Date().toISOString();

    const newResource: ProjectResource = {
      id: newId,
      projectId: cleanProjectId,
      title: title.trim(),
      description: description?.trim() || undefined,
      type,
      url: url?.trim() || undefined,
      localPath: localPath?.trim() || undefined,
      provider: provider?.trim() || undefined,
      environment: (resourceData.environment as ResourceEnvironment) || "Not applicable",
      status: (resourceData.status as ResourceStatus) || "Active",
      tags: resourceData.tags || [],
      isFavorite: resourceData.isFavorite || false,
      isArchived: false,
      createdAt: isoString,
      updatedAt: isoString,
    };

    inMemoryResources[cleanProjectId] = [newResource, ...(inMemoryResources[cleanProjectId] || [])];
    syncState();

    toast({
      type: "success",
      title: "Resource Created",
      message: `"${newResource.title}" has been successfully added to your workspace.`,
    });

    return true;
  }, [cleanProjectId, syncState, toast]);

  // 2. Edit Resource
  const editResource = useCallback((id: string, resourceData: Partial<ProjectResource>): boolean => {
    const rawList = inMemoryResources[cleanProjectId] || [];
    const index = rawList.findIndex((r) => r.id === id);
    if (index === -1) {
      toast({
        type: "error",
        title: "Error",
        message: "Resource not found.",
      });
      return false;
    }

    const original = rawList[index];
    const title = resourceData.title !== undefined ? resourceData.title : original.title;
    const type = resourceData.type !== undefined ? resourceData.type : original.type;
    const url = resourceData.url !== undefined ? resourceData.url : original.url;
    const localPath = resourceData.localPath !== undefined ? resourceData.localPath : original.localPath;
    const description = resourceData.description !== undefined ? resourceData.description : original.description;
    const provider = resourceData.provider !== undefined ? resourceData.provider : original.provider;

    if (!validateResource(title, type, url, localPath, description, provider, id)) {
      return false;
    }

    const updatedResource: ProjectResource = {
      ...original,
      title: title.trim(),
      description: description?.trim() || undefined,
      type,
      url: url?.trim() || undefined,
      localPath: localPath?.trim() || undefined,
      provider: provider?.trim() || undefined,
      environment: (resourceData.environment as ResourceEnvironment) ?? original.environment,
      status: (resourceData.status as ResourceStatus) ?? original.status,
      tags: resourceData.tags ?? original.tags,
      isFavorite: resourceData.isFavorite ?? original.isFavorite,
      updatedAt: new Date().toISOString(),
    };

    rawList[index] = updatedResource;
    inMemoryResources[cleanProjectId] = [...rawList];
    syncState();

    toast({
      type: "success",
      title: "Resource Updated",
      message: `"${updatedResource.title}" has been successfully updated.`,
    });

    return true;
  }, [cleanProjectId, syncState, toast]);

  // 3. Duplicate Resource
  const duplicateResource = useCallback((id: string): boolean => {
    const rawList = inMemoryResources[cleanProjectId] || [];
    const original = rawList.find((r) => r.id === id);
    if (!original) return false;

    const newId = `${cleanProjectId}-res-dup-${Date.now()}`;
    const isoString = new Date().toISOString();

    const duplicated: ProjectResource = {
      ...original,
      id: newId,
      title: `${original.title} Copy`,
      status: "Pending", // Reset status to Pending as per requirement
      isFavorite: false, // Reset favorite
      createdAt: isoString,
      updatedAt: isoString,
      lastOpenedAt: undefined,
    };

    inMemoryResources[cleanProjectId] = [duplicated, ...rawList];
    syncState();

    toast({
      type: "success",
      title: "Reference Duplicated",
      message: `"${original.title}" has been duplicated as "${duplicated.title}".`,
    });

    return true;
  }, [cleanProjectId, syncState, toast]);

  // 4. Toggle Favorite
  const toggleFavorite = useCallback((id: string) => {
    const rawList = inMemoryResources[cleanProjectId] || [];
    const index = rawList.findIndex((r) => r.id === id);
    if (index === -1) return;

    const item = rawList[index];
    const isNowFavorite = !item.isFavorite;
    rawList[index] = {
      ...item,
      isFavorite: isNowFavorite,
      updatedAt: new Date().toISOString(),
    };

    inMemoryResources[cleanProjectId] = [...rawList];
    syncState();

    toast({
      type: "success",
      title: isNowFavorite ? "Added to Favorites" : "Removed from Favorites",
      message: `"${item.title}" has been ${isNowFavorite ? "added to" : "removed from"} your favorite board.`,
    });
  }, [cleanProjectId, syncState, toast]);

  // 5. Toggle Archive
  const toggleArchive = useCallback((id: string) => {
    const rawList = inMemoryResources[cleanProjectId] || [];
    const index = rawList.findIndex((r) => r.id === id);
    if (index === -1) return;

    const item = rawList[index];
    const isNowArchived = !item.isArchived;

    // If we archive, also reset status to 'Archived' if active, or restore to 'Active'
    rawList[index] = {
      ...item,
      isArchived: isNowArchived,
      status: isNowArchived ? "Archived" : "Active",
      updatedAt: new Date().toISOString(),
    };

    inMemoryResources[cleanProjectId] = [...rawList];
    syncState();

    toast({
      type: "success",
      title: isNowArchived ? "Reference Archived" : "Reference Restored",
      message: `"${item.title}" has been ${isNowArchived ? "moved to" : "restored from"} the Archive.`,
    });
  }, [cleanProjectId, syncState, toast]);

  // 6. Mark Status
  const markStatus = useCallback((id: string, status: ResourceStatus) => {
    const rawList = inMemoryResources[cleanProjectId] || [];
    const index = rawList.findIndex((r) => r.id === id);
    if (index === -1) return;

    const item = rawList[index];
    rawList[index] = {
      ...item,
      status,
      updatedAt: new Date().toISOString(),
    };

    inMemoryResources[cleanProjectId] = [...rawList];
    syncState();

    toast({
      type: "success",
      title: "Status Changed",
      message: `"${item.title}" status has been set to "${status}".`,
    });
  }, [cleanProjectId, syncState, toast]);

  // 7. Delete Resource (Temporary in-memory delete)
  const deleteResource = useCallback((id: string) => {
    const rawList = inMemoryResources[cleanProjectId] || [];
    const filtered = rawList.filter((r) => r.id !== id);
    
    inMemoryResources[cleanProjectId] = filtered;
    syncState();

    toast({
      type: "success",
      title: "Resource Deleted",
      message: "The resource reference has been permanently cleared from this session.",
    });
  }, [cleanProjectId, syncState, toast]);

  // 8. Open Resource (update lastOpenedAt)
  const openResource = useCallback((id: string) => {
    const rawList = inMemoryResources[cleanProjectId] || [];
    const index = rawList.findIndex((r) => r.id === id);
    if (index === -1) return;

    const item = rawList[index];
    rawList[index] = {
      ...item,
      lastOpenedAt: new Date().toISOString(),
    };

    inMemoryResources[cleanProjectId] = [...rawList];
    syncState();
  }, [cleanProjectId, syncState]);

  // 9. Reset Demo Store (back to initial seeds)
  const resetToSeed = useCallback(() => {
    const defaultSeeds = getInitialResources();
    inMemoryResources[cleanProjectId] = defaultSeeds[cleanProjectId] || [];
    syncState();

    toast({
      type: "success",
      title: "Workspace Reloaded",
      message: "Resource database has been successfully reset to default seeded entries.",
    });
  }, [cleanProjectId, syncState, toast]);

  // Computed and filtered results list
  const filteredResources = useMemo(() => {
    const rawList = inMemoryResources[cleanProjectId] || [];
    return filterAndSortResources(rawList, {
      searchQuery,
      typeFilter,
      providerFilter,
      envFilter,
      statusFilter,
      favoritesOnlyFilter,
      archivedFilter,
      sortBy,
    });
  }, [resources, cleanProjectId, searchQuery, typeFilter, providerFilter, envFilter, statusFilter, favoritesOnlyFilter, archivedFilter, sortBy]);

  const allResourcesCount = (inMemoryResources[cleanProjectId] || []).length;

  return {
    resources: filteredResources,
    allResourcesCount,
    allProviders,
    summary,
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
    addResource,
    editResource,
    duplicateResource,
    toggleFavorite,
    toggleArchive,
    markStatus,
    deleteResource,
    openResource,
    resetToSeed,
  };
};
