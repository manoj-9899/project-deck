/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PromptTool =
  | "Google AI Studio"
  | "Codex"
  | "ChatGPT"
  | "Claude"
  | "Fable"
  | "Stitch"
  | "Hermes"
  | "Other";

export type PromptCategory =
  | "Planning"
  | "UI/UX"
  | "Development"
  | "Debugging"
  | "Testing"
  | "Documentation"
  | "Research"
  | "Handover";

export type PromptStatus =
  | "Draft"
  | "Ready"
  | "Used"
  | "Needs revision"
  | "Archived";

export interface PromptVersion {
  id: string;
  version: number;
  prompt: string;
  changeSummary: string;
  createdAt: string;
}

export interface ProjectPrompt {
  id: string;
  projectId: string;
  title: string;
  prompt: string;
  description: string;
  tool: PromptTool;
  category: PromptCategory;
  status: PromptStatus;
  tags: string[];
  relatedPhaseId?: string;
  relatedTaskId?: string;
  responseSummary?: string;
  handoverContext?: string;
  version: number;
  versions: PromptVersion[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
}

export interface PromptSummaryStats {
  total: number;
  ready: number;
  used: number;
  needsRevision: number;
  favorites: number;
}
