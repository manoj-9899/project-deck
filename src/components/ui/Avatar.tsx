import React, { useState } from "react";
import { cn } from "../../lib/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string; // Typically 1-2 initials
  size?: "sm" | "md" | "lg" | "xl";
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  alt,
  fallback,
  size = "md",
  id,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const sizes = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-11 h-11 text-base",
    xl: "w-14 h-14 text-lg",
  };

  const showImage = src && !hasError;

  return (
    <div
      id={id}
      className={cn(
        "relative flex items-center justify-center rounded-full overflow-hidden bg-muted-surface border border-border-strong select-none font-mono font-medium text-text-secondary shrink-0",
        sizes[size],
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-opacity duration-200"
        />
      ) : (
        <span className="uppercase tracking-tight text-text-secondary">{fallback}</span>
      )}
    </div>
  );
};
