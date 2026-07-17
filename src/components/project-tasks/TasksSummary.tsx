import React from "react";
import { 
  CheckSquare, 
  Play, 
  AlertTriangle, 
  Clock, 
  CheckCircle2 
} from "lucide-react";

interface TasksSummaryProps {
  summary: {
    total: number;
    inProgress: number;
    dueSoon: number;
    blocked: number;
    completed: number;
  };
}

export default function TasksSummary({ summary }: TasksSummaryProps) {
  const cards = [
    {
      id: "summary-total",
      label: "Total Active",
      value: summary.total,
      icon: <CheckSquare className="w-4 h-4 text-text-secondary" />,
      bg: "bg-bg-secondary",
      border: "border-border-subtle",
    },
    {
      id: "summary-inprogress",
      label: "In Progress",
      value: summary.inProgress,
      icon: <Play className="w-4 h-4 text-accent-primary" />,
      bg: "bg-accent-subtle/20",
      border: "border-accent-subtle",
    },
    {
      id: "summary-duesoon",
      label: "Due Soon",
      value: summary.dueSoon,
      icon: <Clock className="w-4 h-4 text-status-warning" />,
      bg: "bg-status-warning/10",
      border: "border-status-warning/30",
    },
    {
      id: "summary-blocked",
      label: "Blocked",
      value: summary.blocked,
      icon: <AlertTriangle className="w-4 h-4 text-status-danger" />,
      bg: "bg-status-danger/10",
      border: "border-status-danger/30",
    },
    {
      id: "summary-completed",
      label: "Completed",
      value: summary.completed,
      icon: <CheckCircle2 className="w-4 h-4 text-status-success" />,
      bg: "bg-status-success/10",
      border: "border-status-success/30",
    },
  ];

  return (
    <div id="tasks-summary-panel" className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {cards.map((card) => (
        <div
          key={card.id}
          id={card.id}
          className={`flex items-center gap-3 p-3.5 rounded-lg border ${card.bg} ${card.border} transition-shadow hover:shadow-sm`}
        >
          <div className="p-1.5 bg-bg-primary rounded-md border border-border-subtle shrink-0">
            {card.icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-sans font-medium text-text-tertiary truncate leading-tight">
              {card.label}
            </span>
            <span className="text-sm sm:text-base font-mono font-bold text-text-primary mt-0.5 leading-none">
              {card.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
