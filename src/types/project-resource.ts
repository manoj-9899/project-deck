/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ResourceType =
  | "Repository"
  | "Deployment"
  | "Documentation"
  | "Design"
  | "Database"
  | "Hosting"
  | "AI Conversation"
  | "Local Path"
  | "API Reference"
  | "Reference Website"
  | "Other";

export type ResourceEnvironment =
  | "Local"
  | "Development"
  | "Preview"
  | "Production"
  | "Not applicable";

export type ResourceStatus =
  | "Active"
  | "Inactive"
  | "Broken"
  | "Pending"
  | "Archived";

export interface ProjectResource {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  type: ResourceType;
  url?: string;
  localPath?: string;
  provider?: string; // e.g. GitHub, Vercel, Supabase, etc.
  environment: ResourceEnvironment;
  status: ResourceStatus;
  tags: string[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
}

export interface ResourceSummaryStats {
  total: number;
  repositories: number;
  deployments: number;
  documentation: number;
  broken: number;
}
