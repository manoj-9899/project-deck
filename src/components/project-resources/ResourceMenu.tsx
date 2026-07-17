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
  Archive, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clipboard,
  ExternalLink
} from "lucide-react";
import { DropdownMenu, DropdownMenuItemType } from "../ui/DropdownMenu";
import { ProjectResource, ResourceStatus } from "../../types/project-resource";
import { useToast } from "../ui/Toast";

interface ResourceMenuProps {
  resource: ProjectResource;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onToggleFavorite: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
  onChangeStatus: (status: ResourceStatus) => void;
  isEditable: boolean;
}

export default function ResourceMenu({
  resource,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onToggleFavorite,
  onToggleArchive,
  onDelete,
  onChangeStatus,
  isEditable,
}: ResourceMenuProps) {
  const { toast } = useToast();

  const handleCopyLink = (e?: React.MouseEvent) => {
    const textToCopy = resource.localPath || resource.url || "";
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    toast({
      type: "success",
      title: "Value Copied",
      message: `Successfully copied the ${resource.localPath ? "local path" : "URL"} to your clipboard.`,
    });
  };

  const menuItems: DropdownMenuItemType[] = [];

  // 1. View Details
  menuItems.push({
    label: "View Details",
    icon: <Eye className="w-3.5 h-3.5" />,
    onClick: onOpenDetails,
  });

  // 2. Open External Link (if URL is present)
  if (resource.url) {
    menuItems.push({
      label: "Open External Link",
      icon: <ExternalLink className="w-3.5 h-3.5" />,
      onClick: () => {
        window.open(resource.url, "_blank", "noopener,noreferrer");
      },
    });
  }

  // 3. Copy Link / Local Path
  menuItems.push({
    label: resource.localPath ? "Copy Local Path" : "Copy URL Link",
    icon: <Clipboard className="w-3.5 h-3.5" />,
    onClick: handleCopyLink,
  });

  // Actions restricted to editable active projects
  if (isEditable) {
    menuItems.push({ label: "---" });

    // 4. Toggle Favorite
    menuItems.push({
      label: resource.isFavorite ? "Remove Favorite" : "Add Favorite",
      icon: <Heart className={`w-3.5 h-3.5 ${resource.isFavorite ? "fill-rose-500 text-rose-500" : ""}`} />,
      onClick: onToggleFavorite,
    });

    // 5. Edit Resource
    menuItems.push({
      label: "Edit Reference",
      icon: <Pencil className="w-3.5 h-3.5" />,
      onClick: onEdit,
    });

    // 6. Duplicate
    menuItems.push({
      label: "Duplicate",
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: onDuplicate,
    });

    // 7. Status Modifications
    menuItems.push({ label: "---" });

    const statuses: { label: string; status: ResourceStatus; icon: React.ReactNode }[] = [
      { label: "Set as Active", status: "Active", icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> },
      { label: "Set as Inactive", status: "Inactive", icon: <XCircle className="w-3.5 h-3.5 text-slate-500" /> },
      { label: "Set as Broken", status: "Broken", icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> },
    ];

    statuses.forEach((s) => {
      if (resource.status !== s.status && !resource.isArchived) {
        menuItems.push({
          label: s.label,
          icon: s.icon,
          onClick: () => onChangeStatus(s.status),
        });
      }
    });

    menuItems.push({ label: "---" });

    // 8. Archive / Restore
    menuItems.push({
      label: resource.isArchived ? "Restore Reference" : "Archive Reference",
      icon: <Archive className="w-3.5 h-3.5" />,
      onClick: onToggleArchive,
    });

    // 9. Delete Reference (Temporary Delete)
    menuItems.push({
      label: "Delete Reference",
      icon: <Trash2 className="w-3.5 h-3.5 text-red-500" />,
      onClick: onDelete,
    });
  }

  return (
    <DropdownMenu items={menuItems} align="right">
      <button 
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
        aria-label="Open resource actions"
        id={`res-menu-trigger-${resource.id}`}
        onClick={(e) => e.stopPropagation()}
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </DropdownMenu>
  );
}
