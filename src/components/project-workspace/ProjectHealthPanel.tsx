import React from "react";
import { AlertTriangle, ShieldCheck, HelpCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Project, ProjectHealth } from "../../types";

interface ProjectHealthPanelProps {
  project: Project;
}

export default function ProjectHealthPanel({ project }: ProjectHealthPanelProps) {
  // Map health to custom icons and descriptive texts
  const getHealthMeta = (health: ProjectHealth, slug: string) => {
    const norm = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
    
    switch (health) {
      case "On track":
      case "Stable":
        // ProjectDock and DevHabits and CampusCanteen
        if (norm === "projectdock") {
          return {
            icon: <ShieldCheck className="w-5 h-5 text-status-success" />,
            riskLevel: "Medium",
            blockerStatus: "No blocking issues",
            mainConcern: "Volatile memory data state.",
            description: "Operations are synchronized locally, but lack persistent cloud tables. Refreshing active tabs resets manual additions.",
            intervention: "Finalize the responsive static layout first, then establish persistent schemas."
          };
        }
        if (norm === "devhabits") {
          return {
            icon: <ShieldCheck className="w-5 h-5 text-status-success" />,
            riskLevel: "Medium",
            blockerStatus: "None",
            mainConcern: "Beta validation checklist.",
            description: "Final regression checks and asset generations must finish before official product listing submissions.",
            intervention: "Complete final security tests on Supabase connection pools."
          };
        }
        if (norm === "campuscanteen" || norm === "edupresence") {
          return {
            icon: <ShieldCheck className="w-5 h-5 text-status-success" />,
            riskLevel: "Low",
            blockerStatus: "None",
            mainConcern: "Post-deployment monitoring.",
            description: "Project is in active production. Handed over successfully to student services controller board.",
            intervention: "Maintain routine database and API metrics checkouts."
          };
        }
        return {
          icon: <ShieldCheck className="w-5 h-5 text-status-success" />,
          riskLevel: "Low",
          blockerStatus: "None",
          mainConcern: "Baseline development validation.",
          description: "All components operate correctly with mock structures.",
          intervention: "Continue detailing the planned backlog items."
        };

      case "Needs attention":
        // LaunchKaro
        return {
          icon: <AlertTriangle className="w-5 h-5 text-status-warning" />,
          riskLevel: "High",
          blockerStatus: "Scope constraint",
          mainConcern: "Product boundary overlaps.",
          description: "Nailing down boilerplate features and customer intake forms requires immediate review to prevent feature creep.",
          intervention: "Convene lead review workshop to finalize tier-1 Indian business packages."
        };

      case "Blocked":
        return {
          icon: <AlertCircle className="w-5 h-5 text-status-danger" />,
          riskLevel: "Critical",
          blockerStatus: "Pipeline Blocked",
          mainConcern: "Unresolved development bottlenecks.",
          description: "A critical blocker (e.g. database keys, payment webhook failures) halts further testing sprints.",
          intervention: "Address structural schema conflicts immediately."
        };

      case "Inactive":
      default:
        // RepoPilot
        return {
          icon: <HelpCircle className="w-5 h-5 text-text-tertiary" />,
          riskLevel: "Low",
          blockerStatus: "Project Paused",
          mainConcern: "Strategic prioritization.",
          description: "Development was reallocated to other projects. System rests in a functional prototype layout.",
          intervention: "Formulate decision memo to resume, archive, or narrow feature sets."
        };
    }
  };

  const meta = getHealthMeta(project.health, project.slug);

  // Map risk level to badges
  const riskVariants = {
    Critical: "danger",
    High: "danger",
    Medium: "warning",
    Low: "neutral"
  } as const;

  return (
    <div id="project-health-panel" className="bg-bg-primary border border-border-subtle rounded-xl p-5 flex flex-col gap-4 font-sans">
      <div className="flex items-center gap-2">
        <RefreshCw className="w-4 h-4 text-accent-primary" />
        <h3 className="text-sm font-semibold text-text-primary tracking-tight">Health & Risk Analysis</h3>
      </div>

      <div className="flex gap-4 items-start p-3 bg-muted-surface border border-border-subtle rounded-lg">
        <div className="shrink-0 p-1.5 bg-bg-primary border border-border-subtle rounded-md">
          {meta.icon}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-text-primary">
              Status: {project.health}
            </span>
            <Badge variant={project.health === "On track" || project.health === "Stable" ? "success" : project.health === "Needs attention" ? "warning" : "neutral"} className="text-[9px] px-1.5 py-0 leading-normal">
              {project.health}
            </Badge>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            <strong className="text-text-primary">Concern: </strong>
            {meta.mainConcern} {meta.description}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-1 text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider font-mono">Assessed Risk</span>
          <Badge variant={riskVariants[meta.riskLevel as "Critical" | "High" | "Medium" | "Low"] || "neutral"} className="w-fit">
            {meta.riskLevel} Risk
          </Badge>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider font-mono">Blocker status</span>
          <span className="font-semibold text-text-primary flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${meta.blockerStatus === "No blocking issues" || meta.blockerStatus === "None" ? "bg-status-success" : "bg-status-warning"}`} />
            {meta.blockerStatus}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 pt-3 border-t border-border-subtle mt-1 text-xs">
        <span className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider font-mono">Recommended Intervention</span>
        <p className="text-text-secondary font-medium italic leading-relaxed">
          &ldquo;{meta.intervention}&rdquo;
        </p>
      </div>

    </div>
  );
}
