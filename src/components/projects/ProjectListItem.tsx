import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { Progress } from "../ui/Progress";
import { DropdownMenu } from "../ui/DropdownMenu";
import { useToast } from "../ui/Toast";
import { Project } from "../../types";
import {
  MoreVertical,
  Calendar,
  Clock,
  Compass,
  Edit,
  Copy,
  Archive,
  RotateCcw,
  Trash2,
  Folder
} from "lucide-react";

interface ProjectListItemProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onArchive: (project: Project) => void;
  onRestore: (id: string) => void;
}

export default function ProjectListItem({
  project,
  onEdit,
  onDuplicate,
  onArchive,
  onRestore
}: ProjectListItemProps) {
  const { toast } = useToast();
  
  const healthVariants = {
    "On track": "success",
    "Needs attention": "warning",
    "Blocked": "danger",
    "Stable": "success",
    "Inactive": "neutral",
  } as const;

  const priorityVariants = {
    Critical: "danger",
    High: "warning",
    Medium: "accent",
    Low: "neutral",
  } as const;

  const menuItems = [
    {
      label: "Edit Settings",
      icon: <Edit className="w-3.5 h-3.5" />,
      onClick: () => onEdit(project)
    },
    {
      label: "Duplicate",
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: () => onDuplicate(project)
    },
    {
      label: "---",
    },
    project.isArchived
      ? {
          label: "Restore Project",
          icon: <RotateCcw className="w-3.5 h-3.5" />,
          onClick: () => onRestore(project.id)
        }
      : {
          label: "Archive",
          icon: <Archive className="w-3.5 h-3.5" />,
          onClick: () => onArchive(project)
        },
    {
      label: "---",
    },
    {
      label: "Delete project",
      icon: <Trash2 className="w-3.5 h-3.5 text-text-tertiary" />,
      onClick: () => {
        toast({
          type: "info",
          title: "Feature Unavailable",
          message: "Permanent project deletion will become available after persistent storage is implemented.",
          duration: 4000
        });
      }
    }
  ];

  return (
    <div className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border-subtle hover:border-accent-primary bg-surface hover:bg-accent-soft/5 rounded-xl shadow-subtle transition-all duration-200 font-sans">
      
      {/* Left Segment: Name & Metadata */}
      <div className="flex items-start gap-3.5 min-w-0 md:flex-1">
        <div className="p-2.5 bg-muted-surface group-hover:bg-accent-soft border border-border-subtle group-hover:border-accent-primary/20 text-text-secondary group-hover:text-accent-primary rounded-lg shrink-0 mt-0.5 transition-colors">
          <Folder className="w-4.5 h-4.5" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/projects/${project.id}`}
              className="text-sm font-extrabold text-text-primary group-hover:text-accent-primary hover:underline transition-colors truncate"
            >
              {project.name}
            </Link>
            <span className="text-[10px] font-mono text-text-tertiary">/</span>
            <span className="text-[9px] font-mono text-text-secondary bg-muted-surface/70 px-1.5 py-0.2 rounded border border-border-subtle/20">
              {project.category}
            </span>
            {project.priority === "Critical" && (
              <Badge variant="danger" className="text-[8px] font-mono font-bold px-1.5 py-0 uppercase">
                CRITICAL
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <p className="text-xs text-text-secondary line-clamp-1 max-w-[280px] lg:max-w-[450px]">
              {project.description}
            </p>
            {project.techStack && project.techStack.length > 0 && (
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-[9px] font-mono text-text-tertiary">•</span>
                <span className="text-[9px] font-mono text-text-tertiary truncate max-w-[150px]">
                  {project.techStack.slice(0, 3).join(", ")}
                  {project.techStack.length > 3 ? "..." : ""}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center/Right Segment: Progress, Health and Dropdown Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-4 shrink-0 w-full md:w-auto md:gap-6 lg:gap-8">
        
        {/* Dates */}
        <div className="flex flex-row sm:flex-col gap-3 sm:gap-1.5 text-[10px] font-mono text-text-tertiary">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Target: {project.targetDate || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Active: {project.lastUpdated}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex flex-col gap-1 w-full sm:w-36 shrink-0">
          <div className="flex items-center justify-between text-[10px] font-mono text-text-secondary">
            <span>Progress</span>
            <span className="font-bold">{project.progress}%</span>
          </div>
          <Progress
            value={project.progress}
            variant={project.status === "Paused" ? "warning" : "accent"}
            size="sm"
          />
          <span className="text-[9px] font-mono text-text-tertiary truncate max-w-[140px]">
            {project.currentPhase ? project.currentPhase : "Planning"}
          </span>
        </div>

        {/* Health & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <Badge
            variant={healthVariants[project.health] || "neutral"}
            className="font-mono text-[9px] uppercase px-1.5 py-0.5 shrink-0"
          >
            {project.health}
          </Badge>

          <div className="shrink-0">
            <DropdownMenu
              trigger={
                <button className="p-1 text-text-tertiary hover:text-text-primary hover:bg-muted-surface border border-transparent hover:border-border-subtle rounded-md transition-all cursor-pointer">
                  <MoreVertical className="w-4 h-4" />
                </button>
              }
              items={menuItems}
              align="right"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
