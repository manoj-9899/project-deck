/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useGlobalSearchContext } from "../components/global-search/GlobalSearchProvider";

export function useGlobalSearch() {
  const context = useGlobalSearchContext();
  return {
    isOpen: context.isOpen,
    setIsOpen: context.setIsOpen,
    searchQuery: context.searchQuery,
    setSearchQuery: context.setSearchQuery,
    recentNavigation: context.recentNavigation,
    addRecentNavigation: context.addRecentNavigation,
    clearRecentNavigation: context.clearRecentNavigation,
    searchIndex: context.searchIndex,
    refreshSearchIndex: context.refreshSearchIndex,
  };
}
