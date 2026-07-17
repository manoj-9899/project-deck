/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import { ProjectPrompt } from "../../types/project-prompt";

interface PromptVersionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  promptItem: ProjectPrompt | null;
  onSubmit: (newPrompt: string, changeSummary: string) => void;
}

export default function PromptVersionDialog({
  isOpen,
  onClose,
  promptItem,
  onSubmit,
}: PromptVersionDialogProps) {
  const [promptText, setPromptText] = useState("");
  const [changeSummary, setChangeSummary] = useState("");
  const [error, setError] = useState("");

  // Sync with current active prompt content when opened
  useEffect(() => {
    if (isOpen && promptItem) {
      setPromptText(promptItem.prompt);
      setChangeSummary("");
      setError("");
    }
  }, [isOpen, promptItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) {
      setError("Prompt content cannot be empty.");
      return;
    }
    onSubmit(promptText, changeSummary);
    onClose();
  };

  return (
    <Dialog
      id="prompt-new-version-dialog"
      isOpen={isOpen}
      onClose={onClose}
      title={`Create Prompt Version v${promptItem ? promptItem.version + 1 : ""}`}
      description={`Iterate on prompt template design for "${promptItem?.title || ""}" without mutating historical releases.`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 pb-1 text-left">
        <div>
          <label htmlFor="ver-prompt-text" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            New AI Prompt Template <span className="text-red-500">*</span>
          </label>
          <textarea
            id="ver-prompt-text"
            rows={5}
            value={promptText}
            onChange={(e) => {
              setPromptText(e.target.value);
              if (error) setError("");
            }}
            placeholder="Write your revised prompt template here..."
            className="w-full p-2.5 font-mono text-xs bg-slate-950 text-slate-100 border border-slate-900 rounded-xl focus:ring-slate-700 focus:border-slate-800 outline-none resize-y"
          />
          {error && <span className="text-xs text-red-500 font-semibold mt-1 block">{error}</span>}
        </div>

        <div>
          <label htmlFor="ver-change-summary" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Notes / Change Summary
          </label>
          <input
            id="ver-change-summary"
            type="text"
            value={changeSummary}
            onChange={(e) => setChangeSummary(e.target.value)}
            placeholder="Describe what changed in this version (e.g. Added system instructions)"
            className="w-full h-10 px-3 text-sm bg-white border border-gray-200 focus:border-slate-300 focus:ring-1 focus:ring-slate-400 rounded-xl transition-colors outline-none shadow-sm placeholder:text-gray-400"
          />
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-50 pt-4 mt-5">
          <Button
            id="btn-close-ver-dialog"
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            id="btn-submit-ver-dialog"
            type="submit"
            variant="primary"
            className="bg-purple-600 hover:bg-purple-700 text-white shadow"
          >
            Create Version v{promptItem ? promptItem.version + 1 : ""}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
