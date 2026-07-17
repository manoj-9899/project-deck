/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { 
  Heart, 
  Terminal, 
  Calendar,
  Layers,
  CheckSquare,
  Sparkles,
  GitBranch
} from "lucide-react";
import { ProjectPrompt, PromptStatus } from "../../types/project-prompt";
import { Badge } from "../ui/Badge";
import PromptMenu from "./PromptMenu";

interface PromptCardProps {
  key?: React.Key;
  prompt: ProjectPrompt;
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onToggleFavorite: () => void;
  onMarkUsed: () => void;
  onToggleArchive: () => void;
  onNewVersion: () => void;
  onDelete: () => void;
  isEditable: boolean;
}

export default function PromptCard({
  prompt,
  phases,
  tasks,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onMarkUsed,
  onToggleArchive,
  onDelete,
  onNewVersion,
  isEditable,
}: PromptCardProps) {

  // Resolve Phase Title
  const phaseTitle = useMemo(() => {
    if (!prompt.relatedPhaseId) return null;
    const found = phases.find((p) => p.id === prompt.relatedPhaseId);
    return found ? (found.title.split(" — ")[1] || found.title) : "Referenced item unavailable";
  }, [prompt.relatedPhaseId, phases]);

  // Resolve Task Title
  const taskTitle = useMemo(() => {
    if (!prompt.relatedTaskId) return null;
    const found = tasks.find((t) => t.id === prompt.relatedTaskId);
    return found ? found.title : "Referenced item unavailable";
  }, [prompt.relatedTaskId, tasks]);

  // Status badge mappings
  const getStatusBadge = (status: PromptStatus) => {
    switch (status) {
      case "Ready":
        return <Badge variant="success" className="text-[10px] font-semibold">{status}</Badge>;
      case "Used":
        return <Badge variant="info" className="text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100">{status}</Badge>;
      case "Needs revision":
        return <Badge variant="warning" className="text-[10px] font-semibold">{status}</Badge>;
      case "Draft":
        return <Badge variant="neutral" className="text-[10px] font-semibold">{status}</Badge>;
      case "Archived":
        return <Badge variant="danger" className="text-[10px] font-semibold">{status}</Badge>;
      default:
        return <Badge variant="neutral" className="text-[10px] font-semibold">{status}</Badge>;
    }
  };

  // Format updated timestamp
  const formattedDate = useMemo(() => {
    const date = new Date(prompt.updatedAt);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [prompt.updatedAt]);

  return (
    <div 
      className={`relative bg-white border rounded-xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-between overflow-hidden text-left p-4 ${
        prompt.isFavorite ? "border-rose-100 bg-rose-50/5" : "border-gray-150"
      }`}
      id={`prompt-card-${prompt.id}`}
    >
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          <span className="p-1.5 bg-gray-50 border border-gray-100 rounded-lg">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
          </span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate">
            {prompt.category}
          </span>
          {prompt.isFavorite && (
            <span className="flex items-center text-[10px] text-rose-500 font-semibold bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-100">
              <Heart className="w-2.5 h-2.5 mr-0.5 fill-rose-500 text-rose-500" />
              Fav
            </span>
          )}
          {prompt.isArchived && (
            <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-200">
              Archived
            </span>
          )}
          <span className="inline-flex items-center gap-0.5 text-[10px] text-purple-600 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-md font-mono">
            <GitBranch className="w-2.5 h-2.5" />
            v{prompt.version}
          </span>
        </div>

        <div className="shrink-0 flex items-center gap-1">
          <PromptMenu
            prompt={prompt}
            onOpenDetails={onOpenDetails}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onToggleFavorite={onToggleFavorite}
            onMarkUsed={onMarkUsed}
            onToggleArchive={onToggleArchive}
            onNewVersion={onNewVersion}
            onDelete={onDelete}
            isEditable={isEditable}
          />
        </div>
      </div>

      {/* Main Card click area */}
      <div className="mb-4 cursor-pointer grow flex flex-col" onClick={onOpenDetails}>
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-slate-800 transition-colors mb-1.5 leading-snug line-clamp-1" id={`prompt-card-title-${prompt.id}`}>
          {prompt.title}
        </h3>

        {prompt.description && (
          <p className="text-xs text-gray-400 line-clamp-1 mb-2">
            {prompt.description}
          </p>
        )}

        {/* Prompt content block (monospace short preview) */}
        <div className="text-[11px] bg-slate-50 border border-slate-100 rounded-lg p-2.5 mb-3 font-mono text-slate-700 select-none grow">
          <p className="line-clamp-2 leading-relaxed break-words">{prompt.prompt}</p>
        </div>

        {/* Tags */}
        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {prompt.tags.map((tag) => (
              <span 
                key={tag} 
                className="text-[10px] font-semibold text-slate-600 bg-slate-100 rounded-md px-1.5 py-0.5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer relationships */}
      <div className="border-t border-gray-50 pt-3 flex flex-col gap-2">
        {(phaseTitle || taskTitle) && (
          <div className="flex flex-col gap-1 text-[11px] font-medium text-gray-500">
            {phaseTitle && (
              <div className="flex items-center gap-1.5">
                <Layers className={`w-3 h-3 ${phaseTitle === "Referenced item unavailable" ? "text-red-400" : "text-gray-400"}`} />
                <span className="truncate">
                  Phase:{" "}
                  <span className={`font-semibold ${phaseTitle === "Referenced item unavailable" ? "text-red-500 italic" : "text-gray-700"}`}>
                    {phaseTitle}
                  </span>
                </span>
              </div>
            )}
            {taskTitle && (
              <div className="flex items-center gap-1.5">
                <CheckSquare className={`w-3 h-3 ${taskTitle === "Referenced item unavailable" ? "text-red-400" : "text-gray-400"}`} />
                <span className="truncate">
                  Task:{" "}
                  <span className={`font-semibold ${taskTitle === "Referenced item unavailable" ? "text-red-500 italic" : "text-gray-700"}`}>
                    {taskTitle}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 text-[10px] text-gray-400 font-medium">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-300" />
            <span>Updated {formattedDate}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold bg-gray-50 text-gray-600 border border-gray-150 rounded px-1 py-0.5 font-sans truncate max-w-[100px]">
              {prompt.tool}
            </span>
            {getStatusBadge(prompt.status)}
          </div>
        </div>
      </div>
    </div>
  );
}
