import React from "react";
import { cn } from "../../lib/cn";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "rectangular",
  id,
  ...props
}) => {
  return (
    <div
      id={id}
      className={cn(
        "animate-pulse bg-border-subtle",
        variant === "text" && "h-3.5 w-full rounded-sm my-1",
        variant === "circular" && "rounded-full shrink-0",
        variant === "rectangular" && "rounded-md",
        className
      )}
      {...props}
    />
  );
};
