import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Folder } from "lucide-react";

interface ProjectBreadcrumbsProps {
  projectName: string;
  projectId: string;
  currentTabLabel?: string;
}

export default function ProjectBreadcrumbs({
  projectName,
  projectId,
  currentTabLabel
}: ProjectBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" id="project-breadcrumbs" className="font-sans py-1.5 text-xs text-text-tertiary">
      <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2 leading-none">
        <li className="flex items-center">
          <Link
            to="/projects"
            className="flex items-center gap-1.5 hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-border-strong rounded px-1 py-0.5"
            id="breadcrumb-projects-link"
          >
            <Folder className="w-3.5 h-3.5" />
            <span>Projects</span>
          </Link>
        </li>
        
        <li className="flex items-center text-border-strong" aria-hidden="true">
          <ChevronRight className="w-3 h-3" />
        </li>

        <li className="flex items-center">
          <Link
            to={`/projects/${projectId}`}
            className={`hover:text-text-primary transition-colors focus:outline-none focus:ring-1 focus:ring-border-strong rounded px-1 py-0.5 font-medium ${
              !currentTabLabel ? "text-text-primary pointer-events-none" : ""
            }`}
            id={`breadcrumb-project-${projectId}-link`}
          >
            {projectName}
          </Link>
        </li>

        {currentTabLabel && (
          <>
            <li className="flex items-center text-border-strong" aria-hidden="true">
              <ChevronRight className="w-3 h-3" />
            </li>
            <li className="flex items-center text-text-primary font-medium px-1 py-0.5" aria-current="page" id="breadcrumb-current-tab">
              {currentTabLabel}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
