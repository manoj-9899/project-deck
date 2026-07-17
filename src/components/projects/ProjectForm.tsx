import React, { useState } from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { Project, ProjectStatus, ProjectHealth, Priority, ProjectCategory } from "../../types";

interface ProjectFormProps {
  initialData?: Partial<Project>;
  onSubmit: (data: Omit<Project, "id" | "slug" | "lastUpdated" | "isArchived">) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save Project"
}: ProjectFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState<ProjectCategory>(
    (initialData?.category as ProjectCategory) || "Personal Tool"
  );
  const [status, setStatus] = useState<ProjectStatus>(
    initialData?.status || "Planning"
  );
  const [health, setHealth] = useState<ProjectHealth>(
    initialData?.health || "On track"
  );
  const [priority, setPriority] = useState<Priority>(
    initialData?.priority || "Medium"
  );
  const [progress, setProgress] = useState<number>(initialData?.progress ?? 0);
  const [currentPhase, setCurrentPhase] = useState(initialData?.currentPhase || "");
  const [nextAction, setNextAction] = useState(initialData?.nextAction || "");
  
  // Convert tech stack array to comma-separated list
  const [techStackInput, setTechStackInput] = useState(
    initialData?.techStack ? initialData.techStack.join(", ") : ""
  );

  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [targetDate, setTargetDate] = useState(initialData?.targetDate || "");
  const [repositoryUrl, setRepositoryUrl] = useState(initialData?.repositoryUrl || "");
  const [deploymentUrl, setDeploymentUrl] = useState(initialData?.deploymentUrl || "");

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { value: "Personal Tool", label: "Personal Tool" },
    { value: "Portfolio", label: "Portfolio" },
    { value: "Business", label: "Business" },
    { value: "Client Work", label: "Client Work" },
    { value: "SaaS Experiment", label: "SaaS Experiment" },
    { value: "Academic", label: "Academic" },
    { value: "Experimental", label: "Experimental" }
  ];

  const statusOptions = [
    { value: "Idea", label: "Idea" },
    { value: "Planning", label: "Planning" },
    { value: "Designing", label: "Designing" },
    { value: "Building", label: "Building" },
    { value: "Testing", label: "Testing" },
    { value: "Deployed", label: "Deployed" },
    { value: "Maintaining", label: "Maintaining" },
    { value: "Paused", label: "Paused" },
    { value: "Archived", label: "Archived" }
  ];

  const healthOptions = [
    { value: "On track", label: "On Track" },
    { value: "Needs attention", label: "Needs Attention" },
    { value: "Blocked", label: "Blocked" },
    { value: "Stable", label: "Stable" },
    { value: "Inactive", label: "Inactive" }
  ];

  const priorityOptions = [
    { value: "Critical", label: "Critical" },
    { value: "High", label: "High" },
    { value: "Medium", label: "Medium" },
    { value: "Low", label: "Low" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (progress < 0 || progress > 100) {
      newErrors.progress = "Progress must be between 0 and 100";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clean tech stack inputs
    const techStack = techStackInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      status,
      health,
      priority,
      progress: Number(progress),
      currentPhase: currentPhase.trim() || undefined,
      nextAction: nextAction.trim() || undefined,
      techStack,
      startDate: startDate || undefined,
      targetDate: targetDate || undefined,
      repositoryUrl: repositoryUrl.trim() || undefined,
      deploymentUrl: deploymentUrl.trim() || undefined
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-sans">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Project Name */}
        <div className="sm:col-span-2">
          <Input
            label="Project Name *"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
            }}
            error={errors.name}
            placeholder="e.g. ProjectDock"
            className="text-xs"
          />
        </div>

        {/* Category */}
        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(e) => setCategory(e.target.value as ProjectCategory)}
          className="text-xs"
        />

        {/* Priority */}
        <Select
          label="Priority"
          options={priorityOptions}
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="text-xs"
        />

        {/* Status */}
        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          className="text-xs"
        />

        {/* Health */}
        <Select
          label="Health"
          options={healthOptions}
          value={health}
          onChange={(e) => setHealth(e.target.value as ProjectHealth)}
          className="text-xs"
        />

        {/* Progress */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary select-none">
            Progress ({progress}%)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full h-1.5 bg-muted-surface border border-border-subtle rounded-lg appearance-none cursor-pointer accent-accent-primary focus:outline-none"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-14 text-center text-xs font-mono text-text-primary bg-surface border border-border-strong rounded py-1 px-1 focus:border-accent-primary outline-none"
            />
          </div>
          {errors.progress && (
            <p className="text-[11px] font-medium text-status-danger">{errors.progress}</p>
          )}
        </div>

        {/* Current Active Phase */}
        <Input
          label="Active Phase (Optional)"
          value={currentPhase}
          onChange={(e) => setCurrentPhase(e.target.value)}
          placeholder="e.g. Design UI Mockups"
          className="text-xs"
        />

        {/* Description */}
        <div className="sm:col-span-2">
          <Textarea
            label="Project Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short overview of what this project accomplishes..."
            className="text-xs"
            rows={2.5}
          />
        </div>

        {/* Tech Stack */}
        <div className="sm:col-span-2">
          <Input
            label="Technologies (Comma-separated)"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            placeholder="React, TypeScript, Tailwind CSS, Motion"
            helperText="Enter technology names separated by commas"
            className="text-xs"
          />
        </div>

        {/* Next Technical Action */}
        <div className="sm:col-span-2">
          <Input
            label="Next Action (Optional)"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            placeholder="e.g. Establish PostgreSQL schema tables"
            className="text-xs"
          />
        </div>

        {/* Start Date */}
        <Input
          label="Start Date (Optional)"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="text-xs"
        />

        {/* Target End Date */}
        <Input
          label="Target Delivery Date (Optional)"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="text-xs"
        />

        {/* Repository URL */}
        <Input
          label="Repository URL (Optional)"
          type="url"
          value={repositoryUrl}
          onChange={(e) => setRepositoryUrl(e.target.value)}
          placeholder="https://github.com/..."
          className="text-xs"
        />

        {/* Deployment URL */}
        <Input
          label="Deployment URL (Optional)"
          type="url"
          value={deploymentUrl}
          onChange={(e) => setDeploymentUrl(e.target.value)}
          placeholder="https://..."
          className="text-xs"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle mt-1.5">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="text-xs py-2 px-4 rounded-md"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="text-xs py-2 px-5 rounded-md bg-accent-primary hover:bg-accent-primary/90 text-white border-transparent font-semibold"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
