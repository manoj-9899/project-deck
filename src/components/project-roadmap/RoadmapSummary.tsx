import React from "react";
import { 
  Activity, 
  CheckCircle2, 
  Milestone, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { Project } from "../../types";

interface RoadmapSummaryProps {
  project: Project;
  summary: {
    totalPhases: number;
    completedPhases: number;
    currentPhase: any;
    blockedPhases: number;
    overallProgress: number;
    nextPlannedPhase: any;
  };
}

export const RoadmapSummary: React.FC<RoadmapSummaryProps> = ({
  project,
  summary
}) => {
  return (
    <div 
      id="roadmap-summary-panel"
      className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-bg-primary border border-border-subtle rounded-xl font-sans"
    >
      {/* 1. Overall Progress Comparison */}
      <div className="col-span-2 flex flex-col justify-between p-3.5 bg-muted-surface border border-border-subtle rounded-xl gap-2">
        <div className="flex items-center gap-1.5 text-text-secondary font-semibold text-xs">
          <TrendingUp className="w-4 h-4 text-accent-primary" />
          <span>Calculated Progress Specs</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-text-tertiary font-mono uppercase tracking-wider">ROADMAP PROGRESS</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-text-primary tracking-tight font-mono">{summary.overallProgress}%</span>
              <span className="text-[10px] text-text-tertiary">Calculated</span>
            </div>
            <div className="w-full h-1 bg-border-subtle rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-accent-primary rounded-full" 
                style={{ width: `${summary.overallProgress}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 border-l border-border-subtle pl-4">
            <span className="text-[10px] text-text-tertiary font-mono uppercase tracking-wider">PROJECT PROGRESS</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-text-secondary tracking-tight font-mono">{project.progress}%</span>
              <span className="text-[10px] text-text-tertiary">Core Spec</span>
            </div>
            <div className="w-full h-1 bg-border-subtle rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full bg-text-tertiary rounded-full" 
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Phase Counts */}
      <div className="flex flex-col justify-between p-3 bg-bg-primary border border-border-subtle rounded-xl gap-1.5">
        <span className="text-[10px] text-text-tertiary font-mono uppercase tracking-wider">PHASE DISTRIBUTION</span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-text-primary font-mono tracking-tight">{summary.totalPhases}</span>
          <span className="text-xs text-text-tertiary">Total</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-status-success font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
          <span>{summary.completedPhases} Completed</span>
        </div>
      </div>

      {/* 3. Current Phase */}
      <div className="flex flex-col justify-between p-3 bg-bg-primary border border-border-subtle rounded-xl gap-1.5">
        <span className="text-[10px] text-text-tertiary font-mono uppercase tracking-wider">ACTIVE EFFORT</span>
        <div className="flex items-center gap-1.5 min-w-0">
          <Activity className="w-4 h-4 text-accent-primary shrink-0 animate-pulse" />
          <span className="text-xs font-semibold text-text-primary truncate" title={summary.currentPhase?.title || "None"}>
            {summary.currentPhase ? summary.currentPhase.title.replace(/^Phase \d+(\.\d+)? — /, "") : "None Active"}
          </span>
        </div>
        {summary.blockedPhases > 0 ? (
          <div className="flex items-center gap-1 text-[11px] text-status-danger font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{summary.blockedPhases} Blocked Phase{summary.blockedPhases > 1 ? 's' : ''}</span>
          </div>
        ) : (
          <span className="text-[10px] text-text-tertiary leading-tight">No active blockages.</span>
        )}
      </div>

      {/* 4. Next Planned Phase */}
      <div className="flex flex-col justify-between p-3 bg-bg-primary border border-border-subtle rounded-xl gap-1.5">
        <span className="text-[10px] text-text-tertiary font-mono uppercase tracking-wider">NEXT UPWARD</span>
        <div className="flex items-center gap-1.5 min-w-0">
          <Milestone className="w-4 h-4 text-text-tertiary shrink-0" />
          <span className="text-xs font-semibold text-text-secondary truncate" title={summary.nextPlannedPhase?.title || "None Planned"}>
            {summary.nextPlannedPhase ? summary.nextPlannedPhase.title.replace(/^Phase \d+(\.\d+)? — /, "") : "No Pending Phases"}
          </span>
        </div>
        {summary.nextPlannedPhase ? (
          <div className="flex items-center gap-1 text-[11px] text-accent-primary font-semibold">
            <span>Ready for queue</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        ) : (
          <span className="text-[10px] text-text-tertiary leading-tight">All phases launched.</span>
        )}
      </div>
    </div>
  );
};
