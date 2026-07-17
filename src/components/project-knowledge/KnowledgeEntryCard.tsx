import React from "react";
import { 
  Pin, 
  CheckCircle, 
  HelpCircle, 
  FileText, 
  AlertCircle,
  Calendar,
  Layers,
  CheckSquare,
  BookOpen,
  MessageSquare,
  Bookmark
} from "lucide-react";
import { ProjectKnowledgeEntry, DecisionStatus } from "../../types/project-knowledge";
import { Badge } from "../ui/Badge";
import KnowledgeEntryMenu from "./KnowledgeEntryMenu";

interface KnowledgeEntryCardProps {
  key?: React.Key;
  entry: ProjectKnowledgeEntry;
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onTogglePin: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
  onChangeDecisionStatus: (status: DecisionStatus) => void;
  isEditable: boolean;
}

export default function KnowledgeEntryCard({
  entry,
  phases,
  tasks,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onTogglePin,
  onToggleArchive,
  onDelete,
  onChangeDecisionStatus,
  isEditable,
}: KnowledgeEntryCardProps) {

  // Resolve Phase Title
  const phaseTitle = React.useMemo(() => {
    if (!entry.relatedPhaseId) return null;
    const found = phases.find((p) => p.id === entry.relatedPhaseId);
    return found ? (found.title.split(" — ")[1] || found.title) : "Referenced item unavailable";
  }, [entry.relatedPhaseId, phases]);

  // Resolve Task Title
  const taskTitle = React.useMemo(() => {
    if (!entry.relatedTaskId) return null;
    const found = tasks.find((t) => t.id === entry.relatedTaskId);
    return found ? found.title : "Referenced item unavailable";
  }, [entry.relatedTaskId, tasks]);

  // Get type icon
  const getTypeIcon = () => {
    switch (entry.type) {
      case "Decision":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case "Error & Solution":
        return <AlertCircle className="w-3.5 h-3.5 text-amber-500" />;
      case "Documentation":
        return <FileText className="w-3.5 h-3.5 text-blue-500" />;
      case "Research":
        return <Layers className="w-3.5 h-3.5 text-indigo-500" />;
      case "Meeting":
        return <MessageSquare className="w-3.5 h-3.5 text-purple-500" />;
      case "Implementation Summary":
        return <Bookmark className="w-3.5 h-3.5 text-pink-500" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  // Get status color/badge for decisions
  const getDecisionStatusBadge = (status?: DecisionStatus) => {
    if (!status) return null;
    switch (status) {
      case "Accepted":
        return <Badge variant="success" className="text-[10px] font-semibold">{status}</Badge>;
      case "Proposed":
        return <Badge variant="neutral" className="text-[10px] font-semibold">{status}</Badge>;
      case "Superseded":
        return <Badge variant="warning" className="text-[10px] font-semibold">{status}</Badge>;
      case "Rejected":
        return <Badge variant="danger" className="text-[10px] font-semibold">{status}</Badge>;
      default:
        return null;
    }
  };

  // Format date helper
  const formattedDate = React.useMemo(() => {
    const date = new Date(entry.updatedAt);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [entry.updatedAt]);

  return (
    <div 
      className={`relative bg-white border rounded-xl shadow-sm hover:shadow transition-all group flex flex-col justify-between overflow-hidden text-left p-4 ${
        entry.isPinned ? "border-rose-100 bg-rose-50/10" : "border-gray-100"
      }`}
    >
      {/* Top row: Type and Pin and Context Menu */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="p-1 bg-gray-50 border border-gray-100 rounded-md">
            {getTypeIcon()}
          </span>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate">
            {entry.type}
          </span>
          {entry.isPinned && (
            <span className="flex items-center text-[10px] text-rose-500 font-semibold bg-rose-50 px-1.5 py-0.5 rounded-full border border-rose-100">
              <Pin className="w-2.5 h-2.5 mr-0.5 fill-rose-500 text-rose-500" />
              Pinned
            </span>
          )}
          {entry.isArchived && (
            <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
              Archived
            </span>
          )}
        </div>

        <div className="shrink-0 flex items-center gap-1">
          <KnowledgeEntryMenu
            entry={entry}
            onOpenDetails={onOpenDetails}
            onEdit={onEdit}
            onDuplicate={onDuplicate}
            onTogglePin={onTogglePin}
            onToggleArchive={onToggleArchive}
            onDelete={onDelete}
            onChangeDecisionStatus={onChangeDecisionStatus}
            isEditable={isEditable}
          />
        </div>
      </div>

      {/* Title & Preview */}
      <div className="mb-3.5 cursor-pointer" onClick={onOpenDetails}>
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-slate-800 transition-colors mb-1.5 leading-snug line-clamp-1">
          {entry.title}
        </h3>

        {/* Content Preview */}
        {entry.type === "Decision" && entry.decision ? (
          <div className="text-xs bg-slate-50 border border-slate-100/60 rounded-lg p-2.5 mb-2">
            <span className="block font-bold text-slate-700 uppercase text-[9px] tracking-wide mb-0.5">Decision Summary:</span>
            <p className="text-gray-600 line-clamp-2 leading-relaxed">{entry.decision}</p>
          </div>
        ) : entry.type === "Error & Solution" && entry.errorMessage ? (
          <div className="text-xs bg-amber-50/40 border border-amber-100/60 rounded-lg p-2.5 mb-2 font-mono text-amber-900">
            <span className="block font-bold text-amber-800 uppercase text-[9px] tracking-wide mb-0.5">Caught Error:</span>
            <p className="line-clamp-2 leading-normal break-all">{entry.errorMessage}</p>
          </div>
        ) : (
          <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-2">
            {entry.content}
          </p>
        )}

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
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

      {/* Bottom Row: Relations and Dates */}
      <div className="border-t border-gray-50 pt-3 flex flex-col gap-2">
        {/* Linked Phase or Task */}
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

        {/* Footer info: Date & Decisions status */}
        <div className="flex items-center justify-between gap-2 text-[10px] text-gray-400 font-medium">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-300" />
            <span>Updated {formattedDate}</span>
          </div>
          
          <div>
            {entry.type === "Decision" && getDecisionStatusBadge(entry.status)}
          </div>
        </div>
      </div>
    </div>
  );
}
