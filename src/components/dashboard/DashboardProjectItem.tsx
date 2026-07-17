import React from "react";
import { Badge } from "../ui/Badge";
import { Progress } from "../ui/Progress";
import { Link } from "react-router-dom";
import { FolderGit2, ChevronRight, Clock, AlertCircle } from "lucide-react";
import { Project } from "../../types";

interface DashboardProjectItemProps {
  project: Project;
  key?: React.Key;
}

export default function DashboardProjectItem({ project }: DashboardProjectItemProps) {
  // Map health to Badge variant
  const healthVariants = {
    "On track": "success",
    "Needs attention": "warning",
    "Blocked": "danger",
    "Stable": "success",
    "Inactive": "neutral",
  } as const;

  const priorityVariants = {
    Critical: "danger",
    High: "warning",
    Medium: "neutral",
    Low: "neutral",
  } as const;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border-subtle hover:border-accent-primary bg-surface hover:bg-accent-soft/5 rounded-lg transition-all duration-200 cursor-pointer font-sans"
    >
      {/* Name and Metadata */}
      <div className="flex items-start gap-3.5 min-w-0 md:flex-1">
        <div className="p-2.5 bg-muted-surface group-hover:bg-accent-soft border border-border-subtle group-hover:border-accent-primary/20 text-text-secondary group-hover:text-accent-primary rounded-lg shrink-0 mt-0.5 transition-colors">
          <FolderGit2 className="w-4 h-4" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors truncate">
              {project.name}
            </h4>
            <span className="text-[10px] font-mono text-text-tertiary">
              /
            </span>
            <span className="text-[10px] font-mono text-text-secondary bg-muted-surface/50 px-1.5 py-0.2 rounded">
              {project.category}
            </span>
            {project.priority === "Critical" && (
              <Badge variant="danger" className="text-[8px] font-mono font-bold px-1 py-0 uppercase">
                CRITICAL
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <span className="text-text-tertiary truncate max-w-[280px] md:max-w-[340px]">
              <span className="font-mono text-[10px] text-text-tertiary uppercase mr-1">Phase:</span>
              {project.currentPhase || "Planning"}
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Status Indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-4 shrink-0 w-full md:w-auto md:gap-8">
        {/* Progress bar */}
        <div className="flex flex-col gap-1 w-full sm:w-36 shrink-0">
          <div className="flex items-center justify-between text-[10px] font-mono text-text-secondary">
            <span>Progress</span>
            <span className="font-bold">{project.progress}%</span>
          </div>
          <Progress value={project.progress} variant={project.status === "Paused" ? "warning" : "accent"} size="sm" />
        </div>

        {/* Health, Priority, & Status details */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <Badge variant={healthVariants[project.health] || "neutral"} className="font-mono text-[9px] uppercase px-1.5 py-0.5">
            {project.health}
          </Badge>

          <span className="text-[10px] font-mono text-text-tertiary flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {project.updatedAt || project.lastUpdated}
          </span>

          <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-1 hidden sm:block" />
        </div>
      </div>
    </Link>
  );
}
