import React, { useState, useEffect } from "react";
import { Plus, X, Layers, CheckSquare, Tag, Terminal } from "lucide-react";
import { ProjectKnowledgeEntry, KnowledgeEntryType, DecisionStatus } from "../../types/project-knowledge";
import { Button } from "../ui/Button";

interface KnowledgeEntryFormProps {
  initialData: ProjectKnowledgeEntry | null;
  onSubmit: (data: Partial<ProjectKnowledgeEntry>) => void;
  onCancel: () => void;
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  isDirtySetter: (dirty: boolean) => void;
}

export default function KnowledgeEntryForm({
  initialData,
  onSubmit,
  onCancel,
  phases,
  tasks,
  isDirtySetter,
}: KnowledgeEntryFormProps) {
  // Main form fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [type, setType] = useState<KnowledgeEntryType>(initialData?.type || "Note");
  const [content, setContent] = useState(initialData?.content || "");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isPinned, setIsPinned] = useState(initialData?.isPinned || false);
  const [relatedPhaseId, setRelatedPhaseId] = useState(initialData?.relatedPhaseId || "");
  const [relatedTaskId, setRelatedTaskId] = useState(initialData?.relatedTaskId || "");

  // Decision specific fields
  const [decision, setDecision] = useState(initialData?.decision || "");
  const [rationale, setRationale] = useState(initialData?.rationale || "");
  const [alternatives, setAlternatives] = useState(initialData?.alternatives || "");
  const [consequences, setConsequences] = useState(initialData?.consequences || "");
  const [status, setStatus] = useState<DecisionStatus>(initialData?.status || "Proposed");

  // Error & Solution specific fields
  const [errorMessage, setErrorMessage] = useState(initialData?.errorMessage || "");
  const [context, setContext] = useState(initialData?.context || "");
  const [rootCause, setRootCause] = useState(initialData?.rootCause || "");
  const [solution, setSolution] = useState(initialData?.solution || "");
  const [preventionNotes, setPreventionNotes] = useState(initialData?.preventionNotes || "");

  // Form error logs
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Monitor dirty state
  useEffect(() => {
    const isDirty = 
      title !== (initialData?.title || "") ||
      type !== (initialData?.type || "Note") ||
      content !== (initialData?.content || "") ||
      JSON.stringify(tags) !== JSON.stringify(initialData?.tags || []) ||
      isPinned !== (initialData?.isPinned || false) ||
      relatedPhaseId !== (initialData?.relatedPhaseId || "") ||
      relatedTaskId !== (initialData?.relatedTaskId || "") ||
      decision !== (initialData?.decision || "") ||
      rationale !== (initialData?.rationale || "") ||
      alternatives !== (initialData?.alternatives || "") ||
      consequences !== (initialData?.consequences || "") ||
      status !== (initialData?.status || "Proposed") ||
      errorMessage !== (initialData?.errorMessage || "") ||
      context !== (initialData?.context || "") ||
      rootCause !== (initialData?.rootCause || "") ||
      solution !== (initialData?.solution || "") ||
      preventionNotes !== (initialData?.preventionNotes || "");

    isDirtySetter(isDirty);
  }, [
    title, type, content, tags, isPinned, relatedPhaseId, relatedTaskId,
    decision, rationale, alternatives, consequences, status,
    errorMessage, context, rootCause, solution, preventionNotes,
    initialData, isDirtySetter
  ]);

  // Handle tag adds
  const handleAddTag = () => {
    const cleanTag = tagInput.trim().replace(/#/g, "").toLowerCase();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, i) => i !== indexToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const formErrors: Record<string, string> = {};
    if (!title.trim()) {
      formErrors.title = "Title is required.";
    }
    if (!content.trim()) {
      formErrors.content = "Detailed content description is required.";
    }

    if (type === "Decision") {
      if (!decision.trim()) {
        formErrors.decision = "Decision statement is required.";
      }
      if (!rationale.trim()) {
        formErrors.rationale = "Rationale statement is required.";
      }
    }

    if (type === "Error & Solution") {
      if (!errorMessage.trim()) {
        formErrors.errorMessage = "Error message description is required.";
      }
      if (!solution.trim()) {
        formErrors.solution = "Solution details are required.";
      }
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // scroll to top or focus first error
      const firstError = Object.keys(formErrors)[0];
      const element = document.getElementById(`field-${firstError}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    // Submit structured payload
    onSubmit({
      title,
      type,
      content,
      tags,
      isPinned,
      relatedPhaseId: relatedPhaseId || undefined,
      relatedTaskId: relatedTaskId || undefined,
      decision: type === "Decision" ? decision : undefined,
      rationale: type === "Decision" ? rationale : undefined,
      alternatives: type === "Decision" ? alternatives : undefined,
      consequences: type === "Decision" ? consequences : undefined,
      status: type === "Decision" ? status : undefined,
      errorMessage: type === "Error & Solution" ? errorMessage : undefined,
      solution: type === "Error & Solution" ? solution : undefined,
      context: type === "Error & Solution" ? context : undefined,
      rootCause: type === "Error & Solution" ? rootCause : undefined,
      preventionNotes: type === "Error & Solution" ? preventionNotes : undefined,
    });
  };

  // Label stylings
  const labelClass = "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5";
  const inputClass = "w-full h-10 px-3 text-sm bg-white border border-gray-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-400 rounded-xl transition-colors outline-none shadow-sm placeholder:text-gray-400";
  const selectClass = "w-full h-10 px-3 text-sm bg-white border border-gray-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-400 rounded-xl transition-colors outline-none shadow-sm cursor-pointer";
  const textareaClass = "w-full min-h-[100px] p-3 text-sm bg-white border border-gray-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-400 rounded-xl transition-colors outline-none shadow-sm placeholder:text-gray-400 font-sans resize-y leading-relaxed";

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      
      {/* 1. Title & Type selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="field-title" className={labelClass}>
            Entry Title <span className="text-red-500">*</span>
          </label>
          <input
            id="field-title"
            type="text"
            placeholder="e.g. Retain Vite instead of Next.js"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
            }}
            className={`${inputClass} ${errors.title ? "border-red-400 focus:ring-red-300" : ""}`}
          />
          {errors.title && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.title}</span>}
        </div>

        <div>
          <label htmlFor="field-type" className={labelClass}>
            Entry Type <span className="text-red-500">*</span>
          </label>
          <select
            id="field-type"
            value={type}
            onChange={(e) => setType(e.target.value as KnowledgeEntryType)}
            className={selectClass}
          >
            <option value="Note">Note</option>
            <option value="Decision">Decision</option>
            <option value="Documentation">Documentation</option>
            <option value="Error & Solution">Error & Solution</option>
            <option value="Research">Research</option>
            <option value="Meeting">Meeting</option>
            <option value="Implementation Summary">Implementation Summary</option>
          </select>
        </div>
      </div>

      {/* 2. Conditional Fields: DECISION */}
      {type === "Decision" && (
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 space-y-4">
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide border-b border-emerald-100 pb-2 mb-3 flex items-center gap-1.5">
            <Terminal className="w-4 h-4" />
            Decision Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="field-decision" className={labelClass}>
                Decision Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                id="field-decision"
                placeholder="What is the precise decision that was accepted or proposed?"
                value={decision}
                onChange={(e) => {
                  setDecision(e.target.value);
                  if (errors.decision) setErrors((prev) => ({ ...prev, decision: "" }));
                }}
                className={`${textareaClass} min-h-[70px] ${errors.decision ? "border-red-400 focus:ring-red-300" : ""}`}
              />
              {errors.decision && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.decision}</span>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="field-rationale" className={labelClass}>
                Rationale / Justification <span className="text-red-500">*</span>
              </label>
              <textarea
                id="field-rationale"
                placeholder="Why was this choice selected? Detail trade-offs, speed, and standard requirements."
                value={rationale}
                onChange={(e) => {
                  setRationale(e.target.value);
                  if (errors.rationale) setErrors((prev) => ({ ...prev, rationale: "" }));
                }}
                className={`${textareaClass} min-h-[70px] ${errors.rationale ? "border-red-400 focus:ring-red-300" : ""}`}
              />
              {errors.rationale && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.rationale}</span>}
            </div>

            <div>
              <label htmlFor="field-status" className={labelClass}>
                Decision Status
              </label>
              <select
                id="field-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as DecisionStatus)}
                className={selectClass}
              >
                <option value="Proposed">Proposed</option>
                <option value="Accepted">Accepted</option>
                <option value="Superseded">Superseded</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label htmlFor="field-consequences" className={labelClass}>
                Consequences
              </label>
              <input
                id="field-consequences"
                type="text"
                placeholder="What are the immediate positive/negative consequences?"
                value={consequences}
                onChange={(e) => setConsequences(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="field-alternatives" className={labelClass}>
                Alternatives Considered
              </label>
              <textarea
                id="field-alternatives"
                placeholder="What other routes did the team investigate? Why were they rejected?"
                value={alternatives}
                onChange={(e) => setAlternatives(e.target.value)}
                className={`${textareaClass} min-h-[60px]`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Conditional Fields: ERROR & SOLUTION */}
      {type === "Error & Solution" && (
        <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 space-y-4">
          <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wide border-b border-amber-100 pb-2 mb-3 flex items-center gap-1.5">
            <Terminal className="w-4 h-4" />
            Error Diagnostic and Mitigation Details
          </h4>

          <div className="space-y-4">
            <div>
              <label htmlFor="field-errorMessage" className={labelClass}>
                Error Message / Stack Trace <span className="text-red-500">*</span>
              </label>
              <textarea
                id="field-errorMessage"
                placeholder="Paste the precise log trace or browser compilation error..."
                value={errorMessage}
                onChange={(e) => {
                  setErrorMessage(e.target.value);
                  if (errors.errorMessage) setErrors((prev) => ({ ...prev, errorMessage: "" }));
                }}
                className={`${textareaClass} font-mono text-xs bg-slate-900 text-slate-100 border-slate-900 focus:ring-amber-400 min-h-[90px]`}
              />
              {errors.errorMessage && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.errorMessage}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="field-context" className={labelClass}>
                  Error Context
                </label>
                <input
                  id="field-context"
                  type="text"
                  placeholder="e.g. During container launch inside Cloud Run"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="field-rootCause" className={labelClass}>
                  Root Cause
                </label>
                <input
                  id="field-rootCause"
                  type="text"
                  placeholder="e.g. Ingress port mismatch on reverse proxy"
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="field-solution" className={labelClass}>
                Mitigation / Solution Details <span className="text-red-500">*</span>
              </label>
              <textarea
                id="field-solution"
                placeholder="What precise actions solved the problem? Provide code modifications."
                value={solution}
                onChange={(e) => {
                  setSolution(e.target.value);
                  if (errors.solution) setErrors((prev) => ({ ...prev, solution: "" }));
                }}
                className={`${textareaClass} min-h-[70px] ${errors.solution ? "border-red-400 focus:ring-red-300" : ""}`}
              />
              {errors.solution && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.solution}</span>}
            </div>

            <div>
              <label htmlFor="field-preventionNotes" className={labelClass}>
                Prevention Notes / Recommendations
              </label>
              <textarea
                id="field-preventionNotes"
                placeholder="How do we prevent this issue in subsequent environments or microservices?"
                value={preventionNotes}
                onChange={(e) => setPreventionNotes(e.target.value)}
                className={`${textareaClass} min-h-[60px]`}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Content Textarea (Used as general description or doc body) */}
      <div>
        <label htmlFor="field-content" className={labelClass}>
          {type === "Decision" || type === "Error & Solution" ? "General Details / Notes" : "Document Content / Body"} <span className="text-red-500">*</span>
        </label>
        <textarea
          id="field-content"
          placeholder="Support markdown styles like headers (##, ###) and bullet items (*, -). Do not write raw HTML."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
          }}
          className={`${textareaClass} min-h-[140px] ${errors.content ? "border-red-400 focus:ring-red-300" : ""}`}
        />
        {errors.content && <span className="text-xs text-red-500 font-medium mt-1 block">{errors.content}</span>}
      </div>

      {/* 5. Relations Panel */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2 mb-3">
          Relationships (Optional)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-relatedPhaseId" className={labelClass}>
              <Layers className="w-3 h-3 inline mr-1 text-gray-400" />
              Link Roadmap Phase
            </label>
            <select
              id="field-relatedPhaseId"
              value={relatedPhaseId}
              onChange={(e) => setRelatedPhaseId(e.target.value)}
              className={selectClass}
            >
              <option value="">-- No Linked Phase --</option>
              {phases.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="field-relatedTaskId" className={labelClass}>
              <CheckSquare className="w-3 h-3 inline mr-1 text-gray-400" />
              Link Action Task
            </label>
            <select
              id="field-relatedTaskId"
              value={relatedTaskId}
              onChange={(e) => setRelatedTaskId(e.target.value)}
              className={selectClass}
            >
              <option value="">-- No Linked Task --</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 6. Tags Manager */}
      <div>
        <label htmlFor="field-tags" className={labelClass}>
          Tags / Labels
        </label>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative grow">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="field-tags"
              type="text"
              placeholder="Type tag (e.g. backend) and press Enter or comma"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              className={`${inputClass} pl-9`}
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={handleAddTag}
            className="h-10 px-3.5 font-semibold"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {tags.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-gray-100 rounded-xl min-h-[44px] items-center">
            {tags.map((tag, i) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg px-2 py-0.5 shadow-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(i)}
                  className="p-0.5 hover:bg-slate-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-[11px] text-gray-400 font-medium italic">No tags added yet.</span>
        )}
      </div>

      {/* 7. Pinned Setting Switch */}
      <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Pin to Top</h4>
          <p className="text-xs text-gray-500">Keep this critical document highlighted on the knowledge workspace header.</p>
        </div>
        <input
          id="field-isPinned"
          type="checkbox"
          checked={isPinned}
          onChange={(e) => setIsPinned(e.target.checked)}
          className="w-4.5 h-4.5 accent-slate-700 cursor-pointer rounded"
        />
      </div>

      {/* 8. Action Buttons */}
      <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="h-11 px-5 font-semibold rounded-xl"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          className="h-11 px-5 font-semibold rounded-xl shadow-md"
        >
          {initialData ? "Save Changes" : "Create Document"}
        </Button>
      </div>
    </form>
  );
}
