import React, { useMemo } from "react";
import { useParams, Outlet, useLocation } from "react-router-dom";
import { MOCK_PROJECTS_DIRECTORY } from "../../data/projects";
import { getWorkspaceDetail } from "../../data/project-workspaces";
import ProjectBreadcrumbs from "./ProjectBreadcrumbs";
import ProjectWorkspaceHeader from "./ProjectWorkspaceHeader";
import ProjectNavigation from "./ProjectNavigation";
import ProjectNotFound from "./ProjectNotFound";
import ArchivedProjectNotice from "./ArchivedProjectNotice";

export default function ProjectWorkspaceLayout() {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();

  // Find matching project slug or ID
  const project = useMemo(() => {
    if (!projectId) return null;
    const cleanId = projectId.toLowerCase().trim();
    return MOCK_PROJECTS_DIRECTORY.find(
      (p) => p.slug.toLowerCase() === cleanId || p.id.toLowerCase() === cleanId
    ) || null;
  }, [projectId]);

  // Combined supplementary data
  const detail = useMemo(() => {
    if (!project) return null;
    return getWorkspaceDetail(project.slug, project.name, project.description);
  }, [project]);

  // Determine current active section for breadcrumb suffix labels
  const currentTabLabel = useMemo(() => {
    const pathname = location.pathname;
    if (pathname.endsWith("/tasks")) return "Tasks";
    if (pathname.endsWith("/roadmap")) return "Roadmap";
    if (pathname.endsWith("/knowledge")) return "Knowledge";
    if (pathname.endsWith("/prompts")) return "Prompts";
    if (pathname.endsWith("/resources")) return "Resources";
    if (pathname.endsWith("/activity")) return "Activity";
    return ""; // Empty for root Overview
  }, [location.pathname]);

  if (!project || !detail) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <ProjectNotFound />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto px-1 sm:px-4 pb-12 font-sans animate-fade-in">
      
      {/* 1. Accessible Breadcrumbs */}
      <ProjectBreadcrumbs
        projectName={project.name}
        projectId={project.id}
        currentTabLabel={currentTabLabel}
      />

      {/* 2. Frozen/Archived Notice Banner */}
      {project.isArchived && (
        <ArchivedProjectNotice projectName={project.name} />
      )}

      {/* 3. Core Workspace Header */}
      <ProjectWorkspaceHeader project={project} />

      {/* 4. Horizontal Tabbed Navigation Row */}
      <ProjectNavigation projectId={project.id} />

      {/* 5. Active Sub-route Layout Outlet */}
      <main id="project-workspace-content-pane" className="mt-2">
        <Outlet context={{ project, detail }} />
      </main>

    </div>
  );
}
export type WorkspaceOutletContext = {
  project: typeof MOCK_PROJECTS_DIRECTORY[0];
  detail: ReturnType<typeof getWorkspaceDetail>;
};
