import React from "react";
import { Card, CardBody } from "../ui/Card";
import { FolderGit2, CheckCircle2, AlertTriangle, AlertOctagon, Archive } from "lucide-react";

interface ProjectsSummaryProps {
  stats: {
    total: number;
    active: number;
    archived: number;
    blocked: number;
    onTrack: number;
    needsAttention: number;
  };
}

export default function ProjectsSummary({ stats }: ProjectsSummaryProps) {
  const cards = [
    {
      label: "Active Projects",
      value: stats.active,
      subtext: `${stats.total} total including archives`,
      icon: FolderGit2,
      colorClass: "text-accent-primary",
      bgClass: "bg-accent-soft/35 border-accent-primary/10"
    },
    {
      label: "On Track / Stable",
      value: stats.onTrack,
      subtext: `${Math.round((stats.onTrack / (stats.active || 1)) * 100)}% of active status`,
      icon: CheckCircle2,
      colorClass: "text-status-success",
      bgClass: "bg-status-success/5 border-status-success/10"
    },
    {
      label: "Needs Attention",
      value: stats.needsAttention,
      subtext: "Review active risks",
      icon: AlertTriangle,
      colorClass: "text-status-warning",
      bgClass: "bg-status-warning/5 border-status-warning/10"
    },
    {
      label: "Blocked Projects",
      value: stats.blocked,
      subtext: "Requires engineering triage",
      icon: AlertOctagon,
      colorClass: "text-status-danger",
      bgClass: "bg-status-danger/5 border-status-danger/10"
    },
    {
      label: "Archived",
      value: stats.archived,
      subtext: "Historical records",
      icon: Archive,
      colorClass: "text-text-tertiary",
      bgClass: "bg-muted-surface border-border-subtle"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card key={idx} className={`border ${card.bgClass} shadow-subtle overflow-hidden`}>
            <CardBody className="p-4 flex flex-col justify-between gap-3 h-full min-h-[90px] font-sans">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-text-secondary uppercase tracking-wider">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.colorClass} shrink-0`} />
              </div>
              <div className="flex flex-col gap-0.5 mt-1">
                <span className="text-2xl font-extrabold font-mono text-text-primary leading-none">
                  {card.value}
                </span>
                <span className="text-[10px] text-text-tertiary truncate leading-tight mt-1">
                  {card.subtext}
                </span>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
