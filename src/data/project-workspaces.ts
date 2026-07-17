import { ProjectWorkspaceDetail } from "../types/project-workspace";

export const PROJECT_WORKSPACES_DETAIL: Record<string, ProjectWorkspaceDetail> = {
  projectdock: {
    projectId: "projectdock",
    summary: "A premium personal engineering command centre for managing projects, tasks, technical context, AI prompts, decisions, links, and delivery progress.",
    objective: "Create one personal engineering command centre for managing projects, tasks, technical context, AI prompts, decisions, links, and delivery progress.",
    currentPhaseSummary: "Building dynamic interactive layouts including the multi-tab navigation, custom breadcrumbs, metadata badges, and fallback rendering modes.",
    completionCriteria: [
      "Establish nested routing framework with custom breadcrumbs",
      "Construct high-density workspace header with contextual action badges",
      "Deploy custom tabs for Overview, Tasks, Roadmap, Knowledge, Prompts, Resources, and Activity",
      "Implement fully responsive layout splitting core content and technical parameters",
      "Gracefully catch unknown or archived workspaces with customized notices"
    ],
    recentActivity: [
      {
        id: "pd-act-1",
        description: "Phase 4.1 scope correction and permanent deletion deferral verified",
        timeContext: "20 minutes ago",
        type: "shell_completed",
        phase: "Projects Directory"
      },
      {
        id: "pd-act-2",
        description: "Added search results badge and active filter chip indicators to toolbar",
        timeContext: "2 hours ago",
        type: "shell_completed",
        phase: "Projects Directory"
      },
      {
        id: "pd-act-3",
        description: "In-memory directory state manager hook integrated for list/grid layouts",
        timeContext: "Yesterday",
        type: "shell_completed",
        phase: "Projects Directory"
      },
      {
        id: "pd-act-4",
        description: "Established clean light-mode theme tokens in global Tailwind layout",
        timeContext: "Last week",
        type: "doc_updated"
      }
    ],
    upcomingWork: [
      {
        id: "pd-up-1",
        title: "Build roadmap planning and milestone dependency chart",
        section: "Roadmap",
        priority: "High",
        timeframe: "Next Sprint",
        statusLabel: "Planned"
      },
      {
        id: "pd-up-2",
        title: "Deploy multi-lane interactive kanban board with subtask tracking",
        section: "Tasks",
        priority: "High",
        timeframe: "Phase 6",
        statusLabel: "Planned"
      },
      {
        id: "pd-up-3",
        title: "Establish local files parsing with embedded prompt injection context",
        section: "Knowledge",
        priority: "Medium",
        timeframe: "Future Phase",
        statusLabel: "Drafted"
      },
      {
        id: "pd-up-4",
        title: "Provision Firestore Database schemas and Auth triggers",
        section: "Resources",
        priority: "Critical",
        timeframe: "Phase 7",
        statusLabel: "Scheduled"
      }
    ],
    risks: [
      {
        id: "pd-risk-1",
        title: "Temporary data is not persistent",
        impact: "High",
        status: "Active",
        description: "Workspace operations are currently loaded and modified in volatile client-side state only. Refreshes wipe custom additions."
      },
      {
        id: "pd-risk-2",
        title: "Workspace modifications are not globally synchronized",
        impact: "Medium",
        status: "Active",
        description: "Adding or editing projects inside the directory doesn't update the dashboard mock data immediately due to decoupled state structures."
      },
      {
        id: "pd-risk-3",
        title: "Future relational schema requires database migrations",
        impact: "High",
        status: "Monitored",
        description: "Connecting tasks, roadmaps, and files directly to project models will necessitate robust Firestore or SQL database schemas."
      }
    ],
    keyLinks: [
      {
        label: "GitHub Repository",
        url: "https://github.com/manoj-pawar/projectdock",
        type: "repository",
        domain: "github.com"
      },
      {
        label: "Live Sandbox",
        url: "https://projectdock.dev",
        type: "deployment",
        domain: "projectdock.dev"
      },
      {
        label: "Product Blueprint",
        url: "/PROJECT_CONTEXT.md",
        type: "documentation"
      },
      {
        label: "Local Workspace Root",
        url: "~/projects/personal/projectdock",
        type: "local"
      }
    ],
    featuredMetrics: [
      {
        label: "Total Workspaces",
        value: "10",
        change: "+1 this month",
        trend: "up"
      },
      {
        label: "Linter Checks",
        value: "100%",
        change: "Fully passing",
        trend: "neutral"
      },
      {
        label: "Open Workflows",
        value: "7 tabs",
        change: "Planned blueprint",
        trend: "neutral"
      }
    ],
    lastDecision: {
      title: "Defer Deletion Mutations",
      outcome: "Decided to omit physical delete operations and redirect users via Informational Toast until cloud security rules and backend database relationships are verified.",
      date: "Today"
    }
  },
  launchkaro: {
    projectId: "launchkaro",
    summary: "Product scope and agency operating workflows require continued prioritization.",
    objective: "Build a premium digital agency and operating system for delivering high-quality websites to Indian businesses.",
    currentPhaseSummary: "Currently structuring basic landing templates, SaaS boilerplates, and lead generation funnels.",
    completionCriteria: [
      "Complete the core Next.js + Tailwind starter template",
      "Establish Stripe customer billing webhooks",
      "Implement agency request tracking board",
      "Deploy localized SEO and performance scoreboards"
    ],
    recentActivity: [
      {
        id: "lk-act-1",
        description: "Drafted project scope guidelines and agency workflow blueprint",
        timeContext: "Yesterday",
        type: "doc_updated"
      },
      {
        id: "lk-act-2",
        description: "Verified Stripe payment sandbox configuration",
        timeContext: "3 days ago",
        type: "test_passed"
      }
    ],
    upcomingWork: [
      {
        id: "lk-up-1",
        title: "Incorporate client intake form with automated Slack notifications",
        section: "Tasks",
        priority: "High",
        timeframe: "Next Week",
        statusLabel: "Planned"
      },
      {
        id: "lk-up-2",
        title: "Deliver localized landing copy optimized for Indian tier-2 SMEs",
        section: "Prompts",
        priority: "Medium",
        timeframe: "Next Sprint",
        statusLabel: "Drafted"
      }
    ],
    risks: [
      {
        id: "lk-risk-1",
        title: "Product scope requires continued prioritization",
        impact: "High",
        status: "Active",
        description: "The team is balancing modular boilerplates versus full-scale bespoke agency delivery models. A final positioning deck is required."
      }
    ],
    keyLinks: [
      {
        label: "GitHub Monorepo",
        url: "https://github.com/manoj-pawar/launchkaro",
        type: "repository",
        domain: "github.com"
      }
    ],
    featuredMetrics: [
      {
        label: "Lead Pipeline",
        value: "12 inquiries",
        change: "+3 yesterday",
        trend: "up"
      },
      {
        label: "Boilerplate Ready",
        value: "2 / 5",
        change: "Under design review",
        trend: "neutral"
      }
    ]
  },
  devhabits: {
    projectId: "devhabits",
    summary: "Developer-focused gamified habit tracker that turns code contributions and learning hours into RPG rewards.",
    objective: "Provide a reliable habit-tracking system across web and command-line workflows.",
    currentPhaseSummary: "Finalizing Beta Testing loops, integrating live GitHub hook events, and refining SVG stats panels.",
    completionCriteria: [
      "Synchronize GitHub contribution calendar streak counts",
      "Refine reward calculator algorithms and XP multiplier settings",
      "Conduct stress-testing on Postgres-backed Supabase connections",
      "Publish public product presentation landing page"
    ],
    recentActivity: [
      {
        id: "dh-act-1",
        description: "Drafted gamified reward calculation and XP multiplier limits",
        timeContext: "2 days ago",
        type: "shell_completed",
        phase: "Beta Testing"
      },
      {
        id: "dh-act-2",
        description: "Conducted security penetration audit on Supabase auth callbacks",
        timeContext: "5 days ago",
        type: "test_passed"
      }
    ],
    upcomingWork: [
      {
        id: "dh-up-1",
        title: "Deploy public beta to selected focus developers",
        section: "Roadmap",
        priority: "High",
        timeframe: "This week",
        statusLabel: "Scheduled"
      },
      {
        id: "dh-up-2",
        title: "Review testing coverage and verify SVG visual rendering on mobile viewports",
        section: "Tasks",
        priority: "Medium",
        timeframe: "Next Sprint",
        statusLabel: "Planned"
      }
    ],
    risks: [
      {
        id: "dh-risk-1",
        title: "Final validation and deployment review pending",
        impact: "Medium",
        status: "Monitored",
        description: "Confirming database indices and security policies on Supabase rules is mandatory before opening general public registration."
      }
    ],
    keyLinks: [
      {
        label: "GitHub Source",
        url: "https://github.com/manoj-pawar/devhabits",
        type: "repository"
      },
      {
        label: "Beta App Portal",
        url: "https://devhabits.app",
        type: "deployment"
      }
    ],
    featuredMetrics: [
      {
        label: "Beta Users",
        value: "148 players",
        change: "+22 this week",
        trend: "up"
      },
      {
        label: "Daily Active Users",
        value: "54%",
        change: "High engagement",
        trend: "up"
      }
    ]
  },
  repopilot: {
    projectId: "repopilot",
    summary: "The project is paused and requires a resume, narrow, or archive decision.",
    objective: "Help developers understand repositories, architecture, risk, and implementation context.",
    currentPhaseSummary: "Currently paused at draft level. Explored AI semantic parsing maps and README automated builders.",
    completionCriteria: [
      "Deploy localized AST semantic repository scan logic",
      "Integrate Gemini Flash context window triggers",
      "Construct interactive architecture dependency viewer",
      "Finalize decision node for project restart"
    ],
    recentActivity: [
      {
        id: "rp-act-1",
        description: "Project placed in Paused state due to temporary bandwidth reallocation",
        timeContext: "4 days ago",
        type: "paused"
      },
      {
        id: "rp-act-2",
        description: "Tested file structure scanning script using AST parses",
        timeContext: "2 weeks ago",
        type: "shell_completed"
      }
    ],
    upcomingWork: [
      {
        id: "rp-up-1",
        title: "Evaluate scope sizing and narrow core feature list to single-repo scanners",
        section: "Roadmap",
        priority: "Medium",
        timeframe: "TBD",
        statusLabel: "Planned"
      }
    ],
    risks: [
      {
        id: "rp-risk-1",
        title: "The project is paused",
        impact: "High",
        status: "Active",
        description: "Development has halted. Needs a dedicated restart, pivot, or official archival proposal."
      }
    ],
    keyLinks: [
      {
        label: "GitHub Archive",
        url: "https://github.com/manoj-pawar/repopilot",
        type: "repository"
      }
    ],
    featuredMetrics: [
      {
        label: "Last Active",
        value: "Paused",
        change: "Inactive",
        trend: "neutral"
      }
    ]
  },
  campuscanteen: {
    projectId: "campuscanteen",
    summary: "Deployed and available for maintenance or portfolio refinement.",
    objective: "Provide a practical digital ordering experience for campus food services.",
    currentPhaseSummary: "Stable in-production maintenance. Occasional optimizations on ordering queue models and transaction reconciliation.",
    completionCriteria: [
      "Completed digital checkout using Razorpay API integration",
      "Deployed localized push notifications on state changes",
      "Refined database structures in MongoDB Atlas database clusters"
    ],
    recentActivity: [
      {
        id: "cc-act-1",
        description: "Deployed performance hotfixes on meal checkout queries",
        timeContext: "Last week",
        type: "deployed"
      },
      {
        id: "cc-act-2",
        description: "Consolidated transaction dispute ledger outputs",
        timeContext: "2 weeks ago",
        type: "doc_updated"
      }
    ],
    upcomingWork: [
      {
        id: "cc-up-1",
        title: "Monitor database connection metrics and weekly billing reconciliation sheets",
        section: "Resources",
        priority: "Low",
        timeframe: "Ongoing",
        statusLabel: "Scheduled"
      }
    ],
    risks: [
      {
        id: "cc-risk-1",
        title: "Maintenance and portfolio scaling tasks",
        impact: "Low",
        status: "Mitigated",
        description: "No immediate threats exist. System has been fully verified and handed over to campus dining controllers."
      }
    ],
    keyLinks: [
      {
        label: "GitHub Core",
        url: "https://github.com/manoj-pawar/campuscanteen",
        type: "repository"
      },
      {
        label: "Live Food App Portal",
        url: "https://campuscanteen.edu",
        type: "deployment"
      }
    ],
    featuredMetrics: [
      {
        label: "Completed Orders",
        value: "3,820 orders",
        change: "+120 this month",
        trend: "up"
      },
      {
        label: "Payment Success",
        value: "99.8%",
        change: "Highly stable",
        trend: "neutral"
      }
    ]
  }
};

/**
 * Returns supplementary details for a project.
 * If no record is found, generates a clean fallback overview on-the-fly.
 */
export function getWorkspaceDetail(slug: string, projectName: string, description: string): ProjectWorkspaceDetail {
  const normalized = slug.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  if (PROJECT_WORKSPACES_DETAIL[normalized]) {
    return PROJECT_WORKSPACES_DETAIL[normalized];
  }
  
  // High-fidelity dynamic fallback generator
  return {
    projectId: slug,
    summary: description,
    objective: `Deliver outstanding results and optimize implementation models for ${projectName}.`,
    currentPhaseSummary: "Currently establishing baseline plans, validating developer tools, and structuring documentation.",
    completionCriteria: [
      "Establish primary technical roadmap milestones",
      "Deploy initial boilerplate repository layouts",
      "Establish visual validation guides and quality metrics"
    ],
    recentActivity: [
      {
        id: `${slug}-fallback-act-1`,
        description: `Project records initialized in workspace registry for ${projectName}`,
        timeContext: "Recently",
        type: "general"
      }
    ],
    upcomingWork: [
      {
        id: `${slug}-fallback-up-1`,
        title: "Structure core developer timeline goals and tasks",
        section: "Roadmap",
        priority: "Medium",
        timeframe: "Next Sprint",
        statusLabel: "Planned"
      }
    ],
    risks: [
      {
        id: `${slug}-fallback-risk-1`,
        title: "Unresolved technical roadmap dependencies",
        impact: "Medium",
        status: "Monitored",
        description: "Additional scoping is required to establish comprehensive tech requirements and avoid timeline bottlenecks."
      }
    ],
    keyLinks: []
  };
}
