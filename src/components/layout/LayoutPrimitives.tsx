import React from "react";
import { cn } from "../../lib/cn";

// 1. Full application viewport wrapper
export const Viewport: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("min-h-screen w-full flex flex-col bg-page-bg text-text-primary overflow-x-hidden selection:bg-accent-primary/10 select-none", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// 2. Responsive page container (constrained width with responsive gutters)
export const PageContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <main
      className={cn(
        "w-full max-w-7xl mx-auto flex-1 flex flex-col",
        "px-4 py-6 md:px-8 md:py-8 lg:px-12 lg:py-10",
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
};

// 3. Page Header
export const PageHeader: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, actions, className }) => {
  return (
    <header className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border-subtle pb-5 mb-6 md:mb-8", className)}>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold font-sans tracking-tight text-text-primary md:text-2xl">
          {title}
        </h1>
        {subtitle && <p className="text-xs md:text-sm text-text-secondary">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </header>
  );
};

// 4. Section Wrapper
export const SectionWrapper: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ title, description, children, className, id }) => {
  return (
    <section id={id} className={cn("flex flex-col gap-4 mb-8 md:mb-10 last:mb-0", className)}>
      <div className="flex flex-col gap-1 border-l-2 border-accent-primary/20 pl-3">
        <h2 className="text-sm font-bold font-sans tracking-tight text-text-primary uppercase">
          {title}
        </h2>
        {description && <p className="text-xs text-text-tertiary">{description}</p>}
      </div>
      <div className="mt-1">{children}</div>
    </section>
  );
};

// 5. Responsive Grid
export const Grid: React.FC<{
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  gap?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}> = ({ cols = 3, gap = "md", children, className }) => {
  const colStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  };

  const gapStyles = {
    sm: "gap-3",
    md: "gap-5",
    lg: "gap-8",
  };

  return (
    <div className={cn("grid", colStyles[cols], gapStyles[gap], className)}>
      {children}
    </div>
  );
};

// 6. Vertical Stack (Stack)
export const Stack: React.FC<{
  gap?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  className?: string;
}> = ({ gap = "md", children, className }) => {
  const gapStyles = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };
  return (
    <div className={cn("flex flex-col", gapStyles[gap], className)}>
      {children}
    </div>
  );
};

// 7. Inline Group (Horizontal block with wrap)
export const InlineGroup: React.FC<{
  gap?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end";
  children: React.ReactNode;
  className?: string;
}> = ({ gap = "md", align = "center", children, className }) => {
  const gapStyles = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const alignStyles = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  };

  return (
    <div className={cn("flex flex-wrap", gapStyles[gap], alignStyles[align], className)}>
      {children}
    </div>
  );
};

// 8. Split Layout (e.g., sidebar and main content split)
export const SplitLayout: React.FC<{
  ratio?: "1:3" | "1:2" | "1:1" | "2:1" | "3:1";
  gap?: "sm" | "md" | "lg";
  children: [React.ReactNode, React.ReactNode];
  className?: string;
}> = ({ ratio = "1:2", gap = "md", children, className }) => {
  const ratioStyles = {
    "1:3": "grid-cols-1 lg:grid-cols-4 lg:[&>*:first-child]:col-span-1 lg:[&>*:last-child]:col-span-3",
    "1:2": "grid-cols-1 lg:grid-cols-3 lg:[&>*:first-child]:col-span-1 lg:[&>*:last-child]:col-span-2",
    "1:1": "grid-cols-1 lg:grid-cols-2",
    "2:1": "grid-cols-1 lg:grid-cols-3 lg:[&>*:first-child]:col-span-2 lg:[&>*:last-child]:col-span-1",
    "3:1": "grid-cols-1 lg:grid-cols-4 lg:[&>*:first-child]:col-span-3 lg:[&>*:last-child]:col-span-1",
  };

  const gapStyles = {
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-10",
  };

  return (
    <div className={cn("grid", ratioStyles[ratio], gapStyles[gap], className)}>
      {children}
    </div>
  );
};

// 9. Scrollable content area
export const ScrollableArea: React.FC<{
  maxHeight?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ maxHeight = "400px", children, className }) => {
  return (
    <div
      className={cn("overflow-y-auto pr-1 border border-border-subtle rounded-lg bg-surface/35", className)}
      style={{ maxHeight }}
    >
      {children}
    </div>
  );
};
