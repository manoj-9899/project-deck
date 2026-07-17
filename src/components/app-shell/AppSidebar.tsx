import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight,
  Terminal
} from "lucide-react";
import { cn } from "../../lib/cn";
import { 
  primaryNavigationItems, 
  secondaryNavigationItems, 
  isRouteActive 
} from "../../config/navigation";
import WorkspaceIdentity from "./WorkspaceIdentity";
import UserMenu from "./UserMenu";
import { Tooltip } from "../ui/Tooltip";

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AppSidebar({ isCollapsed, onToggleCollapse }: AppSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;


  const renderNavItems = (items: typeof primaryNavigationItems) => {
    return items.map((item) => {
      const active = isRouteActive(currentPath, item.path);
      const Icon = item.icon;

      const linkContent = (
        <Link
          to={item.path}
          className={cn(
            "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 outline-none select-none",
            "focus-visible:ring-2 focus-visible:ring-accent-primary/40 focus-visible:ring-offset-1",
            active
              ? "bg-accent-primary/5 text-accent-primary border-transparent"
              : "text-text-secondary hover:bg-muted-surface hover:text-text-primary border-transparent"
          )}
          aria-current={active ? "page" : undefined}
        >
          {/* Active border indicator */}
          {active && (
            <span 
              className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-accent-primary" 
              aria-hidden="true"
            />
          )}

          <Icon className={cn("w-4.5 h-4.5 shrink-0", active ? "text-accent-primary" : "text-text-tertiary group-hover:text-text-primary")} />
          
          {!isCollapsed && (
            <span className="truncate">{item.label}</span>
          )}
        </Link>
      );

      if (isCollapsed) {
        return (
          <Tooltip key={item.path} content={item.label} position="right">
            {linkContent}
          </Tooltip>
        );
      }

      return <div key={item.path}>{linkContent}</div>;
    });
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen fixed top-0 left-0 bg-surface border-r border-border-strong select-none shrink-0 transition-all duration-200 ease-in-out z-30",
        isCollapsed ? "w-[72px]" : "w-[264px]"
      )}
    >
      {/* Brand Identity */}
      <div className="flex items-center gap-3 px-5 py-4.5 border-b border-border-subtle h-[65px] shrink-0">
        <Link 
          to="/" 
          className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 rounded"
          aria-label="ProjectDock home"
        >
          <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-accent-primary text-white font-sans font-extrabold tracking-tighter text-sm shrink-0 shadow-sm border border-accent-primary/20">
            PD
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-primary leading-tight tracking-tight">ProjectDock</span>
              <span className="text-[10px] font-mono text-text-tertiary leading-none uppercase tracking-wider">Engineering Workspace</span>
            </div>
          )}
        </Link>
      </div>

      {/* Static Workspace Identity Area */}
      <div className="p-3 shrink-0">
        <WorkspaceIdentity isCollapsed={isCollapsed} />
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-1.5 custom-scrollbar">
        {renderNavItems(primaryNavigationItems)}
      </nav>

      {/* Settings & Bottom Area */}
      <div className="p-3 border-t border-b border-border-subtle flex flex-col gap-1.5 shrink-0">
        {renderNavItems(secondaryNavigationItems)}

        {/* Sidebar Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-text-tertiary hover:bg-muted-surface hover:text-text-primary transition-all duration-150 border border-transparent outline-none cursor-pointer select-none",
            "focus-visible:ring-2 focus-visible:ring-accent-primary/40 focus-visible:ring-offset-1"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Tooltip content="Expand Sidebar" position="right">
              <div className="flex items-center justify-center w-full">
                <ChevronRight className="w-4.5 h-4.5 text-text-tertiary" />
              </div>
            </Tooltip>
          ) : (
            <>
              <ChevronLeft className="w-4.5 h-4.5 text-text-tertiary shrink-0" />
              <span>Collapse Menu</span>
            </>
          )}
        </button>
      </div>

      {/* User Profile Area */}
      <div className="p-3 shrink-0">
        <UserMenu isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
