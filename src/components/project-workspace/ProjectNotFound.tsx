import React from "react";
import { Link } from "react-router-dom";
import { FolderX, ArrowLeft, Home, HelpCircle } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div
      id="project-not-found"
      className="bg-bg-primary border border-border-subtle rounded-xl p-8 flex flex-col items-center justify-center text-center font-sans max-w-md mx-auto py-12 shadow-sm animate-fade-in my-12"
    >
      <div className="p-4 bg-status-danger/5 border border-status-danger/10 text-status-danger rounded-full mb-4 shadow-3xs">
        <FolderX className="w-8 h-8" />
      </div>

      <h2 className="text-base font-semibold text-text-primary tracking-tight font-sans">
        Project not found
      </h2>
      
      <p className="text-xs text-text-secondary leading-relaxed mt-2 max-w-xs">
        This project may have been renamed, archived, or removed from the current workspace records.
      </p>

      {/* Supporting details block */}
      <div className="mt-5 p-3 bg-muted-surface border border-border-subtle rounded-lg text-[10px] text-text-tertiary font-mono flex items-center gap-2">
        <HelpCircle className="w-4 h-4 shrink-0" />
        <span>Error Code: WORKSPACE_RESOLVER_404</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full">
        <Link
          to="/projects"
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-accent-primary hover:bg-accent-primary/90 rounded-lg shadow-sm transition-all focus:outline-none w-full"
          id="notfound-projects-directory-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Projects</span>
        </Link>
        <Link
          to="/"
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-text-secondary hover:text-text-primary bg-bg-primary border border-border-subtle rounded-lg hover:bg-muted-surface transition-all focus:outline-none w-full"
          id="notfound-dashboard-btn"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Go to Overview</span>
        </Link>
      </div>
    </div>
  );
}
