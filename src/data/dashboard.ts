import { Project, Task, AttentionItem, ActivityItem, WorkspaceMetrics } from "../types";
import { MOCK_PROJECTS_DIRECTORY } from "./projects";

export const MOCK_PROJECTS: Project[] = MOCK_PROJECTS_DIRECTORY;

export const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Review dashboard responsiveness",
    projectId: "projectdock",
    projectName: "ProjectDock",
    priority: "High",
    dueDateLabel: "Today",
    status: "in-progress"
  },
  {
    id: "task-2",
    title: "Document Phase 3 implementation",
    projectId: "projectdock",
    projectName: "ProjectDock",
    priority: "Medium",
    dueDateLabel: "Tomorrow",
    status: "todo"
  },
  {
    id: "task-3",
    title: "Run final security regression tests",
    projectId: "devhabits",
    projectName: "DevHabits",
    priority: "High",
    dueDateLabel: "In 2 days",
    status: "todo"
  },
  {
    id: "task-4",
    title: "Finalize product foundation decisions",
    projectId: "launchkaro",
    projectName: "LaunchKaro",
    priority: "High",
    dueDateLabel: "In 4 days",
    status: "todo",
    isBlocked: true,
    blockerReason: "Product scope needs to be finalized"
  },
  {
    id: "task-5",
    title: "Decide whether to resume development",
    projectId: "repopilot",
    projectName: "RepoPilot",
    priority: "Medium",
    dueDateLabel: "This week",
    status: "todo"
  }
];

export const MOCK_ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: "attn-1",
    projectId: "launchkaro",
    projectName: "LaunchKaro",
    reason: "Product scope needs to be finalized before implementation continues.",
    severity: "danger",
    suggestedAction: "Resolve scope definitions in workspace planning deck",
    statusLabel: "Blocked"
  },
  {
    id: "attn-2",
    projectId: "repopilot",
    projectName: "RepoPilot",
    reason: "Development has been paused and needs a resume-or-archive decision.",
    severity: "warning",
    suggestedAction: "Analyze current market validity and decide by Friday",
    statusLabel: "Inactive"
  },
  {
    id: "attn-3",
    projectId: "devhabits",
    projectName: "DevHabits",
    reason: "Testing is nearly complete, but final deployment validation remains.",
    severity: "info",
    suggestedAction: "Review final staging logs and sign off for launch",
    statusLabel: "Testing"
  }
];

export const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    action: "ProjectDock dashboard phase started",
    projectId: "projectdock",
    projectName: "ProjectDock",
    timeContext: "20 minutes ago",
    type: "phase_started"
  },
  {
    id: "act-2",
    action: "ProjectDock application shell completed",
    projectId: "projectdock",
    projectName: "ProjectDock",
    timeContext: "Yesterday",
    type: "shell_completed"
  },
  {
    id: "act-3",
    action: "DevHabits security tests passed",
    projectId: "devhabits",
    projectName: "DevHabits",
    timeContext: "2 days ago",
    type: "test_passed"
  },
  {
    id: "act-4",
    action: "LaunchKaro product documentation updated",
    projectId: "launchkaro",
    projectName: "LaunchKaro",
    timeContext: "4 days ago",
    type: "doc_updated"
  },
  {
    id: "act-5",
    action: "CampusCanteen marked as deployed",
    projectId: "campuscanteen",
    projectName: "CampusCanteen",
    timeContext: "Last week",
    type: "deployed"
  },
  {
    id: "act-6",
    action: "RepoPilot moved to paused",
    projectId: "repopilot",
    projectName: "RepoPilot",
    timeContext: "2 weeks ago",
    type: "paused"
  }
];

export const MOCK_METRICS: WorkspaceMetrics = {
  activeProjects: 4, // ProjectDock, LaunchKaro, DevHabits, Vows & Vine
  dueSoonTasks: 5,
  blockedItems: 2, // LaunchKaro blocked, RepoPilot inactive
  completedThisWeek: 7
};

export const EMPTY_PROJECTS_MOCK: Project[] = [];
export const EMPTY_TASKS_MOCK: Task[] = [];
export const EMPTY_ACTIVITIES_MOCK: ActivityItem[] = [];
