import { Priority } from "../types";

export type PhaseStatus =
  | "Not started"
  | "Planned"
  | "In progress"
  | "Blocked"
  | "Completed"
  | "Paused"
  | "Skipped";

export type MilestoneStatus =
  | "Pending"
  | "In progress"
  | "Blocked"
  | "Completed"
  | "Skipped";

export interface CompletionCriterion {
  id: string;
  label: string;
  isComplete: boolean;
}

export interface ProjectMilestone {
  id: string;
  phaseId: string;
  title: string;
  description?: string;
  status: MilestoneStatus;
  priority: Priority;
  targetDate?: string;
  completedDate?: string;
  order: number;
}

export interface ProjectPhase {
  id: string;
  projectId: string;
  title: string;
  description: string;
  order: number;
  status: PhaseStatus;
  progress: number; // 0 to 100
  startDate?: string;
  targetDate?: string;
  completedDate?: string;
  isCurrent: boolean;
  dependencies: string[]; // phase IDs
  milestones: ProjectMilestone[];
  completionCriteria: CompletionCriterion[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectRoadmap {
  projectId: string;
  phases: ProjectPhase[];
}
