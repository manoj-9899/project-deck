import React from "react";
import SummaryMetric from "./SummaryMetric";
import { FolderGit2, Calendar, AlertTriangle, CheckCircle2 } from "lucide-react";
import { WorkspaceMetrics } from "../../types";

interface WorkspaceSummaryProps {
  metrics: WorkspaceMetrics;
}

export default function WorkspaceSummary({ metrics }: WorkspaceSummaryProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <SummaryMetric
        label="Active Projects"
        value={metrics.activeProjects}
        context="Across building, planning, and testing"
        icon={<FolderGit2 className="w-4 h-4" />}
        variant="accent"
      />
      <SummaryMetric
        label="Due Soon"
        value={metrics.dueSoonTasks}
        context="Within the next seven days"
        icon={<Calendar className="w-4 h-4" />}
        variant="info"
      />
      <SummaryMetric
        label="Needs Attention"
        value={metrics.blockedItems}
        context="One blocked, one inactive project"
        icon={<AlertTriangle className="w-4 h-4" />}
        variant="warning"
      />
      <SummaryMetric
        label="Completed"
        value={metrics.completedThisWeek}
        context="Tasks completed this week"
        icon={<CheckCircle2 className="w-4 h-4" />}
        variant="success"
      />
    </div>
  );
}
