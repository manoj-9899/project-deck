/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./components/ui/Toast";
import { GlobalSearchProvider } from "./components/global-search/GlobalSearchProvider";
import { Viewport } from "./components/layout/LayoutPrimitives";
import HomePage from "./components/home/HomePage";
import ProjectsPage from "./components/projects/ProjectsPage";
import ProjectWorkspaceLayout from "./components/project-workspace/ProjectWorkspaceLayout";
import WorkspaceOverviewRoute from "./components/project-workspace/WorkspaceOverviewRoute";
import WorkspacePlaceholderRoute from "./components/project-workspace/WorkspacePlaceholderRoute";
import ProjectRoadmapPage from "./components/project-roadmap/ProjectRoadmapPage";
import ProjectTasksPage from "./components/project-tasks/ProjectTasksPage";
import ProjectKnowledgePage from "./components/project-knowledge/ProjectKnowledgePage";
import ProjectPromptsPage from "./components/project-prompts/ProjectPromptsPage";
import ProjectResourcesPage from "./components/project-resources/ProjectResourcesPage";
import DesignSystemPage from "./components/design-system/DesignSystemPage";
import AppShell from "./components/app-shell/AppShell";
import RoutePlaceholder from "./components/app-shell/RoutePlaceholder";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <GlobalSearchProvider>
          <Viewport>
            <Routes>
            {/* Main Application Shell routes */}
            <Route element={<AppShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              
              <Route path="/projects/:projectId" element={<ProjectWorkspaceLayout />}>
                <Route index element={<WorkspaceOverviewRoute />} />
                <Route path="tasks" element={<ProjectTasksPage />} />
                <Route path="roadmap" element={<ProjectRoadmapPage />} />
                <Route path="knowledge" element={<ProjectKnowledgePage />} />
                <Route path="prompts" element={<ProjectPromptsPage />} />
                <Route path="resources" element={<ProjectResourcesPage />} />
                <Route path="activity" element={<WorkspacePlaceholderRoute section="activity" />} />
              </Route>

              <Route path="/tasks" element={<RoutePlaceholder type="tasks" />} />
              <Route path="/prompts" element={<RoutePlaceholder type="prompts" />} />
              <Route path="/knowledge" element={<RoutePlaceholder type="knowledge" />} />
              <Route path="/settings" element={<RoutePlaceholder type="settings" />} />
              {/* Fallback routes within the shell */}
              <Route path="*" element={<RoutePlaceholder type="not-found" />} />
            </Route>

            {/* Standalone design system showcase */}
            <Route path="/design-system" element={<DesignSystemPage />} />
          </Routes>
        </Viewport>
      </GlobalSearchProvider>
    </ToastProvider>
  </BrowserRouter>
  );
}

