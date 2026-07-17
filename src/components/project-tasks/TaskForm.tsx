import React, { useState, useEffect } from "react";
import { ProjectTask, TaskStatus } from "../../types/project-task";
import { Priority } from "../../types";
import { Button } from "../ui/Button";
import { Plus, X, Tag as TagIcon } from "lucide-react";

interface TaskFormProps {
  initialData?: ProjectTask;
  phases: Array<{ id: string; title: string }>;
  allTasks: ProjectTask[];
  onSubmit: (data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: Priority;
    phaseId?: string;
    dueDate?: string;
    labels: string[];
    isBlocked: boolean;
    blockerReason?: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
  onChangeDirty?: (isDirty: boolean) => void;
}

export default function TaskForm({
  initialData,
  phases,
  allTasks,
  onSubmit,
  onCancel,
  onChangeDirty,
}: TaskFormProps) {
  // Input fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || "To do");
  const [priority, setPriority] = useState<Priority>(initialData?.priority || "Medium");
  const [phaseId, setPhaseId] = useState(initialData?.phaseId || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  
  // Blocker States
  const [isBlocked, setIsBlocked] = useState(initialData?.isBlocked || false);
  const [blockerReason, setBlockerReason] = useState(initialData?.blockerReason || "");

  // Tag entry state
  const [labels, setLabels] = useState<string[]>(initialData?.labels || []);
  const [tagInput, setTagInput] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-sync isBlocked state when status is "Blocked"
  useEffect(() => {
    if (status === "Blocked") {
      setIsBlocked(true);
    } else {
      // Don't auto-clear unless user selects a non-blocked state and wants to unblock
    }
  }, [status]);

  // If checkbox is manually checked/unchecked, synchronize status lane
  const handleToggleBlocked = (checked: boolean) => {
    setIsBlocked(checked);
    if (checked) {
      setStatus("Blocked");
    } else if (status === "Blocked") {
      setStatus("To do");
    }
  };

  // Monitor dirty changes
  useEffect(() => {
    const isDirty =
      title !== (initialData?.title || "") ||
      description !== (initialData?.description || "") ||
      status !== (initialData?.status || "To do") ||
      priority !== (initialData?.priority || "Medium") ||
      phaseId !== (initialData?.phaseId || "") ||
      dueDate !== (initialData?.dueDate || "") ||
      notes !== (initialData?.notes || "") ||
      isBlocked !== (initialData?.isBlocked || false) ||
      (isBlocked && blockerReason !== (initialData?.blockerReason || "")) ||
      JSON.stringify([...labels].sort()) !== JSON.stringify([...(initialData?.labels || [])].sort());

    onChangeDirty?.(isDirty);
  }, [
    title,
    description,
    status,
    priority,
    phaseId,
    dueDate,
    notes,
    isBlocked,
    blockerReason,
    labels,
    initialData,
    onChangeDirty,
  ]);

  // Handle Tag Addition
  const handleAddTag = () => {
    const cleanTag = tagInput.trim();
    if (cleanTag && !labels.includes(cleanTag)) {
      setLabels((prev) => [...prev, cleanTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setLabels((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handleKeyDownTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle Submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // 1. Title validation
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      newErrors.title = "Task title is required.";
    } else {
      // Check for duplicate active titles within the same project
      const duplicate = allTasks.find(
        (t) =>
          !t.isArchived &&
          t.id !== initialData?.id &&
          t.title.trim().toLowerCase() === cleanTitle.toLowerCase()
      );
      if (duplicate) {
        newErrors.title = `An active task named "${duplicate.title}" already exists in this project.`;
      }
    }

    // 2. Blocked reason validation
    if (isBlocked && !blockerReason.trim()) {
      newErrors.blockerReason = "A blocker reason is required for blocked tasks.";
    }

    // 3. Due Date Validation (must be valid format or empty)
    if (dueDate) {
      const parsed = Date.parse(dueDate);
      if (isNaN(parsed)) {
        newErrors.dueDate = "Please enter a valid target due date.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit({
      title: cleanTitle,
      description: description.trim(),
      status,
      priority,
      phaseId: phaseId || undefined,
      dueDate: dueDate || undefined,
      labels,
      isBlocked,
      blockerReason: isBlocked ? blockerReason.trim() : undefined,
      notes: notes.trim(),
    });
  };

  return (
    <form id="project-task-form" onSubmit={handleFormSubmit} className="space-y-4 font-sans text-xs">
      
      {/* 1. Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-form-title" className="font-semibold text-text-secondary">
          Task Title <span className="text-status-danger">*</span>
        </label>
        <input
          id="task-form-title"
          type="text"
          placeholder="E.g., Design task List view"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
          }}
          className={`h-9 px-3 border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-1 ${
            errors.title 
              ? "border-status-danger focus:ring-status-danger" 
              : "border-border-subtle focus:border-accent-primary focus:ring-accent-primary"
          }`}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "task-title-error" : undefined}
        />
        {errors.title && (
          <p id="task-title-error" className="text-[10px] text-status-danger font-medium mt-0.5">
            {errors.title}
          </p>
        )}
      </div>

      {/* 2. Description */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-form-desc" className="font-semibold text-text-secondary">
          Description
        </label>
        <textarea
          id="task-form-desc"
          rows={2}
          placeholder="Detailed explanation of the task deliverables, checkboxes, or outcomes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-3 border border-border-subtle rounded-lg bg-bg-primary text-text-primary focus:border-accent-primary focus:ring-accent-primary focus:outline-none resize-y"
        />
      </div>

      {/* 3. Status and Priority row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-form-status" className="font-semibold text-text-secondary">
            Status <span className="text-status-danger">*</span>
          </label>
          <select
            id="task-form-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="h-9 px-2.5 border border-border-subtle bg-bg-primary rounded-lg text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary cursor-pointer font-medium"
          >
            <option value="Backlog">Backlog</option>
            <option value="To do">To do</option>
            <option value="In progress">In progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-form-priority" className="font-semibold text-text-secondary">
            Priority <span className="text-status-danger">*</span>
          </label>
          <select
            id="task-form-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="h-9 px-2.5 border border-border-subtle bg-bg-primary rounded-lg text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary cursor-pointer font-medium"
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* 4. Roadmap Phase and Due Date row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Roadmap Phase link */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-form-phase" className="font-semibold text-text-secondary">
            Linked Roadmap Phase
          </label>
          <select
            id="task-form-phase"
            value={phaseId}
            onChange={(e) => setPhaseId(e.target.value)}
            className="h-9 px-2.5 border border-border-subtle bg-bg-primary rounded-lg text-text-secondary focus:outline-none focus:ring-1 focus:ring-accent-primary cursor-pointer font-medium"
          >
            <option value="">Unassigned (None)</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Target Due Date */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="task-form-duedate" className="font-semibold text-text-secondary">
            Target Due Date
          </label>
          <input
            id="task-form-duedate"
            type="date"
            value={dueDate}
            onChange={(e) => {
              setDueDate(e.target.value);
              if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: "" }));
            }}
            className={`h-9 px-3 border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-1 ${
              errors.dueDate 
                ? "border-status-danger focus:ring-status-danger" 
                : "border-border-subtle focus:border-accent-primary focus:ring-accent-primary"
            }`}
          />
          {errors.dueDate && (
            <p className="text-[10px] text-status-danger font-medium mt-0.5">
              {errors.dueDate}
            </p>
          )}
        </div>
      </div>

      {/* 5. Blocker checkbox and Conditional Blocker reason */}
      <div className="border border-border-subtle bg-bg-secondary rounded-lg p-3.5 space-y-3">
        <label className="flex items-center gap-2.5 font-semibold text-text-secondary cursor-pointer select-none">
          <input
            type="checkbox"
            checked={isBlocked}
            onChange={(e) => handleToggleBlocked(e.target.checked)}
            className="h-4 w-4 rounded border-border-subtle text-accent-primary focus:ring-accent-primary cursor-pointer"
          />
          <span>This task is currently Blocked</span>
        </label>

        {isBlocked && (
          <div className="flex flex-col gap-1.5 pt-1 animate-fade-in">
            <label htmlFor="task-form-blocker-reason" className="font-semibold text-status-danger">
              Blocker Reason <span className="text-status-danger">*</span>
            </label>
            <textarea
              id="task-form-blocker-reason"
              rows={2}
              placeholder="What external dependency, feedback delay, or technical challenge is blocking this task?"
              value={blockerReason}
              onChange={(e) => {
                setBlockerReason(e.target.value);
                if (errors.blockerReason) setErrors((prev) => ({ ...prev, blockerReason: "" }));
              }}
              className={`p-3 border rounded-lg bg-bg-primary text-text-primary focus:outline-none focus:ring-1 ${
                errors.blockerReason 
                  ? "border-status-danger focus:ring-status-danger" 
                  : "border-border-subtle focus:border-accent-primary focus:ring-accent-primary"
              }`}
              aria-invalid={!!errors.blockerReason}
            />
            {errors.blockerReason && (
              <p className="text-[10px] text-status-danger font-medium">
                {errors.blockerReason}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 6. Tags/Labels entry builder */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-form-labels" className="font-semibold text-text-secondary">
          Task Labels (Tags)
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
            <input
              id="task-form-labels"
              type="text"
              placeholder="Type label and click Add or press Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDownTag}
              className="w-full h-9 pl-9 pr-3 border border-border-subtle bg-bg-primary rounded-lg text-text-primary focus:border-accent-primary focus:ring-accent-primary focus:outline-none"
            />
          </div>
          <Button
            id="add-label-btn"
            type="button"
            variant="secondary"
            onClick={handleAddTag}
            className="h-9 flex items-center gap-1 font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add Tag
          </Button>
        </div>

        {/* Active tags badges */}
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2 bg-bg-secondary border border-border-subtle/50 rounded-lg p-2">
            {labels.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 bg-bg-primary text-text-secondary border border-border-subtle px-2 py-0.5 rounded-full text-[10px] font-sans font-medium"
              >
                <span>{t}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="p-0.5 hover:bg-muted-surface text-text-tertiary hover:text-status-danger rounded-full transition-colors"
                  aria-label={`Remove label ${t}`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 7. Notes */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="task-form-notes" className="font-semibold text-text-secondary">
          Engineering Logs & Work Notes
        </label>
        <textarea
          id="task-form-notes"
          rows={2}
          placeholder="Add implementation warnings, testing guidelines, or general notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="p-3 border border-border-subtle rounded-lg bg-bg-primary text-text-primary focus:border-accent-primary focus:ring-accent-primary focus:outline-none resize-y"
        />
      </div>

      {/* 8. Action buttons footer */}
      <div className="flex items-center justify-end gap-2.5 border-t border-border-subtle pt-4 mt-5">
        <Button
          id="task-form-cancel-btn"
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          id="task-form-submit-btn"
          type="submit"
          size="sm"
        >
          {initialData ? "Save Task Changes" : "Create Project Task"}
        </Button>
      </div>

    </form>
  );
}
