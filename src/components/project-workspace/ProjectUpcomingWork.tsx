import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Milestone, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Project, Priority } from "../../types";
import { ProjectWorkspaceDetail } from "../../types/project-workspace";

interface ProjectUpcomingWorkProps {
  project: Project;
  detail: ProjectWorkspaceDetail;
}

export default function ProjectUpcomingWork({ project, detail }: ProjectUpcomingWorkProps) {
  const navigate = useNavigate();
  const upcomingItems = detail.upcomingWork || [];

  // Map priorities to badge variants
  const priorityVariants: Record<Priority, "danger" | "warning" | "info" | "neutral"> = {
    Critical: "danger",
    High: "warning",
    Medium: "info",
    Low: "neutral"
  };

  return (
    <div id="project-upcoming-work" className="bg-bg-primary border border-border-subtle rounded-xl p-5 flex flex-col gap-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Milestone className="w-4 h-4 text-accent-primary" />
          <h3 className="text-sm font-semibold text-text-primary tracking-tight">Upcoming Work & Roadmap</h3>
        </div>
        
        <Link
          to={`/projects/${project.id}/roadmap`}
          className="flex items-center gap-1 text-xs text-accent-primary hover:text-accent-primary/80 font-medium transition-all focus:outline-none"
          id="view-full-roadmap-link"
        >
          <span>Full roadmap</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {upcomingItems.length === 0 ? (
        <div className="text-center py-6 text-xs text-text-tertiary">
          No upcoming work items currently registered.
        </div>
      ) : (
        <div className="flex flex-col gap-3" id="upcoming-work-list">
          {upcomingItems.map((item, idx) => (
            <div
              key={item.id || idx}
              onClick={() => navigate(`/projects/${project.id}/roadmap`)}
              className="group flex items-start justify-between gap-4 p-3 bg-muted-surface hover:bg-muted-surface/70 border border-border-subtle hover:border-border-strong rounded-lg cursor-pointer transition-all"
              id={`upcoming-item-${idx}`}
              title="Click to view full roadmap"
            >
              <div className="flex flex-col gap-1.5 min-w-0">
                <h4 className="text-xs font-semibold text-text-primary leading-tight truncate group-hover:text-accent-primary transition-colors">
                  {item.title}
                </h4>
                
                <div className="flex items-center flex-wrap gap-2 text-[10px] text-text-tertiary font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Target: {item.timeframe}</span>
                  </span>
                  <span>&bull;</span>
                  <span onClick={(e) => e.stopPropagation()}>
                    Tab: <Link to={`/projects/${project.id}/${item.section.toLowerCase()}`} className="text-accent-primary hover:underline">{item.section}</Link>
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <Badge variant={priorityVariants[item.priority]} className="text-[9px] px-1.5 py-0 leading-none font-semibold">
                  {item.priority}
                </Badge>
                <span className="text-[9px] font-mono font-semibold text-text-secondary bg-bg-primary border border-border-subtle/80 px-1.5 py-0.5 rounded shadow-2xs uppercase">
                  {item.statusLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
