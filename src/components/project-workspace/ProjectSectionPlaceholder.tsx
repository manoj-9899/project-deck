import React from "react";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  Milestone,
  BookOpen,
  Terminal,
  Link2,
  Activity,
  ArrowLeft,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { Project } from "../../types";

interface ProjectSectionPlaceholderProps {
  project: Project;
  section: "tasks" | "roadmap" | "knowledge" | "prompts" | "resources" | "activity";
}

export default function ProjectSectionPlaceholder({ project, section }: ProjectSectionPlaceholderProps) {
  const getSectionDetails = () => {
    switch (section) {
      case "tasks":
        return {
          title: "Tasks Tracker",
          icon: <CheckSquare className="w-8 h-8 text-accent-primary" />,
          explanation: "Project tasks will be introduced in a dedicated task-management phase.",
          plannedPhase: "Phase 6 — Actionable Task Planner",
          tip: "Interactive kanban boards, task lists, and issue queues will let you track direct contributions without leaving your Workspace."
        };
      case "roadmap":
        return {
          title: "Roadmap Planner",
          icon: <Milestone className="w-8 h-8 text-accent-primary" />,
          explanation: "Phases, milestones, dependencies, and timeline planning will be introduced next.",
          plannedPhase: "Phase 5.5 — Interactive Roadmap & Milestone Registry",
          tip: "Visual gantt-like timeline scales, delivery phases, and blocking milestone warnings will synchronize with active project states."
        };
      case "knowledge":
        return {
          title: "Knowledge Vault",
          icon: <BookOpen className="w-8 h-8 text-accent-primary" />,
          explanation: "Technical decisions, notes, documentation, and solutions will be introduced later.",
          plannedPhase: "Phase 7 — Engineering Wiki & Notes Editor",
          tip: "Construct structural Markdown manuals, repository architectures maps, and save critical code snippets under technical tags."
        };
      case "prompts":
        return {
          title: "Prompt Registry",
          icon: <Terminal className="w-8 h-8 text-accent-primary" />,
          explanation: "Reusable AI prompts and implementation context will be introduced in the Prompt Library phase.",
          plannedPhase: "Phase 8 — AI Engineering Prompt Library",
          tip: "Store custom system prompts, codebase summaries, and context injections ready to be fed directly to Gemini or local LLM runtimes."
        };
      case "resources":
        return {
          title: "Resources Catalog",
          icon: <Link2 className="w-8 h-8 text-accent-primary" />,
          explanation: "Structured project links and external resources will be expanded in a future phase.",
          plannedPhase: "Phase 9 — Multi-Source Integrations Console",
          tip: "Organize design dashboards, sandbox APIs, credentials checklists, and repository endpoints into cohesive structured lists."
        };
      case "activity":
      default:
        return {
          title: "Activity Logs",
          icon: <Activity className="w-8 h-8 text-accent-primary" />,
          explanation: "Complete project activity history will become available after persistent event logging is implemented.",
          plannedPhase: "Phase 5.2 — Durable Database Persistent Synchronization",
          tip: "Every commit, release, deploy trigger, or status modification will stream cleanly into a secure remote ledger."
        };
    }
  };

  const details = getSectionDetails();

  return (
    <div
      id={`section-placeholder-${section}`}
      className="bg-bg-primary border border-border-subtle rounded-xl p-8 flex flex-col items-center justify-center text-center font-sans max-w-2xl mx-auto py-12 shadow-2xs animate-fade-in"
    >
      <div className="p-4 bg-muted-surface border border-border-subtle rounded-full mb-4 shadow-3xs">
        {details.icon}
      </div>

      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-accent-primary tracking-wider mb-2 bg-accent-soft px-2 py-0.5 rounded border border-accent-primary/10">
        <Sparkles className="w-3 h-3 text-accent-primary" />
        <span>{details.plannedPhase}</span>
      </div>

      <h2 className="text-base font-semibold text-text-primary tracking-tight font-sans">
        {details.title} — {project.name}
      </h2>
      
      <p className="text-xs text-text-secondary leading-relaxed max-w-md mt-2">
        {details.explanation}
      </p>

      {/* Expanded Tip description */}
      <div className="mt-5 p-3.5 bg-muted-surface border border-border-subtle rounded-lg text-[11px] text-text-tertiary leading-normal max-w-sm">
        <strong className="text-text-secondary">Expected Features: </strong>
        {details.tip}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Link
          to={`/projects/${project.id}`}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary bg-bg-primary border border-border-subtle rounded-lg hover:bg-muted-surface transition-all focus:outline-none focus:ring-1 focus:ring-border-strong"
          id="placeholder-back-to-overview"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </Link>
        <Link
          to="/projects"
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-accent-primary hover:text-accent-primary/80 transition-all focus:outline-none"
          id="placeholder-to-directory"
        >
          <span>Projects Directory</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
