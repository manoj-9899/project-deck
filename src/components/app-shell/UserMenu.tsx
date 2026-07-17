import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../ui/Avatar";
import { DropdownMenu, DropdownMenuItemType } from "../ui/DropdownMenu";
import { useToast } from "../ui/Toast";
import { Settings, BookOpen, Info, ChevronRight, Layout } from "lucide-react";
import { cn } from "../../lib/cn";

interface UserMenuProps {
  isCollapsed?: boolean;
}

export default function UserMenu({ isCollapsed = false }: UserMenuProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAboutClick = () => {
    toast({
      type: "info",
      title: "About ProjectDock",
      message: "ProjectDock is a client-rendered private workspace for engineering management. Built on React 19, Vite, Tailwind v4, and Motion.",
      duration: 5000,
    });
  };

  const menuItems: DropdownMenuItemType[] = [
    {
      label: "Workspace Settings",
      icon: <Settings className="w-3.5 h-3.5" />,
      onClick: () => navigate("/settings"),
    },
    {
      label: "Design System Showcase",
      icon: <Layout className="w-3.5 h-3.5" />,
      onClick: () => navigate("/design-system"),
    },
    {
      label: "---", // Divider
    },
    {
      label: "About ProjectDock",
      icon: <Info className="w-3.5 h-3.5" />,
      onClick: handleAboutClick,
    },
  ];

  const trigger = (
    <button
      type="button"
      className={cn(
        "flex items-center gap-3 w-full p-2 rounded-lg text-left transition-all duration-150 border border-transparent cursor-pointer",
        "hover:bg-muted-surface hover:border-border-subtle focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:outline-none"
      )}
      aria-label="User profile menu"
    >
      <Avatar fallback="MP" size="md" className="shrink-0 bg-accent-primary/10 text-accent-primary font-sans font-semibold border-accent-primary/20" />
      
      {!isCollapsed && (
        <div className="flex-1 min-w-0 flex flex-col">
          <span className="text-xs font-semibold text-text-primary truncate">Manoj Pawar</span>
          <span className="text-[10px] text-text-tertiary truncate">Personal Workspace</span>
        </div>
      )}
      
      {!isCollapsed && (
        <ChevronRight className="w-3.5 h-3.5 text-text-tertiary shrink-0 ml-auto" />
      )}
    </button>
  );

  return (
    <DropdownMenu
      trigger={trigger}
      items={menuItems}
      align={isCollapsed ? "left" : "right"}
    />
  );
}
