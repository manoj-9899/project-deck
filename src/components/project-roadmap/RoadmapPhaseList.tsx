import React from "react";
import { ProjectPhase, MilestoneStatus } from "../../types/project-roadmap";
import { RoadmapPhaseCard } from "./RoadmapPhaseCard";
import { RoadmapEmptyState } from "./RoadmapEmptyState";

interface RoadmapPhaseListProps {
  phases: ProjectPhase[];
  allPhases: ProjectPhase[];
  expandedPhases: Record<string, boolean>;
  onTogglePhaseExpand: (id: string) => void;
  isReadOnly: boolean;
  onEditPhase: (phase: ProjectPhase) => void;
  onDeletePhase: (id: string) => void;
  onMovePhaseUp: (id: string) => void;
  onMovePhaseDown: (id: string) => void;
  onDuplicatePhase: (id: string) => void;
  onSetPhaseCurrent: (id: string) => void;
  onMarkPhaseCompleted: (id: string) => void;
  onPausePhase: (id: string) => void;
  onSkipPhase: (id: string) => void;
  // Milestones
  onAddMilestone: (phaseId: string, data: any) => void;
  onEditMilestone: (phaseId: string, milestoneId: string, data: any) => void;
  onDeleteMilestone: (phaseId: string, milestoneId: string) => void;
  onReorderMilestone: (phaseId: string, milestoneId: string, direction: "up" | "down") => void;
  onMilestoneStatusChange: (phaseId: string, milestoneId: string, status: MilestoneStatus) => void;
  // Criteria
  onAddCriterion: (phaseId: string, label: string) => void;
  onEditCriterion: (phaseId: string, criterionId: string, label: string) => void;
  onToggleCriterion: (phaseId: string, criterionId: string) => void;
  onDeleteCriterion: (phaseId: string, criterionId: string) => void;
  onAddPhaseClick: () => void;
}

export const RoadmapPhaseList: React.FC<RoadmapPhaseListProps> = ({
  phases,
  allPhases,
  expandedPhases,
  onTogglePhaseExpand,
  isReadOnly,
  onEditPhase,
  onDeletePhase,
  onMovePhaseUp,
  onMovePhaseDown,
  onDuplicatePhase,
  onSetPhaseCurrent,
  onMarkPhaseCompleted,
  onPausePhase,
  onSkipPhase,
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onReorderMilestone,
  onMilestoneStatusChange,
  onAddCriterion,
  onEditCriterion,
  onToggleCriterion,
  onDeleteCriterion,
  onAddPhaseClick
}) => {
  if (phases.length === 0) {
    return (
      <RoadmapEmptyState 
        type="roadmap" 
        onAddClick={onAddPhaseClick} 
        isReadOnly={isReadOnly}
      />
    );
  }

  return (
    <div id="roadmap-phase-list-pane" className="flex flex-col gap-4 font-sans text-xs">
      {phases.map((phase, idx) => (
        <RoadmapPhaseCard
          key={phase.id}
          phase={phase}
          allPhases={allPhases}
          isExpanded={!!expandedPhases[phase.id]}
          onToggleExpand={() => onTogglePhaseExpand(phase.id)}
          onEdit={() => onEditPhase(phase)}
          onDelete={() => onDeletePhase(phase.id)}
          onMoveUp={() => onMovePhaseUp(phase.id)}
          onMoveDown={() => onMovePhaseDown(phase.id)}
          onDuplicate={() => onDuplicatePhase(phase.id)}
          onSetCurrent={() => onSetPhaseCurrent(phase.id)}
          onMarkCompleted={() => onMarkPhaseCompleted(phase.id)}
          onPause={() => onPausePhase(phase.id)}
          onSkip={() => onSkipPhase(phase.id)}
          isFirst={idx === 0}
          isLast={idx === phases.length - 1}
          isReadOnly={isReadOnly}
          // Milestones
          onAddMilestone={onAddMilestone}
          onEditMilestone={onEditMilestone}
          onDeleteMilestone={onDeleteMilestone}
          onReorderMilestone={onReorderMilestone}
          onMilestoneStatusChange={onMilestoneStatusChange}
          // Criteria
          onAddCriterion={onAddCriterion}
          onEditCriterion={onEditCriterion}
          onToggleCriterion={onToggleCriterion}
          onDeleteCriterion={onDeleteCriterion}
        />
      ))}
    </div>
  );
};
