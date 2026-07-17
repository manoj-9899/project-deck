import React from "react";
import { FolderGit2, Calendar, FileType, Star, HardDriveDownload, Cloud } from "lucide-react";
import { Project } from "../../types";

interface ProjectFactsProps {
  project: Project;
}

export default function ProjectFacts({ project }: ProjectFactsProps) {
  const getFactItem = (label: string, value: string | React.ReactNode, icon: React.ReactNode) => (
    <div className="flex items-center justify-between p-2.5 bg-muted-surface border border-border-subtle rounded-lg text-xs">
      <div className="flex items-center gap-2 text-text-secondary">
        {icon}
        <span className="font-medium text-text-tertiary font-sans">{label}</span>
      </div>
      <span className="font-semibold text-text-primary text-right max-w-[150px] truncate">
        {value}
      </span>
    </div>
  );

  return (
    <div id="project-facts-panel" className="bg-bg-primary border border-border-subtle rounded-xl p-5 flex flex-col gap-4 font-sans">
      <div className="flex items-center gap-2">
        <FolderGit2 className="w-4 h-4 text-accent-primary" />
        <h3 className="text-sm font-semibold text-text-primary tracking-tight">Technical Coordinates</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" id="facts-items-container">
        {getFactItem(
          "Project Slug",
          <code className="text-[11px] font-mono bg-bg-primary px-1 py-0.5 rounded border border-border-subtle">{project.slug}</code>,
          <FileType className="w-3.5 h-3.5 text-text-tertiary" />
        )}
        
        {getFactItem(
          "Category",
          project.category,
          <Star className="w-3.5 h-3.5 text-text-tertiary" />
        )}

        {getFactItem(
          "Start Date",
          project.startDate || "Not scheduled",
          <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
        )}

        {getFactItem(
          "Target Date",
          project.targetDate || "Not scheduled",
          <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
        )}

        {getFactItem(
          "Source Code",
          project.repositoryUrl ? "Configured" : "None",
          <HardDriveDownload className="w-3.5 h-3.5 text-text-tertiary" />
        )}

        {getFactItem(
          "Deployment",
          project.deploymentUrl ? "Live" : "None",
          <Cloud className="w-3.5 h-3.5 text-text-tertiary" />
        )}
      </div>
    </div>
  );
}
