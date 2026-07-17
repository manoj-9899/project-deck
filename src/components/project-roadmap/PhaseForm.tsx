import React, { useState, useEffect } from "react";
import { ProjectPhase, PhaseStatus } from "../../types/project-roadmap";
import { Button } from "../ui/Button";

interface PhaseFormProps {
  initialData?: ProjectPhase;
  allPhases: ProjectPhase[];
  onSubmit: (data: {
    title: string;
    description: string;
    status: PhaseStatus;
    progress: number;
    startDate?: string;
    targetDate?: string;
    dependencies: string[];
    notes?: string;
    isCurrent: boolean;
  }) => void;
  onCancel: () => void;
  onChangeDirty?: (isDirty: boolean) => void;
}

// Helper to check if endId is reachable from startId in the dependency graph.
const isReachable = (startId: string, targetId: string, phases: ProjectPhase[]): boolean => {
  const visited = new Set<string>();
  const queue: string[] = [startId];
  visited.add(startId);

  while (queue.length > 0) {
    const currentId = queue.shift()!;
    if (currentId === targetId) return true;

    const currentPhase = phases.find((p) => p.id === currentId);
    if (currentPhase) {
      for (const depId of currentPhase.dependencies) {
        if (!visited.has(depId)) {
          visited.add(depId);
          queue.push(depId);
        }
      }
    }
  }
  return false;
};

export const PhaseForm: React.FC<PhaseFormProps> = ({
  initialData,
  allPhases,
  onSubmit,
  onCancel,
  onChangeDirty
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState<PhaseStatus>(initialData?.status || "Planned");
  const [progress, setProgress] = useState<number>(initialData?.progress ?? 0);
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [targetDate, setTargetDate] = useState(initialData?.targetDate || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [isCurrent, setIsCurrent] = useState(initialData?.isCurrent || false);
  const [selectedDeps, setSelectedDeps] = useState<string[]>(initialData?.dependencies || []);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Monitor dirty state
  useEffect(() => {
    const isDirtyNow = 
      title !== (initialData?.title || "") ||
      description !== (initialData?.description || "") ||
      status !== (initialData?.status || "Planned") ||
      progress !== (initialData?.progress ?? 0) ||
      startDate !== (initialData?.startDate || "") ||
      targetDate !== (initialData?.targetDate || "") ||
      notes !== (initialData?.notes || "") ||
      isCurrent !== (initialData?.isCurrent || false) ||
      JSON.stringify([...selectedDeps].sort()) !== JSON.stringify([...(initialData?.dependencies || [])].sort());

    onChangeDirty?.(isDirtyNow);
  }, [title, description, status, progress, startDate, targetDate, notes, isCurrent, selectedDeps, initialData, onChangeDirty]);

  // Auto-set progress to 100 if completed
  useEffect(() => {
    if (status === "Completed") {
      setProgress(100);
    } else if (status === "Planned" || status === "Not started") {
      if (progress === 100) setProgress(0);
    }
  }, [status]);

  // Available phases that can be marked as dependencies (prevent self dependency)
  const availableDependencyPhases = allPhases.filter(
    (p) => !initialData || p.id !== initialData.id
  );

  const handleToggleDep = (depId: string) => {
    setSelectedDeps((prev) => {
      if (prev.includes(depId)) {
        return prev.filter((id) => id !== depId);
      } else {
        // Prevent circular dependency
        if (initialData) {
          const wouldCreateCycle = isReachable(depId, initialData.id, allPhases);
          if (wouldCreateCycle) {
            setErrors((errs) => ({
              ...errs,
              dependencies: `Circular dependency detected! Phase "${allPhases.find(p => p.id === depId)?.title}" already depends on this phase.`
            }));
            // Clear error after 5 seconds
            setTimeout(() => {
              setErrors((errs) => {
                const copy = { ...errs };
                delete copy.dependencies;
                return copy;
              });
            }, 5000);
            return prev;
          }
        }
        return [...prev, depId];
      }
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // 1. Validation: Title is required
    if (!title.trim()) {
      newErrors.title = "Phase title is required.";
    } else {
      // Prevent exact duplication of title (except if editing itself)
      const isDuplicate = allPhases.some(
        (p) => p.title.toLowerCase().trim() === title.toLowerCase().trim() && p.id !== initialData?.id
      );
      if (isDuplicate) {
        newErrors.title = "A phase with this exact title already exists.";
      }
    }

    // 2. Validation: Description practical min length
    if (description.trim().length < 10) {
      newErrors.description = "Please provide a description of at least 10 characters.";
    }

    // 3. Validation: Progress constraints
    if (progress < 0 || progress > 100) {
      newErrors.progress = "Progress must be between 0% and 100%.";
    }

    // 4. Validation: Date logical order
    if (startDate && targetDate && targetDate < startDate) {
      newErrors.targetDate = "Target completion date cannot fall before the start date.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      progress: Number(progress),
      startDate: startDate || undefined,
      targetDate: targetDate || undefined,
      dependencies: selectedDeps,
      notes: notes.trim() || undefined,
      isCurrent
    });
  };

  return (
    <form id="phase-form-element" onSubmit={handleFormSubmit} className="flex flex-col gap-4 font-sans text-xs">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label htmlFor="phase-title" className="font-semibold text-text-secondary">
          PHASE TITLE <span className="text-status-danger">*</span>
        </label>
        <input
          id="phase-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Phase 7 — Advanced Integrations"
          className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong font-medium text-text-primary"
        />
        {errors.title && <span className="text-[11px] text-status-danger font-medium">{errors.title}</span>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label htmlFor="phase-desc" className="font-semibold text-text-secondary">
          DESCRIPTION / OBJECTIVES <span className="text-status-danger">*</span>
        </label>
        <textarea
          id="phase-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What objectives must this phase achieve?"
          rows={3}
          className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong font-medium text-text-primary resize-y"
        />
        {errors.description && <span className="text-[11px] text-status-danger font-medium">{errors.description}</span>}
      </div>

      {/* Grid: Status, Progress */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="phase-status-select" className="font-semibold text-text-secondary">
            STATUS
          </label>
          <select
            id="phase-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as PhaseStatus)}
            className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong text-text-primary font-medium"
          >
            <option value="Not started">Not started</option>
            <option value="Planned">Planned</option>
            <option value="In progress">In progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
            <option value="Skipped">Skipped</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phase-progress-input" className="font-semibold text-text-secondary">
            PROGRESS (%)
          </label>
          <input
            id="phase-progress-input"
            type="number"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            disabled={status === "Completed"}
            className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong text-text-primary font-medium font-mono disabled:opacity-60"
          />
          {errors.progress && <span className="text-[11px] text-status-danger font-medium">{errors.progress}</span>}
        </div>
      </div>

      {/* Grid: Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="phase-start-date" className="font-semibold text-text-secondary">
            START DATE
          </label>
          <input
            id="phase-start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong text-text-primary font-medium"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phase-target-date" className="font-semibold text-text-secondary">
            TARGET DATE
          </label>
          <input
            id="phase-target-date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong text-text-primary font-medium"
          />
          {errors.targetDate && <span className="text-[11px] text-status-danger font-medium">{errors.targetDate}</span>}
        </div>
      </div>

      {/* Dependencies checklist */}
      {availableDependencyPhases.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-text-secondary uppercase">
            PREREQUISITE PHASES (DEPENDENCIES)
          </span>
          <div className="max-h-24 overflow-y-auto p-2 bg-muted-surface border border-border-subtle rounded-lg flex flex-col gap-1.5">
            {availableDependencyPhases.map((p) => (
              <label 
                key={p.id} 
                className="flex items-center gap-2 cursor-pointer text-text-primary hover:text-text-secondary transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedDeps.includes(p.id)}
                  onChange={() => handleToggleDep(p.id)}
                  className="rounded border-border-subtle text-accent-primary focus:ring-accent-primary focus:ring-opacity-20 cursor-pointer"
                />
                <span className="truncate">{p.title}</span>
                <span className="font-mono text-[9px] opacity-70">({p.status})</span>
              </label>
            ))}
          </div>
          {errors.dependencies && (
            <span className="text-[11px] text-status-danger font-medium animate-fade-in">
              {errors.dependencies}
            </span>
          )}
        </div>
      )}

      {/* Notes */}
      <div className="flex flex-col gap-1">
        <label htmlFor="phase-notes" className="font-semibold text-text-secondary">
          PHASE NOTES
        </label>
        <textarea
          id="phase-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes, risks or handoff parameters."
          rows={2}
          className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong font-medium text-text-primary resize-none"
        />
      </div>

      {/* Set as Current Phase Toggle */}
      <div className="flex items-center justify-between p-2.5 bg-muted-surface border border-border-subtle rounded-lg">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-text-primary">Set as Current Active Phase</span>
          <span className="text-[10px] text-text-tertiary">Only one roadmap phase can be marked as the current focus.</span>
        </div>
        <input
          type="checkbox"
          checked={isCurrent}
          onChange={(e) => setIsCurrent(e.target.checked)}
          className="rounded border-border-subtle text-accent-primary focus:ring-accent-primary focus:ring-opacity-20 cursor-pointer"
        />
      </div>

      {/* Footer controls */}
      <div className="flex justify-end gap-2.5 pt-2 border-t border-border-subtle">
        <Button 
          id="phase-form-cancel-btn"
          type="button" 
          variant="secondary" 
          size="sm" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          id="phase-form-submit-btn"
          type="submit" 
          variant="primary" 
          size="sm"
        >
          Save Phase
        </Button>
      </div>
    </form>
  );
};
