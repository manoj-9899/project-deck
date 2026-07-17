import React from "react";
import { Link } from "react-router-dom";
import { Play, ArrowRight, CheckCircle2, FileText, PauseCircle, Star, GitCommit } from "lucide-react";
import { Project } from "../../types";
import { ProjectWorkspaceDetail } from "../../types/project-workspace";

interface ProjectActivityPreviewProps {
  project: Project;
  detail: ProjectWorkspaceDetail;
}

export default function ProjectActivityPreview({ project, detail }: ProjectActivityPreviewProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "phase_started":
        return <Play className="w-3.5 h-3.5 text-accent-primary" />;
      case "shell_completed":
        return <GitCommit className="w-3.5 h-3.5 text-status-success" />;
      case "test_passed":
        return <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />;
      case "doc_updated":
        return <FileText className="w-3.5 h-3.5 text-status-info" />;
      case "deployed":
        return <CheckCircle2 className="w-3.5 h-3.5 text-status-success" />;
      case "paused":
        return <PauseCircle className="w-3.5 h-3.5 text-status-warning" />;
      default:
        return <GitCommit className="w-3.5 h-3.5 text-text-tertiary" />;
    }
  };

  const activities = detail.recentActivity || [];

  return (
    <div id="project-activity-preview" className="bg-bg-primary border border-border-subtle rounded-xl p-5 flex flex-col gap-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-accent-primary" />
          <h3 className="text-sm font-semibold text-text-primary tracking-tight">Recent Activity Feed</h3>
        </div>
        
        <Link
          to={`/projects/${project.id}/activity`}
          className="flex items-center gap-1 text-xs text-accent-primary hover:text-accent-primary/80 font-medium transition-all focus:outline-none"
          id="view-all-activity-link"
        >
          <span>View all</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-6 text-xs text-text-tertiary">
          No recent activity logs recorded for this workspace.
        </div>
      ) : (
        <div className="relative pl-3.5 border-l border-border-subtle flex flex-col gap-5 mt-1" id="activity-preview-timeline">
          {activities.map((act, index) => (
            <div key={act.id || index} className="relative flex flex-col gap-1 text-xs" id={`activity-log-${index}`}>
              {/* Chronological Dot Indicator */}
              <span className="absolute -left-[21.5px] top-1 flex items-center justify-center w-4 h-4 rounded-full bg-bg-primary border border-border-subtle">
                {getActivityIcon(act.type)}
              </span>

              <div className="flex items-start justify-between gap-4">
                <span className="font-medium text-text-primary leading-normal">
                  {act.description}
                </span>
                <span className="text-[10px] font-mono text-text-tertiary shrink-0 mt-0.5 whitespace-nowrap">
                  {act.timeContext}
                </span>
              </div>
              
              {act.phase && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-tertiary mt-0.5">
                  <span className="text-text-tertiary font-bold">&bull;</span>
                  <span>Phase Context:</span>
                  <span className="text-text-secondary font-medium">{act.phase}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
