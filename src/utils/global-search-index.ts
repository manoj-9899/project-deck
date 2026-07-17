/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SearchResult } from "../types/global-search";
import { MOCK_PROJECTS_DIRECTORY } from "../data/projects";
import { getInitialTasks } from "../data/project-tasks";
import { getInitialRoadmaps } from "../data/project-roadmaps";
import { getInitialKnowledge } from "../data/project-knowledge";
import { getInitialPrompts } from "../data/project-prompts";
import { getInitialResources } from "../data/project-resources";

// Static Navigation Entries
export const STATIC_NAV_ENTRIES: SearchResult[] = [
  {
    id: "nav-overview",
    type: "Navigation",
    title: "Overview Dashboard",
    description: "Your engineering workspace at a glance, highlighting current focus and blockers.",
    route: "/",
    keywords: ["overview", "dashboard", "home", "focus", "blockers", "metrics", "kpi"],
    icon: "LayoutDashboard",
  },
  {
    id: "nav-projects",
    type: "Navigation",
    title: "Projects Directory",
    description: "Plan, track, and ship every project from the master directory catalog.",
    route: "/projects",
    keywords: ["projects", "directory", "catalog", "portfolio", "folders", "active"],
    icon: "FolderGit2",
  },
  {
    id: "nav-tasks",
    type: "Navigation",
    title: "Global Tasks Tracker",
    description: "Review backlog, sprint, and completed assignments across all active projects.",
    route: "/tasks",
    keywords: ["tasks", "planner", "sprints", "board", "kanban", "assignments"],
    icon: "CheckSquare",
  },
  {
    id: "nav-prompts",
    type: "Navigation",
    title: "Global Prompt Library",
    description: "Organize reusable system instructions and AI implementation presets.",
    route: "/prompts",
    keywords: ["prompts", "ai", "copilot", "library", "system instructions", "chatgpt", "gemini", "claude"],
    icon: "Terminal",
  },
  {
    id: "nav-knowledge",
    type: "Navigation",
    title: "Global Knowledge Wiki",
    description: "Keep technical decisions, architecture logs, and solutions accessible.",
    route: "/knowledge",
    keywords: ["knowledge", "wiki", "adr", "decisions", "architecture", "solutions", "errors"],
    icon: "BookOpen",
  },
  {
    id: "nav-settings",
    type: "Navigation",
    title: "Workspace Settings",
    description: "Manage your local ProjectDock preferences and visual styles.",
    route: "/settings",
    keywords: ["settings", "preferences", "preferences", "visual", "modes", "collapsing"],
    icon: "Settings",
  },
  {
    id: "nav-design-system",
    type: "Navigation",
    title: "Design System Showcase",
    description: "Interactive component playground, color palettes, and typographic token sandboxes.",
    route: "/design-system",
    keywords: ["design system", "components", "sandbox", "playground", "theme", "colors", "tokens"],
    icon: "Layers",
  },
];

// Static Quick Action Entries
export const STATIC_ACTION_ENTRIES: SearchResult[] = [
  {
    id: "action-overview",
    type: "Action",
    title: "Go to Overview",
    description: "Navigate directly to the dashboard home page.",
    route: "/",
    keywords: ["go to", "overview", "dashboard", "home", "nav"],
    icon: "Home",
  },
  {
    id: "action-projects",
    type: "Action",
    title: "Open Projects Directory",
    description: "Browse your active, planned, and archived project collections.",
    route: "/projects",
    keywords: ["open", "projects", "directory", "list"],
    icon: "FolderKanban",
  },
  {
    id: "action-project-tasks",
    type: "Action",
    title: "Open Current Project Tasks",
    description: "Open the active task tracker / kanban board for the current project context.",
    route: "project-tasks", // handled contextually
    keywords: ["tasks", "kanban", "current", "board"],
    icon: "ListChecks",
  },
  {
    id: "action-project-roadmap",
    type: "Action",
    title: "Open Current Project Roadmap",
    description: "Open active roadmap phases and timeline scheduler for the current project.",
    route: "project-roadmap",
    keywords: ["roadmap", "timeline", "phases", "current"],
    icon: "Milestone",
  },
  {
    id: "action-project-knowledge",
    type: "Action",
    title: "Open Current Project Knowledge",
    description: "Open the architecture decision records (ADR) and wiki of the current project.",
    route: "project-knowledge",
    keywords: ["knowledge", "wiki", "decisions", "adr", "current"],
    icon: "FileText",
  },
  {
    id: "action-project-prompts",
    type: "Action",
    title: "Open Current Project Prompts",
    description: "Open prompt templates and variable LLM system guides for the current project.",
    route: "project-prompts",
    keywords: ["prompts", "copilot", "templates", "current"],
    icon: "Cpu",
  },
  {
    id: "action-project-resources",
    type: "Action",
    title: "Open Current Project Resources",
    description: "Open repositories, local folders, and deployment reference links for the current project.",
    route: "project-resources",
    keywords: ["resources", "links", "repos", "paths", "current"],
    icon: "Link",
  },
  {
    id: "action-create-project",
    type: "Action",
    title: "Create Project",
    description: "Open the project creation workspace template.",
    route: "create-project",
    keywords: ["create", "new", "project", "add"],
    icon: "PlusCircle",
  },
  {
    id: "action-create-task",
    type: "Action",
    title: "Create Task",
    description: "Add a task under the active project board.",
    route: "create-task",
    keywords: ["create", "new", "task", "add"],
    icon: "FilePlus",
  },
  {
    id: "action-design-system",
    type: "Action",
    title: "Open Design System Showcase",
    description: "Review UI buttons, Dialog triggers, custom Sheets, and badging scales.",
    route: "/design-system",
    keywords: ["open", "design", "system", "components"],
    icon: "Palette",
  },
];

/**
 * Builds the searchable unified search index using local mock data.
 * This runs client-side and avoids making slow API requests.
 */
export function buildGlobalSearchIndex(): SearchResult[] {
  const index: SearchResult[] = [];

  // 1. Projects
  MOCK_PROJECTS_DIRECTORY.forEach((project) => {
    index.push({
      id: `project-${project.id}`,
      type: "Project",
      title: project.name,
      description: project.description,
      projectId: project.id,
      projectName: project.name,
      route: `/projects/${project.id}`,
      keywords: [
        project.category,
        project.status,
        project.health,
        ...project.techStack,
        "project",
        project.slug,
      ],
      icon: "Folder",
      metadata: {
        category: project.category,
        status: project.status,
        health: project.health,
        progress: project.progress,
        isArchived: project.isArchived,
      },
    });
  });

  // Helper mapping of project IDs to names
  const projectNames = MOCK_PROJECTS_DIRECTORY.reduce((acc, p) => {
    acc[p.id] = p.name;
    return acc;
  }, {} as Record<string, string>);

  // 2. Tasks
  try {
    const tasksMap = getInitialTasks();
    Object.entries(tasksMap).forEach(([projectId, tasks]) => {
      const projectName = projectNames[projectId] || projectId;
      tasks.forEach((task) => {
        index.push({
          id: `task-${task.id}`,
          type: "Task",
          title: task.title,
          description: task.description,
          projectId,
          projectName,
          route: `/projects/${projectId}/tasks?focus=${task.id}`,
          keywords: [
            task.status,
            task.priority,
            ...(task.labels || []),
            task.notes || "",
            "task",
            "todo",
            "ticket",
          ],
          icon: "CheckSquare",
          metadata: {
            status: task.status,
            priority: task.priority,
            isBlocked: task.isBlocked,
            isArchived: task.isArchived,
          },
        });
      });
    });
  } catch (e) {
    console.warn("Failed to index tasks:", e);
  }

  // 3. Roadmap Phases and Milestones
  try {
    const roadmapsMap = getInitialRoadmaps();
    Object.entries(roadmapsMap).forEach(([projectId, phases]) => {
      const projectName = projectNames[projectId] || projectId;
      phases.forEach((phase) => {
        // Index Phase itself
        index.push({
          id: `roadmap-phase-${phase.id}`,
          type: "Roadmap",
          title: phase.title,
          description: phase.description,
          projectId,
          projectName,
          route: `/projects/${projectId}/roadmap?focus=${phase.id}`,
          keywords: [
            "phase",
            phase.status,
            `order-${phase.order}`,
            "roadmap",
            "milestones",
          ],
          icon: "Calendar",
          metadata: {
            itemType: "phase",
            status: phase.status,
            progress: phase.progress,
          },
        });

        // Index Milestones in Phase
        if (phase.milestones) {
          phase.milestones.forEach((milestone) => {
            index.push({
              id: `roadmap-milestone-${milestone.id}`,
              type: "Roadmap",
              title: milestone.title,
              description: milestone.description,
              projectId,
              projectName,
              route: `/projects/${projectId}/roadmap?focus=${milestone.id}`,
              keywords: [
                "milestone",
                milestone.status,
                milestone.priority,
                "roadmap",
                "checkpoint",
              ],
              icon: "Milestone",
              metadata: {
                itemType: "milestone",
                status: milestone.status,
                priority: milestone.priority,
                phaseId: milestone.phaseId,
              },
            });
          });
        }
      });
    });
  } catch (e) {
    console.warn("Failed to index roadmaps:", e);
  }

  // 4. Knowledge (ADR & Wiki)
  try {
    const knowledgeMap = getInitialKnowledge();
    Object.entries(knowledgeMap).forEach(([projectId, entries]) => {
      const projectName = projectNames[projectId] || projectId;
      entries.forEach((entry) => {
        index.push({
          id: `knowledge-${entry.id}`,
          type: "Knowledge",
          title: entry.title,
          description: entry.content,
          projectId,
          projectName,
          route: `/projects/${projectId}/knowledge?focus=${entry.id}`,
          keywords: [
            entry.type,
            entry.status || "",
            ...(entry.tags || []),
            entry.decision || "",
            entry.rationale || "",
            entry.alternatives || "",
            entry.consequences || "",
            entry.errorMessage || "",
            "knowledge",
            "adr",
            "wiki",
            "documentation",
          ],
          icon: "BookOpen",
          metadata: {
            entryType: entry.type,
            status: entry.status,
            tags: entry.tags,
            isPinned: entry.isPinned,
          },
        });
      });
    });
  } catch (e) {
    console.warn("Failed to index knowledge entries:", e);
  }

  // 5. Prompts
  try {
    const promptsMap = getInitialPrompts();
    Object.entries(promptsMap).forEach(([projectId, prompts]) => {
      const projectName = projectNames[projectId] || projectId;
      prompts.forEach((prompt) => {
        index.push({
          id: `prompt-${prompt.id}`,
          type: "Prompt",
          title: prompt.title,
          description: prompt.description,
          projectId,
          projectName,
          route: `/projects/${projectId}/prompts?focus=${prompt.id}`,
          keywords: [
            prompt.prompt,
            prompt.tool,
            prompt.category,
            prompt.status,
            ...(prompt.tags || []),
            "prompt",
            "system-prompt",
            "ai",
            "copilot",
          ],
          icon: "Terminal",
          metadata: {
            tool: prompt.tool,
            category: prompt.category,
            status: prompt.status,
            isFavorite: prompt.isFavorite,
          },
        });
      });
    });
  } catch (e) {
    console.warn("Failed to index prompts:", e);
  }

  // 6. Resources
  try {
    const resourcesMap = getInitialResources();
    Object.entries(resourcesMap).forEach(([projectId, resources]) => {
      const projectName = projectNames[projectId] || projectId;
      resources.forEach((resource) => {
        index.push({
          id: `resource-${resource.id}`,
          type: "Resource",
          title: resource.title,
          description: resource.description,
          projectId,
          projectName,
          route: `/projects/${projectId}/resources?focus=${resource.id}`,
          keywords: [
            resource.type,
            resource.url || "",
            resource.localPath || "",
            resource.provider,
            resource.environment,
            resource.status,
            ...(resource.tags || []),
            "resource",
            "link",
            "path",
          ],
          icon: "Link",
          metadata: {
            resourceType: resource.type,
            provider: resource.provider,
            environment: resource.environment,
            status: resource.status,
            isFavorite: resource.isFavorite,
          },
        });
      });
    });
  } catch (e) {
    console.warn("Failed to index resources:", e);
  }

  // 7. Navigations
  STATIC_NAV_ENTRIES.forEach((nav) => {
    index.push(nav);
  });

  // 8. Actions
  STATIC_ACTION_ENTRIES.forEach((act) => {
    index.push(act);
  });

  return index;
}
