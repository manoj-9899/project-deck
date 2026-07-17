import React, { useState, useEffect } from "react";
import { Sheet } from "../ui/Sheet";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import KnowledgeEntryForm from "./KnowledgeEntryForm";
import { ProjectKnowledgeEntry } from "../../types/project-knowledge";

interface KnowledgeEntryFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProjectKnowledgeEntry | null;
  phases: Array<{ id: string; title: string }>;
  tasks: Array<{ id: string; title: string }>;
  onSubmit: (data: Partial<ProjectKnowledgeEntry>) => void;
}

export default function KnowledgeEntryFormSheet({
  isOpen,
  onClose,
  initialData,
  phases,
  tasks,
  onSubmit,
}: KnowledgeEntryFormSheetProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Reset tracking state on close
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
        title={initialData ? "Edit Knowledge Document" : "Create Knowledge Document"}
        size="lg"
      >
        <div className="px-6 py-4 overflow-y-auto h-full pb-20">
          <p className="text-xs text-gray-500 mb-6 -mt-2">
            {initialData 
              ? "Update technical guidelines, product decisions, or troubleshooting logs for this project."
              : "Capture decisions, research logs, guides, and meeting action items for reference across your roadmap phases."}
          </p>

          <KnowledgeEntryForm
            initialData={initialData}
            onSubmit={(data) => {
              onSubmit(data);
              setIsDirty(false); // Disarm dirty warning after valid submit
            }}
            onCancel={handleCloseAttempt}
            phases={phases}
            tasks={tasks}
            isDirtySetter={setIsDirty}
          />
        </div>
      </Sheet>

      {/* Discard confirmation overlay */}
      <Dialog
        id="knowledge-discard-confirm-dialog"
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        title="Discard Unsaved Knowledge Edits?"
        description="You have unsaved changes in this document. Closing the form will discard all your edits."
        footer={
          <div className="flex justify-end gap-2 px-1">
            <Button
              id="knowledge-discard-cancel"
              type="button"
              variant="secondary"
              onClick={() => setShowDiscardConfirm(false)}
            >
              Keep Editing
            </Button>
            <Button
              id="knowledge-discard-confirm"
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
