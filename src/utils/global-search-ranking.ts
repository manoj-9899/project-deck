/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SearchResult } from "../types/global-search";

/**
 * Ranks and filters search results based on a query.
 * Matches title exact, prefix, substring, then description, and keywords.
 */
export function rankSearchResults(query: string, items: SearchResult[]): SearchResult[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  return items
    .map((item) => {
      let score = 0;
      const title = item.title.toLowerCase();
      const description = (item.description || "").toLowerCase();

      // 1. Exact title match
      if (title === cleanQuery) {
        score += 1000;
      }
      // 2. Prefix title match
      else if (title.startsWith(cleanQuery)) {
        score += 500;
      }
      // 3. Substring title match
      else if (title.includes(cleanQuery)) {
        score += 200;
      }

      // 4. Description/Body substring match
      if (description.includes(cleanQuery)) {
        score += 50;
      }

      // 5. Keyword / Tag match
      if (item.keywords && item.keywords.length > 0) {
        const hasKeywordMatch = item.keywords.some((keyword) => {
          const cleanK = keyword.toLowerCase();
          return cleanK === cleanQuery || cleanK.startsWith(cleanQuery) || cleanK.includes(cleanQuery);
        });

        if (hasKeywordMatch) {
          score += 30;
        }
      }

      // 6. Project Name context match
      if (item.projectName && item.projectName.toLowerCase().includes(cleanQuery)) {
        score += 10;
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      // Primary: Score descending
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Secondary: Type grouping consistency
      if (a.item.type !== b.item.type) {
        return a.item.type.localeCompare(b.item.type);
      }
      // Tertiary: Title alphabetical
      return a.item.title.localeCompare(b.item.title);
    })
    .map((entry) => entry.item);
}

/**
 * Groups raw list of search results by their SearchResultType.
 */
export function groupSearchResults(items: SearchResult[]): Record<string, SearchResult[]> {
  const groups: Record<string, SearchResult[]> = {};
  items.forEach((item) => {
    if (!groups[item.type]) {
      groups[item.type] = [];
    }
    groups[item.type].push(item);
  });
  return groups;
}
