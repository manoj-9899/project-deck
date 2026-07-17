import React from "react";
import { useOutletContext } from "react-router-dom";
import ProjectSectionPlaceholder from "./ProjectSectionPlaceholder";
import { WorkspaceOutletContext } from "./ProjectWorkspaceLayout";

interface WorkspacePlaceholderRouteProps {
  section: "tasks" | "roadmap" | "knowledge" | "prompts" | "resources" | "activity";
}

export default function WorkspacePlaceholderRoute({ section }: WorkspacePlaceholderRouteProps) {
  const { project } = useOutletContext<WorkspaceOutletContext>();
  return <ProjectSectionPlaceholder project={project} section={section} />;
}
