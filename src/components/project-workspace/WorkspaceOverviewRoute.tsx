import React from "react";
import { useOutletContext } from "react-router-dom";
import ProjectOverviewPage from "./ProjectOverviewPage";
import { WorkspaceOutletContext } from "./ProjectWorkspaceLayout";

export default function WorkspaceOverviewRoute() {
  const { project, detail } = useOutletContext<WorkspaceOutletContext>();
  return <ProjectOverviewPage project={project} detail={detail} />;
}
