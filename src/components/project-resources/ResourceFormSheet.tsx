/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Sheet } from "../ui/Sheet";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import ResourceForm from "./ResourceForm";
import { ProjectResource } from "../../types/project-resource";

interface ResourceFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProjectResource | null;
  onSubmit: (data: Partial<ProjectResource>) => void;
}

export default function ResourceFormSheet({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: ResourceFormSheetProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Reset dirty triggers on closed
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
        title={initialData ? "Edit Resource Reference" : "Add Resource Reference"}
        size="lg"
      >
        <div className="px-6 py-4 overflow-y-auto h-full pb-20" id="resource-form-sheet-container">
          <p className="text-xs text-gray-500 mb-5 -mt-2">
            {initialData 
              ? "Update resource properties, active environment pointers, and reference parameters in this workspace."
              : "Register source code repositories, staging/production deployments, local systems, databases, and AI sessions."}
          </p>

          <ResourceForm
            initialData={initialData}
            onSubmit={(data) => {
              onSubmit(data);
              setIsDirty(false); // Disarm dirty trigger on submit success
            }}
            onCancel={handleCloseAttempt}
            isDirtySetter={setIsDirty}
          />
        </div>
      </Sheet>

      {/* Discard confirmation dialog */}
      <Dialog
        id="resource-discard-confirm-dialog"
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        title="Discard Unsaved Changes?"
        description="You have unsaved form entries in this resource reference. Closing this form will lose all edits."
        footer={
          <div className="flex justify-end gap-2 px-1">
            <Button
              id="resource-discard-cancel"
              type="button"
              variant="secondary"
              onClick={() => setShowDiscardConfirm(false)}
            >
              Keep Editing
            </Button>
            <Button
              id="resource-discard-confirm"
              type="button"
              variant="danger"
              onClick={handleConfirmDiscard}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Discard Changes
            </Button>
          </div>
        }
      />
    </>
  );
}
