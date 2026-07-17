import React from "react";
import { NavLink } from "react-router-dom";
import {
  Layers,
  CheckSquare,
  Milestone,
  BookOpen,
  Terminal,
  Link2,
  Activity
} from "lucide-react";

interface ProjectNavigationProps {
  projectId: string;
}

export default function ProjectNavigation({ projectId }: ProjectNavigationProps) {
  const tabs = [
    {
      label: "Overview",
      path: `/projects/${projectId}`,
      end: true,
      icon: <Layers className="w-4 h-4" />
    },
    {
      label: "Tasks",
      path: `/projects/${projectId}/tasks`,
      end: false,
      icon: <CheckSquare className="w-4 h-4" />
    },
    {
      label: "Roadmap",
      path: `/projects/${projectId}/roadmap`,
      end: false,
      icon: <Milestone className="w-4 h-4" />
    },
    {
      label: "Knowledge",
      path: `/projects/${projectId}/knowledge`,
      end: false,
      icon: <BookOpen className="w-4 h-4" />
    },
    {
      label: "Prompts",
      path: `/projects/${projectId}/prompts`,
      end: false,
      icon: <Terminal className="w-4 h-4" />
    },
    {
      label: "Resources",
      path: `/projects/${projectId}/resources`,
      end: false,
      icon: <Link2 className="w-4 h-4" />
    },
    {
      label: "Activity",
      path: `/projects/${projectId}/activity`,
      end: false,
      icon: <Activity className="w-4 h-4" />
    }
  ];

  return (
    <nav
      aria-label="Project Sections"
      id="project-navigation"
      className="border-b border-border-subtle bg-bg-primary overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
    >
      <div className="flex gap-1 min-w-max pb-[1px]" id="project-navigation-container">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.path}
            end={tab.end}
            id={`project-tab-${tab.label.toLowerCase()}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-3 text-xs font-sans font-medium border-b-2 transition-all duration-150 focus:outline-none focus:bg-muted-surface ${
                isActive
                  ? "border-text-primary text-text-primary"
                  : "border-transparent text-text-tertiary hover:text-text-secondary hover:border-border-strong"
              }`
            }
          >
            {tab.icon}
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
