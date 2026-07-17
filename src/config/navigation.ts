import { 
  LayoutDashboard, 
  FolderKanban, 
  ListTodo, 
  Terminal, 
  BookOpen, 
  Settings 
} from "lucide-react";
import React from "react";

export interface NavigationItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  description: string;
}

export const primaryNavigationItems: NavigationItem[] = [
  {
    path: "/",
    label: "Overview",
    icon: LayoutDashboard,
    description: "Your engineering workspace at a glance.",
  },
  {
    path: "/projects",
    label: "Projects",
    icon: FolderKanban,
    description: "Plan, track, and ship every project from one workspace.",
  },
  {
    path: "/tasks",
    label: "Tasks",
    icon: ListTodo,
    description: "Review work across active projects.",
  },
  {
    path: "/prompts",
    label: "Prompt Library",
    icon: Terminal,
    description: "Organize reusable prompts and AI implementation context.",
  },
  {
    path: "/knowledge",
    label: "Knowledge",
    icon: BookOpen,
    description: "Keep technical decisions, documentation, and solutions accessible.",
  },
];

export const secondaryNavigationItems: NavigationItem[] = [
  {
    path: "/settings",
    label: "Settings",
    icon: Settings,
    description: "Manage your ProjectDock workspace preferences.",
  },
];

/**
 * Checks if a current pathname is active for a given navigation item path.
 * In React Router, `/projects/:projectId` should keep the `/projects` navigation item active.
 */
export function isRouteActive(currentPath: string, targetPath: string): boolean {
  if (targetPath === "/") {
    return currentPath === "/";
  }
  // `/projects` matches `/projects/123`, etc.
  if (targetPath === "/projects") {
    return currentPath.startsWith("/projects");
  }
  return currentPath === targetPath || currentPath.startsWith(targetPath + "/");
}
