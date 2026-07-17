/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SearchResultType =
  | "Project"
  | "Task"
  | "Roadmap"
  | "Knowledge"
  | "Prompt"
  | "Resource"
  | "Navigation"
  | "Action";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  route: string;
  keywords?: string[];
  icon?: string;
  metadata?: Record<string, any>;
}

export interface SearchIndex {
  items: SearchResult[];
}
