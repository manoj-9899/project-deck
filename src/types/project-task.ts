import { Priority } from "../types";

export type TaskStatus =
  | "Backlog"
  | "To do"
  | "In progress"
  | "Blocked"
  | "Completed";

export interface ProjectTask {
  id: string;
  projectId: string; // references project.id/slug
  phaseId?: string; // references roadmap phase.id
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string; // YYYY-MM-DD
  labels: string[]; // custom labels
  isBlocked: boolean;
  blockerReason?: string;
  notes?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  completedAt?: string; // ISO string or empty
  isArchived: boolean;
  order: number;
}
