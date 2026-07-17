import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody } from "../ui/Card";
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
  Folder,
  Code
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDuplicate: (project: Project) => void;
  onArchive: (project: Project) => void;
  onRestore: (id: string) => void;
}

export default function ProjectCard({
  project,
  onEdit,
  onDuplicate,
  onArchive,
  onRestore
}: ProjectCardProps) {
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

  // Set menu items
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
      label: "---", // Divider
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
      label: "---", // Divider
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
    <Card className="border border-border-subtle hover:border-accent-primary/60 bg-surface shadow-subtle group hover:shadow-floating transition-all duration-300 flex flex-col h-full overflow-hidden">
      <CardBody className="p-5 flex flex-col justify-between gap-4 h-full font-sans">
        
        {/* Header Block */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="p-2 bg-muted-surface border border-border-subtle group-hover:border-accent-primary/20 text-text-secondary group-hover:text-accent-primary rounded-lg shrink-0 transition-all">
              <Folder className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <Link
                to={`/projects/${project.id}`}
                className="text-base font-extrabold text-text-primary group-hover:text-accent-primary leading-tight hover:underline truncate transition-colors"
              >
                {project.name}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                <Badge variant="neutral" className="text-[9px] font-mono font-medium px-1.5 py-0">
                  {project.category}
                </Badge>
                {project.priority === "Critical" && (
                  <Badge variant="danger" className="text-[9px] font-mono font-bold px-1.5 py-0 uppercase">
                    CRITICAL
                  </Badge>
                )}
              </div>
            </div>
          </div>

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

        {/* Description Section */}
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 h-9">
          {project.description || "No description provided."}
        </p>

        {/* Tech Stack tags */}
        <div className="flex flex-wrap gap-1 items-center h-5 overflow-hidden">
          {project.techStack && project.techStack.length > 0 ? (
            project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-[9px] font-mono font-medium text-text-secondary bg-muted-surface/70 px-1.5 py-0.2 rounded border border-border-subtle/30"
              >
                {tech}
              </span>
            ))
          ) : (
            <span className="text-[9px] font-mono text-text-tertiary italic">No stack declared</span>
          )}
        </div>

        {/* Timeline block */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-text-tertiary py-1 border-y border-border-subtle/30">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
            <span>Target: {project.targetDate ? project.targetDate : "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-text-tertiary" />
            <span>Active: {project.lastUpdated}</span>
          </div>
        </div>

        {/* Next Action Indicator */}
        {project.nextAction && (
          <div className="bg-muted-surface/20 border border-border-subtle/50 rounded p-2.5 flex items-start gap-2 h-14 overflow-hidden">
            <Compass className="w-3.5 h-3.5 text-accent-primary shrink-0 mt-0.5 animate-spin-slow" />
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[8px] font-mono font-bold text-accent-primary uppercase tracking-wider">
                Next Action
              </span>
              <p className="text-[10px] text-text-secondary leading-normal truncate font-sans">
                {project.nextAction}
              </p>
            </div>
          </div>
        )}

        {/* Progress & Health Section */}
        <div className="flex flex-col gap-2 mt-1 pt-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-text-secondary font-medium">Progress</span>
            <span className="text-accent-primary font-bold">{project.progress}%</span>
          </div>
          <Progress
            value={project.progress}
            variant={project.status === "Paused" ? "warning" : "accent"}
            size="sm"
          />

          <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
            <span className="text-text-tertiary truncate max-w-[120px]">
              {project.currentPhase ? project.currentPhase : "Planning"}
            </span>
            <Badge
              variant={healthVariants[project.health] || "neutral"}
              className="text-[9px] px-1.5 py-0 uppercase"
            >
              {project.health}
            </Badge>
          </div>
        </div>

      </CardBody>
    </Card>
  );
}
