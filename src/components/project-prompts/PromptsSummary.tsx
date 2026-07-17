/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Terminal, CheckCircle2, PlayCircle, AlertTriangle, Heart } from "lucide-react";
import { PromptSummaryStats } from "../../types/project-prompt";

interface PromptsSummaryProps {
  summary: PromptSummaryStats;
}

export default function PromptsSummary({ summary }: PromptsSummaryProps) {
  const stats = [
    {
      label: "Total Prompts",
      value: summary.total,
      icon: <Terminal className="w-4 h-4 text-slate-500" />,
      bg: "bg-slate-50 border-slate-100",
    },
    {
      label: "Ready Prompts",
      value: summary.ready,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      bg: "bg-emerald-50/50 border-emerald-100",
    },
    {
      label: "Used Prompts",
      value: summary.used,
      icon: <PlayCircle className="w-4 h-4 text-blue-500" />,
      bg: "bg-blue-50/50 border-blue-100",
    },
    {
      label: "Needs Revision",
      value: summary.needsRevision,
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
      bg: "bg-amber-50/50 border-amber-100",
    },
    {
      label: "Favorites",
      value: summary.favorites,
      icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />,
      bg: "bg-rose-50/50 border-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3" id="prompts-summary-metrics">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 p-3.5 border rounded-xl shadow-sm bg-white transition-all ${
            i === 0 ? "col-span-2 md:col-span-1 bg-gray-50/50" : ""
          }`}
          id={`prompt-stat-card-${i}`}
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
