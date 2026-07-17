/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Plus, X, Layers, CheckSquare, Tag, Terminal, Sparkles } from "lucide-react";
import { ProjectPrompt, PromptTool, PromptCategory, PromptStatus } from "../../types/project-prompt";
import { Button } from "../ui/Button";

interface PromptFormProps {
  initialData: ProjectPrompt | null;
  onSubmit: (data: Partial<ProjectPrompt>) => void;
  onCancel: () => void;
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  isDirtySetter: (dirty: boolean) => void;
}

export default function PromptForm({
  initialData,
  onSubmit,
  onCancel,
  phases,
  tasks,
  isDirtySetter,
}: PromptFormProps) {
  // Main form fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [prompt, setPrompt] = useState(initialData?.prompt || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [tool, setTool] = useState<PromptTool>(initialData?.tool || "Google AI Studio");
  const [category, setCategory] = useState<PromptCategory>(initialData?.category || "Planning");
  const [status, setStatus] = useState<PromptStatus>(initialData?.status || "Draft");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [relatedPhaseId, setRelatedPhaseId] = useState(initialData?.relatedPhaseId || "");
  const [relatedTaskId, setRelatedTaskId] = useState(initialData?.relatedTaskId || "");
  const [responseSummary, setResponseSummary] = useState(initialData?.responseSummary || "");
  const [handoverContext, setHandoverContext] = useState(initialData?.handoverContext || "");

  // Form error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Monitor dirty state
  useEffect(() => {
    const isDirty = 
      title !== (initialData?.title || "") ||
      prompt !== (initialData?.prompt || "") ||
      description !== (initialData?.description || "") ||
      tool !== (initialData?.tool || "Google AI Studio") ||
      category !== (initialData?.category || "Planning") ||
      status !== (initialData?.status || "Draft") ||
      JSON.stringify(tags) !== JSON.stringify(initialData?.tags || []) ||
      relatedPhaseId !== (initialData?.relatedPhaseId || "") ||
      relatedTaskId !== (initialData?.relatedTaskId || "") ||
      responseSummary !== (initialData?.responseSummary || "") ||
      handoverContext !== (initialData?.handoverContext || "");

    isDirtySetter(isDirty);
  }, [
    title, prompt, description, tool, category, status, tags,
    relatedPhaseId, relatedTaskId, responseSummary, handoverContext,
    initialData, isDirtySetter
  ]);

  // Handle tag additions
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
    if (!prompt.trim()) {
      formErrors.prompt = "Prompt content text is required.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // Scroll to first error
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
      prompt,
      description: description || undefined,
      tool,
      category,
      status,
      tags,
      relatedPhaseId: relatedPhaseId || undefined,
      relatedTaskId: relatedTaskId || undefined,
      responseSummary: responseSummary || undefined,
      handoverContext: handoverContext || undefined,
    });
  };

  const labelClass = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";
  const inputClass = "w-full h-10 px-3 text-sm bg-white border border-gray-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-400 rounded-xl transition-colors outline-none shadow-sm placeholder:text-gray-400";
  const selectClass = "w-full h-10 px-3 text-sm bg-white border border-gray-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-400 rounded-xl transition-colors outline-none shadow-sm cursor-pointer";
  const textareaClass = "w-full min-h-[90px] p-3 text-sm bg-white border border-gray-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-400 rounded-xl transition-colors outline-none shadow-sm placeholder:text-gray-400 font-sans resize-y leading-relaxed";

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5" id="prompt-edit-form">
      
      {/* 1. Title */}
      <div>
        <label htmlFor="field-title" className={labelClass}>
          Prompt Title <span className="text-red-500">*</span>
        </label>
        <input
          id="field-title"
          type="text"
          placeholder="e.g. Generate database schema for full-stack tasks"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
          }}
          className={`${inputClass} ${errors.title ? "border-red-400 focus:ring-red-300" : ""}`}
        />
        {errors.title && <span className="text-xs text-red-500 font-semibold mt-1 block">{errors.title}</span>}
      </div>

      {/* 2. Tool, Category & Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="field-tool" className={labelClass}>
            AI Tool Platform
          </label>
          <select
            id="field-tool"
            value={tool}
            onChange={(e) => setTool(e.target.value as PromptTool)}
            className={selectClass}
          >
            <option value="Google AI Studio">Google AI Studio</option>
            <option value="Codex">Codex</option>
            <option value="ChatGPT">ChatGPT</option>
            <option value="Claude">Claude</option>
            <option value="Fable">Fable</option>
            <option value="Stitch">Stitch</option>
            <option value="Hermes">Hermes</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="field-category" className={labelClass}>
            Category Lane
          </label>
          <select
            id="field-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as PromptCategory)}
            className={selectClass}
          >
            <option value="Planning">Planning</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Development">Development</option>
            <option value="Debugging">Debugging</option>
            <option value="Testing">Testing</option>
            <option value="Documentation">Documentation</option>
            <option value="Research">Research</option>
            <option value="Handover">Handover</option>
          </select>
        </div>

        <div>
          <label htmlFor="field-status" className={labelClass}>
            Current Status
          </label>
          <select
            id="field-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as PromptStatus)}
            className={selectClass}
          >
            <option value="Draft">Draft</option>
            <option value="Ready">Ready</option>
            <option value="Used">Used</option>
            <option value="Needs revision">Needs revision</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* 3. Description (Single-line prompt help) */}
      <div>
        <label htmlFor="field-description" className={labelClass}>
          Brief Description / Purpose
        </label>
        <input
          id="field-description"
          type="text"
          placeholder="What is this prompt optimized to do?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* 4. CORE AI PROMPT TEXTAREA */}
      <div>
        <label htmlFor="field-prompt" className={labelClass}>
          AI Prompt Template Content <span className="text-red-500">*</span>
        </label>
        <textarea
          id="field-prompt"
          placeholder="Paste or write the complete AI system or user prompt content here. Use standard double brackets [[variable]] to represent variables."
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            if (errors.prompt) setErrors((prev) => ({ ...prev, prompt: "" }));
          }}
          className={`${textareaClass} font-mono text-xs bg-slate-950 text-slate-100 border-slate-900 focus:ring-slate-700 focus:border-slate-800 min-h-[160px]`}
        />
        {errors.prompt && <span className="text-xs text-red-500 font-semibold mt-1 block">{errors.prompt}</span>}
      </div>

      {/* 5. RESPONSE SUMMARY */}
      <div>
        <label htmlFor="field-responseSummary" className={labelClass}>
          Response Summary (Generation Output)
        </label>
        <textarea
          id="field-responseSummary"
          placeholder="Describe what the AI model generated, or key code snippets returned. This is useful for future iterations."
          value={responseSummary}
          onChange={(e) => setResponseSummary(e.target.value)}
          className={textareaClass}
        />
      </div>

      {/* 6. HANDOVER CONTEXT */}
      <div>
        <label htmlFor="field-handoverContext" className={labelClass}>
          Session Handover Context
        </label>
        <textarea
          id="field-handoverContext"
          placeholder="Specify exact contextual instructions, truncated memory summaries, or developer instructions for resuming work on another AI assistant session."
          value={handoverContext}
          onChange={(e) => setHandoverContext(e.target.value)}
          className={`${textareaClass} font-mono text-xs text-purple-900 bg-purple-50/20 border-purple-100 focus:ring-purple-400`}
        />
      </div>

      {/* 7. Relations Binding */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2 mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-gray-400" />
          Workspace Linkages
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="field-relatedPhaseId" className={labelClass}>
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

      {/* 8. Tags Manager */}
      <div>
        <label htmlFor="field-tags" className={labelClass}>
          Labels & Tags
        </label>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative grow">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="field-tags"
              type="text"
              placeholder="e.g. drizzle-orm (Press Enter or comma)"
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

      {/* 9. Actions buttons */}
      <div className="flex items-center justify-end gap-2 border-t border-gray-150 pt-4 mt-6">
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
          {initialData ? "Save Changes" : "Create Prompt"}
        </Button>
      </div>
    </form>
  );
}
