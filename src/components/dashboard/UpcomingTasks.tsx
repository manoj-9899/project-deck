import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { CheckSquare, ArrowUpRight } from "lucide-react";
import DashboardTaskItem from "./DashboardTaskItem";
import { Task } from "../../types";

interface UpcomingTasksProps {
  tasks: Task[];
}

export default function UpcomingTasks({ tasks }: UpcomingTasksProps) {
  return (
    <Card className="border border-border-subtle bg-surface shadow-subtle flex flex-col font-sans">
      <CardHeader className="py-3.5 px-5 border-b border-border-subtle flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <CheckSquare className="w-4 h-4 text-accent-primary" />
          <h3 className="text-sm font-bold text-text-primary tracking-tight">
            Upcoming Tasks
          </h3>
          <Badge variant="accent" className="font-mono text-[10px] px-2 py-0">
            {tasks.length}
          </Badge>
        </div>
        
        <Link
          to="/tasks"
          className="text-xs text-text-secondary hover:text-accent-primary font-medium flex items-center gap-1 transition-colors group"
        >
          <span>View all tasks</span>
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </CardHeader>
      
      <CardBody className="p-5 flex flex-col gap-3">
        {tasks.length === 0 ? (
          <EmptyState
            icon={<CheckSquare className="w-5 h-5 text-text-tertiary" />}
            title="All Caught Up"
            description="You don't have any pending tasks requiring attention this week. Nice work!"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <DashboardTaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
