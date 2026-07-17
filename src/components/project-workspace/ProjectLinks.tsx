import React, { useState } from "react";
import { Link2, Github, ExternalLink, FileText, Database, Copy, Check, Terminal, Compass } from "lucide-react";
import { Project } from "../../types";
import { ProjectWorkspaceDetail, WorkspaceLink } from "../../types/project-workspace";

interface ProjectLinksProps {
  project: Project;
  detail: ProjectWorkspaceDetail;
}

export default function ProjectLinks({ project, detail }: ProjectLinksProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Combine core links with supplementary links
  const allLinks: WorkspaceLink[] = [];

  // Core Repository Link
  if (project.repositoryUrl) {
    allLinks.push({
      label: "GitHub Repository",
      url: project.repositoryUrl,
      type: "repository",
      domain: "github.com"
    });
  }

  // Core Deployment Link
  if (project.deploymentUrl) {
    allLinks.push({
      label: "Live Deployment",
      url: project.deploymentUrl,
      type: "deployment",
      domain: project.deploymentUrl.replace(/^https?:\/\//, "")
    });
  }

  // Supplementary links
  if (detail.keyLinks && detail.keyLinks.length > 0) {
    detail.keyLinks.forEach((link) => {
      // Avoid duplicate repository/deployment labels
      const exists = allLinks.some(
        (l) => l.type === link.type && (l.url === link.url || l.label === link.label)
      );
      if (!exists) {
        allLinks.push(link);
      }
    });
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "repository":
        return <Github className="w-3.5 h-3.5" />;
      case "deployment":
        return <ExternalLink className="w-3.5 h-3.5" />;
      case "documentation":
        return <FileText className="w-3.5 h-3.5" />;
      case "database":
        return <Database className="w-3.5 h-3.5" />;
      case "local":
        return <Terminal className="w-3.5 h-3.5" />;
      default:
        return <Link2 className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div id="project-links-panel" className="bg-bg-primary border border-border-subtle rounded-xl p-5 flex flex-col gap-4 font-sans">
      <div className="flex items-center gap-2">
        <Link2 className="w-4 h-4 text-accent-primary" />
        <h3 className="text-sm font-semibold text-text-primary tracking-tight">Key Workspace Links</h3>
      </div>

      {allLinks.length === 0 ? (
        <div className="text-center py-6 text-xs text-text-tertiary">
          No key links currently associated with this project.
        </div>
      ) : (
        <div className="flex flex-col gap-2" id="workspace-links-list">
          {allLinks.map((link, idx) => {
            const linkId = `${link.type}-${idx}`;
            const isLocal = link.type === "local";

            return (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-muted-surface hover:bg-muted-surface/70 border border-border-subtle rounded-lg transition-all text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex items-center justify-center p-1.5 bg-bg-primary border border-border-subtle rounded-md text-text-secondary">
                    {getIcon(link.type)}
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-text-primary truncate">
                      {link.label}
                    </span>
                    <span className="text-[10px] font-mono text-text-tertiary truncate max-w-[180px] sm:max-w-xs">
                      {link.domain || link.url}
                    </span>
                  </div>
                </div>

                {isLocal ? (
                  <button
                    onClick={() => handleCopy(link.url, linkId)}
                    className="flex items-center justify-center p-1.5 text-text-secondary hover:text-text-primary bg-bg-primary border border-border-subtle rounded-md hover:bg-muted-surface focus:outline-none focus:ring-1 focus:ring-border-strong transition-all"
                    title="Copy local path to clipboard"
                    aria-label="Copy local path to clipboard"
                  >
                    {copiedId === linkId ? (
                      <Check className="w-3.5 h-3.5 text-status-success" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                ) : (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-1.5 text-text-secondary hover:text-accent-primary bg-bg-primary border border-border-subtle rounded-md hover:bg-muted-surface focus:outline-none focus:ring-1 focus:ring-border-strong transition-all"
                    title={`Open ${link.label}`}
                    aria-label={`Open ${link.label}`}
                  >
                    <Compass className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
