import React from "react";
import { 
  MoreVertical, 
  Eye, 
  Pencil, 
  Copy, 
  Pin, 
  PinOff,
  Archive, 
  Trash2,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  FileText,
  Clipboard
} from "lucide-react";
import { DropdownMenu, DropdownMenuItemType } from "../ui/DropdownMenu";
import { ProjectKnowledgeEntry, DecisionStatus } from "../../types/project-knowledge";
import { useToast } from "../ui/Toast";

interface KnowledgeEntryMenuProps {
  entry: ProjectKnowledgeEntry;
  onOpenDetails: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onTogglePin: () => void;
  onToggleArchive: () => void;
  onDelete: () => void;
  onChangeDecisionStatus?: (status: DecisionStatus) => void;
  isEditable: boolean;
}

export default function KnowledgeEntryMenu({
  entry,
  onOpenDetails,
  onEdit,
  onDuplicate,
  onTogglePin,
  onToggleArchive,
  onDelete,
  onChangeDecisionStatus,
  isEditable,
}: KnowledgeEntryMenuProps) {
  const { toast } = useToast();
  
  const handleCopyText = () => {
    navigator.clipboard.writeText(`${entry.title}\n\n${entry.content}`);
    toast({
      type: "success",
      title: "Copied to Clipboard",
      message: "The entry title and content were copied successfully.",
    });
  };

  const menuItems: DropdownMenuItemType[] = [];

  // 1. View Details (always available)
  menuItems.push({
    label: "View Details",
    icon: <Eye className="w-3.5 h-3.5" />,
    onClick: onOpenDetails,
  });

  // 2. Copy Text (always available for read-only convenience)
  menuItems.push({
    label: "Copy Text",
    icon: <Clipboard className="w-3.5 h-3.5" />,
    onClick: handleCopyText,
  });

  // Actions restricted to editable active projects
  if (isEditable) {
    menuItems.push({ label: "---" });

    // 3. Pin / Unpin
    menuItems.push({
      label: entry.isPinned ? "Unpin from Top" : "Pin to Top",
      icon: entry.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />,
      onClick: onTogglePin,
    });

    // 4. Edit
    menuItems.push({
      label: "Edit Entry",
      icon: <Pencil className="w-3.5 h-3.5" />,
      onClick: onEdit,
    });

    // 5. Duplicate
    menuItems.push({
      label: "Duplicate",
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: onDuplicate,
    });

    // 6. Decision-specific lane moves
    if (entry.type === "Decision" && onChangeDecisionStatus) {
      menuItems.push({ label: "---" });
      
      const statuses: { label: string; status: DecisionStatus; icon: React.ReactNode }[] = [
        { label: "Set as Proposed", status: "Proposed", icon: <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> },
        { label: "Set as Accepted", status: "Accepted", icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> },
        { label: "Set as Superseded", status: "Superseded", icon: <FileText className="w-3.5 h-3.5 text-amber-500" /> },
        { label: "Set as Rejected", status: "Rejected", icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> },
      ];

      statuses.forEach((s) => {
        if (entry.status !== s.status) {
          menuItems.push({
            label: s.label,
            icon: s.icon,
            onClick: () => onChangeDecisionStatus(s.status),
          });
        }
      });
    }

    menuItems.push({ label: "---" });

    // 7. Archive / Restore
    menuItems.push({
      label: entry.isArchived ? "Restore Entry" : "Archive Entry",
      icon: <Archive className="w-3.5 h-3.5" />,
      onClick: onToggleArchive,
    });

    // 8. Delete permanently from session memory
    menuItems.push({
      label: "Delete Entry",
      icon: <Trash2 className="w-3.5 h-3.5 text-red-500" />,
      onClick: onDelete,
    });
  }

  return (
    <DropdownMenu items={menuItems} align="right">
      <button 
        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none"
        aria-label="Open context actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </DropdownMenu>
  );
}
