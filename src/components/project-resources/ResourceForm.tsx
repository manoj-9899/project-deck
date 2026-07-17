/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Plus, X, Tag, Link2, Terminal, AlertTriangle, Layers, Heart } from "lucide-react";
import { ProjectResource, ResourceType, ResourceEnvironment, ResourceStatus } from "../../types/project-resource";
import { Button } from "../ui/Button";
import { isValidHttpUrl, isValidLocalPath, containsCredentials } from "../../utils/resource-security";

interface ResourceFormProps {
  initialData: ProjectResource | null;
  onSubmit: (data: Partial<ProjectResource>) => void;
  onCancel: () => void;
  isDirtySetter: (dirty: boolean) => void;
}

export default function ResourceForm({
  initialData,
  onSubmit,
  onCancel,
  isDirtySetter,
}: ResourceFormProps) {
  // Main form fields
  const [title, setTitle] = useState(initialData?.title || "");
  const [type, setType] = useState<ResourceType>(initialData?.type || "Repository");
  const [url, setUrl] = useState(initialData?.url || "");
  const [localPath, setLocalPath] = useState(initialData?.localPath || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [provider, setProvider] = useState(initialData?.provider || "");
  const [environment, setEnvironment] = useState<ResourceEnvironment>(initialData?.environment || "Not applicable");
  const [status, setStatus] = useState<ResourceStatus>(initialData?.status || "Active");
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isFavorite, setIsFavorite] = useState(initialData?.isFavorite || false);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Monitor dirty state
  useEffect(() => {
    const isDirty = 
      title !== (initialData?.title || "") ||
      type !== (initialData?.type || "Repository") ||
      url !== (initialData?.url || "") ||
      localPath !== (initialData?.localPath || "") ||
      description !== (initialData?.description || "") ||
      provider !== (initialData?.provider || "") ||
      environment !== (initialData?.environment || "Not applicable") ||
      status !== (initialData?.status || "Active") ||
      isFavorite !== (initialData?.isFavorite || false) ||
      JSON.stringify(tags) !== JSON.stringify(initialData?.tags || []);

    isDirtySetter(isDirty);
  }, [
    title, type, url, localPath, description, provider, environment, status, tags, isFavorite,
    initialData, isDirtySetter
  ]);

  // Handle tag actions
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
    
    // Clear previous errors
    const formErrors: Record<string, string> = {};

    // 1. Check title
    if (!title.trim()) {
      formErrors.title = "Title is required.";
    }

    // 2. Credentials warning check
    if (
      containsCredentials(title) ||
      containsCredentials(description) ||
      containsCredentials(provider) ||
      containsCredentials(url) ||
      containsCredentials(localPath)
    ) {
      formErrors.security = "Resource fields must not contain passwords, API keys, tokens, or connection strings.";
    }

    // 3. Either URL or Local Path must exist
    const hasUrl = !!url.trim();
    const hasPath = !!localPath.trim();

    if (!hasUrl && !hasPath) {
      formErrors.address = "Either a URL or a Local Path must be specified.";
    }

    // 4. Validate URL protocol if URL exists
    if (hasUrl) {
      const trimmedUrl = url.trim();
      if (!isValidHttpUrl(trimmedUrl)) {
        formErrors.url = "Valid HTTP link protocol is required (http:// or https://). Protocol wrappers like javascript:, data: are rejected.";
      }
    }

    // 5. Validate local path format if path exists
    if (hasPath) {
      const trimmedPath = localPath.trim();
      if (!isValidLocalPath(trimmedPath)) {
        formErrors.localPath = "Local path structure contains invalid characters or credential patterns.";
      }
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      // Scroll to the first error element
      const firstErrorKey = Object.keys(formErrors)[0];
      const targetId = firstErrorKey === "security" || firstErrorKey === "address" ? "form-alerts" : `field-${firstErrorKey}`;
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Submit structured values
    onSubmit({
      title: title.trim(),
      type,
      url: hasUrl ? url.trim() : undefined,
      localPath: hasPath ? localPath.trim() : undefined,
      description: description.trim() || undefined,
      provider: provider.trim() || undefined,
      environment,
      status,
      tags,
      isFavorite,
    });
  };

  const labelClass = "block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5";
  const inputClass = "w-full h-10 px-3 text-sm bg-white border border-gray-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-400 rounded-xl transition-colors outline-none shadow-sm placeholder:text-gray-400";
  const selectClass = "w-full h-10 px-3 text-sm bg-white border border-gray-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-400 rounded-xl transition-colors outline-none shadow-sm cursor-pointer";
  const textareaClass = "w-full min-h-[90px] p-3 text-sm bg-white border border-gray-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-400 rounded-xl transition-colors outline-none shadow-sm placeholder:text-gray-400 font-sans resize-y leading-relaxed";

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5 font-sans" id="resource-edit-form">
      
      {/* Visual Safety Reminder Badge */}
      <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-800 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong>Safety & Credentials Policy:</strong> Store references only. Never save credentials, passwords, access tokens, environment values, or secret keys in ProjectDock.
        </div>
      </div>

      {/* Form Error Alerts Banner */}
      {(errors.security || errors.address) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800 space-y-1" id="form-alerts">
          <strong className="block font-bold">Please correct the following:</strong>
          {errors.security && <p className="flex items-center gap-1.5"><X className="w-3.5 h-3.5 text-red-500" /> {errors.security}</p>}
          {errors.address && <p className="flex items-center gap-1.5"><X className="w-3.5 h-3.5 text-red-500" /> {errors.address}</p>}
        </div>
      )}

      {/* 1. Title */}
      <div>
        <label htmlFor="field-title" className={labelClass}>
          Resource Name / Title <span className="text-red-500">*</span>
        </label>
        <input
          id="field-title"
          type="text"
          placeholder="e.g. Supabase Production Database Server"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
          }}
          className={`${inputClass} ${errors.title ? "border-red-400 focus:ring-red-300" : ""}`}
        />
        {errors.title && <span className="text-xs text-red-500 font-semibold mt-1 block">{errors.title}</span>}
      </div>

      {/* 2. Type, Environment & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="field-type" className={labelClass}>
            Resource Type
          </label>
          <select
            id="field-type"
            value={type}
            onChange={(e) => setType(e.target.value as ResourceType)}
            className={selectClass}
          >
            <option value="Repository">Repository</option>
            <option value="Deployment">Deployment</option>
            <option value="Documentation">Documentation</option>
            <option value="Design">Design</option>
            <option value="Database">Database</option>
            <option value="Hosting">Hosting</option>
            <option value="AI Conversation">AI Conversation</option>
            <option value="Local Path">Local Path</option>
            <option value="API Reference">API Reference</option>
            <option value="Reference Website">Reference Website</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="field-environment" className={labelClass}>
            Environment
          </label>
          <select
            id="field-environment"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as ResourceEnvironment)}
            className={selectClass}
          >
            <option value="Not applicable">Not applicable</option>
            <option value="Local">Local</option>
            <option value="Development">Development</option>
            <option value="Preview">Preview</option>
            <option value="Production">Production</option>
          </select>
        </div>

        <div>
          <label htmlFor="field-status" className={labelClass}>
            Status
          </label>
          <select
            id="field-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ResourceStatus)}
            className={selectClass}
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Broken">Broken</option>
            <option value="Pending">Pending</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* 3. Description */}
      <div>
        <label htmlFor="field-description" className={labelClass}>
          Brief Description
        </label>
        <textarea
          id="field-description"
          placeholder="Summarize what this resource contains, or troubleshoot links if status is broken."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={textareaClass}
        />
      </div>

      {/* 4. Provider & Favorites checkbox row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label htmlFor="field-provider" className={labelClass}>
            Host Provider / Tool
          </label>
          <input
            id="field-provider"
            type="text"
            placeholder="e.g. GitHub, Vercel, Supabase, Local Machine"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex items-center h-10 px-1">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4.5 h-4.5 text-rose-500 border-gray-300 rounded focus:ring-0 focus:ring-rose-500 cursor-pointer"
            />
            <span className="flex items-center gap-1">
              <Heart className={`w-3.5 h-3.5 text-rose-500 ${isFavorite ? "fill-rose-500" : ""}`} />
              Pin to Favorites ribbon
            </span>
          </label>
        </div>
      </div>

      {/* 5. Address Links: URL & Local Path block */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2 mb-3 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-gray-400" />
          Location Reference <span className="text-red-500 font-bold">*</span>
        </h4>
        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Provide either a valid, safe HTTP link (for remote docs, repos, deployments) or a safe CLI file path (for local folders).
        </p>

        <div className="space-y-4">
          {/* URL Input */}
          <div>
            <label htmlFor="field-url" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
              External Resource URL
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="field-url"
                type="text"
                placeholder="https://example.com/project-docs"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (errors.url || errors.address) {
                    setErrors((prev) => ({ ...prev, url: "", address: "" }));
                  }
                }}
                className={`${inputClass} pl-9 ${errors.url ? "border-red-400 focus:ring-red-300" : ""}`}
              />
            </div>
            {errors.url && <span className="text-xs text-red-500 font-semibold mt-1 block">{errors.url}</span>}
          </div>

          <div className="flex items-center justify-center">
            <span className="h-px bg-gray-200 grow" />
            <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50">OR</span>
            <span className="h-px bg-gray-200 grow" />
          </div>

          {/* Local Path Input */}
          <div>
            <label htmlFor="field-localPath" className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
              Local System / Folder Path
            </label>
            <div className="relative">
              <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="field-localPath"
                type="text"
                placeholder="~/Workspace/projects/myapp"
                value={localPath}
                onChange={(e) => {
                  setLocalPath(e.target.value);
                  if (errors.localPath || errors.address) {
                    setErrors((prev) => ({ ...prev, localPath: "", address: "" }));
                  }
                }}
                className={`${inputClass} pl-9 ${errors.localPath ? "border-red-400 focus:ring-red-300" : ""}`}
              />
            </div>
            {errors.localPath && <span className="text-xs text-red-500 font-semibold mt-1 block">{errors.localPath}</span>}
          </div>
        </div>
      </div>

      {/* 6. Tags Manager */}
      <div>
        <label htmlFor="field-tag-input" className={labelClass}>
          Labels & Tags
        </label>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative grow">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="field-tag-input"
              type="text"
              placeholder="e.g. vercel-deployment (Press Enter or comma)"
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
            className="h-10 px-3.5 font-semibold shrink-0"
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

      {/* 7. Action Controls */}
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
          className="h-11 px-5 font-semibold rounded-xl shadow-md bg-slate-900 hover:bg-slate-800 text-white"
        >
          {initialData ? "Save Changes" : "Create Resource"}
        </Button>
      </div>
    </form>
  );
}
