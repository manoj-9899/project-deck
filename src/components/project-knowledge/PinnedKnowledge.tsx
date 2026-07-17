import React from "react";
import { Pin, ArrowUpRight, CheckCircle, FileText, AlertCircle, HelpCircle } from "lucide-react";
import { ProjectKnowledgeEntry } from "../../types/project-knowledge";
import { Badge } from "../ui/Badge";

interface PinnedKnowledgeProps {
  pinnedEntries: ProjectKnowledgeEntry[];
  onOpenDetails: (entry: ProjectKnowledgeEntry) => void;
}

export default function PinnedKnowledge({ pinnedEntries, onOpenDetails }: PinnedKnowledgeProps) {
  if (pinnedEntries.length === 0) return null;

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case "Proposed":
        return <HelpCircle className="w-3.5 h-3.5 text-blue-500" />;
      case "Superseded":
        return <FileText className="w-3.5 h-3.5 text-amber-500" />;
      case "Rejected":
        return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case "Accepted":
        return "success";
      case "Proposed":
        return "neutral";
      case "Superseded":
        return "warning";
      case "Rejected":
        return "danger";
      default:
        return "neutral";
    }
  };

  return (
    <div className="mb-6 bg-slate-50 border border-slate-200/60 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 uppercase tracking-wider mb-3">
        <Pin className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        <span>Pinned / Frequently Referenced</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {pinnedEntries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => onOpenDetails(entry)}
            className="flex flex-col justify-between p-3.5 bg-white hover:bg-slate-50 border border-gray-100 hover:border-gray-200 rounded-lg cursor-pointer transition-all hover:shadow-sm group text-left"
          >
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {entry.type}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-slate-800 transition-colors truncate mb-1">
                {entry.title}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {entry.type === "Decision" && entry.decision ? entry.decision : entry.content}
              </p>
            </div>

            <div className="flex items-center justify-between gap-1 mt-3 pt-2.5 border-t border-gray-50">
              {entry.type === "Decision" && entry.status ? (
                <div className="flex items-center gap-1">
                  {getStatusIcon(entry.status)}
                  <span className="text-[10px] font-medium text-gray-600">{entry.status}</span>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1 max-w-[120px] overflow-hidden">
                  {entry.tags.slice(0, 1).map((t) => (
                    <span key={t} className="text-[9px] font-semibold text-slate-500">#{t}</span>
                  ))}
                </div>
              )}
              <span className="text-[10px] text-gray-400">
                {new Date(entry.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
