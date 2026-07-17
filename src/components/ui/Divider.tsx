import React from "react";
import { cn } from "../../lib/cn";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const Divider: React.FC<DividerProps> = ({
  className,
  orientation = "horizontal",
  id,
  ...props
}) => {
  return (
    <div
      id={id}
      className={cn(
        "bg-border-subtle shrink-0",
        orientation === "horizontal" ? "h-px w-full my-4" : "w-px h-auto self-stretch mx-4",
        className
      )}
      {...props}
    />
  );
};
