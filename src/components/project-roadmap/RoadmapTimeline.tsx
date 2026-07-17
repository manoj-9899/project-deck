import React from "react";
import { ProjectPhase } from "../../types/project-roadmap";
import { Badge } from "../ui/Badge";
import { 
  Calendar, 
  Link2, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight
} from "lucide-react";

interface RoadmapTimelineProps {
  phases: ProjectPhase[];
  onSelectPhase: (phaseId: string) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  phases,
  onSelectPhase
}) => {
  // Map phase status to color variants
  const getStatusVariant = (status: string): "success" | "warning" | "info" | "neutral" | "danger" => {
    if (status === "Completed") return "success";
    if (status === "In progress") return "info";
    if (status === "Blocked") return "danger";
    if (status === "Paused") return "warning";
    if (status === "Skipped" || status === "Planned") return "neutral";
    return "neutral";
  };

  return (
    <div id="roadmap-timeline-container" className="flex flex-col gap-6 py-4 px-2 font-sans">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-text-primary">Chronological Timeline View</h3>
        <p className="text-xs text-text-tertiary">
          A sequential view of project deliveries. Click any phase node to open and manage it inside the Phase List.
        </p>
      </div>

      <div className="relative border-l-2 border-border-subtle ml-3 pl-6 flex flex-col gap-8">
        {phases.map((phase) => {
          const statusVariant = getStatusVariant(phase.status);
          const hasDependencies = phase.dependencies.length > 0;

          // Determine node styling based on status
          const getNodeStyles = () => {
            if (phase.status === "Completed") {
              return "bg-status-success text-white ring-4 ring-status-success/15";
            }
            if (phase.isCurrent) {
              return "bg-accent-primary text-white ring-4 ring-accent-primary/20 animate-pulse";
            }
            if (phase.status === "Blocked") {
              return "bg-status-danger text-white ring-4 ring-status-danger/15";
            }
            if (phase.status === "Paused") {
              return "bg-status-warning text-white ring-4 ring-status-warning/15";
            }
            return "bg-bg-primary text-text-tertiary border-2 border-border-subtle ring-4 ring-muted-surface";
          };

          return (
            <div 
              key={phase.id} 
              id={`timeline-node-${phase.id}`}
              className="relative group flex flex-col gap-2.5 animate-fade-in"
            >
              {/* Timeline dot node */}
              <div 
                className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all ${getNodeStyles()}`}
              >
                {phase.status === "Completed" ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : phase.isCurrent ? (
                  <Activity className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-[10px] font-mono font-bold">{phase.order}</span>
                )}
              </div>

              {/* Card Container */}
              <div 
                onClick={() => onSelectPhase(phase.id)}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-bg-primary border border-border-subtle hover:border-border-strong rounded-xl cursor-pointer transition-all hover:bg-muted-surface/30"
              >
                <div className="flex flex-col gap-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-xs font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                      {phase.title}
                    </h4>
                    {phase.isCurrent && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-[9px] font-semibold text-accent-primary uppercase font-mono">
                        Current Focus
                      </span>
                    )}
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-text-secondary leading-relaxed truncate max-w-xl">
                    {phase.description}
                  </p>

                  {/* Metadata labels */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-text-tertiary font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
                      <span>
                        {phase.startDate || "TBD"} &rarr; {phase.targetDate || "TBD"}
                      </span>
                    </span>

                    {hasDependencies && (
                      <span className="flex items-center gap-1 border-l border-border-subtle pl-3">
                        <Link2 className="w-3.5 h-3.5 text-text-tertiary" />
                        <span>{phase.dependencies.length} Prerequisite{phase.dependencies.length > 1 ? 's' : ''}</span>
                      </span>
                    )}

                    <span className="flex items-center gap-1 border-l border-border-subtle pl-3">
                      <Clock className="w-3.5 h-3.5 text-text-tertiary" />
                      <span>{phase.milestones.length} Milestones</span>
                    </span>
                  </div>
                </div>

                {/* Right Side Info: status badge & progress bar */}
                <div className="flex items-center gap-4 shrink-0 border-t border-border-subtle md:border-0 pt-3 md:pt-0">
                  <div className="flex flex-col items-start md:items-end gap-1.5">
                    <Badge variant={statusVariant} size="sm">
                      {phase.status}
                    </Badge>
                    
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-secondary">
                      <span>{phase.progress}% Done</span>
                    </div>
                  </div>
                  
                  <div className="p-1 text-text-tertiary group-hover:text-accent-primary rounded-lg transition-colors hidden sm:block">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
