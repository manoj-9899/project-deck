import React from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Sliders, HelpCircle } from "lucide-react";
import { Project, ProjectStatus } from "../../types";

interface ProjectStatusDistributionProps {
  projects: Project[];
}

export default function ProjectStatusDistribution({ projects }: ProjectStatusDistributionProps) {
  // Group counts
  const statusGroups: Record<ProjectStatus, { count: number; color: string; label: string; bg: string }> = {
    Idea: { count: 0, color: "bg-indigo-400", bg: "bg-indigo-50", label: "Idea" },
    Planning: { count: 0, color: "bg-status-info", bg: "bg-status-info/10", label: "Planning" },
    Designing: { count: 0, color: "bg-purple-400", bg: "bg-purple-50", label: "Designing" },
    Building: { count: 0, color: "bg-accent-primary", bg: "bg-accent-soft", label: "Building" },
    Testing: { count: 0, color: "bg-status-warning", bg: "bg-status-warning/10", label: "Testing" },
    Deployed: { count: 0, color: "bg-status-success", bg: "bg-status-success/10", label: "Deployed" },
    Maintaining: { count: 0, color: "bg-emerald-500", bg: "bg-emerald-50", label: "Maintaining" },
    Paused: { count: 0, color: "bg-text-tertiary", bg: "bg-muted-surface", label: "Paused" },
    Archived: { count: 0, color: "bg-zinc-400", bg: "bg-zinc-100", label: "Archived" },
  };

  // Populate counts
  projects.forEach((p) => {
    if (statusGroups[p.status]) {
      statusGroups[p.status].count++;
    }
  });

  const total = projects.length || 1;

  // Render segments
  const statuses = Object.keys(statusGroups) as ProjectStatus[];

  return (
    <Card className="border border-border-subtle bg-surface shadow-subtle flex flex-col font-sans">
      <CardHeader className="py-3.5 px-5 border-b border-border-subtle flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-accent-primary" />
          <h3 className="text-sm font-bold text-text-primary tracking-tight">
            Portfolio Distribution
          </h3>
          <Badge variant="accent" className="font-mono text-[10px] px-2 py-0">
            Lifecycle
          </Badge>
        </div>
      </CardHeader>
      
      <CardBody className="p-5 flex flex-col gap-6">
        {/* Segmented bar */}
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-muted-surface border border-border-subtle/30">
            {statuses.map((status) => {
              const info = statusGroups[status];
              const pct = (info.count / total) * 100;
              if (pct === 0) return null;
              return (
                <div
                  key={status}
                  style={{ width: `${pct}%` }}
                  className={`${info.color} h-full transition-all duration-300 relative group first:rounded-l-full last:rounded-r-full`}
                  title={`${info.label}: ${info.count} projects`}
                />
              );
            })}
          </div>
          
          <div className="flex items-center justify-between text-[10px] font-mono text-text-tertiary">
            <span>Portfolio Span</span>
            <span>Total: {projects.length} Projects</span>
          </div>
        </div>

        {/* Legend listing */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
          {statuses.map((status) => {
            const info = statusGroups[status];
            const pct = Math.round((info.count / total) * 100);
            
            // Collect project names in this status
            const filteredProjNames = projects
              .filter((p) => p.status === status)
              .map((p) => p.name)
              .join(", ");

            const isZero = info.count === 0;

            return (
              <div
                key={status}
                className={`flex flex-col gap-1 p-2 border border-border-subtle bg-muted-surface/20 rounded-md hover:border-border-strong hover:bg-muted-surface/30 transition-all ${isZero ? "opacity-40" : "opacity-100"}`}
                title={filteredProjNames ? `Projects: ${filteredProjNames}` : "No active projects"}
              >
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${info.color}`} />
                  <span className="text-[9px] font-mono font-bold text-text-secondary leading-none uppercase truncate">
                    {info.label}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-1.5 mt-0.5">
                  <span className="text-sm font-extrabold font-mono text-text-primary leading-none">
                    {info.count}
                  </span>
                  <span className="text-[9px] font-mono text-text-tertiary">
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
