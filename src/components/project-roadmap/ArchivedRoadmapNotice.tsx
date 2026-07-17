import React from "react";
import { ShieldCheck, Info } from "lucide-react";

interface ArchivedRoadmapNoticeProps {
  isArchived: boolean;
  isPaused: boolean;
  projectName: string;
}

export const ArchivedRoadmapNotice: React.FC<ArchivedRoadmapNoticeProps> = ({
  isArchived,
  isPaused,
  projectName
}) => {
  if (isArchived) {
    return (
      <div 
        id="archived-roadmap-notice" 
        className="flex items-start gap-3 p-4 bg-status-danger/10 border border-status-danger/20 rounded-xl"
      >
        <ShieldCheck className="w-5 h-5 text-status-danger shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-semibold text-text-primary">
            Frozen Roadmap Workspace
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            <strong>{projectName}</strong> is archived. All phases, milestones, dependencies, and completion criteria are locked in a read-only state. Adding, editing, duplicating, or reordering has been disabled.
          </p>
        </div>
      </div>
    );
  }

  if (isPaused) {
    return (
      <div 
        id="paused-roadmap-notice" 
        className="flex items-start gap-3 p-4 bg-status-warning/10 border border-status-warning/20 rounded-xl animate-fade-in"
      >
        <Info className="w-5 h-5 text-status-warning shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h4 className="text-sm font-semibold text-text-primary">
            Development Paused
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed">
            This project is paused. Roadmap planning is available, but changes do not resume the project automatically.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
