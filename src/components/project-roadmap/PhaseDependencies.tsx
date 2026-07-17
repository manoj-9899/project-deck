import React from "react";
import { Link2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ProjectPhase } from "../../types/project-roadmap";

interface PhaseDependenciesProps {
  dependencies: string[];
  allPhases: ProjectPhase[];
}

export const PhaseDependencies: React.FC<PhaseDependenciesProps> = ({
  dependencies,
  allPhases
}) => {
  if (dependencies.length === 0) return null;

  // Resolve dependent phases
  const resolvedDeps = dependencies.map((depId) => {
    const found = allPhases.find((p) => p.id === depId);
    if (!found) return null;

    // A dependency is satisfied when it is completed or skipped
    const isSatisfied = found.status === "Completed" || found.status === "Skipped";
    return {
      id: found.id,
      title: found.title,
      status: found.status,
      isSatisfied
    };
  }).filter(Boolean);

  if (resolvedDeps.length === 0) return null;

  const hasUnsatisfied = resolvedDeps.some((dep) => !dep?.isSatisfied);

  return (
    <div id="phase-dependencies-card" className="flex flex-col gap-2 p-3 bg-muted-surface border border-border-subtle rounded-xl text-xs font-sans">
      <div className="flex items-center gap-1.5 text-text-secondary font-semibold">
        <Link2 className="w-3.5 h-3.5 text-text-tertiary" />
        <span>Dependencies</span>
        {hasUnsatisfied && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-status-danger/10 border border-status-danger/20 rounded-full text-[10px] text-status-danger font-mono font-medium animate-pulse ml-auto">
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>Unsatisfied Blockers</span>
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2.5 mt-1">
        {resolvedDeps.map((dep) => {
          if (!dep) return null;
          return (
            <div 
              key={dep.id}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                dep.isSatisfied 
                  ? "bg-status-success/5 border-status-success/20 text-status-success"
                  : "bg-status-danger/5 border-status-danger/20 text-status-danger"
              }`}
              title={`Phase: ${dep.title} (${dep.status})`}
            >
              {dep.isSatisfied ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <AlertTriangle className="w-3 h-3" />
              )}
              <span className="truncate max-w-[200px]">{dep.title}</span>
              <span className="font-mono text-[9px] opacity-75 uppercase">({dep.status})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
