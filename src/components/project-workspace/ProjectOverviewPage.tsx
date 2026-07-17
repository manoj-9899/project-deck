import React from "react";
import { Project } from "../../types";
import { ProjectWorkspaceDetail } from "../../types/project-workspace";
import ProjectBrief from "./ProjectBrief";
import ProjectProgressPanel from "./ProjectProgressPanel";
import ProjectNextActions from "./ProjectNextActions";
import ProjectHealthPanel from "./ProjectHealthPanel";
import ProjectLinks from "./ProjectLinks";
import ProjectTechStack from "./ProjectTechStack";
import ProjectActivityPreview from "./ProjectActivityPreview";
import ProjectUpcomingWork from "./ProjectUpcomingWork";
import ProjectFacts from "./ProjectFacts";
import { TrendingUp, Activity, Box } from "lucide-react";

interface ProjectOverviewPageProps {
  project: Project;
  detail: ProjectWorkspaceDetail;
}

export default function ProjectOverviewPage({ project, detail }: ProjectOverviewPageProps) {
  const metrics = detail.featuredMetrics || [];

  return (
    <div id="project-overview-tab-content" className="flex flex-col gap-6 animate-fade-in">
      
      {/* Featured Metrics Row (Only shown if configured for premium projects) */}
      {metrics.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="project-featured-metrics">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-bg-primary border border-border-subtle rounded-xl p-4 flex flex-col gap-1 shadow-2xs font-sans"
              id={`featured-metric-${idx}`}
            >
              <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider font-mono">
                {metric.label}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-text-primary tracking-tight font-sans">
                  {metric.value}
                </span>
                {metric.change && (
                  <span className={`text-[10px] font-medium font-mono ${
                    metric.trend === "up" ? "text-status-success" : "text-text-tertiary"
                  }`}>
                    {metric.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Two-Column Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Primary Column: Technical Actions & Brief */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          <ProjectBrief project={project} detail={detail} />
          <ProjectNextActions project={project} />
          <ProjectUpcomingWork project={project} detail={detail} />
          <ProjectActivityPreview project={project} detail={detail} />
        </div>

        {/* Right Supporting Column: Diagnostics, Tech & Links */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          <ProjectProgressPanel project={project} detail={detail} />
          <ProjectHealthPanel project={project} />
          <ProjectLinks project={project} detail={detail} />
          <ProjectTechStack project={project} />
          <ProjectFacts project={project} />
        </div>

      </div>

    </div>
  );
}
