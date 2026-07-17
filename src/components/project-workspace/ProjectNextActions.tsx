import React from "react";
import { Play, ArrowRight, CornerDownRight, CheckSquare } from "lucide-react";
import { Badge } from "../ui/Badge";
import { useToast } from "../ui/Toast";
import { Priority, Project } from "../../types";

interface NextActionItem {
  title: string;
  context: string;
  priority: Priority;
  timeframe: string;
  section: "Roadmap" | "Tasks" | "Knowledge" | "Prompts" | "Resources";
}

interface ProjectNextActionsProps {
  project: Project;
}

export default function ProjectNextActions({ project }: ProjectNextActionsProps) {
  const { toast } = useToast();

  const handleActionClick = (title: string) => {
    toast({
      type: "info",
      title: "Action Information",
      message: "Action management will be introduced with roadmap and task functionality.",
      duration: 4000
    });
  };

  // Map priorities to badge variants
  const priorityVariants: Record<Priority, "danger" | "warning" | "info" | "neutral"> = {
    Critical: "danger",
    High: "warning",
    Medium: "info",
    Low: "neutral"
  };

  // Structured Next Actions dataset mapped specifically by project slug
  const getNextActions = (slug: string): NextActionItem[] => {
    const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, "");

    switch (normalized) {
      case "projectdock":
        return [
          {
            title: "Complete workspace overview",
            context: "Finish styling dynamic multi-tab layouts, responsive charts fallback, and unknown slugs handler.",
            priority: "Critical",
            timeframe: "Today",
            section: "Tasks"
          },
          {
            title: "Prepare roadmap and phase-management model",
            context: "Map milestones, phase completions, and dependencies schema representation.",
            priority: "High",
            timeframe: "Next Sprint",
            section: "Roadmap"
          },
          {
            title: "Define Supabase persistence architecture",
            context: "Formulate tables, triggers, secure rules, and database entity definitions.",
            priority: "High",
            timeframe: "Phase 5.1/6",
            section: "Resources"
          }
        ];
      case "launchkaro":
        return [
          {
            title: "Resolve product scope constraints",
            context: "Schedule priority design review for agency custom boilerplates and templates mapping.",
            priority: "Critical",
            timeframe: "This week",
            section: "Knowledge"
          },
          {
            title: "Configure Stripe customer portal",
            context: "Verify live webhooks endpoints and test sandbox subscriptions.",
            priority: "High",
            timeframe: "Next week",
            section: "Tasks"
          }
        ];
      case "devhabits":
        return [
          {
            title: "Verify final security regression tests",
            context: "Ensure absolute row security and sanitization of user data on Supabase tables.",
            priority: "High",
            timeframe: "This week",
            section: "Tasks"
          },
          {
            title: "Establish Product Hunt launch checklist",
            context: "Draft marketing badges, presentation slide assets, and tagline variations.",
            priority: "Medium",
            timeframe: "Next Sprint",
            section: "Prompts"
          }
        ];
      case "repopilot":
        return [
          {
            title: "Evaluate project restart criteria",
            context: "Formulate decision node to either resume, narrow focus, or archive repository pilot.",
            priority: "High",
            timeframe: "TBD",
            section: "Knowledge"
          }
        ];
      case "campuscanteen":
        return [
          {
            title: "Monitor server metrics",
            context: "Inspect weekly Express backend responses and Mongo connection logs.",
            priority: "Low",
            timeframe: "Weekly",
            section: "Resources"
          }
        ];
      default:
        // Generic next actions fallback
        return [
          {
            title: "Establish baseline project requirements",
            context: "Consult product blueprints and outline primary deliverables.",
            priority: "Medium",
            timeframe: "Next Sprint",
            section: "Tasks"
          },
          {
            title: "Review technology stack installation",
            context: "Verify developer tools are cleanly mapped and lint passes successfully.",
            priority: "Low",
            timeframe: "Ongoing",
            section: "Resources"
          }
        ];
    }
  };

  const actions = getNextActions(project.slug);

  if (actions.length === 0) {
    return null;
  }

  return (
    <div id="project-next-actions-panel" className="bg-bg-primary border border-border-subtle rounded-xl p-5 flex flex-col gap-4 font-sans">
      <div className="flex items-center gap-2">
        <CheckSquare className="w-4 h-4 text-accent-primary" />
        <h3 className="text-sm font-semibold text-text-primary tracking-tight">Next Priority Actions</h3>
      </div>

      <div className="flex flex-col gap-3" id="next-actions-list">
        {actions.map((action, index) => (
          <div
            key={index}
            onClick={() => handleActionClick(action.title)}
            className="group flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-3 bg-bg-primary hover:bg-muted-surface border border-border-subtle rounded-lg cursor-pointer transition-all focus-within:ring-1 focus-within:ring-border-strong"
            id={`next-action-item-${index}`}
          >
            <div className="flex gap-2.5 items-start">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-soft text-accent-primary text-[10px] font-mono font-bold shrink-0 mt-0.5 group-hover:bg-accent-primary group-hover:text-white transition-all">
                {index + 1}
              </span>
              <div className="flex flex-col gap-1">
                <h4 className="text-xs font-semibold text-text-primary leading-tight group-hover:text-accent-primary transition-colors flex items-center gap-1.5 flex-wrap">
                  {action.title}
                  <Badge variant={priorityVariants[action.priority]} className="text-[9px] px-1 py-0 leading-none">
                    {action.priority}
                  </Badge>
                </h4>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  {action.context}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary font-mono mt-1">
                  <CornerDownRight className="w-3 h-3 text-text-tertiary" />
                  <span>Targeting:</span>
                  <span className="text-text-secondary font-medium underline decoration-border-strong decoration-dotted">{action.section}</span>
                </div>
              </div>
            </div>

            {/* Timeframe Action tag */}
            <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0 text-[10px] font-mono bg-muted-surface border border-border-subtle px-2 py-1 rounded text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary"></span>
              <span>{action.timeframe}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
