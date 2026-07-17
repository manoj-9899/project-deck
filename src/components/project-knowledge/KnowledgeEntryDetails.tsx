import React from "react";
import { 
  Pin, 
  Calendar, 
  Layers, 
  CheckSquare, 
  Pencil, 
  Clipboard, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Clock,
  ArrowUpRight,
  Archive,
  BookOpen,
  Bookmark,
  MessageSquare
} from "lucide-react";
import { ProjectKnowledgeEntry } from "../../types/project-knowledge";
import { Sheet } from "../ui/Sheet";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useToast } from "../ui/Toast";

interface KnowledgeEntryDetailsProps {
  entry: ProjectKnowledgeEntry | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (entry: ProjectKnowledgeEntry) => void;
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  isEditable: boolean;
}

export default function KnowledgeEntryDetails({
  entry,
  isOpen,
  onClose,
  onEdit,
  phases,
  tasks,
  isEditable,
}: KnowledgeEntryDetailsProps) {
  const { toast } = useToast();

  if (!entry) return null;

  // Resolve titles
  const phase = phases.find((p) => p.id === entry.relatedPhaseId);
  const phaseTitle = phase ? phase.title : (entry.relatedPhaseId ? "Referenced item unavailable" : null);

  const task = tasks.find((t) => t.id === entry.relatedTaskId);
  const taskTitle = task ? task.title : (entry.relatedTaskId ? "Referenced item unavailable" : null);

  const handleCopyAll = () => {
    let textToCopy = `Title: ${entry.title}\nType: ${entry.type}\n\nContent:\n${entry.content}`;
    
    if (entry.type === "Decision") {
      textToCopy += `\n\nDecision Statement: ${entry.decision}\nRationale: ${entry.rationale}\nAlternatives Considered: ${entry.alternatives || 'None'}\nConsequences: ${entry.consequences || 'None'}`;
    } else if (entry.type === "Error & Solution") {
      textToCopy += `\n\nError Message: ${entry.errorMessage}\nRoot Cause: ${entry.rootCause || 'Unspecified'}\nSolution: ${entry.solution}\nPrevention Notes: ${entry.preventionNotes || 'None'}`;
    }

    navigator.clipboard.writeText(textToCopy);
    toast({
      type: "success",
      title: "Copied to Clipboard",
      message: "The complete structured entry was copied successfully.",
    });
  };

  // Safe and simple Markdown parser
  const renderMarkdown = (text?: string) => {
    if (!text) return null;
    const lines = text.split("\n");
    return (
      <div className="space-y-2 font-sans text-sm text-gray-700 leading-relaxed">
        {lines.map((line, idx) => {
          // Headers
          if (line.startsWith("### ")) {
            return (
              <h4 key={idx} className="text-sm font-bold text-gray-900 mt-4 mb-2 tracking-tight">
                {line.replace("### ", "")}
              </h4>
            );
          }
          if (line.startsWith("## ")) {
            return (
              <h3 key={idx} className="text-base font-bold text-gray-900 mt-5 mb-2 border-b border-gray-100 pb-1 tracking-tight">
                {line.replace("## ", "")}
              </h3>
            );
          }
          if (line.startsWith("# ")) {
            return (
              <h2 key={idx} className="text-lg font-extrabold text-gray-900 mt-6 mb-3 tracking-tight">
                {line.replace("# ", "")}
              </h2>
            );
          }
          // Bullets
          if (line.startsWith("* ") || line.startsWith("- ")) {
            return (
              <li key={idx} className="ml-4 list-disc text-gray-600 leading-relaxed">
                {line.substring(2)}
              </li>
            );
          }
          // Empty lines
          if (!line.trim()) {
            return <div key={idx} className="h-2" />;
          }
          
          // Parse inline code blocks `code`
          const parts = line.split("`");
          if (parts.length > 2) {
            return (
              <p key={idx} className="text-gray-600 leading-relaxed">
                {parts.map((part, i) => {
                  if (i % 2 === 1) {
                    return (
                      <code key={i} className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded font-mono text-xs text-slate-800 break-all">
                        {part}
                      </code>
                    );
                  }
                  return part;
                })}
              </p>
            );
          }

          return <p key={idx} className="text-gray-600 leading-relaxed">{line}</p>;
        })}
      </div>
    );
  };

  // Resolve type banner
  const renderTypeBanner = () => {
    switch (entry.type) {
      case "Decision":
        return (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <h4 className="font-semibold text-emerald-900 text-sm">Product/Architectural Decision</h4>
            </div>
            <div className="space-y-4 pt-1">
              <div>
                <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Decision Statement:</span>
                <p className="text-sm text-emerald-950 font-medium">{entry.decision}</p>
              </div>
              {entry.rationale && (
                <div>
                  <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Rationale:</span>
                  <p className="text-sm text-emerald-950">{entry.rationale}</p>
                </div>
              )}
              {entry.alternatives && (
                <div>
                  <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Alternatives Considered:</span>
                  <p className="text-sm text-emerald-950">{entry.alternatives}</p>
                </div>
              )}
              {entry.consequences && (
                <div>
                  <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Consequences:</span>
                  <p className="text-sm text-emerald-950">{entry.consequences}</p>
                </div>
              )}
              <div>
                <span className="block text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Decision Status:</span>
                <Badge variant={entry.status === "Accepted" ? "success" : entry.status === "Superseded" ? "warning" : entry.status === "Rejected" ? "danger" : "neutral"} className="mt-1 font-semibold text-xs">
                  {entry.status || "Proposed"}
                </Badge>
              </div>
            </div>
          </div>
        );
      case "Error & Solution":
        return (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-amber-900 text-sm">Error & Solution Log</h4>
            </div>
            <div className="space-y-4 pt-1">
              <div>
                <span className="block text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">Error Message:</span>
                <pre className="p-3 bg-white border border-amber-100 rounded-lg font-mono text-xs text-amber-950 overflow-x-auto whitespace-pre-wrap break-all shadow-sm">
                  {entry.errorMessage}
                </pre>
              </div>
              {entry.context && (
                <div>
                  <span className="block text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">Error Context:</span>
                  <p className="text-sm text-amber-950">{entry.context}</p>
                </div>
              )}
              {entry.rootCause && (
                <div>
                  <span className="block text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">Root Cause:</span>
                  <p className="text-sm text-amber-950">{entry.rootCause}</p>
                </div>
              )}
              <div>
                <span className="block text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">Solution Description:</span>
                <div className="text-sm text-amber-950 bg-white/40 border border-amber-100/50 p-2.5 rounded-lg">{entry.solution}</div>
              </div>
              {entry.preventionNotes && (
                <div>
                  <span className="block text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">Prevention Notes:</span>
                  <p className="text-sm text-amber-950">{entry.preventionNotes}</p>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Sheet
      isOpen={isOpen}
      onClose={onClose}
      title={entry.title}
      size="lg"
    >
      <div className="flex flex-col justify-between h-full font-sans">
        {/* Scrollable details view */}
        <div className="grow overflow-y-auto px-6 py-4 pb-20">
          
          {/* Header metadata row */}
          <div className="flex flex-wrap items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <Badge variant="neutral" className="text-xs uppercase font-bold tracking-wider">
              {entry.type}
            </Badge>

            {entry.isPinned && (
              <span className="flex items-center text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                <Pin className="w-3 h-3 mr-1 fill-rose-500 text-rose-500" />
                Pinned Document
              </span>
            )}

            {entry.isArchived && (
              <span className="flex items-center text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                <Archive className="w-3 h-3 mr-1 text-gray-500" />
                Archived Snapshot
              </span>
            )}

            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium ml-auto">
              <Clock className="w-3.5 h-3.5 text-gray-300" />
              <span>Created: {new Date(entry.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>Updated: {new Date(entry.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Render structured content based on type */}
          {renderTypeBanner()}

          {/* Standard main text content */}
          <div className="mb-6">
            <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              {entry.type === "Decision" || entry.type === "Error & Solution" ? "General Details & Overview:" : "Description & Document Body:"}
            </h4>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              {renderMarkdown(entry.content)}
            </div>
          </div>

          {/* Relations panel */}
          {(phaseTitle || taskTitle) && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-6">
              <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Technical Coordinates & Linkages</h4>
              <div className="space-y-2">
                {phaseTitle && (
                  <div className="flex items-center justify-between text-xs bg-white border border-gray-100 p-2.5 rounded-lg">
                    <span className="text-gray-500 font-medium flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-gray-400" />
                      Linked Phase:
                    </span>
                    <span className={`font-semibold ${phaseTitle === "Referenced item unavailable" ? "text-red-500 italic" : "text-gray-900"}`}>
                      {phaseTitle}
                    </span>
                  </div>
                )}
                {taskTitle && (
                  <div className="flex items-center justify-between text-xs bg-white border border-gray-100 p-2.5 rounded-lg">
                    <span className="text-gray-500 font-medium flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-gray-400" />
                      Linked Task:
                    </span>
                    <span className={`font-semibold ${taskTitle === "Referenced item unavailable" ? "text-red-500 italic" : "text-gray-900"}`}>
                      {taskTitle}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tags / Labels</h4>
              <div className="flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-2.5 py-1 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer sticky bar with actions */}
        <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-gray-100 bg-white/95 backdrop-blur-sm flex items-center justify-between px-6 z-10">
          <Button 
            onClick={handleCopyAll}
            variant="secondary"
            className="gap-1.5 h-10 px-4 text-xs font-semibold rounded-xl"
          >
            <Clipboard className="w-4 h-4" />
            Copy All Text
          </Button>

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
                  onEdit(entry);
                }}
                variant="primary"
                className="gap-1.5 h-10 px-4 text-xs font-semibold rounded-xl shadow"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Document
              </Button>
            )}
          </div>
        </div>
      </div>
    </Sheet>
  );
}
