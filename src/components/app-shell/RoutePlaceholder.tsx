import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { EmptyState } from "../ui/EmptyState";
import { 
  LayoutDashboard, 
  FolderKanban, 
  ListTodo, 
  Terminal, 
  BookOpen, 
  Settings, 
  HelpCircle,
  Clock
} from "lucide-react";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

interface RoutePlaceholderProps {
  type: "overview" | "projects" | "project-detail" | "tasks" | "prompts" | "knowledge" | "settings" | "not-found";
}

export default function RoutePlaceholder({ type }: RoutePlaceholderProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const getContent = () => {
    switch (type) {
      case "overview":
        return {
          title: "Overview Metrics",
          description: "Dashboard metrics, daily task digests, and active session-focus metrics will be introduced in Phase 3.",
          icon: <LayoutDashboard className="w-5 h-5 text-accent-primary" />,
          phase: "Phase 3 Scope",
          techDetail: "Overview dashboard layout & metrics synchronization engine",
        };
      case "projects":
        return {
          title: "Projects Directory",
          description: "The project directory, project configuration templates, and folder-management workflows will be introduced in Phase 4.",
          icon: <FolderKanban className="w-5 h-5 text-accent-primary" />,
          phase: "Phase 4 Scope",
          techDetail: "Dynamic project indexing and template schema engine",
        };
      case "project-detail":
        return {
          title: `Project Workspace`,
          description: "The individual project workspace boards, checklists, and automated repository logs will be introduced after the project directory foundation is established.",
          icon: <FolderKanban className="w-5 h-5 text-accent-primary" />,
          phase: "Future Phase",
          techDetail: `Active projectId: ${projectId || "unresolved"}`,
        };
      case "tasks":
        return {
          title: "Global Task Manager",
          description: "Global cross-project task boards, keyboard-driven sprint management, and checklists will be introduced once core projects are live.",
          icon: <ListTodo className="w-5 h-5 text-accent-primary" />,
          phase: "Future Phase",
          techDetail: "Active checklist states and project-task relative relational indexes",
        };
      case "prompts":
        return {
          title: "AI Prompt Library",
          description: "A centralized directory for organizing reusable prompt engineering templates and AI implementation instructions will be introduced in a dedicated future phase.",
          icon: <Terminal className="w-5 h-5 text-accent-primary" />,
          phase: "Future Phase",
          techDetail: "Structured JSON schema storage for context instructions",
        };
      case "knowledge":
        return {
          title: "Engineering Knowledge Base",
          description: "A professional notes and technical documentation manager to capture design decisions, system architectures, and production logs will be introduced later.",
          icon: <BookOpen className="w-5 h-5 text-accent-primary" />,
          phase: "Future Phase",
          techDetail: "Markdown renderer & local index-based knowledge storage",
        };
      case "settings":
        return {
          title: "Workspace Settings",
          description: "Global developer workspace configuration settings, profile setups, and custom environment controls will become available after the core engineering tools are online.",
          icon: <Settings className="w-5 h-5 text-accent-primary" />,
          phase: "Future Phase",
          techDetail: "LocalStorage options and custom design-system flags",
        };
      default:
        return {
          title: "Path Not Resolved",
          description: "The requested route does not map to any active engineering module in this workspace context.",
          icon: <HelpCircle className="w-5 h-5 text-status-warning" />,
          phase: "Invalid Path",
          techDetail: "404 Route Fallback - Unmapped path routing",
        };
    }
  };

  const data = getContent();

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full py-4 animate-fade-in">
      <div className="flex items-center justify-between border border-border-subtle bg-muted-surface/30 rounded-lg p-3.5 px-4.5">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-text-tertiary" />
          <span className="text-xs font-mono text-text-secondary">Workspace Status Tracker</span>
        </div>
        <Badge variant="secondary" className="bg-accent-primary/10 text-accent-primary border-accent-primary/20 text-[10px] font-sans font-medium">
          {data.phase}
        </Badge>
      </div>

      <Card className="border border-border-subtle p-8 py-12 flex flex-col items-center text-center shadow-none bg-surface">
        <div className="mb-4 p-3 rounded-full bg-accent-primary/5 border border-accent-primary/10">
          {data.icon}
        </div>
        
        <h2 className="text-lg font-semibold text-text-primary mb-2 tracking-tight">
          {data.title}
        </h2>
        
        <p className="text-sm text-text-secondary leading-relaxed max-w-lg mb-6 font-sans">
          {data.description}
        </p>

        <div className="text-[11px] font-mono text-text-tertiary border border-border-subtle bg-muted-surface/50 rounded p-1.5 px-3 max-w-md truncate">
          <span className="font-semibold text-text-secondary">Technical Context:</span> {data.techDetail}
        </div>
      </Card>
    </div>
  );
}
