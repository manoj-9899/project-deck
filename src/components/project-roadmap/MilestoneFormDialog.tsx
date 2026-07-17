import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { MilestoneForm } from "./MilestoneForm";
import { ProjectMilestone } from "../../types/project-roadmap";
import { Button } from "../ui/Button";

interface MilestoneFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProjectMilestone;
  existingMilestones?: ProjectMilestone[];
  onSubmit: (data: any) => void;
}

export const MilestoneFormDialog: React.FC<MilestoneFormDialogProps> = ({
  isOpen,
  onClose,
  initialData,
  existingMilestones = [],
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
        id="milestone-form-dialog"
        isOpen={isOpen}
        onClose={handleCloseAttempt}
        title={initialData ? "Edit Phase Milestone" : "Add Phase Milestone"}
        description={
          initialData
            ? "Update the details and priority of this milestone delivery."
            : "Add a new milestone representing a critical delivery event or phase outcome."
        }
      >
        <MilestoneForm
          initialData={initialData}
          existingMilestones={existingMilestones}
          onSubmit={onSubmit}
          onCancel={handleCloseAttempt}
          onChangeDirty={setIsDirty}
        />
      </Dialog>

      <Dialog
        id="milestone-form-discard-confirm"
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        title="Discard unsaved changes?"
        description="You have unsaved changes in this milestone form."
        footer={
          <div className="flex justify-end gap-2.5">
            <Button
              id="milestone-discard-cancel-btn"
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowDiscardConfirm(false)}
            >
              Keep Editing
            </Button>
            <Button
              id="milestone-discard-confirm-btn"
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
