import React from "react";
import { BookOpen, FileText, CheckCircle, Pin, AlertCircle } from "lucide-react";

interface KnowledgeSummaryProps {
  summary: {
    total: number;
    decisions: number;
    documentation: number;
    errorsSolved: number;
    pinned: number;
  };
}

export default function KnowledgeSummary({ summary }: KnowledgeSummaryProps) {
  const stats = [
    {
      label: "Total Entries",
      value: summary.total,
      icon: <BookOpen className="w-4 h-4 text-slate-500" />,
      bg: "bg-slate-50 border-slate-100",
    },
    {
      label: "Decisions",
      value: summary.decisions,
      icon: <CheckCircle className="w-4 h-4 text-emerald-500" />,
      bg: "bg-emerald-50/50 border-emerald-100",
    },
    {
      label: "Documentation",
      value: summary.documentation,
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      bg: "bg-blue-50/50 border-blue-100",
    },
    {
      label: "Errors Solved",
      value: summary.errorsSolved,
      icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
      bg: "bg-amber-50/50 border-amber-100",
    },
    {
      label: "Pinned Items",
      value: summary.pinned,
      icon: <Pin className="w-4 h-4 text-rose-500" />,
      bg: "bg-rose-50/50 border-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`flex items-center gap-3 p-3.5 border rounded-xl shadow-sm bg-white transition-all ${
            i === 0 ? "col-span-2 md:col-span-1 bg-gray-50/50" : ""
          }`}
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
