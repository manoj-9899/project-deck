/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SearchResult } from "../../types/global-search";
import { buildGlobalSearchIndex } from "../../utils/global-search-index";

interface GlobalSearchContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  recentNavigation: SearchResult[];
  addRecentNavigation: (item: SearchResult) => void;
  clearRecentNavigation: () => void;
  searchIndex: SearchResult[];
  refreshSearchIndex: () => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export function GlobalSearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentNavigation, setRecentNavigation] = useState<SearchResult[]>([]);
  const [searchIndex, setSearchIndex] = useState<SearchResult[]>([]);

  // Build/refresh client search index
  const refreshSearchIndex = useCallback(() => {
    try {
      const indexed = buildGlobalSearchIndex();
      setSearchIndex(indexed);
    } catch (e) {
      console.error("Error building search index:", e);
    }
  }, []);

  // Initialize index on mount
  useEffect(() => {
    refreshSearchIndex();
  }, [refreshSearchIndex]);

  // Re-build index whenever the palette is opened to grab any updated state
  useEffect(() => {
    if (isOpen) {
      refreshSearchIndex();
    }
  }, [isOpen, refreshSearchIndex]);

  // Handle Ctrl+K / Cmd+K global listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addRecentNavigation = useCallback((item: SearchResult) => {
    // Only add if it's not a temporary action like "Create Project" or a duplicate item
    if (item.type === "Action" && (item.id.includes("create") || item.id.includes("open-current"))) {
      return;
    }

    setRecentNavigation((prev) => {
      // Remove duplicate from list if it exists
      const filtered = prev.filter((r) => r.id !== item.id);
      // Prepend and limit to 10 entries
      return [item, ...filtered].slice(0, 10);
    });
  }, []);

  const clearRecentNavigation = useCallback(() => {
    setRecentNavigation([]);
  }, []);

  return (
    <GlobalSearchContext.Provider
      value={{
        isOpen,
        setIsOpen,
        searchQuery,
        setSearchQuery,
        recentNavigation,
        addRecentNavigation,
        clearRecentNavigation,
        searchIndex,
        refreshSearchIndex,
      }}
    >
      {children}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearchContext() {
  const context = useContext(GlobalSearchContext);
  if (context === undefined) {
    throw new Error("useGlobalSearchContext must be used within a GlobalSearchProvider");
  }
  return context;
}
