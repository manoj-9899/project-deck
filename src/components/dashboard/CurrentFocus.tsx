import React from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Progress } from "../ui/Progress";
import { useToast } from "../ui/Toast";
import { useNavigate } from "react-router-dom";
import { PlayCircle, Compass, Clock, Terminal, ArrowRight } from "lucide-react";
import { Project } from "../../types";

interface CurrentFocusProps {
  project: Project;
}

export default function CurrentFocus({ project }: CurrentFocusProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewPlan = () => {
    toast({
      type: "info",
      title: "Workspace Roadmap",
      message: "Project roadmap will be introduced in a future phase.",
      duration: 3000,
    });
  };

  const handleContinueWorking = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card className="border border-border-strong/70 bg-surface shadow-subtle overflow-hidden font-sans">
      <CardHeader className="py-3 px-5 border-b border-border-subtle bg-muted-surface/10 flex flex-row items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent-primary" />
          <span className="text-xs font-bold font-mono text-text-primary tracking-wide uppercase">
            Current Workspace Focus
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-text-tertiary font-mono flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Last active {project.updatedAt}
          </span>
        </div>
      </CardHeader>
      
      <CardBody className="p-5 md:p-6 flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-xl font-bold text-text-primary tracking-tight">
                {project.name}
              </h3>
              <Badge variant="accent" className="font-mono text-[9px] px-1.5 py-0">
                {project.category}
              </Badge>
              <Badge variant="success" className="font-mono text-[9px] px-1.5 py-0 uppercase">
                {project.status}
              </Badge>
              {project.priority === "Critical" && (
                <Badge variant="danger" className="font-mono text-[9px] px-1.5 py-0 uppercase">
                  CRITICAL PRIORITY
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="flex flex-col gap-1 bg-muted-surface/20 border border-border-subtle/50 p-3 rounded-md">
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
                  Active Phase
                </span>
                <span className="text-xs font-bold text-text-primary">
                  {project.currentPhase || "None"}
                </span>
              </div>
              <div className="flex flex-col gap-1 bg-muted-surface/20 border border-border-subtle/50 p-3 rounded-md">
                <span className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider">
                  Workspace Health
                </span>
                <span className={`text-xs font-semibold flex items-center gap-1 ${
                  project.health === "On track" || project.health === "Stable"
                    ? "text-status-success"
                    : project.health === "Needs attention"
                    ? "text-status-warning"
                    : project.health === "Blocked"
                    ? "text-status-danger"
                    : "text-text-tertiary"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full animate-pulse inline-block ${
                    project.health === "On track" || project.health === "Stable"
                      ? "bg-status-success"
                      : project.health === "Needs attention"
                      ? "bg-status-warning"
                      : project.health === "Blocked"
                      ? "bg-status-danger"
                      : "bg-text-tertiary"
                  }`} />
                  {project.health}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-56 shrink-0 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-medium font-mono">
              <span className="text-text-secondary">Progress</span>
              <span className="text-accent-primary font-bold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} variant="accent" size="md" />
            <span className="text-[10px] text-text-tertiary font-mono text-right block">
              3 of 8 deliverables completed
            </span>
          </div>
        </div>

        <div className="bg-accent-soft/30 border border-accent-primary/10 rounded-lg p-3.5 flex items-start gap-3">
          <Compass className="w-4 h-4 text-accent-primary shrink-0 mt-0.5 animate-spin-slow" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-mono text-accent-primary uppercase tracking-wider font-bold">
              Next Technical Action
            </span>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              {project.nextAction}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-border-subtle/50 mt-1">
          <Button
            variant="primary"
            onClick={handleContinueWorking}
            className="flex items-center gap-1.5 text-xs py-2 px-4 rounded-md"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Continue working</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-80" />
          </Button>

          <Button
            variant="secondary"
            onClick={handleViewPlan}
            className="flex items-center gap-1.5 text-xs py-2 px-4 rounded-md"
          >
            <span>View plan</span>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
