export type ProjectStatus =
  | "Idea"
  | "Planning"
  | "Designing"
  | "Building"
  | "Testing"
  | "Deployed"
  | "Maintaining"
  | "Paused"
  | "Archived";

export type ProjectHealth =
  | "On track"
  | "Needs attention"
  | "Blocked"
  | "Stable"
  | "Inactive";

export type Priority = "Critical" | "High" | "Medium" | "Low";

export type ProjectCategory =
  | "Personal Tool"
  | "Portfolio"
  | "Business"
  | "Client Work"
  | "SaaS Experiment"
  | "Academic"
  | "Experimental";

export interface Project {
  id: string; // Slug, e.g., 'projectdock'
  slug: string;
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  health: ProjectHealth;
  priority: Priority;
  progress: number; // 0 to 100
  currentPhase?: string;
  nextAction?: string;
  techStack: string[];
  startDate?: string; // YYYY-MM-DD
  targetDate?: string; // YYYY-MM-DD
  lastUpdated: string; // e.g. '20 minutes ago', '2 days ago'
  updatedAt?: string; // Alias for backward compatibility
  repositoryUrl?: string;
  deploymentUrl?: string;
  isArchived: boolean;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  priority: Priority;
  dueDateLabel: string; // e.g., 'Today', 'Tomorrow', 'In 2 days', 'This week'
  status: "todo" | "in-progress" | "done";
  isBlocked?: boolean;
  blockerReason?: string;
}

export interface AttentionItem {
  id: string;
  projectId: string;
  projectName: string;
  reason: string;
  severity: "warning" | "danger" | "info";
  suggestedAction: string;
  statusLabel: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  projectId: string;
  projectName: string;
  timeContext: string; // e.g., '20 minutes ago', 'Yesterday'
  type: "phase_started" | "shell_completed" | "test_passed" | "doc_updated" | "deployed" | "paused" | "task_completed";
}

export interface WorkspaceMetrics {
  activeProjects: number;
  dueSoonTasks: number;
  blockedItems: number;
  completedThisWeek: number;
}
