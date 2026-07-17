import { useState, useMemo } from "react";
import { Project, ProjectStatus, ProjectHealth, Priority, ProjectCategory } from "../../types";
import { MOCK_PROJECTS_DIRECTORY } from "../../data/projects";

const PRIORITY_WEIGHTS: Record<Priority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1
};

const STATUS_WEIGHTS: Record<ProjectStatus, number> = {
  Idea: 1,
  Planning: 2,
  Designing: 3,
  Building: 4,
  Testing: 5,
  Deployed: 6,
  Maintaining: 7,
  Paused: 8,
  Archived: 9
};

export interface ProjectFilterState {
  status: ProjectStatus | "All";
  health: ProjectHealth | "All";
  priority: Priority | "All";
  category: ProjectCategory | "All";
  archiveVisibility: "active" | "archived" | "all";
}

export type SortOption =
  | "recently-updated"
  | "name"
  | "priority"
  | "progress"
  | "target-date"
  | "status";

export function useProjectsState() {
  const [projects, setProjects] = useState<Project[]>(() => MOCK_PROJECTS_DIRECTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<SortOption>("recently-updated");
  
  const [filters, setFilters] = useState<ProjectFilterState>({
    status: "All",
    health: "All",
    priority: "All",
    category: "All",
    archiveVisibility: "active"
  });

  const resetFilters = () => {
    setFilters({
      status: "All",
      health: "All",
      priority: "All",
      category: "All",
      archiveVisibility: "active"
    });
    setSearchQuery("");
  };

  const filteredAndSortedProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Search filter
        if (searchQuery.trim() !== "") {
          const query = searchQuery.toLowerCase();
          const matchesName = project.name.toLowerCase().includes(query);
          const matchesDesc = project.description.toLowerCase().includes(query);
          const matchesCategory = project.category.toLowerCase().includes(query);
          const matchesTech = project.techStack.some((t) => t.toLowerCase().includes(query));
          if (!matchesName && !matchesDesc && !matchesCategory && !matchesTech) {
            return false;
          }
        }

        // Dropdown Filters
        if (filters.status !== "All" && project.status !== filters.status) {
          return false;
        }
        if (filters.health !== "All" && project.health !== filters.health) {
          return false;
        }
        if (filters.priority !== "All" && project.priority !== filters.priority) {
          return false;
        }
        if (filters.category !== "All" && project.category !== filters.category) {
          return false;
        }

        // Archive filters
        if (filters.archiveVisibility === "active" && project.isArchived) {
          return false;
        }
        if (filters.archiveVisibility === "archived" && !project.isArchived) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "priority") {
          const weightA = PRIORITY_WEIGHTS[a.priority] || 0;
          const weightB = PRIORITY_WEIGHTS[b.priority] || 0;
          return weightB - weightA; // High priority first
        }
        if (sortBy === "progress") {
          return b.progress - a.progress; // High progress first
        }
        if (sortBy === "status") {
          const weightA = STATUS_WEIGHTS[a.status] || 0;
          const weightB = STATUS_WEIGHTS[b.status] || 0;
          return weightA - weightB;
        }
        if (sortBy === "target-date") {
          if (!a.targetDate) return 1;
          if (!b.targetDate) return -1;
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
        }
        // default: recently-updated (we'll sort by relative updated indexes, but here we can just use dates or maintain order)
        // Since we don't have absolute JS dates for relative ones (e.g., '20 minutes ago'), we'll treat a's current index or a simple default
        return 0; // Maintain original order or use secondary sorting if same
      });
  }, [projects, searchQuery, filters, sortBy]);

  // CRUD Actions
  const createProject = (projectData: Omit<Project, "id" | "slug" | "lastUpdated" | "isArchived">) => {
    const slug = projectData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const newProject: Project = {
      ...projectData,
      id: slug,
      slug,
      lastUpdated: "Just now",
      updatedAt: "Just now",
      isArchived: false
    };

    setProjects((prev) => [newProject, ...prev]);
  };

  const editProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? {
              ...project,
              ...updatedFields,
              lastUpdated: "Just now",
              updatedAt: "Just now"
            }
          : project
      )
    );
  };

  const duplicateProject = (project: Project) => {
    const baseSlug = `${project.slug}-copy`;
    const newName = `${project.name} (Copy)`;
    
    // Find unique slug
    let finalSlug = baseSlug;
    let count = 1;
    while (projects.some((p) => p.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${count}`;
      count++;
    }

    const duplicated: Project = {
      ...project,
      id: finalSlug,
      slug: finalSlug,
      name: count > 1 ? `${project.name} (Copy ${count - 1})` : newName,
      lastUpdated: "Just now",
      updatedAt: "Just now"
    };

    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === project.id);
      if (idx === -1) return [duplicated, ...prev];
      const next = [...prev];
      next.splice(idx + 1, 0, duplicated);
      return next;
    });
  };

  const archiveProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isArchived: true, status: "Archived" as ProjectStatus, lastUpdated: "Just now", updatedAt: "Just now" } : p
      )
    );
  };

  const restoreProject = (id: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              isArchived: false,
              status: "Planning" as ProjectStatus, // Reset status to Planning
              lastUpdated: "Just now",
              updatedAt: "Just now"
            }
          : p
      )
    );
  };

  const projectStats = useMemo(() => {
    const active = projects.filter((p) => !p.isArchived);
    const archived = projects.filter((p) => p.isArchived);
    const blocked = active.filter((p) => p.health === "Blocked");
    const onTrack = active.filter((p) => p.health === "On track" || p.health === "Stable");
    const needsAttention = active.filter((p) => p.health === "Needs attention");

    return {
      total: projects.length,
      active: active.length,
      archived: archived.length,
      blocked: blocked.length,
      onTrack: onTrack.length,
      needsAttention: needsAttention.length
    };
  }, [projects]);

  return {
    projects,
    filteredAndSortedProjects,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,
    filters,
    setFilters,
    resetFilters,
    createProject,
    editProject,
    duplicateProject,
    archiveProject,
    restoreProject,
    projectStats
  };
}
