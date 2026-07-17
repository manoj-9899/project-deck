/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SearchResult } from "../../types/global-search";
import { cn } from "../../lib/cn";
import {
  LayoutDashboard,
  Folder,
  CheckSquare,
  Calendar,
  BookOpen,
  Terminal,
  Link,
  Home,
  Settings,
  Layers,
  Cpu,
  Milestone,
  FileText,
  PlusCircle,
  FilePlus,
  FolderGit2,
  FolderKanban,
  ListChecks,
  Palette,
  Star,
  ExternalLink,
  GitBranch,
  CornerDownLeft,
} from "lucide-react";

// Mapping icons for fast lookups
const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard,
  Folder,
  CheckSquare,
  Calendar,
  BookOpen,
  Terminal,
  Link,
  Home,
  Settings,
  Layers,
  Cpu,
  Milestone,
  FileText,
  PlusCircle,
  FilePlus,
  FolderGit2,
  FolderKanban,
  ListChecks,
  Palette,
  Star,
  ExternalLink,
  GitBranch,
};

interface SearchResultItemProps {
  item: SearchResult;
  isActive: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  item,
  isActive,
  onSelect,
  onMouseEnter,
}) => {
  // Retrieve the mapped icon or fallback to default Document/Link icons
  const IconComponent = iconMap[item.icon || ""] || FileText;

  // Render type-specific meta tags or status pills
  const renderMetaBadge = () => {
    switch (item.type) {
      case "Task": {
        const priority = item.metadata?.priority;
        const status = item.metadata?.status;
        const isBlocked = item.metadata?.isBlocked;

        return (
          <div className="flex items-center gap-1.5 shrink-0">
            {isBlocked && (
              <span className="text-[10px] px-1.5 py-0.5 bg-status-danger/10 text-status-danger border border-status-danger/20 rounded font-medium">
                Blocked
              </span>
            )}
            {priority && (
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-medium border",
                  priority === "Critical" && "bg-status-danger/10 text-status-danger border-status-danger/20",
                  priority === "High" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                  priority === "Medium" && "bg-blue-500/10 text-blue-600 border-blue-500/20",
                  priority === "Low" && "bg-zinc-500/10 text-zinc-600 border-zinc-500/20"
                )}
              >
                {priority}
              </span>
            )}
            {status && (
              <span className="text-[10px] text-text-tertiary capitalize">
                &bull; {status}
              </span>
            )}
          </div>
        );
      }
      case "Resource": {
        const isFavorite = item.metadata?.isFavorite;
        const status = item.metadata?.status;
        const resType = item.metadata?.resourceType;

        return (
          <div className="flex items-center gap-1.5 shrink-0">
            {isFavorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
            {resType && (
              <span className="text-[10px] px-1.5 py-0.5 bg-muted-surface border border-border-subtle rounded text-text-secondary font-medium">
                {resType}
              </span>
            )}
            {status && (
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  status === "Active" && "bg-status-success",
                  status === "Pending" && "bg-amber-500",
                  status === "Broken" && "bg-status-danger",
                  status === "Inactive" && "bg-text-tertiary"
                )}
                title={`Status: ${status}`}
              />
            )}
          </div>
        );
      }
      case "Knowledge": {
        const entryType = item.metadata?.entryType;
        const status = item.metadata?.status;
        return (
          <div className="flex items-center gap-1.5 shrink-0">
            {entryType && (
              <span className="text-[10px] px-1.5 py-0.5 bg-accent-primary/10 text-accent-primary border border-accent-primary/20 rounded font-medium font-mono">
                {entryType}
              </span>
            )}
            {status && <span className="text-[10px] text-text-tertiary">&bull; {status}</span>}
          </div>
        );
      }
      case "Prompt": {
        const tool = item.metadata?.tool;
        return (
          <div className="flex items-center gap-1.5 shrink-0">
            {tool && (
              <span className="text-[10px] px-1.5 py-0.5 bg-muted-surface border border-border-subtle rounded font-mono text-text-secondary">
                {tool}
              </span>
            )}
          </div>
        );
      }
      case "Roadmap": {
        const itemType = item.metadata?.itemType; // phase or milestone
        const status = item.metadata?.status;
        return (
          <div className="flex items-center gap-1.5 shrink-0">
            {itemType && (
              <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/10 text-purple-600 border border-purple-500/20 rounded font-medium capitalize">
                {itemType}
              </span>
            )}
            {status && (
              <span className="text-[10px] text-text-tertiary capitalize">
                &bull; {status.replace("-", " ")}
              </span>
            )}
          </div>
        );
      }
      case "Action":
        return (
          <kbd className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 bg-muted-surface border border-border-subtle rounded-md font-mono text-[9px] text-text-tertiary font-normal shadow-xs">
            Action
          </kbd>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={cn(
        "group flex items-start gap-3.5 px-4 py-3 rounded-lg cursor-pointer transition-all duration-150 relative border-l-2 select-none",
        isActive
          ? "bg-accent-soft border-accent-primary text-text-primary shadow-xs"
          : "border-transparent text-text-secondary hover:bg-muted-surface/50 hover:text-text-primary"
      )}
      role="option"
      aria-selected={isActive}
    >
      {/* Icon frame */}
      <div
        className={cn(
          "p-1.5 rounded-lg border flex items-center justify-center shrink-0 transition-all",
          isActive
            ? "bg-surface border-accent-primary/20 text-accent-primary"
            : "bg-muted-surface border-border-subtle text-text-tertiary group-hover:text-text-secondary"
        )}
      >
        <IconComponent className="w-4 h-4" />
      </div>

      {/* Content area */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2 justify-between flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className={cn(
              "font-medium text-sm truncate transition-colors",
              isActive ? "text-text-primary" : "text-text-primary group-hover:text-accent-primary"
            )}>{item.title}</span>
            {item.projectName && (
              <span className="text-[10px] font-medium text-text-tertiary truncate max-w-[120px] bg-muted-surface/65 px-1 rounded">
                in {item.projectName}
              </span>
            )}
          </div>
          {renderMetaBadge()}
        </div>

        {item.description && (
          <p
            className={cn(
              "text-xs line-clamp-1 truncate transition-colors",
              isActive ? "text-text-secondary" : "text-text-tertiary group-hover:text-text-secondary"
            )}
          >
            {item.description}
          </p>
        )}
      </div>

      {/* Selected marker prompt (Action indicator) */}
      {isActive && (
        <div className="hidden sm:flex items-center gap-1 shrink-0 self-center pl-2 animate-fade-in text-text-tertiary">
          <CornerDownLeft className="w-3.5 h-3.5 text-accent-primary" />
        </div>
      )}
    </div>
  );
};
