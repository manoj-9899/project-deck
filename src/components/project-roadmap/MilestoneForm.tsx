import React, { useState, useEffect } from "react";
import { ProjectMilestone, MilestoneStatus } from "../../types/project-roadmap";
import { Priority } from "../../types";
import { Button } from "../ui/Button";

interface MilestoneFormProps {
  initialData?: ProjectMilestone;
  existingMilestones?: ProjectMilestone[];
  onSubmit: (data: {
    title: string;
    description?: string;
    status: MilestoneStatus;
    priority: Priority;
    targetDate?: string;
  }) => void;
  onCancel: () => void;
  onChangeDirty?: (isDirty: boolean) => void;
}

export const MilestoneForm: React.FC<MilestoneFormProps> = ({
  initialData,
  existingMilestones = [],
  onSubmit,
  onCancel,
  onChangeDirty
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState<MilestoneStatus>(initialData?.status || "Pending");
  const [priority, setPriority] = useState<Priority>(initialData?.priority || "Medium");
  const [targetDate, setTargetDate] = useState(initialData?.targetDate || "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Monitor dirty state
  useEffect(() => {
    const isDirtyNow = 
      title !== (initialData?.title || "") ||
      description !== (initialData?.description || "") ||
      status !== (initialData?.status || "Pending") ||
      priority !== (initialData?.priority || "Medium") ||
      targetDate !== (initialData?.targetDate || "");

    onChangeDirty?.(isDirtyNow);
  }, [title, description, status, priority, targetDate, initialData, onChangeDirty]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validate title is required
    if (!title.trim()) {
      newErrors.title = "Milestone title is required.";
    } else {
      const isDuplicate = existingMilestones.some(
        (m) => m.title.toLowerCase().trim() === title.toLowerCase().trim() && m.id !== initialData?.id
      );
      if (isDuplicate) {
        newErrors.title = "A milestone with this title already exists in this phase.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      priority,
      targetDate: targetDate || undefined
    });
  };

  return (
    <form id="milestone-form-element" onSubmit={handleFormSubmit} className="flex flex-col gap-4 font-sans text-xs">
      {/* Informational outcome distinction badge */}
      <div className="p-2.5 bg-muted-surface border border-border-subtle rounded-lg text-text-tertiary leading-relaxed text-[10px]">
        <strong>Scope Note:</strong> Milestones represent phase-level delivery outcomes. Detailed tasks are managed separately.
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <label htmlFor="milestone-title" className="font-semibold text-text-secondary">
          MILESTONE TITLE <span className="text-status-danger">*</span>
        </label>
        <input
          id="milestone-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Establish SQLite migrations"
          className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong font-medium text-text-primary"
        />
        {errors.title && <span className="text-[11px] text-status-danger font-medium">{errors.title}</span>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label htmlFor="milestone-desc" className="font-semibold text-text-secondary">
          DESCRIPTION
        </label>
        <textarea
          id="milestone-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional explanation of what success looks like."
          rows={2}
          className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong font-medium text-text-primary resize-none"
        />
      </div>

      {/* Grid: Priority, Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="milestone-priority-select" className="font-semibold text-text-secondary">
            PRIORITY
          </label>
          <select
            id="milestone-priority-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong text-text-primary font-medium"
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="milestone-status-select" className="font-semibold text-text-secondary">
            STATUS
          </label>
          <select
            id="milestone-status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
            className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong text-text-primary font-medium"
          >
            <option value="Pending">Pending</option>
            <option value="In progress">In progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Completed">Completed</option>
            <option value="Skipped">Skipped</option>
          </select>
        </div>
      </div>

      {/* Target Date */}
      <div className="flex flex-col gap-1">
        <label htmlFor="milestone-target-date" className="font-semibold text-text-secondary">
          TARGET TIMELINE DATE
        </label>
        <input
          id="milestone-target-date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="px-3 py-2 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong text-text-primary font-medium"
        />
      </div>

      {/* Footer controls */}
      <div className="flex justify-end gap-2.5 pt-2 border-t border-border-subtle">
        <Button 
          id="milestone-form-cancel-btn"
          type="button" 
          variant="secondary" 
          size="sm" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          id="milestone-form-submit-btn"
          type="submit" 
          variant="primary" 
          size="sm"
        >
          Save Milestone
        </Button>
      </div>
    </form>
  );
};
