import React from "react";
import { 
  MoreVertical, 
  Eye, 
  Pencil, 
  Copy, 
  Archive, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Undo2,
  Play,
  ClipboardList,
  CheckCircle,
  HelpCircle,
  FolderMinus
} from "lucide-react";
import { DropdownMenu, DropdownMenuItemType } from "../ui/DropdownMenu";
import { ProjectTask, TaskStatus } from "../../types/project-task";

interface TaskMenuProps {
  task: ProjectTask;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onChangeStatus: (status: TaskStatus) => void;
  onToggleArchive: () => void;
  onDelete: () => void;
  isEditable: boolean;
}

export default function TaskMenu({
  task,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onChangeStatus,
  onToggleArchive,
  onDelete,
  isEditable,
}: TaskMenuProps) {
  
  const menuItems: DropdownMenuItemType[] = [];

  // 1. View Details (always available)
  menuItems.push({
    label: "View Details",
    icon: <Eye className="w-3.5 h-3.5" />,
    onClick: onOpenDetails,
  });

  if (isEditable) {
    // 2. Edit
    menuItems.push({
      label: "Edit Task",
      icon: <Pencil className="w-3.5 h-3.5" />,
      onClick: onEdit,
    });

    // 3. Duplicate
    menuItems.push({
      label: "Duplicate",
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: onDuplicate,
    });

    // Divider
    menuItems.push({ label: "---" });

    // 4. Dynamic Quick status shifts
    const statuses: { label: string; status: TaskStatus; icon: React.ReactNode }[] = [
      { label: "Move to Backlog", status: "Backlog", icon: <FolderMinus className="w-3.5 h-3.5" /> },
      { label: "Move to To do", status: "To do", icon: <ClipboardList className="w-3.5 h-3.5" /> },
      { label: "Move to In progress", status: "In progress", icon: <Play className="w-3.5 h-3.5" /> },
      { label: "Mark as Blocked", status: "Blocked", icon: <AlertTriangle className="w-3.5 h-3.5 text-status-warning" /> },
      { label: "Mark as Completed", status: "Completed", icon: <CheckCircle2 className="w-3.5 h-3.5 text-status-success" /> },
    ];

    statuses.forEach((s) => {
      if (task.status !== s.status) {
        menuItems.push({
          label: s.label,
          icon: s.icon,
          onClick: () => onChangeStatus(s.status),
        });
      }
    });

    // Divider
    menuItems.push({ label: "---" });

    // 5. Archive / Restore
    menuItems.push({
      label: task.isArchived ? "Restore Task" : "Archive Task",
      icon: <Archive className="w-3.5 h-3.5" />,
      onClick: onToggleArchive,
    });

    // 6. Delete (destructive, only if editable)
    menuItems.push({
      label: "Delete Permanently",
      icon: <Trash2 className="w-3.5 h-3.5" />,
      destructive: true,
      onClick: onDelete,
    });
  } else {
    // If read-only, we can show a disabled archive notice or keep it simple
    menuItems.push({
      label: "Editing disabled (Archived)",
      disabled: true,
    });
  }

  return (
    <DropdownMenu
      id={`task-menu-${task.id}`}
      align="right"
      trigger={
        <button
          id={`task-menu-btn-${task.id}`}
          type="button"
          aria-label="Task action options"
          className="p-1 text-text-tertiary hover:text-text-primary hover:bg-muted-surface border border-transparent hover:border-border-subtle rounded-md transition-all h-8 w-8 flex items-center justify-center cursor-pointer focus:outline-none"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      }
      items={menuItems}
    />
  );
}
