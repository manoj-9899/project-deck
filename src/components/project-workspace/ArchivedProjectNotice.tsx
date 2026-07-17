import React from "react";
import { Link } from "react-router-dom";
import { Archive, ArrowLeft, AlertCircle } from "lucide-react";

interface ArchivedProjectNoticeProps {
  projectName: string;
}

export default function ArchivedProjectNotice({ projectName }: ArchivedProjectNoticeProps) {
  return (
    <div
      id="archived-project-notice"
      className="bg-status-danger/5 border border-status-danger/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans mb-4"
    >
      <div className="flex gap-3 items-start sm:items-center">
        <span className="p-1.5 bg-bg-primary border border-status-danger/20 text-status-danger rounded-lg shrink-0 flex items-center justify-center">
          <Archive className="w-4 h-4" />
        </span>
        <div className="flex flex-col gap-0.5 text-xs text-text-secondary leading-relaxed">
          <h4 className="font-bold text-text-primary">
            Archived Workspace: {projectName}
          </h4>
          <p>
            This project has been placed in the archive. It is kept as read-only technical reference material; active task and pipeline tracking are disabled.
          </p>
        </div>
      </div>

      <Link
        to="/projects?scope=archived"
        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-text-secondary hover:text-text-primary bg-bg-primary border border-border-subtle rounded-lg hover:bg-muted-surface transition-all shrink-0 self-start sm:self-auto focus:outline-none focus:ring-1 focus:ring-border-strong"
        id="archived-back-to-archives"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>View Archived Projects</span>
      </Link>
    </div>
  );
}
