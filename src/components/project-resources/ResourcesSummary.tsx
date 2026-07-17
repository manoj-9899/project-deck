/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Link2, GitBranch, Globe, FileText, AlertTriangle } from "lucide-react";
import { ResourceSummaryStats } from "../../types/project-resource";

interface ResourcesSummaryProps {
  summary: ResourceSummaryStats;
}

export default function ResourcesSummary({ summary }: ResourcesSummaryProps) {
  const stats = [
    {
      label: "Total Resources",
      value: summary.total,
      icon: <Link2 className="w-4 h-4 text-slate-500" />,
      bg: "bg-slate-50 border-slate-100",
      id: "stat-total",
    },
    {
      label: "Repositories",
      value: summary.repositories,
      icon: <GitBranch className="w-4 h-4 text-blue-500" />,
      bg: "bg-blue-50/50 border-blue-100",
      id: "stat-repositories",
    },
    {
      label: "Deployments",
      value: summary.deployments,
      icon: <Globe className="w-4 h-4 text-emerald-500" />,
      bg: "bg-emerald-50/50 border-emerald-100",
      id: "stat-deployments",
    },
    {
      label: "Documentation",
      value: summary.documentation,
      icon: <FileText className="w-4 h-4 text-purple-500" />,
      bg: "bg-purple-50/50 border-purple-100",
      id: "stat-documentation",
    },
    {
      label: "Broken Links",
      value: summary.broken,
      icon: <AlertTriangle className="w-4 h-4 text-rose-500" />,
      bg: "bg-rose-50/50 border-rose-100",
      id: "stat-broken",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3" id="resources-summary-metrics">
      {stats.map((stat, i) => (
        <div
          key={stat.id}
          className={`flex items-center gap-3 p-3.5 border rounded-xl shadow-sm bg-white transition-all ${
            i === 0 ? "col-span-2 md:col-span-1 bg-gray-50/50" : ""
          }`}
          id={`resource-stat-card-${stat.id}`}
        >
          <div className={`p-2 rounded-lg border ${stat.bg} shrink-0`}>
            {stat.icon}
          </div>
          <div className="min-w-0">
            <span className="block text-xs font-medium text-gray-500 tracking-wide uppercase">
              {stat.label}
            </span>
            <span className="block text-xl font-semibold text-gray-900 tracking-tight">
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
