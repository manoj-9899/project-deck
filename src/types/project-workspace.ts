import { Priority } from "../types";

export interface WorkspaceLink {
  label: string;
  url: string;
  type: "repository" | "deployment" | "documentation" | "design" | "database" | "ai" | "local" | "other";
  domain?: string;
}

export interface UpcomingWorkItem {
  id: string;
  title: string;
  section: "Tasks" | "Roadmap" | "Knowledge" | "Prompts" | "Resources" | "Activity";
  priority: Priority;
  timeframe: string; // e.g., "This week", "Next sprint"
  statusLabel: string; // e.g., "Planned", "Scheduled", "Blocked"
}

export interface WorkspaceRisk {
  id: string;
  title: string;
  impact: "Critical" | "High" | "Medium" | "Low";
  status: "Active" | "Monitored" | "Mitigated" | "Resolved";
  description: string;
}

export interface WorkspaceActivity {
  id: string;
  description: string;
  timeContext: string;
  type: "phase_started" | "shell_completed" | "test_passed" | "doc_updated" | "deployed" | "paused" | "task_completed" | "general";
  phase?: string;
}

export interface FeaturedMetric {
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
}

export interface ProjectWorkspaceDetail {
  projectId: string; // Matches slug
  summary: string;
  objective: string;
  currentPhaseSummary: string;
  completionCriteria?: string[];
  recentActivity: WorkspaceActivity[];
  upcomingWork: UpcomingWorkItem[];
  risks: WorkspaceRisk[];
  keyLinks: WorkspaceLink[];
  featuredMetrics?: FeaturedMetric[];
  lastDecision?: {
    title: string;
    outcome: string;
    date: string;
  };
}
