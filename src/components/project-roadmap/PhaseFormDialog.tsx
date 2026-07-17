import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { PhaseForm } from "./PhaseForm";
import { ProjectPhase } from "../../types/project-roadmap";
import { Button } from "../ui/Button";

interface PhaseFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProjectPhase;
  allPhases: ProjectPhase[];
  onSubmit: (data: any) => void;
}

export const PhaseFormDialog: React.FC<PhaseFormDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  allPhases,
  onSubmit
}) => {
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Reset states when dialog closes
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

  return (
    <>
      <Dialog
        id="phase-form-dialog"
        isOpen={isOpen}
        onClose={handleCloseAttempt}
        title={initialData ? "Edit Roadmap Phase" : "Create Roadmap Phase"}
        description={
          initialData 
            ? "Update the parameters, progress metrics, and dependencies for this phase." 
            : "Add a new sequential phase with milestones, objectives, and target parameters."
        }
      >
        <PhaseForm
          initialData={initialData}
          allPhases={allPhases}
          onSubmit={onSubmit}
          onCancel={handleCloseAttempt}
          onChangeDirty={setIsDirty}
        />
      </Dialog>

      <Dialog
        id="phase-form-discard-confirm"
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        title="Discard unsaved changes?"
        description="You have unsaved changes in this phase form."
        footer={
          <div className="flex justify-end gap-2.5">
            <Button
              id="phase-discard-cancel-btn"
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowDiscardConfirm(false)}
            >
              Keep Editing
            </Button>
            <Button
              id="phase-discard-confirm-btn"
              type="button"
              variant="danger"
              size="sm"
              onClick={() => {
                setShowDiscardConfirm(false);
                setIsDirty(false);
                onClose();
              }}
            >
              Discard Changes
            </Button>
          </div>
        }
      >
        <p className="text-xs text-text-secondary leading-relaxed">
          Are you sure you want to close this form and discard your current edits? This action cannot be undone.
        </p>
      </Dialog>
    </>
  );
};
