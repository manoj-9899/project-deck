import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, Terminal, Settings, Layout, ExternalLink, HelpCircle } from "lucide-react";
import { cn } from "../../lib/cn";
import { Button } from "../ui/Button";
import { Sheet } from "../ui/Sheet";
import { useToast } from "../ui/Toast";
import { useGlobalSearch } from "../../hooks/useGlobalSearch";
import { 
  primaryNavigationItems, 
  secondaryNavigationItems, 
  isRouteActive 
} from "../../config/navigation";
import WorkspaceIdentity from "./WorkspaceIdentity";
import { Avatar } from "../ui/Avatar";

export default function MobileAppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIsOpen } = useGlobalSearch();

  // Helper to get active page title for the header display
  const getPageTitle = () => {
    if (currentPath === "/") return "Overview";
    if (currentPath === "/projects") return "Projects";
    if (currentPath.startsWith("/projects/")) return "Project Workspace";
    if (currentPath === "/tasks") return "Tasks";
    if (currentPath === "/prompts") return "Prompt Library";
    if (currentPath === "/knowledge") return "Knowledge";
    if (currentPath === "/settings") return "Settings";
    return "ProjectDock";
  };

  const handleSearchClick = () => {
    setIsOpen(true);
  };

  const handleAboutClick = () => {
    toast({
      type: "info",
      title: "About ProjectDock",
      message: "ProjectDock is an engineering planning environment. Built with React 19 and Tailwind CSS v4.",
      duration: 4000,
    });
    setIsMenuOpen(false);
  };

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="md:hidden flex items-center justify-between px-4 bg-surface border-b border-border-strong h-14 sticky top-0 z-40 w-full select-none">
      <div className="flex items-center gap-3">
        {/* Menu button to open the Sheet drawer */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMenuOpen(true)}
          className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-muted-surface border-transparent"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Current page title */}
        <span className="font-semibold text-text-primary text-sm tracking-tight truncate max-w-[180px]">
          {getPageTitle()}
        </span>
      </div>

      {/* Brand logo & Search trigger */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSearchClick}
          className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-muted-surface border-transparent"
          aria-label="Search Workspace"
        >
          <Search className="w-4.5 h-4.5" />
        </Button>

        <Link to="/" className="flex items-center justify-center w-7 h-7 rounded-md bg-accent-primary text-white font-sans font-extrabold tracking-tighter text-xs shadow-sm ml-1.5">
          PD
        </Link>
      </div>

      {/* Navigation Drawer (using Phase 1.1 Sheet with escape binding and focus traps) */}
      <Sheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title="Navigation"
        description="Engineering Workspace Portal"
        side="left"
      >
        <div className="flex flex-col gap-6 h-full min-h-[70vh] justify-between pb-4">
          <div className="flex flex-col gap-5">
            {/* ProjectDock Branding Identity */}
            <div className="flex items-center gap-3 px-1 py-1">
              <div className="flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-accent-primary text-white font-sans font-extrabold tracking-tighter text-sm shrink-0 border border-accent-primary/20">
                PD
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-text-primary leading-tight tracking-tight">ProjectDock</span>
                <span className="text-[10px] font-mono text-text-tertiary leading-none uppercase tracking-wider">Engineering Workspace</span>
              </div>
            </div>

            {/* Static Workspace Identity card */}
            <WorkspaceIdentity isCollapsed={false} />

            {/* Navigation Menus */}
            <nav className="flex flex-col gap-1 mt-1">
              {primaryNavigationItems.map((item) => {
                const active = isRouteActive(currentPath, item.path);
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      "relative flex items-center gap-3.5 px-3 py-3 rounded-lg text-xs font-semibold transition-all duration-150 border text-left cursor-pointer",
                      active
                        ? "bg-accent-primary/5 text-accent-primary border-transparent font-bold"
                        : "text-text-secondary hover:bg-muted-surface hover:text-text-primary border-transparent"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-accent-primary" />
                    )}
                    <Icon className="w-4.5 h-4.5 text-text-tertiary shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="h-px bg-border-subtle my-2" />

              {secondaryNavigationItems.map((item) => {
                const active = isRouteActive(currentPath, item.path);
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={cn(
                      "relative flex items-center gap-3.5 px-3 py-3 rounded-lg text-xs font-semibold transition-all duration-150 border text-left cursor-pointer",
                      active
                        ? "bg-accent-primary/5 text-accent-primary border-transparent font-bold"
                        : "text-text-secondary hover:bg-muted-surface hover:text-text-primary border-transparent"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-accent-primary" />
                    )}
                    <Icon className="w-4.5 h-4.5 text-text-tertiary shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User profile & Extra utility triggers */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border-subtle mt-auto">
            {/* Design System Access */}
            <button
              onClick={() => handleNavClick("/design-system")}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-text-secondary hover:bg-muted-surface hover:text-text-primary border border-transparent transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Layout className="w-4 h-4 text-text-tertiary" />
                <span>Design System Showcase</span>
              </div>
              <ExternalLink className="w-3 h-3 text-text-tertiary" />
            </button>

            {/* About triggering toast */}
            <button
              onClick={handleAboutClick}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-text-secondary hover:bg-muted-surface hover:text-text-primary border border-transparent transition-all text-left cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-text-tertiary" />
              <span>About ProjectDock</span>
            </button>

            {/* Profile Summary Badge */}
            <div className="flex items-center gap-3 px-3 py-3 bg-muted-surface/45 border border-border-subtle rounded-xl mt-2">
              <Avatar fallback="MP" size="md" className="bg-accent-primary/10 text-accent-primary font-semibold font-sans border-accent-primary/25" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-text-primary">Manoj Pawar</span>
                <span className="text-[10px] text-text-tertiary">Personal Workspace</span>
              </div>
            </div>
          </div>
        </div>
      </Sheet>
    </header>
  );
}
