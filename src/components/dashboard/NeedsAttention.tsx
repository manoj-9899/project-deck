import React from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { EmptyState } from "../ui/EmptyState";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import AttentionItem from "./AttentionItem";
import { AttentionItem as AttentionItemType } from "../../types";

interface NeedsAttentionProps {
  items: AttentionItemType[];
}

export default function NeedsAttention({ items }: NeedsAttentionProps) {
  return (
    <Card className="border border-border-subtle bg-surface shadow-subtle flex flex-col font-sans">
      <CardHeader className="py-3.5 px-5 border-b border-border-subtle flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-status-warning" />
          <h3 className="text-sm font-bold text-text-primary tracking-tight">
            Needs Attention
          </h3>
          <Badge variant="warning" className="font-mono text-[10px] px-2 py-0">
            {items.length}
          </Badge>
        </div>
      </CardHeader>
      
      <CardBody className="p-5 flex flex-col gap-3">
        {items.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
            title="All Work is Stable"
            description="Every workspace is healthy and active. No critical blockages or unresolved dependencies are flagged."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <AttentionItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
