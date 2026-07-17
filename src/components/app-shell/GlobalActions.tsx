import React from "react";
import { Search, Plus, Bell } from "lucide-react";
import { IconButton } from "../ui/IconButton";
import { Tooltip } from "../ui/Tooltip";
import { useToast } from "../ui/Toast";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";

export default function GlobalActions() {
  const { toast } = useToast();
  const { setIsOpen } = useGlobalSearch();

  const handleSearchClick = () => {
    setIsOpen(true);
  };

  const handleCreateClick = () => {
    toast({
      type: "info",
      title: "Creation Workflow",
      message: "Creation workflows will be introduced with project and task management.",
      duration: 3500,
    });
  };

  const handleNotificationsClick = () => {
    toast({
      type: "info",
      title: "Notifications Center",
      message: "No notifications yet.",
      duration: 3000,
    });
  };

  return (
    <div className="flex items-center gap-1.5">
      <Tooltip content="Search Workspace" position="bottom">
        <IconButton
          label="Search Workspace"
          icon={<Search className="w-4 h-4 text-text-secondary" />}
          variant="ghost"
          size="md"
          onClick={handleSearchClick}
        />
      </Tooltip>

      <Tooltip content="Create New..." position="bottom">
        <IconButton
          label="Create New..."
          icon={<Plus className="w-4 h-4 text-text-secondary" />}
          variant="ghost"
          size="md"
          onClick={handleCreateClick}
        />
      </Tooltip>

      <Tooltip content="Notifications" position="bottom">
        <IconButton
          label="Notifications"
          icon={<Bell className="w-4 h-4 text-text-secondary" />}
          variant="ghost"
          size="md"
          onClick={handleNotificationsClick}
        />
      </Tooltip>
    </div>
  );
}
