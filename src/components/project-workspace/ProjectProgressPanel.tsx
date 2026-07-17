import React from "react";
import { Layers, Calendar } from "lucide-react";
import { Progress } from "../ui/Progress";
import { Project } from "../../types";
import { ProjectWorkspaceDetail } from "../../types/project-workspace";

interface ProjectProgressPanelProps {
  project: Project;
  detail: ProjectWorkspaceDetail;
}

export default function ProjectProgressPanel({ project, detail }: ProjectProgressPanelProps) {
  // Determine color theme for the progress indicators
  let variant: "accent" | "success" | "warning" | "danger" = "accent";
  if (project.health === "On track" || project.health === "Stable" || project.progress === 100) {
    variant = "success";
  } else if (project.health === "Needs attention") {
    variant = "warning";
  } else if (project.health === "Blocked") {
    variant = "danger";
  }

  const daysRemaining = () => {
    if (!project.targetDate) return null;
    const target = new Date(project.targetDate).getTime();
    const now = new Date().getTime();
    const diff = target - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysLeft = daysRemaining();

  return (
    <div id="project-progress-panel" className="bg-bg-primary border border-border-subtle rounded-xl p-5 flex flex-col gap-4 font-sans">
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-accent-primary" />
        <h3 className="text-sm font-semibold text-text-primary tracking-tight">Progress & Active Phase</h3>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-text-secondary">Project Completion</span>
          <span className="text-text-primary font-mono font-bold text-sm">{project.progress}%</span>
        </div>
        <Progress value={project.progress} size="md" variant={variant} />
      </div>

      <div className="flex flex-col gap-1.5 bg-muted-surface border border-border-subtle p-3 rounded-lg mt-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">Active Phase</span>
          {project.currentPhase && (
            <span className="text-[9px] font-semibold font-mono text-accent-primary bg-accent-soft px-1.5 py-0.5 rounded border border-accent-primary/15">
              ACTIVE
            </span>
          )}
        </div>
        <h4 className="text-xs font-semibold text-text-primary">
          {project.currentPhase || "Inception / Scoping"}
        </h4>
        <p className="text-[11px] text-text-secondary leading-normal">
          {detail.currentPhaseSummary}
        </p>
      </div>

      {daysLeft !== null && !project.isArchived && (
        <div className="flex items-center gap-2 text-[11px] text-text-tertiary border-t border-border-subtle pt-3 mt-1">
          <Calendar className="w-3.5 h-3.5" />
          {daysLeft > 0 ? (
            <span>
              Approximately <strong className="text-text-secondary">{daysLeft} days</strong> remaining until target delivery date.
            </span>
          ) : daysLeft === 0 ? (
            <span>
              Target delivery date is <strong className="text-status-warning">today</strong>.
            </span>
          ) : (
            <span>
              Target delivery date was <strong className="text-text-secondary">{Math.abs(daysLeft)} days ago</strong>.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
