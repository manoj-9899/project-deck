import React from "react";
import PageHeader from "../app-shell/PageHeader";
import { useToast } from "../ui/Toast";
import { Plus, ListPlus, Sparkles } from "lucide-react";

import CurrentFocus from "./CurrentFocus";
import WorkspaceSummary from "./WorkspaceSummary";
import ActiveProjects from "./ActiveProjects";
import UpcomingTasks from "./UpcomingTasks";
import NeedsAttention from "./NeedsAttention";
import RecentActivity from "./RecentActivity";
import ProjectStatusDistribution from "./ProjectStatusDistribution";

import {
  MOCK_PROJECTS,
  MOCK_TASKS,
  MOCK_ACTIVITIES,
  MOCK_ATTENTION_ITEMS,
  MOCK_METRICS,
} from "../../data/dashboard";

export default function DashboardPage() {
  const { toast } = useToast();

  const handleCreateProject = () => {
    toast({
      type: "info",
      title: "Projects Directory Module",
      message: "Project creation will be introduced with the projects directory.",
      duration: 4000,
    });
  };

  const handleAddTask = () => {
    toast({
      type: "info",
      title: "Task Planner Module",
      message: "Task creation will be introduced with task management.",
      duration: 4000,
    });
  };

  // Extract current focus project
  const currentFocusProject = MOCK_PROJECTS.find((p) => p.id === "projectdock") || MOCK_PROJECTS[0];

  // Derive active projects list (exclude 'deployed' projects for density, or just render top 4 active)
  // The product spec says: "active-projects section showing approximately four projects: ProjectDock, DevHabits, LaunchKaro, RepoPilot"
  const activeIds = ["projectdock", "devhabits", "launchkaro", "repopilot"];
  const activeProjectsList = MOCK_PROJECTS.filter((p) => activeIds.includes(p.id));

  // Determine current day of the week dynamic string
  const currentDayName = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const eyebrowText = `${currentDayName} workspace`;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto animate-fade-in font-sans pb-12">
      {/* Dynamic Workspace Header */}
      <PageHeader
        title="Overview"
        eyebrow={eyebrowText}
        description="See what is moving, what needs attention, and what to work on next."
        primaryAction={{
          label: "New project",
          onClick: handleCreateProject,
          icon: <Plus className="w-4 h-4" />,
          variant: "primary",
        }}
        secondaryAction={{
          label: "Add task",
          onClick: handleAddTask,
          icon: <ListPlus className="w-4 h-4" />,
          variant: "secondary",
        }}
      />

      {/* Focus Area */}
      <CurrentFocus project={currentFocusProject} />

      {/* Metrics Indicators Row */}
      <WorkspaceSummary metrics={MOCK_METRICS} />

      {/* Double Column Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-1">
        {/* Main Content Column (Left) */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          <ActiveProjects projects={activeProjectsList} />
          <UpcomingTasks tasks={MOCK_TASKS} />
        </div>

        {/* Sidebar Supporting Column (Right) */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          <NeedsAttention items={MOCK_ATTENTION_ITEMS} />
          <ProjectStatusDistribution projects={MOCK_PROJECTS} />
          <RecentActivity activities={MOCK_ACTIVITIES} />
        </div>
      </div>
    </div>
  );
}
