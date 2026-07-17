import React, { useState, useRef, useEffect } from "react";
import { 
  ProjectPhase, 
  PhaseStatus, 
  MilestoneStatus,
  ProjectMilestone
} from "../../types/project-roadmap";
import { Badge } from "../ui/Badge";
import { PhaseProgress } from "./PhaseProgress";
import { PhaseDependencies } from "./PhaseDependencies";
import { PhaseCompletionCriteria } from "./PhaseCompletionCriteria";
import { MilestoneItem } from "./MilestoneItem";
import { MilestoneFormDialog } from "./MilestoneFormDialog";
import { RoadmapEmptyState } from "./RoadmapEmptyState";
import { 
  ChevronDown, 
  ChevronUp, 
  MoreVertical, 
  Calendar, 
  Play, 
  Pause, 
  FastForward, 
  Trash2, 
  Copy, 
  CheckSquare, 
  Edit, 
  FileText, 
  Plus,
  ArrowUp,
  ArrowDown,
  Lock
} from "lucide-react";
import { useToast } from "../ui/Toast";

interface RoadmapPhaseCardProps {
  phase: ProjectPhase;
  allPhases: ProjectPhase[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onSetCurrent: () => void;
  onMarkCompleted: () => void;
  onPause: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
  isReadOnly: boolean;
  // Milestone callbacks
  onAddMilestone: (phaseId: string, data: any) => void;
  onEditMilestone: (phaseId: string, milestoneId: string, data: any) => void;
  onDeleteMilestone: (phaseId: string, milestoneId: string) => void;
  onReorderMilestone: (phaseId: string, milestoneId: string, direction: "up" | "down") => void;
  onMilestoneStatusChange: (phaseId: string, milestoneId: string, status: MilestoneStatus) => void;
  // Criteria callbacks
  onAddCriterion: (phaseId: string, label: string) => void;
  onEditCriterion: (phaseId: string, criterionId: string, label: string) => void;
  onToggleCriterion: (phaseId: string, criterionId: string) => void;
  onDeleteCriterion: (phaseId: string, criterionId: string) => void;
}

export const RoadmapPhaseCard: React.FC<RoadmapPhaseCardProps> = ({
  phase,
  allPhases,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onSetCurrent,
  onMarkCompleted,
  onPause,
  onSkip,
  isFirst,
  isLast,
  isReadOnly,
  onAddMilestone,
  onEditMilestone,
  onDeleteMilestone,
  onReorderMilestone,
  onMilestoneStatusChange,
  onAddCriterion,
  onEditCriterion,
  onToggleCriterion,
  onDeleteCriterion
}) => {
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Milestone Form State
  const [isMilestoneFormOpen, setIsMilestoneFormOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<ProjectMilestone | null>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine completed milestone fraction
  const completedMilestonesCount = phase.milestones.filter((m) => m.status === "Completed").length;
  const totalMilestonesCount = phase.milestones.length;

  // Render status badge variants
  const getStatusVariant = (status: PhaseStatus): "success" | "warning" | "info" | "neutral" | "danger" => {
    if (status === "Completed") return "success";
    if (status === "In progress") return "info";
    if (status === "Blocked") return "danger";
    if (status === "Paused") return "warning";
    return "neutral";
  };

  const handleMilestoneFormSubmit = (data: any) => {
    if (editingMilestone) {
      onEditMilestone(phase.id, editingMilestone.id, data);
    } else {
      onAddMilestone(phase.id, data);
    }
    setIsMilestoneFormOpen(false);
    setEditingMilestone(null);
  };

  const handleOpenAddMilestone = () => {
    setEditingMilestone(null);
    setIsMilestoneFormOpen(true);
  };

  const handleOpenEditMilestone = (milestone: ProjectMilestone) => {
    setEditingMilestone(milestone);
    setIsMilestoneFormOpen(true);
  };

  return (
    <div 
      id={`phase-card-${phase.id}`}
      className={`border rounded-xl font-sans overflow-hidden transition-all duration-200 ${
        phase.isCurrent 
          ? "border-accent-primary bg-bg-primary shadow-sm" 
          : "border-border-subtle bg-bg-primary"
      }`}
    >
      {/* 1. Header Row (Collapsed State View) */}
      <div 
        onClick={onToggleExpand}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted-surface/30 select-none gap-4"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Order circle */}
          <div 
            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
              phase.isCurrent 
                ? "bg-accent-primary text-white" 
                : phase.status === "Completed"
                  ? "bg-status-success/10 text-status-success"
                  : "bg-muted-surface border border-border-subtle text-text-secondary"
            }`}
          >
            {phase.order}
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 
                className={`text-xs font-semibold text-text-primary leading-tight truncate ${
                  phase.status === "Completed" ? "line-through text-text-tertiary font-medium" : ""
                }`}
              >
                {phase.title}
              </h3>
              
              {phase.isCurrent && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-accent-primary/10 border border-accent-primary/20 rounded-full text-[9px] font-semibold text-accent-primary uppercase font-mono animate-pulse">
                  Current Phase
                </span>
              )}
            </div>

            {/* Subtitles: Date Range, milestones counts */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-text-tertiary font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
                <span>{phase.startDate || "TBD"} &rarr; {phase.targetDate || "TBD"}</span>
              </span>
              <span>&bull;</span>
              <span>{completedMilestonesCount}/{totalMilestonesCount} Milestones Met</span>
              {phase.dependencies.length > 0 && (
                <>
                  <span>&bull;</span>
                  <span className="text-status-danger font-medium">Blocked by Prereq</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right action block */}
        <div className="flex items-center gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Progress meter */}
          <div className="hidden sm:block">
            <PhaseProgress progress={phase.progress} status={phase.status} />
          </div>

          {/* Status Badge */}
          <Badge variant={getStatusVariant(phase.status)} size="sm">
            {phase.status}
          </Badge>

          {/* Trigger Context menu */}
          {!isReadOnly ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 text-text-secondary hover:text-text-primary hover:bg-muted-surface rounded-lg transition-colors focus:outline-none"
                title="Options"
                id={`phase-menu-trigger-${phase.id}`}
                aria-label="Toggle options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div 
                  id={`phase-menu-options-${phase.id}`}
                  className="absolute right-0 mt-1 w-48 bg-surface border border-border-strong rounded-xl shadow-floating py-1.5 z-20 font-medium text-xs text-text-secondary flex flex-col"
                >
                  <button
                    onClick={() => { setIsMenuOpen(false); onEdit(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted-surface hover:text-text-primary text-left"
                  >
                    <Edit className="w-3.5 h-3.5 text-text-tertiary" />
                    <span>Edit phase parameters</span>
                  </button>

                  <button
                    onClick={() => { setIsMenuOpen(false); onSetCurrent(); }}
                    disabled={phase.isCurrent || phase.status === "Completed" || phase.status === "Skipped"}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted-surface hover:text-text-primary disabled:opacity-40 disabled:hover:bg-transparent text-left"
                  >
                    <Play className="w-3.5 h-3.5 text-text-tertiary" />
                    <span>Set as current phase</span>
                  </button>

                  <button
                    onClick={() => { setIsMenuOpen(false); onMarkCompleted(); }}
                    disabled={phase.status === "Completed"}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted-surface hover:text-text-primary disabled:opacity-40 disabled:hover:bg-transparent text-left"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-text-tertiary" />
                    <span>Mark phase completed</span>
                  </button>

                  <button
                    onClick={() => { setIsMenuOpen(false); onPause(); }}
                    disabled={phase.status === "Paused" || phase.status === "Completed"}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted-surface hover:text-text-primary disabled:opacity-40 disabled:hover:bg-transparent text-left"
                  >
                    <Pause className="w-3.5 h-3.5 text-text-tertiary" />
                    <span>Pause phase</span>
                  </button>

                  <button
                    onClick={() => { setIsMenuOpen(false); onSkip(); }}
                    disabled={phase.status === "Skipped" || phase.isCurrent}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted-surface hover:text-text-primary disabled:opacity-40 disabled:hover:bg-transparent text-left"
                  >
                    <FastForward className="w-3.5 h-3.5 text-text-tertiary" />
                    <span>Skip phase</span>
                  </button>

                  <button
                    onClick={() => { setIsMenuOpen(false); onDuplicate(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted-surface hover:text-text-primary text-left"
                  >
                    <Copy className="w-3.5 h-3.5 text-text-tertiary" />
                    <span>Duplicate phase copy</span>
                  </button>

                  <div className="border-t border-border-subtle my-1.5" />

                  <button
                    onClick={() => { setIsMenuOpen(false); onMoveUp(); }}
                    disabled={isFirst}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-muted-surface hover:text-text-primary disabled:opacity-40 disabled:hover:bg-transparent text-left font-sans"
                    aria-label={`Move Phase ${phase.order} upward`}
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-text-tertiary" />
                    <span>Move Phase Up</span>
                  </button>

                  <button
                    onClick={() => { setIsMenuOpen(false); onMoveDown(); }}
                    disabled={isLast}
                    className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-muted-surface hover:text-text-primary disabled:opacity-40 disabled:hover:bg-transparent text-left font-sans"
                    aria-label={`Move Phase ${phase.order} downward`}
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-text-tertiary" />
                    <span>Move Phase Down</span>
                  </button>

                  <div className="border-t border-border-subtle my-1.5" />

                  <button
                    onClick={() => { setIsMenuOpen(false); onDelete(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-status-danger hover:bg-status-danger/10 text-left font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-status-danger" />
                    <span>Delete phase</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-1 text-text-tertiary">
              <Lock className="w-3.5 h-3.5" title="Archived, locked edit" />
            </div>
          )}

          {/* Collapse toggle button */}
          <button 
            onClick={onToggleExpand}
            className="p-1 text-text-secondary hover:text-text-primary rounded"
            aria-label={isExpanded ? "Collapse phase details" : "Expand phase details"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Expanded Detail Panel */}
      {isExpanded && (
        <div className="border-t border-border-subtle p-5 bg-muted-surface/10 flex flex-col gap-5 animate-fade-in">
          {/* Phase objective description */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-xs font-semibold text-text-secondary uppercase">
              Phase Summary & Purpose
            </h4>
            <p className="text-xs text-text-primary leading-relaxed max-w-3xl">
              {phase.description}
            </p>
          </div>

          {/* Inline Progress Bar for Mobile */}
          <div className="block sm:hidden border-b border-border-subtle pb-3">
            <span className="text-[10px] text-text-tertiary font-mono uppercase block mb-1">Mobile Progress Meter</span>
            <PhaseProgress progress={phase.progress} status={phase.status} />
          </div>

          {/* Phase Notes */}
          {phase.notes && (
            <div className="flex gap-2.5 p-3.5 bg-bg-primary border border-border-subtle rounded-xl text-xs">
              <FileText className="w-4 h-4 text-text-tertiary mt-0.5 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-text-secondary">Executive notes</span>
                <p className="text-text-primary leading-relaxed">{phase.notes}</p>
              </div>
            </div>
          )}

          {/* Phase Dependencies block */}
          <PhaseDependencies dependencies={phase.dependencies} allPhases={allPhases} />

          {/* Milestones Checklist panel */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-text-secondary uppercase">
                  Milestone Outcomes ({completedMilestonesCount}/{totalMilestonesCount})
                </h4>
                {!isReadOnly && (
                  <button
                    onClick={handleOpenAddMilestone}
                    className="px-2.5 py-1 bg-bg-primary hover:bg-muted-surface border border-border-subtle rounded-lg text-[10px] font-semibold text-text-primary flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-accent-primary" />
                    <span>Add Milestone</span>
                  </button>
                )}
              </div>
              <p className="text-[10px] text-text-tertiary">
                Milestones represent phase-level delivery outcomes. Detailed tasks are managed separately.
              </p>
            </div>

            {totalMilestonesCount === 0 ? (
              <RoadmapEmptyState 
                type="milestones" 
                onAddClick={handleOpenAddMilestone} 
                isReadOnly={isReadOnly}
              />
            ) : (
              <div className="flex flex-col gap-2">
                {phase.milestones.map((m, idx) => (
                  <MilestoneItem
                    key={m.id}
                    milestone={m}
                    isReadOnly={isReadOnly}
                    onEdit={() => handleOpenEditMilestone(m)}
                    onDelete={() => onDeleteMilestone(phase.id, m.id)}
                    onMoveUp={() => onReorderMilestone(phase.id, m.id, "up")}
                    onMoveDown={() => onReorderMilestone(phase.id, m.id, "down")}
                    onStatusChange={(status) => onMilestoneStatusChange(phase.id, m.id, status)}
                    isFirst={idx === 0}
                    isLast={idx === phase.milestones.length - 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completion Criteria checklists */}
          <PhaseCompletionCriteria
            phaseId={phase.id}
            criteria={phase.completionCriteria}
            isReadOnly={isReadOnly}
            onAdd={(label) => onAddCriterion(phase.id, label)}
            onEdit={(criterionId, label) => onEditCriterion(phase.id, criterionId, label)}
            onToggle={(criterionId) => onToggleCriterion(phase.id, criterionId)}
            onDelete={(criterionId) => onDeleteCriterion(phase.id, criterionId)}
          />

          {/* Primary detailed footer triggers */}
          {!isReadOnly && (
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-subtle text-xs">
              <button
                onClick={onEdit}
                className="px-3 py-1.5 bg-bg-primary hover:bg-muted-surface border border-border-subtle hover:border-border-strong rounded-lg text-text-primary font-medium flex items-center gap-1 transition-all"
              >
                <Edit className="w-3.5 h-3.5 text-text-tertiary" />
                <span>Edit parameters</span>
              </button>
              
              <button
                onClick={onDelete}
                className="px-3 py-1.5 hover:bg-status-danger/10 border border-transparent rounded-lg text-status-danger font-semibold flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-status-danger" />
                <span>Delete phase</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Milestone Form Dialog container */}
      <MilestoneFormDialog
        isOpen={isMilestoneFormOpen}
        onClose={() => setIsMilestoneFormOpen(false)}
        initialData={editingMilestone || undefined}
        existingMilestones={phase.milestones}
        onSubmit={handleMilestoneFormSubmit}
      />
    </div>
  );
};
