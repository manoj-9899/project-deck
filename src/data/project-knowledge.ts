import { ProjectKnowledgeEntry } from "../types/project-knowledge";

export const getInitialKnowledge = (): Record<string, ProjectKnowledgeEntry[]> => {
  const now = new Date();
  
  const formatDateOffset = (days: number) => {
    const d = new Date();
    d.setDate(now.getDate() + days);
    return d.toISOString().split('T')[0];
  };

  const formatDateTimeOffset = (days: number) => {
    const d = new Date();
    d.setDate(now.getDate() + days);
    return d.toISOString();
  };

  return {
    projectdock: [
      {
        id: "pd-knowledge-1",
        projectId: "projectdock",
        title: "Retain Vite + React over Next.js",
        content: "We decided to build ProjectDock on Vite instead of Next.js to preserve fast feedback cycles, standard static single-page application (SPA) output structures, and simplified dev-server container mappings. Next.js brings server-side runtime complexities that would violate sandboxing and reverse-proxy setups on port 3000.",
        type: "Decision",
        status: "Accepted",
        tags: ["Architecture", "Frontend", "Build Tool"],
        isPinned: true,
        isArchived: false,
        createdAt: formatDateTimeOffset(-25),
        updatedAt: formatDateTimeOffset(-25),
        relatedPhaseId: "pd-phase-1",
        decision: "Retain Vite + React as the core client stack.",
        rationale: "Vite provides instantaneous Hot Module Replacement, outputs clean static assets under standard build targets, and avoids unnecessary Node.js SSR runtime overhead in sandboxed client environments.",
        alternatives: "Next.js App Router (Rejected due to deployment port bindings and routing complexity).",
        consequences: "Client-only SPA build outputs are fully stable, fast, and simple to host or bundle. Server routes are only added when explicit API proxies are requested."
      },
      {
        id: "pd-knowledge-2",
        projectId: "projectdock",
        title: "Standard React Router Integration",
        content: "To support client-side deep linking and nested layout routes (e.g., project details, roadmap views, tasks dashboards) seamlessly, standard React Router v6 was configured. It enables path parsing, active-link state highlights, and nested page layouts with standard <Outlet /> containers.",
        type: "Decision",
        status: "Accepted",
        tags: ["Routing", "Frontend"],
        isPinned: false,
        isArchived: false,
        createdAt: formatDateTimeOffset(-20),
        updatedAt: formatDateTimeOffset(-20),
        relatedPhaseId: "pd-phase-1",
        decision: "Leverage standard declarative hash or history router routing.",
        rationale: "Provides robust URL state synchronization, layout reuse, and clean route parameters like :projectId for workspace pages.",
        alternatives: "Custom hook-based state routing (Rejected because it breaks browser back/forward buttons and deep linking).",
        consequences: "Navigation behaves naturally, but we must protect nested routes when projects are missing or archived by using outlet context providers."
      },
      {
        id: "pd-knowledge-3",
        projectId: "projectdock",
        title: "Durable Supabase Persistence Deferred",
        content: "Durable Supabase database integration has been deferred to Phase 8/9. The system will continue utilizing high-density, memory-resident React state controllers initialized with mock seeds to let users preview interactive features instantly without configuring database schemas or secrets first.",
        type: "Decision",
        status: "Proposed",
        tags: ["Database", "Persistence", "Deferred"],
        isPinned: true,
        isArchived: false,
        createdAt: formatDateTimeOffset(-15),
        updatedAt: formatDateTimeOffset(-15),
        relatedPhaseId: "pd-phase-4",
        decision: "Defer remote SQL persistence and run on local in-memory controllers.",
        rationale: "Allows complete client-side simulation of complex planners and dashboards. Prevents cold-start delays or access blocks caused by missing database keys during initial reviews.",
        alternatives: "Direct local storage sync (Rejected as standard caches don't handle multi-relational references cleanly), real PostgreSQL (Deferred for subsequent database phase).",
        consequences: "Workspace data resets on manual browser refresh, but is preserved during client routing. Safe error and warning states are printed if relations fail to load."
      },
      {
        id: "pd-knowledge-4",
        projectId: "projectdock",
        title: "Roadmap Milestones Separated from Tasks",
        content: "Roadmap milestones represent high-level architectural goals or phases of delivery, whereas Project Tasks represent granular, single-person developer tasks with priorities, status lanes, and blocker notes. Keeping these models decoupled prevents bloated milestone cards and avoids cyclic dependencies.",
        type: "Decision",
        status: "Accepted",
        tags: ["Architecture", "Planning"],
        isPinned: false,
        isArchived: false,
        createdAt: formatDateTimeOffset(-12),
        updatedAt: formatDateTimeOffset(-12),
        relatedPhaseId: "pd-phase-6",
        relatedTaskId: "pd-task-1",
        decision: "Explicitly decouple roadmap phases and milestones from daily action tasks.",
        rationale: "Milestones should map out long-term scheduling goals, whereas tasks represent actual developer execution. Coupling them strictly into a single collection leads to infinite loops in progress calculations.",
        alternatives: "A single unified table mapping hierarchy (Rejected because it complicates progress rollups and sorting).",
        consequences: "Tasks can be optionally linked to roadmap phases, but their completion does not strictly override milestone checkboxes unless requested."
      },
      {
        id: "pd-knowledge-5",
        projectId: "projectdock",
        title: "Permanent Project Deletion Deferred",
        content: "To safeguard workspace integrity, permanent project deletion is currently deferred. Users are allowed to archive projects, which freezes all edits and places the repository in a read-only state. This prevents accidental full-data loss while providing a toggleable review option.",
        type: "Decision",
        status: "Accepted",
        tags: ["Safety", "Features"],
        isPinned: false,
        isArchived: false,
        createdAt: formatDateTimeOffset(-10),
        updatedAt: formatDateTimeOffset(-10),
        relatedPhaseId: "pd-phase-5",
        decision: "Defer hard deletion features and prioritize high-visibility project archiving.",
        rationale: "Hard deletions of relational projects would require cascading deletions across tasks, roadmaps, and knowledge bases, risking permanent work loss on client refreshes.",
        alternatives: "Immediate Cascade Deletes (Rejected for safety).",
        consequences: "Archived projects are kept visible in a read-only state, with all creation and editing controls hidden or disabled."
      },
      {
        id: "pd-knowledge-6",
        projectId: "projectdock",
        title: "Remove Native Browser Prompts",
        content: "Native browser popup boxes (`window.confirm`, `window.prompt`, `window.alert`) cause sudden visual interruptions, block the main execution thread, and degrade iframe responsiveness. We have replaced all browser popups with elegant, standard React modal overlays and toasts.",
        type: "Decision",
        status: "Accepted",
        tags: ["UI/UX", "Refactor"],
        isPinned: false,
        isArchived: false,
        createdAt: formatDateTimeOffset(-8),
        updatedAt: formatDateTimeOffset(-8),
        relatedPhaseId: "pd-phase-6",
        decision: "Ban window.confirm and window.alert, replacing them with a custom state-driven Dialog system.",
        rationale: "Ensures seamless rendering within embedding iframes and allows us to style popups to match the dark slate visual identity of ProjectDock.",
        alternatives: "Standard alert boxes (Rejected due to poor iframe integration).",
        consequences: "Forms track unsaved changes (dirty states) and trigger our custom double-confirmation dialog when a user attempts to discard edits."
      },
      {
        id: "pd-knowledge-7",
        projectId: "projectdock",
        title: "No Drag-and-Drop for Kanban Board",
        content: "Implementing direct drag-and-drop mechanics introduces heavy external package weights (such as react-beautiful-dnd) and frequently breaks on mobile touch devices. By using explicit status selectors and dropdown action menus, we preserve perfect mobile and keyboard accessibility.",
        type: "Decision",
        status: "Accepted",
        tags: ["Accessibility", "Tasks", "Frontend"],
        isPinned: false,
        isArchived: false,
        createdAt: formatDateTimeOffset(-5),
        updatedAt: formatDateTimeOffset(-5),
        relatedPhaseId: "pd-phase-7",
        relatedTaskId: "pd-task-4",
        decision: "Use action menus and lane-shift buttons instead of touch drag-and-drop.",
        rationale: "Guarantees 100% accessible keyboard navigation, avoids horizontal scroll conflicts on mobile screens, and maintains lightweight bundle size.",
        alternatives: "HTML5 Drag-and-Drop (Rejected as it is notoriously buggy on touch browsers).",
        consequences: "Users move cards between Backlog, To do, In progress, Blocked, and Completed lanes with lightning-fast context clicks."
      },
      {
        id: "pd-knowledge-8",
        projectId: "projectdock",
        title: "Webpack/Vite Dev Server Ingress Port Conflicts",
        content: "Encountered a critical issue where the local development server failed to bind correctly due to custom container mappings. The build proxy was expecting all external traffic exclusively on port 3000, while Vite was occasionally spinning up on 5173.",
        type: "Error & Solution",
        tags: ["Docker", "Vite", "Container"],
        isPinned: false,
        isArchived: false,
        createdAt: formatDateTimeOffset(-18),
        updatedAt: formatDateTimeOffset(-18),
        relatedPhaseId: "pd-phase-1",
        errorMessage: "vite: not found or failed to connect on port 5173",
        context: "Initial developer environment launch inside Cloud Run sandboxed containers.",
        rootCause: "The docker container and nginx proxy layers route ingress traffic strictly to port 3000. When Vite automatically fell back to standard 5173, the reverse proxy returned a 502 Bad Gateway.",
        solution: "Configured vite.config.ts with a strict server port object (port: 3000, host: '0.0.0.0') and added watch options to respect container file modifications.",
        preventionNotes: "Never allow Vite to pick random ports. Ensure package.json scripts explicitly pass `--port 3000` or configure it in the main configuration file."
      },
      {
        id: "pd-knowledge-9",
        projectId: "projectdock",
        title: "Workspace Layout Guidelines",
        content: "A detailed documentation on how to build and maintain nested workspace pages under `/projects/:projectId/`.\n\nAll nested routes should utilize the shared `useProjectWorkspace` context which outputs the primary project metadata, archive state, and route controllers. This prevents separate, redundant fetching and ensures that archiving a project immediately propagates read-only states down to child tabs like Tasks or Roadmap.",
        type: "Documentation",
        tags: ["Guidelines", "Architecture", "Routing"],
        isPinned: false,
        isArchived: false,
        createdAt: formatDateTimeOffset(-22),
        updatedAt: formatDateTimeOffset(-20)
      }
    ],
    launchkaro: [
      {
        id: "lk-knowledge-1",
        projectId: "launchkaro",
        title: "Product Hunt & Hacker News Automated Schedule",
        content: "Detailed scheduled roadmap for launching LaunchKaro on major product directory networks. We will leverage timed releases based on maximum active traffic windows (typically Tuesdays at 12:01 AM PST).",
        type: "Research",
        tags: ["Launch", "Marketing", "Strategy"],
        isPinned: true,
        isArchived: false,
        createdAt: formatDateTimeOffset(-14),
        updatedAt: formatDateTimeOffset(-14)
      },
      {
        id: "lk-knowledge-2",
        projectId: "launchkaro",
        title: "Strip Subdomain DNS Redirect Loop",
        content: "Users attempting to navigate from subdomains were stuck in an infinite redirect cycle because the wildcard SSL certificate was not propagating to multi-tier nested domains.",
        type: "Error & Solution",
        tags: ["DNS", "Cloudflare", "SSL"],
        isPinned: false,
        isArchived: false,
        createdAt: formatDateTimeOffset(-10),
        updatedAt: formatDateTimeOffset(-10),
        errorMessage: "ERR_TOO_MANY_REDIRECTS on launchkaro.co subdomains",
        context: "Custom domain configuration with wildcard subdomains for individual creator pages.",
        rootCause: "Cloudflare proxy rules was attempting to force HTTPS on top of custom CNAME configurations that were already performing internal HTTPS redirects.",
        solution: "Changed Cloudflare SSL/TLS setting from 'Flexible' to 'Full (Strict)' and configured clear rewrite page rules.",
        preventionNotes: "Ensure DNS proxy settings match backend web servers to prevent SSL termination loops."
      }
    ],
    devhabits: [
      {
        id: "dh-knowledge-1",
        projectId: "devhabits",
        title: "Gamification Algorithm & Streaks Calculator",
        content: "To keep developer engagement high, the streak engine calculates multiplier bonuses for consecutive active days.\n\n### Multipliers:\n* 3-day streak: 1.1x XP\n* 7-day streak: 1.3x XP\n* 30-day streak: 1.5x XP\n\nSkipping a habit causes a breakdown. However, a 'Freeze' item can be purchased with virtual developer points to safeguard streaks.",
        type: "Documentation",
        tags: ["Algorithm", "Gamification"],
        isPinned: true,
        isArchived: false,
        createdAt: formatDateTimeOffset(-12),
        updatedAt: formatDateTimeOffset(-10)
      }
    ],
    repopilot: [
      {
        id: "rp-knowledge-1",
        projectId: "repopilot",
        title: "LLM Parsing Performance Optimization",
        content: "Research on optimizing prompt response payloads and file-structure context sizes for the automated code analysis engine. Using Abstract Syntax Tree (AST) tree-shaking allows us to feed only relevant code modules into the context window, reducing token consumption by up to 60%.",
        type: "Research",
        tags: ["AI", "Parsing", "Tokens"],
        isPinned: true,
        isArchived: false,
        createdAt: formatDateTimeOffset(-15),
        updatedAt: formatDateTimeOffset(-14)
      }
    ],
    campuscanteen: [
      {
        id: "cc-knowledge-1",
        projectId: "campuscanteen",
        title: "Real-time Order Queue Refactor",
        content: "Implementation review of the order fulfillment display in the campus kitchens.\n\nOrders must be grouped chronologically and split by dining stations (e.g., Grills, Beverages, Salads). High-priority indicators are flagged for student orders with express meal plans.",
        type: "Implementation Summary",
        tags: ["Fulfillment", "Refactor"],
        isPinned: true,
        isArchived: false,
        createdAt: formatDateTimeOffset(-5),
        updatedAt: formatDateTimeOffset(-5)
      }
    ]
  };
};
