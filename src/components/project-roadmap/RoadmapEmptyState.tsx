import React from "react";
import { Milestone, Plus, CheckSquare } from "lucide-react";
import { Button } from "../ui/Button";

interface RoadmapEmptyStateProps {
  type: "roadmap" | "milestones" | "criteria";
  onAddClick?: () => void;
  isReadOnly?: boolean;
}

export const RoadmapEmptyState: React.FC<RoadmapEmptyStateProps> = ({
  type,
  onAddClick,
  isReadOnly = false
}) => {
  if (type === "roadmap") {
    return (
      <div 
        id="empty-roadmap-state" 
        className="flex flex-col items-center justify-center text-center p-12 bg-bg-primary border border-border-subtle rounded-2xl gap-4"
      >
        <div className="p-3 bg-muted-surface border border-border-subtle rounded-full text-text-tertiary">
          <Milestone className="w-8 h-8" />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <h3 className="text-sm font-semibold text-text-primary">No roadmap has been created</h3>
          <p className="text-xs text-text-tertiary">
            Start planning project deliveries by adding sequential engineering phases, tracking target timelines, and registering dependencies.
          </p>
        </div>
        {!isReadOnly && onAddClick && (
          <Button 
            id="empty-roadmap-add-btn"
            variant="primary" 
            size="sm" 
            onClick={onAddClick}
            className="flex items-center gap-1.5 mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Phase</span>
          </Button>
        )}
      </div>
    );
  }

  if (type === "milestones") {
    return (
      <div 
        id="empty-milestones-state"
        className="flex flex-col items-center justify-center text-center py-8 px-4 bg-muted-surface/50 border border-dashed border-border-subtle rounded-xl gap-2"
      >
        <p className="text-xs font-medium text-text-secondary">No milestones in this phase</p>
        <p className="text-[11px] text-text-tertiary max-w-xs leading-normal">
          Milestones represent phase-level delivery outcomes. Detailed tasks will be introduced separately.
        </p>
        {!isReadOnly && onAddClick && (
          <button 
            id="empty-milestones-add-btn"
            onClick={onAddClick}
            className="text-[11px] font-semibold text-accent-primary hover:underline flex items-center gap-1 mt-1 focus:outline-none"
          >
            <Plus className="w-3 h-3" />
            <span>Add Milestone</span>
          </button>
        )}
      </div>
    );
  }

  // Criteria
  return (
    <div 
      id="empty-criteria-state"
      className="flex flex-col items-center justify-center text-center py-6 px-4 bg-muted-surface/50 border border-dashed border-border-subtle rounded-xl gap-1.5"
    >
      <p className="text-xs font-medium text-text-secondary">No completion criteria defined</p>
      <p className="text-[11px] text-text-tertiary max-w-xs leading-normal">
        Define target checklist criteria that must be satisfied before completing this phase.
      </p>
      {!isReadOnly && onAddClick && (
        <button 
          id="empty-criteria-add-btn"
          onClick={onAddClick}
          className="text-[11px] font-semibold text-accent-primary hover:underline flex items-center gap-1 mt-1 focus:outline-none"
        >
          <Plus className="w-3 h-3" />
          <span>Add Criterion</span>
        </button>
      )}
    </div>
  );
};
