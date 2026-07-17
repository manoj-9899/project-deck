import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { cn } from "../../lib/cn";
import AppSidebar from "./AppSidebar";
import MobileAppHeader from "./MobileAppHeader";
import PageHeader from "./PageHeader";
import GlobalActions from "./GlobalActions";
import { useToast } from "../ui/Toast";
import { GlobalSearchDialog } from "../global-search/GlobalSearchDialog";

export default function AppShell() {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const { toast } = useToast();

  // Unified collapsed state for both sidebar width and content padding
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      if (typeof window !== "undefined") {
        return localStorage.getItem("projectdock:sidebar-collapsed") === "true";
      }
    } catch (e) {
      // Ignore localStorage issues
    }
    return false;
  });

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("projectdock:sidebar-collapsed", String(next));
      } catch (e) {
        // Ignore errors
      }
      return next;
    });
  };

  // Compute route-aware page header properties
  const getHeaderProps = () => {
    if (currentPath === "/") {
      return {
        title: "Overview",
        description: "Your engineering workspace at a glance.",
        eyebrow: "Dashboard",
        primaryAction: {
          label: "View Projects",
          onClick: () => navigate("/projects"),
        },
      };
    }
    if (currentPath === "/projects") {
      return {
        title: "Projects",
        description: "Plan, track, and ship every project from one workspace.",
        eyebrow: "Directory",
        primaryAction: {
          label: "New Project",
          onClick: () => {
            toast({
              type: "info",
              title: "Creation Workflow",
              message: "Creation workflows will be introduced with project and task management.",
              duration: 3500,
            });
          },
        },
      };
    }
    if (currentPath.startsWith("/projects/")) {
      return {
        title: "Project Workspace",
        description: "Review project board updates, active tasks, and code metrics.",
        eyebrow: "Active Project",
        metadata: (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-accent-primary/10 text-accent-primary border border-accent-primary/25 ml-2">
            ID: {projectId || "active"}
          </span>
        ),
        primaryAction: {
          label: "Configure Workspace",
          onClick: () => {
            toast({
              type: "info",
              title: "Workspace Configuration",
              message: "Project-level settings will be introduced when workspace engines are built.",
              duration: 3500,
            });
          },
        },
      };
    }
    if (currentPath === "/tasks") {
      return {
        title: "Tasks",
        description: "Review work across active projects.",
        eyebrow: "Sprint Planner",
        primaryAction: {
          label: "Create Task",
          onClick: () => {
            toast({
              type: "info",
              title: "Creation Workflow",
              message: "Creation workflows will be introduced with project and task management.",
              duration: 3500,
            });
          },
        },
      };
    }
    if (currentPath === "/prompts") {
      return {
        title: "Prompt Library",
        description: "Organize reusable prompts and AI implementation context.",
        eyebrow: "AI Copilot Core",
        primaryAction: {
          label: "Add Prompt Template",
          onClick: () => {
            toast({
              type: "info",
              title: "Creation Workflow",
              message: "Creation workflows will be introduced with project and task management.",
              duration: 3500,
            });
          },
        },
      };
    }
    if (currentPath === "/knowledge") {
      return {
        title: "Knowledge",
        description: "Keep technical decisions, documentation, and solutions accessible.",
        eyebrow: "Wiki",
        primaryAction: {
          label: "New Doc",
          onClick: () => {
            toast({
              type: "info",
              title: "Creation Workflow",
              message: "Creation workflows will be introduced with project and task management.",
              duration: 3500,
            });
          },
        },
      };
    }
    if (currentPath === "/settings") {
      return {
        title: "Settings",
        description: "Manage your ProjectDock workspace preferences.",
        eyebrow: "Preferences",
        primaryAction: {
          label: "Save Preferences",
          onClick: () => {
            toast({
              type: "success",
              title: "Preferences Saved",
              message: "Local workspace preference states updated successfully.",
              duration: 3000,
            });
          },
        },
      };
    }

    return {
      title: "Not Found",
      description: "This requested path does not exist in ProjectDock.",
      eyebrow: "Error 404",
    };
  };

  const headerProps = getHeaderProps();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <AppSidebar 
        isCollapsed={isCollapsed} 
        onToggleCollapse={handleToggleCollapse} 
      />

      {/* Main Viewport Panel */}
      <div 
        className={cn(
          "flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-200 ease-in-out bg-surface/40",
          isCollapsed ? "md:pl-[72px]" : "md:pl-[264px]"
        )}
      >
        {/* Mobile Navigation Header */}
        <MobileAppHeader />

        {/* Desktop Sticky Top-Bar with Global Actions */}
        <div className="hidden md:flex items-center justify-end h-14 border-b border-border-subtle px-6 shrink-0 bg-surface/50 backdrop-blur-md sticky top-0 z-20">
          <GlobalActions />
        </div>

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar focus:outline-none" tabIndex={-1}>
          <div className="w-full max-w-5xl mx-auto px-4 py-6 md:px-8 md:py-8 flex flex-col gap-6">
            
            {/* Route-Aware Page Header */}
            <PageHeader
              title={headerProps.title}
              description={headerProps.description}
              eyebrow={headerProps.eyebrow}
              primaryAction={headerProps.primaryAction}
              metadata={"metadata" in headerProps ? headerProps.metadata : undefined}
            />

            {/* Inner Content Outlet */}
            <div className="flex-1 pb-10">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      {/* Workspace-wide keyboard-accessible Command Palette overlay */}
      <GlobalSearchDialog />
    </div>
  );
}
