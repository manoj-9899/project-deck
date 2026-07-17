import { ProjectPhase, PhaseStatus, MilestoneStatus } from "../types/project-roadmap";

export const getInitialRoadmaps = (): Record<string, ProjectPhase[]> => {
  return {
    projectdock: [
      {
        id: "pd-phase-1",
        projectId: "projectdock",
        title: "Phase 1 — Foundation and Design System",
        description: "Establish the visual language, typography tokens, layout systems, and custom UI components to serve as the unified core for the ProjectDock ecosystem.",
        order: 1,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-06-01",
        targetDate: "2026-06-15",
        completedDate: "2026-06-14",
        isCurrent: false,
        dependencies: [],
        completionCriteria: [
          { id: "pd-cc-1-1", label: "Interactive design system page is fully responsive", isComplete: true },
          { id: "pd-cc-1-2", label: "Unified color palette, borders, and dark/light token contracts established", isComplete: true },
          { id: "pd-cc-1-3", label: "Key UI primitives (Dialog, Badge, Select, Sheet, Button) coded", isComplete: true }
        ],
        milestones: [
          {
            id: "pd-m-1-1",
            phaseId: "pd-phase-1",
            title: "Establish application foundation",
            description: "Scaffold Vite + React + Tailwind CSS environment with correct port configurations.",
            status: "Completed" as MilestoneStatus,
            priority: "Critical",
            targetDate: "2026-06-03",
            completedDate: "2026-06-03",
            order: 1
          },
          {
            id: "pd-m-1-2",
            phaseId: "pd-phase-1",
            title: "Define visual tokens",
            description: "Map Tailwind theme extensions for subtle borders, surfaces, and semantic states.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-06-07",
            completedDate: "2026-06-06",
            order: 2
          },
          {
            id: "pd-m-1-3",
            phaseId: "pd-phase-1",
            title: "Build reusable UI components",
            description: "Implement accessible, fully styled, state-aware common elements.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-06-12",
            completedDate: "2026-06-11",
            order: 3
          },
          {
            id: "pd-m-1-4",
            phaseId: "pd-phase-1",
            title: "Create design-system preview",
            description: "Deploy the /design-system page as an interactive sandbox and spec sheet.",
            status: "Completed" as MilestoneStatus,
            priority: "Medium",
            targetDate: "2026-06-15",
            completedDate: "2026-06-14",
            order: 4
          }
        ],
        notes: "Foundation was built extremely quickly. Tailwind CSS v4 provides very fluid token support."
      },
      {
        id: "pd-phase-1-1",
        projectId: "projectdock",
        title: "Phase 1.1 — Architecture Hardening",
        description: "Address navigation routing vulnerabilities, enhance keyboard accessibility, and enforce strict overlay focus trapping constraints.",
        order: 2,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-06-16",
        targetDate: "2026-06-22",
        completedDate: "2026-06-22",
        isCurrent: false,
        dependencies: ["pd-phase-1"],
        completionCriteria: [
          { id: "pd-cc-11-1", label: "Replace custom router with react-router-dom v7 standard", isComplete: true },
          { id: "pd-cc-11-2", label: "Enforce focus traps on active Sheets and modal dialogues", isComplete: true }
        ],
        milestones: [
          {
            id: "pd-m-11-1",
            phaseId: "pd-phase-1-1",
            title: "Replace custom router",
            description: "Configure BrowserRouter context with proper nested route support.",
            status: "Completed" as MilestoneStatus,
            priority: "Critical",
            targetDate: "2026-06-18",
            completedDate: "2026-06-18",
            order: 1
          },
          {
            id: "pd-m-11-2",
            phaseId: "pd-phase-1-1",
            title: "Standardize React Router",
            description: "Eliminate window.location hacks, and adopt Outlet templates.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-06-20",
            completedDate: "2026-06-19",
            order: 2
          },
          {
            id: "pd-m-11-3",
            phaseId: "pd-phase-1-1",
            title: "Improve overlay accessibility",
            description: "Implement Escape key bindings, Focus Restoration, and screen reader labels.",
            status: "Completed" as MilestoneStatus,
            priority: "Critical",
            targetDate: "2026-06-22",
            completedDate: "2026-06-22",
            order: 3
          },
          {
            id: "pd-m-11-4",
            phaseId: "pd-phase-1-1",
            title: "Validate design-system interactions",
            description: "Review modal traps on mobile and desktop viewports.",
            status: "Completed" as MilestoneStatus,
            priority: "Medium",
            targetDate: "2026-06-22",
            completedDate: "2026-06-22",
            order: 4
          }
        ],
        notes: "Architecture is now solid. Dialogs and sheets have proper ARIA attributes."
      },
      {
        id: "pd-phase-2",
        projectId: "projectdock",
        title: "Phase 2 — Application Shell",
        description: "Construct the durable core navigation framework, handling responsive layouts across desktop and mobile screens.",
        order: 3,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-06-23",
        targetDate: "2026-06-30",
        completedDate: "2026-06-29",
        isCurrent: false,
        dependencies: ["pd-phase-1-1"],
        completionCriteria: [
          { id: "pd-cc-2-1", label: "Sidebar supports collapsing on desktop", isComplete: true },
          { id: "pd-cc-2-2", label: "Mobile top bar expands to Left Slide-out Drawer", isComplete: true }
        ],
        milestones: [
          {
            id: "pd-m-2-1",
            phaseId: "pd-phase-2",
            title: "Build desktop sidebar",
            description: "Create vertical navigation panel with active route awareness.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-06-25",
            completedDate: "2026-06-24",
            order: 1
          },
          {
            id: "pd-m-2-2",
            phaseId: "pd-phase-2",
            title: "Build mobile navigation",
            description: "Code top header panel with slide-out sheet toggle.",
            status: "Completed" as MilestoneStatus,
            priority: "Critical",
            targetDate: "2026-06-27",
            completedDate: "2026-06-26",
            order: 2
          },
          {
            id: "pd-m-2-3",
            phaseId: "pd-phase-2",
            title: "Add route-aware page headers",
            description: "Extract current folder names into descriptive page headers.",
            status: "Completed" as MilestoneStatus,
            priority: "Medium",
            targetDate: "2026-06-29",
            completedDate: "2026-06-29",
            order: 3
          },
          {
            id: "pd-m-2-4",
            phaseId: "pd-phase-2",
            title: "Add shell actions",
            description: "Add user profile avatars, notifications placeholder, and support links.",
            status: "Completed" as MilestoneStatus,
            priority: "Low",
            targetDate: "2026-06-30",
            completedDate: "2026-06-29",
            order: 4
          }
        ]
      },
      {
        id: "pd-phase-3",
        projectId: "projectdock",
        title: "Phase 3 — Dashboard",
        description: "Design and implement the workspace command center, giving engineering leaders clear visibility into metrics, blocked items, and focus priorities.",
        order: 4,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-07-01",
        targetDate: "2026-07-07",
        completedDate: "2026-07-07",
        isCurrent: false,
        dependencies: ["pd-phase-2"],
        completionCriteria: [
          { id: "pd-cc-3-1", label: "Metric cards reflect active counts correctly", isComplete: true },
          { id: "pd-cc-3-2", label: "Current Focus card acts as primary call-to-action", isComplete: true }
        ],
        milestones: [
          {
            id: "pd-m-3-1",
            phaseId: "pd-phase-3",
            title: "Current-focus interface",
            description: "Highlight active tasks and allow status completions.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-02",
            completedDate: "2026-07-02",
            order: 1
          },
          {
            id: "pd-m-3-2",
            phaseId: "pd-phase-3",
            title: "Workspace metrics",
            description: "Show cards for Active Projects, Blocked Tasks, and Weekly Completions.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-03",
            completedDate: "2026-07-03",
            order: 2
          },
          {
            id: "pd-m-3-3",
            phaseId: "pd-phase-3",
            title: "Active projects",
            description: "Render dense progress bars for the top 3 high-priority folders.",
            status: "Completed" as MilestoneStatus,
            priority: "Medium",
            targetDate: "2026-07-05",
            completedDate: "2026-07-04",
            order: 3
          },
          {
            id: "pd-m-3-4",
            phaseId: "pd-phase-3",
            title: "Upcoming tasks",
            description: "List next-priority assignments sorted chronologically.",
            status: "Completed" as MilestoneStatus,
            priority: "Low",
            targetDate: "2026-07-07",
            completedDate: "2026-07-06",
            order: 4
          },
          {
            id: "pd-m-3-5",
            phaseId: "pd-phase-3",
            title: "Needs-attention section",
            description: "Surface critical blockers with associated contextual advice.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-07",
            completedDate: "2026-07-07",
            order: 5
          },
          {
            id: "pd-m-3-6",
            phaseId: "pd-phase-3",
            title: "Recent activity",
            description: "Implement a chronological stream of project mutations.",
            status: "Completed" as MilestoneStatus,
            priority: "Low",
            targetDate: "2026-07-07",
            completedDate: "2026-07-07",
            order: 6
          }
        ]
      },
      {
        id: "pd-phase-4",
        projectId: "projectdock",
        title: "Phase 4 — Projects Directory",
        description: "Develop the full portfolio directory catalog. Implement grid/list view selection, multi-field searching, status filters, and project duplicate/archive utility commands.",
        order: 5,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-07-08",
        targetDate: "2026-07-12",
        completedDate: "2026-07-12",
        isCurrent: false,
        dependencies: ["pd-phase-3"],
        completionCriteria: [
          { id: "pd-cc-4-1", label: "Filters dynamically narrow catalog instantly", isComplete: true },
          { id: "pd-cc-4-2", label: "Duplicated projects append correctly with (Copy) string", isComplete: true }
        ],
        milestones: [
          {
            id: "pd-m-4-1",
            phaseId: "pd-phase-4",
            title: "Search and filtering",
            description: "Enable fuzzy text searches and category filtering.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-09",
            completedDate: "2026-07-09",
            order: 1
          },
          {
            id: "pd-m-4-2",
            phaseId: "pd-phase-4",
            title: "Grid and list views",
            description: "Implement view toggle with persistent local UI states.",
            status: "Completed" as MilestoneStatus,
            priority: "Medium",
            targetDate: "2026-07-10",
            completedDate: "2026-07-09",
            order: 2
          },
          {
            id: "pd-m-4-3",
            phaseId: "pd-phase-4",
            title: "Temporary create and edit",
            description: "Add forms inside accessible dialog overlays.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-11",
            completedDate: "2026-07-11",
            order: 3
          },
          {
            id: "pd-m-4-4",
            phaseId: "pd-phase-4",
            title: "Duplicate, archive, and restore",
            description: "Ensure archive state flags prevent modification in core catalogs.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-12",
            completedDate: "2026-07-12",
            order: 4
          },
          {
            id: "pd-m-4-5",
            phaseId: "pd-phase-4",
            title: "Scope correction for deletion",
            description: "Refactor deletion to require absolute user confirmation inputs.",
            status: "Completed" as MilestoneStatus,
            priority: "Critical",
            targetDate: "2026-07-12",
            completedDate: "2026-07-12",
            order: 5
          }
        ]
      },
      {
        id: "pd-phase-5",
        projectId: "projectdock",
        title: "Phase 5 — Project Workspace Overview",
        description: "Assemble the individual folder workspace shell. Render key project indices, checklist elements, status facts, local pathways, and robust error placeholders for missing folders.",
        order: 6,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-07-13",
        targetDate: "2026-07-15",
        completedDate: "2026-07-15",
        isCurrent: false,
        dependencies: ["pd-phase-4"],
        completionCriteria: [
          { id: "pd-cc-5-1", label: "Unknown slugs load 404 project layout cleanly", isComplete: true },
          { id: "pd-cc-5-2", label: "Archived warning card freezes modifications safely", isComplete: true }
        ],
        milestones: [
          {
            id: "pd-m-5-1",
            phaseId: "pd-phase-5",
            title: "Nested workspace routes",
            description: "Setup React Router v7 sub-outlets inside the workspace shell.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-13",
            completedDate: "2026-07-13",
            order: 1
          },
          {
            id: "pd-m-5-2",
            phaseId: "pd-phase-5",
            title: "Read-only project overview",
            description: "Map primary workspace dashboard tiles displaying brief stats.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-14",
            completedDate: "2026-07-14",
            order: 2
          },
          {
            id: "pd-m-5-3",
            phaseId: "pd-phase-5",
            title: "Project links and facts",
            description: "Implement repository link buttons and dense technical properties table.",
            status: "Completed" as MilestoneStatus,
            priority: "Medium",
            targetDate: "2026-07-15",
            completedDate: "2026-07-14",
            order: 3
          },
          {
            id: "pd-m-5-4",
            phaseId: "pd-phase-5",
            title: "Archived and unknown project handling",
            description: "Gracefully display alert headers for archived codebases.",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-15",
            completedDate: "2026-07-15",
            order: 4
          },
          {
            id: "pd-m-5-5",
            phaseId: "pd-phase-5",
            title: "Read-only scope correction",
            description: "Strictly decouple the individual dashboard overview from editing workflows.",
            status: "Completed" as MilestoneStatus,
            priority: "Critical",
            targetDate: "2026-07-15",
            completedDate: "2026-07-15",
            order: 5
          }
        ]
      },
      {
        id: "pd-phase-6",
        projectId: "projectdock",
        title: "Phase 6 — Roadmap, Phases, and Milestones",
        description: "Introduce structured, interactive roadmap and planning interfaces. Manage project phases, sequential delivery milestones, dependencies, completion criteria, and chronological timelines.",
        order: 7,
        status: "In progress" as PhaseStatus,
        progress: 30,
        startDate: "2026-07-16",
        targetDate: "2026-07-22",
        isCurrent: true,
        dependencies: ["pd-phase-5"],
        completionCriteria: [
          { id: "pd-cc-6-1", label: "Strongly typed schemas created for phases & milestones", isComplete: true },
          { id: "pd-cc-6-2", label: "Temporary in-memory mutations support adding, editing & reordering", isComplete: false },
          { id: "pd-cc-6-3", label: "Lightweight CSS timeline view handles vertical/horizontal responsive shifts", isComplete: false }
        ],
        milestones: [
          {
            id: "pd-m-6-1",
            phaseId: "pd-phase-6",
            title: "Roadmap data model",
            description: "Define schemas in src/types/project-roadmap.ts, matching order bounds.",
            status: "Completed" as MilestoneStatus,
            priority: "Critical",
            targetDate: "2026-07-17",
            completedDate: "2026-07-17",
            order: 1
          },
          {
            id: "pd-m-6-2",
            phaseId: "pd-phase-6",
            title: "Roadmap overview",
            description: "Build full list and lightweight timeline tabs within workspace nested routers.",
            status: "In progress" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-19",
            order: 2
          },
          {
            id: "pd-m-6-3",
            phaseId: "pd-phase-6",
            title: "Phase management",
            description: "Code create/edit/delete/reorder/duplicate routines for sequential phases.",
            status: "Pending" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-20",
            order: 3
          },
          {
            id: "pd-m-6-4",
            phaseId: "pd-phase-6",
            title: "Milestone management",
            description: "Build checklist interface to append, status-mutate, and reorder deliveries.",
            status: "Pending" as MilestoneStatus,
            priority: "Medium",
            targetDate: "2026-07-21",
            order: 4
          },
          {
            id: "pd-m-6-5",
            phaseId: "pd-phase-6",
            title: "Dependency visualization",
            description: "Call attention to blocked states when prerequisite phases are not yet Completed.",
            status: "Pending" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-22",
            order: 5
          },
          {
            id: "pd-m-6-6",
            phaseId: "pd-phase-6",
            title: "Responsive roadmap refinement",
            description: "Optimize checklist buttons for touch grids, testing down to 360px widths.",
            status: "Pending" as MilestoneStatus,
            priority: "Medium",
            targetDate: "2026-07-22",
            order: 6
          }
        ],
        notes: "This module implements the vital roadmap and phase architecture!"
      },
      {
        id: "pd-phase-7",
        projectId: "projectdock",
        title: "Phase 7 — Task Management",
        description: "Enable comprehensive granular task managers, Kanban boards, sprint planners, and direct assignment matrices.",
        order: 8,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-07-23",
        targetDate: "2026-08-01",
        isCurrent: false,
        dependencies: ["pd-phase-6"],
        completionCriteria: [],
        milestones: []
      },
      {
        id: "pd-phase-8",
        projectId: "projectdock",
        title: "Phase 8 — Knowledge and Decisions",
        description: "Introduce wiki editors, decision registers (DR), tech debt audits, and collaborative documents.",
        order: 9,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-08-02",
        targetDate: "2026-08-10",
        isCurrent: false,
        dependencies: ["pd-phase-7"],
        completionCriteria: [],
        milestones: []
      },
      {
        id: "pd-phase-9",
        projectId: "projectdock",
        title: "Phase 9 — Prompt Library",
        description: "Construct curated system instructions, variable prompt playbooks, and LLM orchestration context presets.",
        order: 10,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-08-11",
        targetDate: "2026-08-15",
        isCurrent: false,
        dependencies: ["pd-phase-8"],
        completionCriteria: [],
        milestones: []
      },
      {
        id: "pd-phase-10",
        projectId: "projectdock",
        title: "Phase 10 — Resources",
        description: "Assemble links catalogs, design-file clouds, environment variables directories, and access coordinate tables.",
        order: 11,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-08-16",
        targetDate: "2026-08-20",
        isCurrent: false,
        dependencies: ["pd-phase-9"],
        completionCriteria: [],
        milestones: []
      },
      {
        id: "pd-phase-11",
        projectId: "projectdock",
        title: "Phase 11 — Search and Command Palette",
        description: "Build system-wide fuzzy search indices and hotkey-activated quick command prompts.",
        order: 12,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-08-21",
        targetDate: "2026-08-25",
        isCurrent: false,
        dependencies: ["pd-phase-10"],
        completionCriteria: [],
        milestones: []
      },
      {
        id: "pd-phase-12",
        projectId: "projectdock",
        title: "Phase 12 — Supabase Integration",
        description: "Bind local storage states into PostgreSQL cloud instances, managing real database tables and row security rules.",
        order: 13,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-08-26",
        targetDate: "2026-09-05",
        isCurrent: false,
        dependencies: ["pd-phase-11"],
        completionCriteria: [],
        milestones: []
      },
      {
        id: "pd-phase-13",
        projectId: "projectdock",
        title: "Phase 13 — Responsive Refinement",
        description: "Exhaustive audits across edge tablet, desktop, and notch-based mobile viewports.",
        order: 14,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-09-06",
        targetDate: "2026-09-10",
        isCurrent: false,
        dependencies: ["pd-phase-12"],
        completionCriteria: [],
        milestones: []
      },
      {
        id: "pd-phase-14",
        projectId: "projectdock",
        title: "Phase 14 — Interaction Polish",
        description: "Deploy micro-interaction layout springs, stagger list entrance animations, and clean fade loading states.",
        order: 15,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-09-11",
        targetDate: "2026-09-15",
        isCurrent: false,
        dependencies: ["pd-phase-13"],
        completionCriteria: [],
        milestones: []
      },
      {
        id: "pd-phase-15",
        projectId: "projectdock",
        title: "Phase 15 — Validation and Deployment",
        description: "Verify linter, build system compilation constraints, and execute final platform-wide deployment checks.",
        order: 16,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-09-16",
        targetDate: "2026-09-20",
        isCurrent: false,
        dependencies: ["pd-phase-14"],
        completionCriteria: [],
        milestones: []
      }
    ],
    launchkaro: [
      {
        id: "lk-phase-1",
        projectId: "launchkaro",
        title: "Phase 1 — Market Research & Scope Finalization",
        description: "Perform competitor audits, identify pricing models, and narrow down core boilerplate integrations.",
        order: 1,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-07-01",
        targetDate: "2026-07-10",
        completedDate: "2026-07-09",
        isCurrent: false,
        dependencies: [],
        completionCriteria: [
          { id: "lk-cc-1-1", label: "Finalize initial product design document", isComplete: true },
          { id: "lk-cc-1-2", label: "Review competitors and pricing structures", isComplete: true }
        ],
        milestones: [
          {
            id: "lk-m-1-1",
            phaseId: "lk-phase-1",
            title: "Competitive Landscape Analysis",
            status: "Completed" as MilestoneStatus,
            priority: "Medium",
            targetDate: "2026-07-05",
            completedDate: "2026-07-04",
            order: 1
          },
          {
            id: "lk-m-1-2",
            phaseId: "lk-phase-1",
            title: "Draft scope definitions",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-10",
            completedDate: "2026-07-09",
            order: 2
          }
        ]
      },
      {
        id: "lk-phase-2",
        projectId: "launchkaro",
        title: "Phase 2 — Boilerplate Foundation",
        description: "Scaffold boilerplate generator using Next.js with unified Tailwind tokens.",
        order: 2,
        status: "In progress" as PhaseStatus,
        progress: 60,
        startDate: "2026-07-11",
        targetDate: "2026-08-15",
        isCurrent: true,
        dependencies: ["lk-phase-1"],
        completionCriteria: [
          { id: "lk-cc-2-1", label: "Establish Next.js core architecture", isComplete: true },
          { id: "lk-cc-2-2", label: "Draft initial CLI configuration schemas", isComplete: false }
        ],
        milestones: [
          {
            id: "lk-m-2-1",
            phaseId: "lk-phase-2",
            title: "Scaffold Next.js repositories",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-15",
            completedDate: "2026-07-15",
            order: 1
          },
          {
            id: "lk-m-2-2",
            phaseId: "lk-phase-2",
            title: "Implement database connectors",
            status: "In progress" as MilestoneStatus,
            priority: "Critical",
            targetDate: "2026-07-30",
            order: 2
          }
        ]
      },
      {
        id: "lk-phase-3",
        projectId: "launchkaro",
        title: "Phase 3 — Template Integrations",
        description: "Build robust integrations for landing pages, user authentication templates, and system mailers.",
        order: 3,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-08-16",
        targetDate: "2026-09-10",
        isCurrent: false,
        dependencies: ["lk-phase-2"],
        completionCriteria: [],
        milestones: []
      },
      {
        id: "lk-phase-4",
        projectId: "launchkaro",
        title: "Phase 4 — Payment Gateways",
        description: "Configure Stripe webhooks, billing cycles, subscription tables, and promo codes.",
        order: 4,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-09-11",
        targetDate: "2026-09-30",
        isCurrent: false,
        dependencies: ["lk-phase-3"],
        completionCriteria: [],
        milestones: []
      }
    ],
    devhabits: [
      {
        id: "dh-phase-1",
        projectId: "devhabits",
        title: "Phase 1 — Engine Foundation",
        description: "Assemble the basic application skeleton, SvelteKit setups, and core user profile structures.",
        order: 1,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-05-10",
        targetDate: "2026-05-30",
        completedDate: "2026-05-29",
        isCurrent: false,
        dependencies: [],
        completionCriteria: [],
        milestones: [
          {
            id: "dh-m-1-1",
            phaseId: "dh-phase-1",
            title: "Database setup with Supabase",
            status: "Completed" as MilestoneStatus,
            priority: "Critical",
            targetDate: "2026-05-20",
            completedDate: "2026-05-18",
            order: 1
          }
        ]
      },
      {
        id: "dh-phase-2",
        projectId: "devhabits",
        title: "Phase 2 — Gamification Engine",
        description: "Design logic to parse github commits and turn coding hours into character stat experience points (XP).",
        order: 2,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-06-01",
        targetDate: "2026-06-25",
        completedDate: "2026-06-25",
        isCurrent: false,
        dependencies: ["dh-phase-1"],
        completionCriteria: [],
        milestones: [
          {
            id: "dh-m-2-1",
            phaseId: "dh-phase-2",
            title: "Build commit listener API",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-06-15",
            completedDate: "2026-06-14",
            order: 1
          }
        ]
      },
      {
        id: "dh-phase-3",
        projectId: "devhabits",
        title: "Phase 3 — Beta & Integration Testing",
        description: "Conduct community testing, gather feedback, fix gamification math, and check mobile layouts.",
        order: 3,
        status: "In progress" as PhaseStatus,
        progress: 80,
        startDate: "2026-06-26",
        targetDate: "2026-07-20",
        isCurrent: true,
        dependencies: ["dh-phase-2"],
        completionCriteria: [
          { id: "dh-cc-3-1", label: "Successfully test with 50 active beta testers", isComplete: true },
          { id: "dh-cc-3-2", label: "Perform full audit of database security policies", isComplete: false }
        ],
        milestones: [
          {
            id: "dh-m-3-1",
            phaseId: "dh-phase-3",
            title: "Beta deployment to staging",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-07-01",
            completedDate: "2026-06-30",
            order: 1
          },
          {
            id: "dh-m-3-2",
            phaseId: "dh-phase-3",
            title: "Security regression tests",
            status: "In progress" as MilestoneStatus,
            priority: "Critical",
            targetDate: "2026-07-15",
            order: 2
          }
        ]
      },
      {
        id: "dh-phase-4",
        projectId: "devhabits",
        title: "Phase 4 — Deploy & Launch",
        description: "Prepare assets for Product Hunt, finalize landing pages, and launch.",
        order: 4,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-07-21",
        targetDate: "2026-07-25",
        isCurrent: false,
        dependencies: ["dh-phase-3"],
        completionCriteria: [],
        milestones: []
      }
    ],
    repopilot: [
      {
        id: "rp-phase-1",
        projectId: "repopilot",
        title: "Phase 1 — Parser & Scanner",
        description: "Create standard Node.js AST parsers to inspect projects, identify licenses, and map dependencies.",
        order: 1,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-03-15",
        targetDate: "2026-04-15",
        completedDate: "2026-04-14",
        isCurrent: false,
        dependencies: [],
        completionCriteria: [],
        milestones: [
          {
            id: "rp-m-1-1",
            phaseId: "rp-phase-1",
            title: "Implement file system recursive walker",
            status: "Completed" as MilestoneStatus,
            priority: "Medium",
            targetDate: "2026-03-30",
            completedDate: "2026-03-29",
            order: 1
          }
        ]
      },
      {
        id: "rp-phase-2",
        projectId: "repopilot",
        title: "Phase 2 — Gemini Integration",
        description: "Inject scanned repository data into Gemini API to auto-generate markdown readmes.",
        order: 2,
        status: "In progress" as PhaseStatus,
        progress: 70,
        startDate: "2026-04-16",
        targetDate: "2026-05-15",
        isCurrent: true,
        dependencies: ["rp-phase-1"],
        completionCriteria: [],
        milestones: [
          {
            id: "rp-m-2-1",
            phaseId: "rp-phase-2",
            title: "Integrate @google/genai SDK on backend",
            status: "Completed" as MilestoneStatus,
            priority: "Critical",
            targetDate: "2026-04-30",
            completedDate: "2026-04-28",
            order: 1
          }
        ]
      },
      {
        id: "rp-phase-3",
        projectId: "repopilot",
        title: "Phase 3 — CLI Engine",
        description: "Build a standalone CLI binary with Commander.js, packaged with local runtimes.",
        order: 3,
        status: "Paused" as PhaseStatus,
        progress: 20,
        startDate: "2026-05-16",
        targetDate: "2026-06-15",
        isCurrent: false,
        dependencies: ["rp-phase-2"],
        completionCriteria: [],
        milestones: [
          {
            id: "rp-m-3-1",
            phaseId: "rp-phase-3",
            title: "Commander scaffold integration",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-05-25",
            completedDate: "2026-05-24",
            order: 1
          }
        ]
      },
      {
        id: "rp-phase-4",
        projectId: "repopilot",
        title: "Phase 4 — Github Action Integration",
        description: "Package the scanner CLI into a reusable custom GitHub Action template.",
        order: 4,
        status: "Planned" as PhaseStatus,
        progress: 0,
        startDate: "2026-06-16",
        targetDate: "2026-06-30",
        isCurrent: false,
        dependencies: ["rp-phase-3"],
        completionCriteria: [],
        milestones: []
      }
    ],
    campuscanteen: [
      {
        id: "cc-phase-1",
        projectId: "campuscanteen",
        title: "Phase 1 — Backend Architecture & DB",
        description: "Design MongoDB schemas for food items, customer accounts, order logs, and transaction tables.",
        order: 1,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-01-10",
        targetDate: "2026-02-10",
        completedDate: "2026-02-09",
        isCurrent: false,
        dependencies: [],
        completionCriteria: [],
        milestones: [
          {
            id: "cc-m-1-1",
            phaseId: "cc-phase-1",
            title: "Deploy Node/Express server API endpoints",
            status: "Completed" as MilestoneStatus,
            priority: "High",
            targetDate: "2026-01-25",
            completedDate: "2026-01-24",
            order: 1
          }
        ]
      },
      {
        id: "cc-phase-2",
        projectId: "campuscanteen",
        title: "Phase 2 — Real-time pre-ordering UI",
        description: "Code native app screens with React Native, displaying reactive item menus.",
        order: 2,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-02-11",
        targetDate: "2026-03-10",
        completedDate: "2026-03-09",
        isCurrent: false,
        dependencies: ["cc-phase-1"],
        completionCriteria: [],
        milestones: []
      },
      {
        id: "cc-phase-3",
        projectId: "campuscanteen",
        title: "Phase 3 — Digital Payment Integration",
        description: "Integrate Razorpay SDK, secure banking handshakes, and receipt generators.",
        order: 3,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-03-11",
        targetDate: "2026-04-10",
        completedDate: "2026-04-09",
        isCurrent: false,
        dependencies: ["cc-phase-2"],
        completionCriteria: [],
        milestones: []
      },
      {
        id: "cc-phase-4",
        projectId: "campuscanteen",
        title: "Phase 4 — Maintenance & Scale",
        description: "Monitor server metrics, handle off-peak hours scale-downs, and optimize database queries.",
        order: 4,
        status: "Completed" as PhaseStatus,
        progress: 100,
        startDate: "2026-04-11",
        targetDate: "2026-04-15",
        completedDate: "2026-04-15",
        isCurrent: true,
        dependencies: ["cc-phase-3"],
        completionCriteria: [
          { id: "cc-cc-4-1", label: "Track active server loads weekly", isComplete: true }
        ],
        milestones: [
          {
            id: "cc-m-4-1",
            phaseId: "cc-phase-4",
            title: "Establish daily database backups",
            status: "Completed" as MilestoneStatus,
            priority: "Medium",
            targetDate: "2026-04-12",
            completedDate: "2026-04-12",
            order: 1
          }
        ]
      }
    ]
  };
};

// Generates fallback roadmap for any project slug/id
export const getFallbackRoadmap = (projectId: string, name: string): ProjectPhase[] => {
  return [
    {
      id: `${projectId}-fallback-phase-1`,
      projectId: projectId,
      title: "Phase 1 — Inception & Analysis",
      description: `Establish core parameters, requirements, and functional scopes for ${name}.`,
      order: 1,
      status: "Completed" as PhaseStatus,
      progress: 100,
      startDate: "2026-01-01",
      targetDate: "2026-02-01",
      completedDate: "2026-01-28",
      isCurrent: false,
      dependencies: [],
      completionCriteria: [
        { id: `${projectId}-cc-f-1`, label: "Draft project description and scope limits", isComplete: true }
      ],
      milestones: [
        {
          id: `${projectId}-m-f-1`,
          phaseId: `${projectId}-fallback-phase-1`,
          title: "Finalize high-level objectives",
          status: "Completed" as MilestoneStatus,
          priority: "High",
          targetDate: "2026-01-15",
          completedDate: "2026-01-12",
          order: 1
        }
      ]
    },
    {
      id: `${projectId}-fallback-phase-2`,
      projectId: projectId,
      title: "Phase 2 — Implementation & Delivery",
      description: `Execute core engineering items and implement baseline modules for ${name}.`,
      order: 2,
      status: "In progress" as PhaseStatus,
      progress: 25,
      startDate: "2026-02-02",
      targetDate: "2026-06-30",
      isCurrent: true,
      dependencies: [`${projectId}-fallback-phase-1`],
      completionCriteria: [
        { id: `${projectId}-cc-f-2-1`, label: "Establish core user interface structures", isComplete: false },
        { id: `${projectId}-cc-f-2-2`, label: "Validate responsive layouts", isComplete: false }
      ],
      milestones: [
        {
          id: `${projectId}-m-f-2-1`,
          phaseId: `${projectId}-fallback-phase-2`,
          title: "Build frontend prototype panels",
          status: "In progress" as MilestoneStatus,
          priority: "Critical",
          targetDate: "2026-04-30",
          order: 1
        },
        {
          id: `${projectId}-m-f-2-2`,
          phaseId: `${projectId}-fallback-phase-2`,
          title: "Configure data routing connectors",
          status: "Pending" as MilestoneStatus,
          priority: "Medium",
          targetDate: "2026-05-30",
          order: 2
        }
      ]
    },
    {
      id: `${projectId}-fallback-phase-3`,
      projectId: projectId,
      title: "Phase 3 — Launch & Maintenance",
      description: "Deploy compiled artifacts, configure performance monitors, and prepare the project handoff files.",
      order: 3,
      status: "Planned" as PhaseStatus,
      progress: 0,
      startDate: "2026-07-01",
      targetDate: "2026-09-30",
      isCurrent: false,
      dependencies: [`${projectId}-fallback-phase-2`],
      completionCriteria: [],
      milestones: []
    }
  ];
};
