import React from "react";
import { Terminal, Lock } from "lucide-react";
import { cn } from "../../lib/cn";

interface WorkspaceIdentityProps {
  isCollapsed?: boolean;
}

export default function WorkspaceIdentity({ isCollapsed = false }: WorkspaceIdentityProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted-surface border border-border-subtle overflow-hidden transition-all duration-200",
        isCollapsed ? "justify-center p-2 h-9 w-9 mx-auto" : "w-full"
      )}
    >
      <div className="flex items-center justify-center w-5 h-5 rounded bg-accent-primary/10 text-accent-primary shrink-0">
        <Terminal className="w-3.5 h-3.5" />
      </div>
      
      {!isCollapsed && (
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-semibold text-text-primary truncate">Personal Workspace</span>
            <Lock className="w-2.5 h-2.5 text-text-tertiary" />
          </div>
          <span className="text-[10px] text-text-tertiary truncate">Manoj Pawar</span>
        </div>
      )}
    </div>
  );
}
