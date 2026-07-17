import React, { useState, useEffect } from "react";
import { Dialog } from "../ui/Dialog";
import { Button } from "../ui/Button";
import TaskForm from "./TaskForm";
import { ProjectTask } from "../../types/project-task";

interface TaskFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ProjectTask;
  phases: Array<{ id: string; title: string }>;
  allTasks: ProjectTask[];
  onSubmit: (data: any) => void;
}

export default function TaskFormDialog({
  isOpen,
  onClose,
  initialData,
  phases,
  allTasks,
  onSubmit,
}: TaskFormDialogProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Reset states on toggle
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
      <Dialog
        id="task-form-dialog"
        isOpen={isOpen}
        onClose={handleCloseAttempt}
        title={initialData ? "Edit Task Parameters" : "Create New Task"}
        description={
          initialData
            ? "Update the status, priority, and phase linkages for this task."
            : "Define a new task deliverable and prioritize it within your project workspace."
        }
      >
        <TaskForm
          initialData={initialData}
          phases={phases}
          allTasks={allTasks}
          onSubmit={(data) => {
            onSubmit(data);
            setIsDirty(false); // Clean up dirty state after successful submit
          }}
          onCancel={handleCloseAttempt}
          onChangeDirty={setIsDirty}
        />
      </Dialog>

      {/* Discard confirmation overlay */}
      <Dialog
        id="task-discard-confirm-dialog"
        isOpen={showDiscardConfirm}
        onClose={() => setShowDiscardConfirm(false)}
        title="Discard Unsaved Task Edits?"
        description="You have unsaved changes in this task form. Closing will lose all modifications."
        footer={
          <div className="flex justify-end gap-2.5">
            <Button
              id="task-discard-cancel-btn"
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowDiscardConfirm(false)}
            >
              Keep Editing Form
            </Button>
            <Button
              id="task-discard-confirm-btn"
              type="button"
              variant="danger"
              size="sm"
              onClick={handleConfirmDiscard}
            >
              Discard Changes
            </Button>
          </div>
        }
      >
        <p className="text-xs text-text-secondary leading-relaxed">
          Are you sure you want to close the task form and discard your current entries? This action is memory-only and cannot be undone.
        </p>
      </Dialog>
    </>
  );
}
