/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectResource } from "../types/project-resource";

/**
 * Filters and sorts resources based on search queries, active filter values, and sorting options.
 */
export const filterAndSortResources = (
  resources: ProjectResource[],
  options: {
    searchQuery: string;
    typeFilter: string;
    providerFilter: string;
    envFilter: string;
    statusFilter: string;
    favoritesOnlyFilter: boolean;
    archivedFilter: string; // "Active" | "Archived" | "All"
    sortBy: string;
  }
): ProjectResource[] => {
  const {
    searchQuery,
    typeFilter,
    providerFilter,
    envFilter,
    statusFilter,
    favoritesOnlyFilter,
    archivedFilter,
    sortBy,
  } = options;

  let result = [...resources];

  // 1. Filter by Archive State
  if (archivedFilter === "Active") {
    result = result.filter((r) => !r.isArchived);
  } else if (archivedFilter === "Archived") {
    result = result.filter((r) => r.isArchived);
  } // if "All", no filtering on archive state

  // 2. Filter by Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter((r) => {
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchDesc = r.description?.toLowerCase().includes(q) || false;
      const matchProvider = r.provider?.toLowerCase().includes(q) || false;
      const matchUrl = r.url?.toLowerCase().includes(q) || false;
      const matchPath = r.localPath?.toLowerCase().includes(q) || false;
      const matchTags = r.tags.some((t) => t.toLowerCase().includes(q));

      return matchTitle || matchDesc || matchProvider || matchUrl || matchPath || matchTags;
    });
  }

  // 3. Filter by Type
  if (typeFilter !== "All") {
    result = result.filter((r) => r.type === typeFilter);
  }

  // 4. Filter by Provider
  if (providerFilter !== "All") {
    result = result.filter((r) => r.provider === providerFilter);
  }

  // 5. Filter by Environment
  if (envFilter !== "All") {
    result = result.filter((r) => r.environment === envFilter);
  }

  // 6. Filter by Status
  if (statusFilter !== "All") {
    result = result.filter((r) => r.status === statusFilter);
  }

  // 7. Filter by Favorites Only
  if (favoritesOnlyFilter) {
    result = result.filter((r) => r.isFavorite);
  }

  // 8. Sorting
  result.sort((a, b) => {
    switch (sortBy) {
      case "recentlyUpdated":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

      case "recentlyOpened": {
        const timeA = a.lastOpenedAt ? new Date(a.lastOpenedAt).getTime() : 0;
        const timeB = b.lastOpenedAt ? new Date(b.lastOpenedAt).getTime() : 0;
        if (timeA === 0 && timeB === 0) {
          // Fall back to updatedAt descending if neither has been opened
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        }
        return timeB - timeA;
      }

      case "title":
        return a.title.localeCompare(b.title);

      case "type":
        return a.type.localeCompare(b.type);

      case "environment":
        return a.environment.localeCompare(b.environment);

      case "favoritesFirst":
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  return result;
};
