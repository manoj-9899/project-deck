import React from "react";
import { CheckCircle, Info, Calendar } from "lucide-react";
import { Project } from "../../types";
import { ProjectWorkspaceDetail } from "../../types/project-workspace";

interface ProjectBriefProps {
  project: Project;
  detail: ProjectWorkspaceDetail;
}

export default function ProjectBrief({ project, detail }: ProjectBriefProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "Not scheduled";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div id="project-brief-panel" className="bg-bg-primary border border-border-subtle rounded-xl p-5 flex flex-col gap-4 font-sans">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-accent-primary" />
        <h3 className="text-sm font-semibold text-text-primary tracking-tight">Project Brief</h3>
      </div>

      {/* Core Objective */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider font-mono">Core Technical Objective</span>
        <p className="text-xs text-text-secondary leading-relaxed bg-muted-surface border border-border-subtle p-3 rounded-lg font-sans">
          {detail.objective}
        </p>
      </div>

      {/* Structured Completion Criteria (Checklist) */}
      {detail.completionCriteria && detail.completionCriteria.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider font-mono">Completion Criteria</span>
          <ul className="flex flex-col gap-2" id="completion-criteria-list">
            {detail.completionCriteria.map((criterion, idx) => (
              <li key={idx} className="flex gap-2.5 items-start text-xs text-text-secondary leading-normal">
                <CheckCircle className="w-3.5 h-3.5 text-status-success shrink-0 mt-0.5" />
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline Quick Specs */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border-subtle text-xs">
        <div className="flex items-center gap-2 text-text-secondary">
          <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-medium uppercase text-text-tertiary leading-none">Started</span>
            <span className="font-semibold text-text-primary mt-0.5">{formatDate(project.startDate)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono font-medium uppercase text-text-tertiary leading-none">Target Deadline</span>
            <span className="font-semibold text-text-primary mt-0.5">{formatDate(project.targetDate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
