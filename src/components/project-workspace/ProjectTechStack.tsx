import React from "react";
import { Cpu } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Project } from "../../types";

interface ProjectTechStackProps {
  project: Project;
}

export default function ProjectTechStack({ project }: ProjectTechStackProps) {
  // Dynamically map technology items to categories for richer tech stack details
  const getTechCategory = (tech: string): string => {
    const t = tech.toLowerCase();
    if (["react", "next.js", "sveltekit", "react native", "tailwind css", "astro", "framer motion", "motion", "three.js", "qwik", "shopify liquid"].some(val => t.includes(val))) {
      return "Frontend";
    }
    if (["node.js", "express", "fastapi", "graphql", "prisma", "octokit", "gemini api", "twilio api"].some(val => t.includes(val))) {
      return "Backend";
    }
    if (["postgresql", "supabase", "mongodb", "aws s3", "docker", "vercel"].some(val => t.includes(val))) {
      return "Infrastructure / DB";
    }
    if (["stripe", "auth0", "razorpay", "twilio"].some(val => t.includes(val))) {
      return "Integrations";
    }
    return "Engineering";
  };

  return (
    <div id="project-tech-stack-panel" className="bg-bg-primary border border-border-subtle rounded-xl p-5 flex flex-col gap-4 font-sans">
      <div className="flex items-center gap-2">
        <Cpu className="w-4 h-4 text-accent-primary" />
        <h3 className="text-sm font-semibold text-text-primary tracking-tight">Technology Stack</h3>
      </div>

      <div className="flex flex-wrap gap-2" id="tech-stack-list">
        {project.techStack.map((tech, idx) => {
          const category = getTechCategory(tech);
          
          return (
            <div
              key={idx}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted-surface hover:bg-muted-surface/75 border border-border-subtle rounded-md select-none transition-all text-xs"
              id={`tech-tag-${tech.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
            >
              <div className="flex flex-col">
                <span className="font-semibold text-text-primary leading-tight">
                  {tech}
                </span>
                <span className="text-[9px] text-text-tertiary font-mono font-medium leading-none mt-0.5 uppercase tracking-wider">
                  {category}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
