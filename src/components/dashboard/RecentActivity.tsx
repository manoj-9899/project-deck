import React from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { Activity, Clock } from "lucide-react";
import ActivityItem from "./ActivityItem";
import { ActivityItem as ActivityItemType } from "../../types";

interface RecentActivityProps {
  activities: ActivityItemType[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="border border-border-subtle bg-surface shadow-subtle flex flex-col font-sans">
      <CardHeader className="py-3.5 px-5 border-b border-border-subtle flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-accent-primary" />
          <h3 className="text-sm font-bold text-text-primary tracking-tight">
            Recent Activity
          </h3>
          <Badge variant="neutral" className="font-mono text-[10px] px-2 py-0">
            Log
          </Badge>
        </div>
      </CardHeader>
      
      <CardBody className="p-5 flex flex-col gap-1">
        {activities.length === 0 ? (
          <EmptyState
            icon={<Clock className="w-5 h-5 text-text-tertiary" />}
            title="No Activity Logs"
            description="No recent project activities or commits recorded in your workspace."
          />
        ) : (
          <div className="flex flex-col">
            {activities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isLast={index === activities.length - 1}
              />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
