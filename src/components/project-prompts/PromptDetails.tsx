/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { 
  Calendar, 
  Layers, 
  CheckSquare, 
  Pencil, 
  Clipboard, 
  Terminal,
  Archive,
  Clock,
  Heart,
  PlayCircle,
  GitBranch,
  Copy,
  Trash2,
  FileText,
  Bookmark
} from "lucide-react";
import { ProjectPrompt } from "../../types/project-prompt";
import { Sheet } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useToast } from "../ui/Toast";

interface PromptDetailsProps {
  prompt: ProjectPrompt | null;
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  isEditable: boolean;
  onEdit: (prompt: ProjectPrompt) => void;
  onDuplicate: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onMarkUsed: (id: string) => void;
  onToggleArchive: (id: string) => void;
  onNewVersion: (prompt: ProjectPrompt) => void;
  onRestoreVersion: (id: string, versionNum: number) => void;
  onDelete: (id: string) => void;
}

export default function PromptDetails({
  prompt,
  isOpen,
  onClose,
  projectName,
  phases,
  tasks,
  isEditable,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onMarkUsed,
  onToggleArchive,
  onNewVersion,
  onRestoreVersion,
  onDelete,
}: PromptDetailsProps) {
  const { toast } = useToast();
  const [copiedType, setCopiedType] = useState<"prompt" | "handover" | "package" | null>(null);

  if (!prompt) return null;

  // Resolve Titles
  const phase = phases.find((p) => p.id === prompt.relatedPhaseId);
  const phaseTitle = phase ? phase.title : (prompt.relatedPhaseId ? "Referenced item unavailable" : null);

  const task = tasks.find((t) => t.id === prompt.relatedTaskId);
  const taskTitle = task ? task.title : (prompt.relatedTaskId ? "Referenced item unavailable" : null);

  // Helper date conversions
  const createdStr = new Date(prompt.createdAt).toLocaleDateString();
  const updatedStr = new Date(prompt.updatedAt).toLocaleDateString();
  const lastUsedStr = prompt.lastUsedAt ? new Date(prompt.lastUsedAt).toLocaleDateString() : "Never used";

  // Actions
  const handleCopyPromptText = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      setCopiedType("prompt");
      toast({
        type: "success",
        title: "Prompt Copied",
        message: "The raw prompt text was copied successfully.",
      });
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      toast({ type: "error", title: "Copy Failed", message: "Failed to copy text." });
    }
  };

  const handleCopyHandoverOnly = async () => {
    if (!prompt.handoverContext) return;
    try {
      await navigator.clipboard.writeText(prompt.handoverContext);
      setCopiedType("handover");
      toast({
        type: "success",
        title: "Handover Context Copied",
        message: "The handover context text was copied successfully.",
      });
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      toast({ type: "error", title: "Copy Failed", message: "Failed to copy text." });
    }
  };

  const handleCopyCombinedPackage = async () => {
    const pkgText = [
      `Project Workspace: ${projectName}`,
      `Prompt Title: ${prompt.title}`,
      `Linked Phase: ${phaseTitle || "None"}`,
      `Linked Task: ${taskTitle || "None"}`,
      `Current Version: v${prompt.version}`,
      "",
      "--- CORE AI PROMPT ---",
      prompt.prompt,
      "",
      "--- HANDOVER CONTEXT ---",
      prompt.handoverContext || "No additional session handover context specified."
    ].join("\n");

    try {
      await navigator.clipboard.writeText(pkgText);
      setCopiedType("package");
      toast({
        type: "success",
        title: "Combined Package Copied",
        message: "The complete prompt + session handover bundle was copied successfully.",
      });
      setTimeout(() => setCopiedType(null), 2000);
    } catch (err) {
      toast({ type: "error", title: "Copy Failed", message: "Failed to copy package." });
    }
  };

  // Safe markdown text layout parser (from KnowledgeDetails)
  const renderMarkdownText = (text?: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return (
      <div className="space-y-2 font-mono text-xs text-slate-700 leading-relaxed select-text">
        {lines.map((line, idx) => {
          if (line.startsWith("### ")) {
            return <h4 key={idx} className="text-xs font-bold text-slate-900 mt-3 mb-1">{line.replace("### ", "")}</h4>;
          }
          if (line.startsWith("## ")) {
            return <h3 key={idx} className="text-sm font-bold text-slate-900 mt-4 mb-1 border-b border-gray-100 pb-0.5">{line.replace("## ", "")}</h3>;
          }
          if (line.startsWith("# ")) {
            return <h2 key={idx} className="text-base font-extrabold text-slate-900 mt-5 mb-2">{line.replace("# ", "")}</h2>;
          }
          if (line.startsWith("* ") || line.startsWith("- ")) {
            return <li key={idx} className="ml-3 list-disc text-slate-600">{line.substring(2)}</li>;
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }
          return <p key={idx} className="break-words leading-relaxed whitespace-pre-wrap">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={prompt.title}
      size="lg"
    >
      <div className="flex flex-col justify-between h-full font-sans" id={`prompt-details-${prompt.id}`}>
        {/* Scrollable Area */}
        <div className="grow overflow-y-auto px-6 py-4 pb-24 space-y-6">
          
          {/* Badge & Timestamp headers */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-gray-150">
            <Badge variant="neutral" className="text-xs uppercase font-bold tracking-wider">
              {prompt.category}
            </Badge>

            <span className="text-[11px] font-bold bg-slate-50 text-slate-700 border border-gray-200 rounded-lg px-2.5 py-1">
              {prompt.tool}
            </span>

            <span className="text-xs text-purple-600 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full font-mono flex items-center gap-1 font-semibold">
              <GitBranch className="w-3.5 h-3.5" />
              Active Version: v{prompt.version}
            </span>

            {prompt.isFavorite && (
              <span className="flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                <Heart className="w-3.5 h-3.5 mr-1 fill-rose-500 text-rose-500" />
                Favorite
              </span>
            )}

            {prompt.isArchived && (
              <span className="flex items-center text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                <Archive className="w-3.5 h-3.5 mr-1 text-gray-500" />
                Archived
              </span>
            )}
          </div>

          {/* Temporal Log Strip */}
          <div className="grid grid-cols-3 gap-2 bg-gray-50 border border-gray-100 p-3 rounded-xl text-center text-[10px] font-medium text-gray-500">
            <div>
              <span className="block text-[9px] font-bold uppercase text-gray-400">Created Date</span>
              <span className="text-gray-700 font-semibold">{createdStr}</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase text-gray-400">Last Modified</span>
              <span className="text-gray-700 font-semibold">{updatedStr}</span>
            </div>
            <div>
              <span className="block text-[9px] font-bold uppercase text-gray-400">Last Used In-App</span>
              <span className="text-gray-700 font-semibold">{lastUsedStr}</span>
            </div>
          </div>

          {/* Copy Commands Toolbar */}
          <div className="flex flex-col sm:flex-row gap-2" id="detail-copy-shortcuts-panel">
            <button
              onClick={handleCopyPromptText}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl shadow-sm transition-all focus:outline-none"
            >
              <Clipboard className="w-4 h-4 text-gray-400" />
              <span>{copiedType === "prompt" ? "Copied Raw Prompt!" : "Copy Prompt Text"}</span>
            </button>

            {prompt.handoverContext && (
              <button
                onClick={handleCopyHandoverOnly}
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-gray-200 px-3 py-2 rounded-xl shadow-sm transition-all focus:outline-none"
              >
                <FileText className="w-4 h-4 text-gray-400" />
                <span>{copiedType === "handover" ? "Copied Handover!" : "Copy Handover Only"}</span>
              </button>
            )}

            <button
              onClick={handleCopyCombinedPackage}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-white hover:bg-slate-800 bg-slate-900 px-3 py-2 rounded-xl shadow-md transition-all focus:outline-none"
            >
              <Bookmark className="w-4 h-4 text-slate-300" />
              <span>{copiedType === "package" ? "Copied Bundle Package!" : "Copy Combined Package"}</span>
            </button>
          </div>

          {/* CORE PROMPT TEXT BLOCK */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Prompt Content (v{prompt.version})</h4>
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 shadow-inner max-h-80 overflow-y-auto">
              {renderMarkdownText(prompt.prompt)}
            </div>
          </div>

          {/* DESCRIPTION */}
          {prompt.description && (
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Description</h4>
              <p className="text-sm text-gray-600 bg-white border border-gray-100 p-3 rounded-xl leading-relaxed">{prompt.description}</p>
            </div>
          )}

          {/* RESPONSE SUMMARY */}
          {prompt.responseSummary && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Response Summary (Outcome)</h4>
              <div className="text-sm text-emerald-950 bg-emerald-50/50 border border-emerald-100/60 p-3 rounded-xl leading-relaxed">
                {prompt.responseSummary}
              </div>
            </div>
          )}

          {/* HANDOVER CONTEXT BOX */}
          {prompt.handoverContext && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Session Handover Context</h4>
              <div className="text-xs font-mono text-purple-950 bg-purple-50/30 border border-purple-100 p-3 rounded-xl whitespace-pre-wrap break-words leading-relaxed select-text">
                {prompt.handoverContext}
              </div>
            </div>
          )}

          {/* LINKED COORDINATES */}
          {(phaseTitle || taskTitle) && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-2">
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Workspace Bindings</h4>
              <div className="space-y-1.5">
                {phaseTitle && (
                  <div className="flex items-center justify-between text-xs bg-white border border-gray-100 p-2.5 rounded-lg">
                    <span className="text-gray-500 font-semibold flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-gray-400" />
                      Roadmap Milestone:
                    </span>
                    <span className={`font-bold ${phaseTitle === "Referenced item unavailable" ? "text-red-500 italic" : "text-gray-900"}`}>
                      {phaseTitle}
                    </span>
                  </div>
                )}
                {taskTitle && (
                  <div className="flex items-center justify-between text-xs bg-white border border-gray-100 p-2.5 rounded-lg">
                    <span className="text-gray-500 font-semibold flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-gray-400" />
                      Active Task:
                    </span>
                    <span className={`font-bold ${taskTitle === "Referenced item unavailable" ? "text-red-500 italic" : "text-gray-900"}`}>
                      {taskTitle}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAGS */}
          {prompt.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Labels & Tags</h4>
              <div className="flex flex-wrap gap-1.5">
                {prompt.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-2.5 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* VERSION HISTORY */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Sequential Version History ({prompt.versions.length})</h4>
              {isEditable && (
                <button
                  onClick={() => onNewVersion(prompt)}
                  className="text-xs font-bold text-purple-600 hover:text-purple-800 transition-colors focus:outline-none flex items-center gap-1"
                  id={`btn-new-version-detail-${prompt.id}`}
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  New Version
                </button>
              )}
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1" id="versions-history-timeline">
              {prompt.versions.map((v) => (
                <div key={v.id} className="p-3 bg-white border border-gray-150 rounded-xl shadow-sm text-xs flex flex-col gap-2 relative">
                  <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
                    <span className="font-mono font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                      Version {v.version}
                    </span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(v.createdAt).toLocaleDateString()} {new Date(v.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-slate-700 font-mono text-[11px] break-all max-h-32 overflow-y-auto">
                    {v.prompt}
                  </div>

                  {v.changeSummary && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50/50 p-2 rounded-lg border border-dashed border-gray-150">
                      <strong>Notes:</strong> {v.changeSummary}
                    </p>
                  )}

                  {isEditable && v.version !== prompt.version && (
                    <button
                      onClick={() => onRestoreVersion(prompt.id, v.version)}
                      className="text-[10px] font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 py-1.5 px-3 rounded-lg self-end transition-all focus:outline-none"
                    >
                      Restore as v{prompt.version + 1}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer sticky bar with mutation controls */}
        <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-gray-100 bg-white/95 backdrop-blur-sm flex items-center justify-between px-6 z-10">
          <div className="flex gap-2">
            {isEditable && (
              <Button
                onClick={() => {
                  onClose();
                  onDelete(prompt.id);
                }}
                variant="secondary"
                className="hover:text-red-600 hover:border-red-200 h-10 px-3 font-semibold rounded-xl"
                id={`btn-detail-delete-${prompt.id}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}

            {isEditable && (
              <Button
                onClick={() => onToggleFavorite(prompt.id)}
                variant="secondary"
                className={`h-10 px-3 font-semibold rounded-xl ${prompt.isFavorite ? "text-rose-500 border-rose-200" : ""}`}
                id={`btn-detail-fav-${prompt.id}`}
              >
                <Heart className={`w-4 h-4 ${prompt.isFavorite ? "fill-rose-500" : ""}`} />
              </Button>
            )}

            {isEditable && prompt.status !== "Used" && (
              <Button
                onClick={() => onMarkUsed(prompt.id)}
                variant="secondary"
                className="h-10 px-3 font-semibold rounded-xl gap-1"
                id={`btn-detail-markused-${prompt.id}`}
              >
                <PlayCircle className="w-4 h-4 text-blue-500" />
                <span className="text-xs hidden sm:inline">Mark Used</span>
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="secondary"
              className="h-10 px-4 text-xs font-semibold rounded-xl"
            >
              Close
            </Button>
            
            {isEditable && (
              <Button
                onClick={() => {
                  onClose();
                  onEdit(prompt);
                }}
                variant="primary"
                className="gap-1.5 h-10 px-4 text-xs font-semibold rounded-xl shadow"
                id={`btn-detail-edit-${prompt.id}`}
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Prompt
              </Button>
            )}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
