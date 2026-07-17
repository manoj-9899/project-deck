import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { Progress } from "../ui/Progress";
import { useToast } from "../ui/Toast";
import { Project, ProjectStatus, ProjectHealth, Priority } from "../../types";
import { Sheet } from "../ui/Sheet";
import {
  Github,
  ExternalLink,
  Edit,
  ArrowLeft,
  Settings,
  MoreVertical,
  Play,
  Clipboard,
  ShieldCheck,
  Pause,
  AlertCircle,
  Copy,
  Check,
  FolderDot,
  Info
} from "lucide-react";

interface ProjectWorkspaceHeaderProps {
  project: Project;
}

export default function ProjectWorkspaceHeader({ project }: ProjectWorkspaceHeaderProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isActionsSheetOpen, setIsActionsSheetOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);

  const handleCopySlug = () => {
    navigator.clipboard.writeText(project.slug);
    setCopiedSlug(true);
    toast({
      type: "success",
      title: "Copied",
      message: "Project slug copied to clipboard safely.",
      duration: 2000
    });
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const handleCopyPath = () => {
    const safePath = `~/projects/personal/${project.slug}`;
    navigator.clipboard.writeText(safePath);
    setCopiedPath(true);
    toast({
      type: "success",
      title: "Copied",
      message: "Safe local workspace path copied to clipboard.",
      duration: 2000
    });
    setTimeout(() => setCopiedPath(false), 2000);
  };

  // Map health to badge variant
  const healthVariants: Record<ProjectHealth, "success" | "warning" | "danger" | "info" | "neutral"> = {
    "On track": "success",
    "Needs attention": "warning",
    "Blocked": "danger",
    "Stable": "info",
    "Inactive": "neutral",
  };

  // Map status to badge variant
  const statusVariants: Record<ProjectStatus, "accent" | "info" | "warning" | "danger" | "success" | "neutral"> = {
    Idea: "neutral",
    Planning: "info",
    Designing: "accent",
    Building: "accent",
    Testing: "warning",
    Deployed: "success",
    Maintaining: "success",
    Paused: "warning",
    Archived: "neutral",
  };

  // Map priority to badge variant
  const priorityVariants: Record<Priority, "danger" | "warning" | "info" | "neutral"> = {
    Critical: "danger",
    High: "warning",
    Medium: "info",
    Low: "neutral",
  };

  const handleEditClick = () => {
    toast({
      type: "info",
      title: "Navigation Hint",
      message: "Project editing is available from the Projects Directory during the temporary data phase.",
      duration: 5000,
    });
  };

  const handlePrimaryActionClick = () => {
    toast({
      type: "info",
      title: "Interactive Roadmap Feature",
      message: "Actionable project workflows will be introduced with roadmap and task management.",
      duration: 4500,
    });
  };

  // Determine what primary button text to display
  let primaryBtnLabel = "";
  let primaryBtnIcon = <Play className="w-3.5 h-3.5 mr-1.5" />;
  
  if (project.status === "Deployed" || project.status === "Maintaining") {
    primaryBtnLabel = "Review project";
    primaryBtnIcon = <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />;
  } else if (project.status === "Paused") {
    primaryBtnLabel = "Review next decision";
    primaryBtnIcon = <Pause className="w-3.5 h-3.5 mr-1.5" />;
  } else if (!project.isArchived) {
    primaryBtnLabel = "Continue working";
    primaryBtnIcon = <Play className="w-3.5 h-3.5 mr-1.5" />;
  }

  // Derive dynamic progress variant
  let progressVariant: "accent" | "success" | "warning" | "danger" = "accent";
  if (project.health === "On track" || project.health === "Stable" || project.progress === 100) {
    progressVariant = "success";
  } else if (project.health === "Needs attention") {
    progressVariant = "warning";
  } else if (project.health === "Blocked") {
    progressVariant = "danger";
  }

  return (
    <header id="project-workspace-header" className="bg-bg-primary border border-border-subtle rounded-xl p-5 flex flex-col gap-4 font-sans shadow-xs">
      
      {/* Top Title Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        
        {/* Core Identity Info */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center flex-wrap gap-2">
            <h1 className="text-xl font-semibold text-text-primary tracking-tight font-sans">
              {project.name}
            </h1>
            <Badge variant="neutral" className="text-[10px] uppercase tracking-wider px-1.5 py-0.5">
              {project.category}
            </Badge>
            {project.isArchived && (
              <Badge variant="danger" className="text-[10px] font-bold">
                ARCHIVED
              </Badge>
            )}
          </div>
          <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Action Buttons Group */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          
          {/* External Links */}
          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 text-text-secondary hover:text-text-primary bg-bg-primary hover:bg-muted-surface border border-border-subtle rounded-lg transition-all focus:ring-1 focus:ring-border-strong focus:outline-none"
              title="Open GitHub Repository"
              aria-label={`Open GitHub Repository for ${project.name}`}
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.deploymentUrl && (
            <a
              href={project.deploymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 text-text-secondary hover:text-text-primary bg-bg-primary hover:bg-muted-surface border border-border-subtle rounded-lg transition-all focus:ring-1 focus:ring-border-strong focus:outline-none"
              title="Open Live Deployment"
              aria-label={`Open Live Deployment for ${project.name}`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Project Actions & Information button */}
          <button
            onClick={() => setIsActionsSheetOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary bg-bg-primary hover:bg-muted-surface border border-border-subtle rounded-lg transition-all focus:ring-1 focus:ring-border-strong focus:outline-none"
            id="workspace-edit-project-btn"
          >
            <Settings className="w-3.5 h-3.5 text-text-secondary" />
            <span className="hidden sm:inline">Project Actions</span>
          </button>

          {/* State-specific Primary Button (Hidden if archived) */}
          {primaryBtnLabel && !project.isArchived && (
            <button
              onClick={handlePrimaryActionClick}
              className="flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-white bg-accent-primary hover:bg-accent-primary/90 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-accent-primary/20 focus:outline-none"
              id="workspace-primary-btn"
            >
              {primaryBtnIcon}
              <span>{primaryBtnLabel}</span>
            </button>
          )}

        </div>
      </div>

      <hr className="border-border-subtle" />

      {/* Row with Badges and Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider font-mono">Status</span>
          <Badge variant={statusVariants[project.status] || "neutral"}>
            {project.status}
          </Badge>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider font-mono">Health</span>
          <Badge variant={healthVariants[project.health] || "neutral"}>
            {project.health}
          </Badge>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider font-mono">Priority</span>
          <Badge variant={priorityVariants[project.priority] || "neutral"}>
            {project.priority}
          </Badge>
        </div>

        <div className="flex flex-col gap-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider font-mono">Current Phase</span>
          <span className="text-xs font-medium text-text-primary truncate" title={project.currentPhase || "Not Defined"}>
            {project.currentPhase || "—"}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider font-mono">Last Updated</span>
          <span className="text-xs font-medium text-text-secondary">
            {project.lastUpdated}
          </span>
        </div>

        {/* Dense progress display */}
        <div className="flex flex-col gap-1 justify-center col-span-2 sm:col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary">
            <span className="uppercase font-medium tracking-wider">Progress</span>
            <span className="font-semibold text-text-primary">{project.progress}%</span>
          </div>
          <Progress value={project.progress} size="sm" variant={progressVariant} />
        </div>

      </div>

      {/* Informational Project Actions Drawer */}
      <Sheet
        isOpen={isActionsSheetOpen}
        onClose={() => setIsActionsSheetOpen(false)}
        title="Project Actions & Info"
        description="View technical parameters, copy pathways, or navigate project sections."
      >
        <div className="flex flex-col gap-6 py-1">
          {/* Section 1: Navigation / Core Operations */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-text-tertiary">
              Core Operations
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsActionsSheetOpen(false);
                  navigate("/projects");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-muted-surface hover:bg-muted-surface/70 border border-border-subtle rounded-lg text-xs font-medium text-text-primary transition-colors text-left"
              >
                <FolderDot className="w-4 h-4 text-accent-primary shrink-0" />
                <span>Open Projects Directory</span>
              </button>
              
              <button
                onClick={() => {
                  setIsActionsSheetOpen(false);
                  navigate("/design-system");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-muted-surface hover:bg-muted-surface/70 border border-border-subtle rounded-lg text-xs font-medium text-text-primary transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-text-secondary shrink-0" />
                <span>View Global Design System</span>
              </button>

              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-muted-surface hover:bg-muted-surface/70 border border-border-subtle rounded-lg text-xs font-medium text-text-primary transition-colors text-left"
                >
                  <Github className="w-4 h-4 text-text-secondary shrink-0" />
                  <span>Open Code Repository</span>
                </a>
              )}

              {project.deploymentUrl && (
                <a
                  href={project.deploymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-muted-surface hover:bg-muted-surface/70 border border-border-subtle rounded-lg text-xs font-medium text-text-primary transition-colors text-left"
                >
                  <ExternalLink className="w-4 h-4 text-text-secondary shrink-0" />
                  <span>Open Live Deployment</span>
                </a>
              )}
            </div>
          </div>

          {/* Section 2: Safe Pathways & Copy Coordinates */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-text-tertiary">
              Workspace Coordinates
            </h3>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-tertiary font-mono">PROJECT SLUG</span>
                <div className="flex items-center justify-between p-2.5 bg-muted-surface border border-border-subtle rounded-lg text-xs">
                  <code className="font-mono text-text-primary font-medium">{project.slug}</code>
                  <button
                    onClick={handleCopySlug}
                    className="p-1 text-text-secondary hover:text-text-primary bg-bg-primary hover:bg-muted-surface border border-border-subtle rounded transition-all"
                    title="Copy Slug"
                  >
                    {copiedSlug ? (
                      <Check className="w-3.5 h-3.5 text-status-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-text-tertiary font-mono">SAFE LOCAL PATHWAY</span>
                <div className="flex items-center justify-between p-2.5 bg-muted-surface border border-border-subtle rounded-lg text-xs">
                  <code className="font-mono text-text-primary font-medium truncate max-w-[280px]">
                    {`~/projects/personal/${project.slug}`}
                  </code>
                  <button
                    onClick={handleCopyPath}
                    className="p-1 text-text-secondary hover:text-text-primary bg-bg-primary hover:bg-muted-surface border border-border-subtle rounded transition-all shrink-0"
                    title="Copy Local Path"
                  >
                    {copiedPath ? (
                      <Check className="w-3.5 h-3.5 text-status-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Read-Only Project Metadata */}
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-text-tertiary">
              Project Parameters
            </h3>
            <div className="grid grid-cols-2 gap-3.5 bg-muted-surface border border-border-subtle p-3.5 rounded-xl text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-tertiary font-mono">STATUS</span>
                <span className="font-semibold text-text-primary">{project.status}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-tertiary font-mono">HEALTH</span>
                <span className="font-semibold text-text-primary">{project.health}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-tertiary font-mono">PRIORITY</span>
                <span className="font-semibold text-text-primary">{project.priority}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-text-tertiary font-mono">PROGRESS</span>
                <span className="font-semibold text-text-primary">{project.progress}%</span>
              </div>
              <div className="flex flex-col gap-0.5 col-span-2">
                <span className="text-[10px] text-text-tertiary font-mono">LAST UPDATED</span>
                <span className="font-semibold text-text-primary">{project.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </Sheet>

    </header>
  );
}
