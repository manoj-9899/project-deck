/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sheet } from "../ui/Sheet";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import PromptForm from "./PromptForm";
import { ProjectPrompt } from "../../types/project-prompt";

interface PromptFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProjectPrompt | null;
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  onSubmit: (data: Partial<ProjectPrompt>) => void;
}

export default function PromptFormSheet({
  isOpen,
  onClose,
  initialData,
  phases,
  tasks,
  onSubmit,
}: PromptFormSheetProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Reset tracking state on close/reset
  useEffect(() => {
    if (!isOpen) {
      setIsDirty(false);
      setShowDiscardConfirm(false);
    }
  }, [isOpen]);

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowDiscardConfirm(false);
    setIsDirty(false);
    onClose();
  };

  return (
    <>
      <Sheet
        isOpen={isOpen}
        onClose={handleCloseAttempt}
        title={initialData ? "Edit AI Prompt" : "Create AI Prompt"}
        size="lg"
      >
        <div className="px-6 py-4 overflow-y-auto h-full pb-20" id="prompt-form-sheet-container">
          <p className="text-xs text-gray-500 mb-5 -mt-2">
            {initialData 
              ? "Update prompting templates, response records, and developer handover contexts for this project."
              : "Store structured prompts, model outputs, and contextual handover parameters to jump-start work across sessions."}
          </p>

          <PromptForm
            initialData={initialData}
            onSubmit={(data) => {
              onSubmit(data);
              setIsDirty(false); // Disarm dirty trigger
            }}
            onCancel={handleCloseAttempt}
            phases={phases}
            tasks={tasks}
            isDirtySetter={setIsDirty}
          />
        </div>
      </Sheet>

      {/* Discard changes dialog */}
      <Dialog
        id="prompt-discard-confirm-dialog"
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        title="Discard Unsaved Prompt Edits?"
        description="You have unsaved edits in this prompt document. Closing this screen will discard all modifications."
        footer={
          <div className="flex justify-end gap-2 px-1">
            <Button
              id="prompt-discard-cancel"
              type="button"
              variant="secondary"
              onClick={() => setShowDiscardConfirm(false)}
            >
              Keep Editing
            </Button>
            <Button
              id="prompt-discard-confirm"
              type="button"
              variant="danger"
              onClick={handleConfirmDiscard}
            >
              Discard Changes
            </Button>
          </div>
        }
      />
    </>
  );
}
