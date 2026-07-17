import React from "react";

interface PhaseProgressProps {
  progress: number;
  status: string;
}

export const PhaseProgress: React.FC<PhaseProgressProps> = ({ progress, status }) => {
  // Determine color based on status
  const getProgressColor = () => {
    if (status === "Completed") return "bg-status-success";
    if (status === "Blocked") return "bg-status-danger";
    if (status === "Paused") return "bg-status-warning";
    if (status === "Skipped") return "bg-text-tertiary";
    return "bg-accent-primary";
  };

  return (
    <div id="phase-progress-container" className="flex items-center gap-2.5 w-full min-w-[120px] max-w-[200px]">
      <div className="relative w-full h-1.5 bg-border-subtle rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 rounded-full ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className="text-xs font-semibold font-mono text-text-primary shrink-0">
        {progress}%
      </span>
    </div>
  );
};
