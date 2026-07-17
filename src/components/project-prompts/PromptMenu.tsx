/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  MoreVertical, 
  Eye, 
  Pencil, 
  Copy, 
  Heart,
  PlayCircle,
  Archive, 
  Trash2,
  GitBranch,
  Clipboard
} from "lucide-react";
import { DropdownMenu, DropdownMenuItemType } from "../ui/DropdownMenu";
import { ProjectPrompt } from "../../types/project-prompt";
import { useToast } from "../ui/Toast";

interface PromptMenuProps {
  prompt: ProjectPrompt;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onToggleFavorite: () => void;
  onMarkUsed: () => void;
  onToggleArchive: () => void;
  onNewVersion: () => void;
  onDelete: () => void;
  isEditable: boolean;
}

export default function PromptMenu({
  prompt,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onMarkUsed,
  onToggleArchive,
  onNewVersion,
  onDelete,
  isEditable,
}: PromptMenuProps) {
  const { toast } = useToast();

  const handleCopyPromptText = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt);
      toast({
        type: "success",
        title: "Prompt Copied",
        message: "The raw prompt text has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        type: "error",
        title: "Copy Failed",
        message: "Failed to copy text. Please try selecting it manually.",
      });
    }
  };

  const menuItems: DropdownMenuItemType[] = [];

  // 1. View Details (Always available)
  menuItems.push({
    label: "View Details",
    icon: <Eye className="w-3.5 h-3.5" />,
    onClick: onOpenDetails,
  });

  // 2. Copy Prompt (Always available)
  menuItems.push({
    label: "Copy Prompt",
    icon: <Clipboard className="w-3.5 h-3.5" />,
    onClick: handleCopyPromptText,
  });

  if (isEditable) {
    menuItems.push({ label: "---" });

    // 3. Favorite / Unfavorite
    menuItems.push({
      label: prompt.isFavorite ? "Unfavorite" : "Favorite",
      icon: <Heart className={`w-3.5 h-3.5 ${prompt.isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />,
      onClick: onToggleFavorite,
    });

    // 4. Mark as Used
    if (prompt.status !== "Used") {
      menuItems.push({
        label: "Mark as Used",
        icon: <PlayCircle className="w-3.5 h-3.5 text-blue-500" />,
        onClick: onMarkUsed,
      });
    }

    // 5. Create New Version
    menuItems.push({
      label: "New Version",
      icon: <GitBranch className="w-3.5 h-3.5 text-purple-500" />,
      onClick: onNewVersion,
    });

    // 6. Edit Prompt
    menuItems.push({
      label: "Edit Prompt",
      icon: <Pencil className="w-3.5 h-3.5" />,
      onClick: onEdit,
    });

    // 7. Duplicate
    menuItems.push({
      label: "Duplicate",
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: onDuplicate,
    });

    menuItems.push({ label: "---" });

    // 8. Archive / Restore
    menuItems.push({
      label: prompt.isArchived ? "Restore Prompt" : "Archive Prompt",
      icon: <Archive className="w-3.5 h-3.5 text-slate-500" />,
      onClick: onToggleArchive,
    });

    // 9. Permanent Delete
    menuItems.push({
      label: "Delete Permanently",
      icon: <Trash2 className="w-3.5 h-3.5 text-red-500" />,
      onClick: onDelete,
    });
  }

  return (
    <DropdownMenu items={menuItems} align="right">
      <button 
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
        aria-label="Open prompt actions"
        id={`prompt-menu-trigger-${prompt.id}`}
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </DropdownMenu>
  );
}
