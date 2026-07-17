import React, { useState } from "react";
import { CompletionCriterion } from "../../types/project-roadmap";
import { Plus, Check, Edit, Trash2, X } from "lucide-react";

interface PhaseCompletionCriteriaProps {
  phaseId: string;
  criteria: CompletionCriterion[];
  onAdd: (label: string) => void;
  onEdit: (criterionId: string, label: string) => void;
  onToggle: (criterionId: string) => void;
  onDelete: (criterionId: string) => void;
  isReadOnly: boolean;
}

export const PhaseCompletionCriteria: React.FC<PhaseCompletionCriteriaProps> = ({
  phaseId,
  criteria,
  onAdd,
  onEdit,
  onToggle,
  onDelete,
  isReadOnly
}) => {
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    onAdd(newLabel.trim());
    setNewLabel("");
  };

  const handleStartEdit = (item: CompletionCriterion) => {
    if (isReadOnly) return;
    setEditingId(item.id);
    setEditingText(item.label);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingText.trim()) return;
    onEdit(id, editingText.trim());
    setEditingId(null);
  };

  return (
    <div 
      id={`phase-criteria-panel-${phaseId}`}
      className="flex flex-col gap-3 p-4 bg-muted-surface border border-border-subtle rounded-xl font-sans text-xs"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-text-secondary uppercase">
          Phase Completion Criteria
        </h4>
        <span className="text-[10px] text-text-tertiary font-mono">
          ({criteria.filter((c) => c.isComplete).length}/{criteria.length} Met)
        </span>
      </div>

      {/* Criteria Checklist */}
      {criteria.length === 0 ? (
        <p className="text-[11px] text-text-tertiary italic">No specific completion criteria defined for this phase.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {criteria.map((item) => (
            <div 
              key={item.id} 
              className="flex items-center justify-between gap-3 p-2 bg-bg-primary border border-border-subtle rounded-lg"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={item.isComplete}
                  disabled={isReadOnly}
                  onChange={() => onToggle(item.id)}
                  className="rounded border-border-subtle text-accent-primary focus:ring-accent-primary focus:ring-opacity-20 cursor-pointer disabled:opacity-50"
                />

                {editingId === item.id ? (
                  <div className="flex items-center gap-1.5 flex-1">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="px-2 py-1 text-xs bg-muted-surface border border-border-subtle rounded focus:outline-none focus:ring-1 focus:ring-border-strong text-text-primary font-medium flex-1"
                    />
                    <button 
                      onClick={() => handleSaveEdit(item.id)}
                      className="p-1 bg-accent-primary hover:bg-accent-primary/80 text-white rounded"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="p-1 bg-muted-surface border border-border-subtle hover:bg-border-strong rounded text-text-secondary"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span 
                    onClick={() => handleStartEdit(item)}
                    className={`text-xs text-text-primary leading-tight truncate ${
                      item.isComplete ? "line-through text-text-tertiary font-medium" : ""
                    } ${!isReadOnly ? "cursor-pointer hover:text-accent-primary" : ""}`}
                    title={!isReadOnly ? "Click to edit text" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </div>

              {!isReadOnly && editingId !== item.id && (
                <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 sm:opacity-100">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1 text-text-secondary hover:text-text-primary rounded"
                    title="Edit criterion"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1 text-status-danger hover:bg-status-danger/10 rounded"
                    title="Delete criterion"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Criterion Form inline */}
      {!isReadOnly && (
        <form onSubmit={handleAddSubmit} className="flex gap-2.5 mt-1.5">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. Pass performance unit checks..."
            className="px-2.5 py-1.5 text-xs bg-bg-primary border border-border-subtle hover:border-border-strong rounded-lg focus:outline-none focus:ring-1 focus:ring-border-strong text-text-primary font-medium flex-1"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-accent-primary hover:bg-accent-primary/90 text-white text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>
      )}
    </div>
  );
};
