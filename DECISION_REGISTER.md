# Decision Register: ProjectDock

## DR-01: Light-Mode-Only Approach
* **Decision:** We built the design system strictly around a warm light mode, omitting a toggled dark mode entirely.
* **Reasoning:** In line with user instructions, developer command centers must prioritize clarity and visual comfort over typical neon SaaS models. High-contrast cream bases reduce eye fatigue during sustained coding sessions while ensuring consistent aesthetic styling across future product pages.
* **Status:** Implemented.

## DR-02: Color Accent & Contrast Strategy
* **Decision:** Selected a rich Blue-Violet / Indigo accent (`#5f5af6`), paired with a deep charcoal text body (`#1a1a1a`), on a subtle off-white warm canvas (`#fdfdfc`).
* **Reasoning:** Blue-violet communicates technical capability and precision, avoiding generic blue SaaS templates. Utilizing charcoal instead of solid black creates a softer layout.
* **Status:** Implemented.

## DR-03: Typography Selections
* **Decision:** Imported and mapped **Inter** for regular user interfaces, **Space Grotesk** for prominent headers/display fields, and **JetBrains Mono** for developer metadata and monospace attributes.
* **Reasoning:** 
  * Inter offers unmatched legibility for small lists and labels.
  * Space Grotesk adds a modern, tech-forward feel to hero areas.
  * JetBrains Mono highlights terminal-like properties, paths, and build statuses.
* **Status:** Implemented.

## DR-04: Lightweight State-Based Client-Side Router
* **Decision:** Built a custom pathname State Router and custom `<Link>` click interceptor at `src/lib/router.tsx` instead of adding third-party routing packages.
* **Reasoning:** Avoids dependency bloat and any potential React 19 package mismatch. It synchronizes state directly with the browser's native `window.location.pathname` and properly handles `popstate` events.
* **Status:** Superseded by DR-08.

## DR-05: Absolute Native Variable Theme Declaring (Tailwind v4)
* **Decision:** Mapped design tokens inside Tailwind CSS v4 `@theme` block in `src/index.css` rather than setting up standard `tailwind.config.js`.
* **Reasoning:** Tailwind CSS v4 eliminates configuration files, preferring native CSS custom properties. Declaring colors, shadow indexes, and radii under `@theme` allows them to compile directly to CSS classes automatically.
* **Status:** Implemented.

## DR-06: Animation Standards via `motion/react`
* **Decision:** Used `motion` from `motion/react` (Framer Motion v12 package signature) for all transition layers.
* **Reasoning:** Mapped to user constraints. All entrances use rapid spring-easing damping transitions, avoiding slow, distracting swoops that reduce productivity. Respects standard browser media rules for reduced motion.
* **Status:** Implemented.

## DR-07: Retaining Vite as Permanent Frontend Architecture
* **Decision:** Retain Vite and React 19 as the permanent client-side architecture for ProjectDock, explicitly avoiding a migration to Next.js or full-stack SSR frameworks.
* **Reasoning:** ProjectDock functions as a dense, private single-user developer workspace. It does not require search engine optimization (SEO), server-side rendering (SSR), or public-facing marketing headers, meaning a pure Vite client-side bundle delivers maximum load performance, zero server lag, and optimal build simplicity.
* **Status:** Approved & Standardized.

## DR-08: Selecting React Router for Robust Client Navigation
* **Decision:** Replace the custom popstate pathname router (DR-04) with `react-router-dom` v7.
* **Reasoning:** As ProjectDock scales into dynamic projects and settings, standard routing features like nested routes, wildcard matchers (`*` 404s), query parameters, dynamic URL segments (`/projects/:projectId`), and browser history synchronization become critical. Migrating to standard React Router provides a stable, enterprise-grade navigation engine with no unnecessary custom abstractions.
* **Status:** Implemented.

## DR-09: Accessible Overlay Focus Trapping & Restoration
* **Decision:** Build lightweight, native focus trapping and focus restoration hooks inside the `Dialog` and `Sheet` overlay components.
* **Reasoning:** Overlays must meet accessibility standards: closing on Escape, trapping the `Tab` loop within the modal to prevent focus bleeding into back-layer elements, and restoring browser focus back to the triggering button upon dismissal. Rather than installing a massive component framework, a vanilla React hook leveraging DOM event listeners and active-element caching satisfies this perfectly with zero dependency overhead.
* **Status:** Implemented.

## DR-10: Persistent Collapsible Sidebar Prefs
* **Decision:** Store the expanded vs. collapsed desktop sidebar state inside the client browser's `localStorage` (key: `projectdock:sidebar-collapsed`) and load it synchronously during React layout initialization.
* **Reasoning:** Supports rapid multi-page layout transitions without visual jumping or state-restoration delay. Checking and setting this value client-side prevents any server-side mismatches (which is safe as ProjectDock is a client-side SPA).
* **Status:** Implemented in Phase 2.

## DR-11: Responsive Mobile Menu Sheet Routing
* **Decision:** Swap the desktop sidebar for a compact sticky mobile app header at viewport widths below `768px`. The header triggers navigation via the focus-trapped `<Sheet />` slide-out drawer from the left edge.
* **Reasoning:** Avoids redundant mobile tab-bar spacing clutter, reserving precious screen real estate for future project metrics while keeping navigation completely accessible and visually lightweight.
* **Status:** Implemented in Phase 2.

## DR-12: Separated Standalone Design System Showcase
* **Decision:** Keep the `/design-system` component showcase page as a separate, unconstrained route outside the primary main application shell.
* **Reasoning:** Allows developers and designers to audit UI buttons, inputs, dialogs, and sheets without layout padding constraints, background overlay structures, or sidebar margins getting in the way of high-fidelity visual checks.
* **Status:** Implemented in Phase 2.

## DR-13: Shell-Level Informational Utility Toasts
* **Decision:** Bind desktop Search, Create, and Notification buttons in the main shell to distinct, friendly `useToast` actions instead of blank inactive click-states or fully developed popups.
* **Reasoning:** Adheres to Scope Discipline: provides clear functional feedback indicating that these cross-module features are intentionally deferred for subsequent implementation phases, avoiding UI silence or unnecessary visual clutter.
* **Status:** Implemented in Phase 2.

## DR-14: Action-First Dashboard Hierarchy
* **Decision:** Design the `/` route dashboard following a distinct hierarchical flow: Current Focus (highest emphasis), Workspace Summary Metrics, Active Projects, Upcoming Tasks (medium emphasis), and supporting panels for Attention warnings, Portfolio Distribution, and chronological Activity Logs.
* **Reasoning:** This layout presents a highly cohesive, calm command console optimized for a single developer. The most critical item (what's being worked on now) gets full-width attention, followed by numerical status checks, and finally dense lists of operational detail.
* **Status:** Implemented in Phase 3.

## DR-15: Compact Metrics over Large KPI Cards
* **Decision:** Render workspace totals (Active Projects, Due Soon, Blocked, Completed) inside highly compact metrics widgets (`SummaryMetric`) rather than standard oversized marketing-style KPI counters.
* **Reasoning:** Avoids visual noise and keeps information density high. This matches the professional software-craftsman aesthetic where micro-indicators tell a deeper story.
* **Status:** Implemented in Phase 3.

## DR-16: Native HTML/CSS Lifecycle Distribution (No Charting Dependency)
* **Decision:** Formulate the project status lifecycle group (Building, Planning, Testing, Deployed, Paused) with a custom, beautifully segmented horizontal bar using standard HTML, flex widths, and Tailwind CSS borders/colors, instead of installing an external charting library.
* **Reasoning:** Eliminates unnecessary package weight, prevents potential compilation mismatches under React 19, and keeps rendering performance extremely high. Hover interactions and status counts serve the exact visual metric purpose cleanly.
* **Status:** Implemented in Phase 3.

## DR-17: Separated Static Mock Data Models
* **Decision:** Decouple all mock dataset records from the page rendering templates, placing them in a strongly typed standalone file (`src/data/dashboard.ts`) mapped to central interfaces in `src/types.ts`.
* **Reasoning:** Keeps dashboard components modular and clean. Separating data from view logic simplifies future API refactor passes once persistent cloud databases (like Supabase or Firestore) are connected.
* **Status:** Implemented in Phase 3.

## DR-18: Dynamic In-Memory Directory State Manager
* **Decision:** Implement Projects Directory creation, setting edits, duplication, and archive/restore state management purely inside a centralized client-side hook (`useProjectsState.ts`) using React `useState` and standard JavaScript collection modifiers.
* **Reasoning:** Since cloud database persistent backends are deferred for future development, a structured React state manager provides full interactive fidelity of these workflows without introducing unapproved local storage mocks or database SDK complexity prematurely.
* **Status:** Implemented in Phase 4.

## DR-19: Deferring Permanent Project Deletion
* **Decision:** Intentionally omit and remove the active `deleteProject` mutation and confirmation dialog from the current in-memory Projects Directory. Replace the active action in dropdown menus with a visually restrained informational option that displays a toast detailing deferral until database persistence exists.
* **Reasoning:** Deleting projects permanently without a persistent database risks data-loss confusion upon simple browser refreshes, and lacks proper backing referential constraint validations. Keeping it as an informational toast maintains visual completeness of the engineering directory while respecting proper backend architectural sequencing.
* **Status:** Implemented in Phase 4.1.

## DR-20: Nested Route Architecture for Project Workspaces
* **Decision:** Refactor the `/projects/:projectId` route into a nested structure with standard `react-router-dom` child routes (index/Overview, Tasks, Roadmap, Knowledge, Prompts, Resources, Activity) sharing a single `<ProjectWorkspaceLayout />`.
* **Reasoning:** Promotes high structural modularity, eliminates duplicate layout codes, and maintains the active status of the "Projects" sidebar across all project-specific sections natively.
* **Status:** Implemented in Phase 5.

## DR-21: Shared Data Composition Strategy
* **Decision:** Retain original core models in `src/data/projects.ts` and declare supplementary workspace-specific detail fields (objective, completion criteria, risks, featured metrics) inside `src/data/project-workspaces.ts`, fusing them dynamically.
* **Reasoning:** Prevents duplicated core state data (e.g. name, priority, progress, dates) and models a realistic relational backend join query (e.g., SELECT * FROM projects JOIN project_workspaces).
* **Status:** Implemented in Phase 5.

## DR-22: Read-Only Workspace Interactions
* **Decision:** Enforce read-only state rules within the individual workspace. Clicking editing prompts triggers navigation hints pointing to the Projects Directory, and workspace action triggers are mapped to descriptive toast notifications.
* **Reasoning:** Since the current data layer is local and in-memory, duplicating edit mutation logic inside the workspace introduces high state-split synchronization complexity and is out-of-scope for the overview presentation.
* **Status:** Implemented in Phase 5.

## DR-23: Archive & Unknown Slug Handler
* **Decision:** Formulate visually distinct notices for archived projects (presenting a frozen read-only warning banner) and design a beautiful standalone Project Not Found dashboard for invalid route parameters.
* **Reasoning:** Safeguards the application against broken layout states or silent, confusing route redirects, improving visual resilience.
* **Status:** Implemented in Phase 5.

## DR-24: Read-Only Workspace Scope Correction
* **Decision:** Converted all lingering interactive or edit-implying elements within the individual workspace to strictly read-only informational actions. Renamed the "Edit Settings" button on the workspace header to "Project Actions" and replaced its functional toasts with a beautiful, fully read-only **Project Actions & Info Slide-out Drawer** (Sheet) containing copyable paths, slug coordinates, read-only metadata parameters, and core navigation actions.
* **Reasoning:** Enforces strict compliance with Phase 5.1 read-only scope guidelines, preventing users from making unbacked edits to status, priority, or details, while providing helpful, accessible technical coordinates (such as project slug, safe local paths, and code metadata) in a structured and elegant layout.
* **Status:** Implemented in Phase 5.1.

## DR-25: Temporary In-Memory Task State (Phase 7)
* **Decision:** Implement task management state entirely in-memory using React state encapsulated inside a reusable, project-scoped controller hook (`useProjectTasks.ts`).
* **Reasoning:** Meets strict constraints to exclude `localStorage`, persistent server DBs, or external APIs. Using a shared, in-memory object cache allows data to persist seamlessly during tab-level navigations while discarding all changes on a browser refresh.
* **Status:** Implemented in Phase 7.

## DR-26: Double-View Responsive Tasks Layout
* **Decision:** Built a flexible List view and bento-style Kanban Board view, toggleable from a single toolbar. On smaller viewport sizes, columns overflow horizontally with touch scrolling, and inline selects are packed into an accessible filter Sheet drawer.
* **Reasoning:** Avoids table overflows and layout spilling, providing optimal data density. Keyboard-friendly navigation is preserved using the customized Sheet overlay and explicit status selectors.
* **Status:** Implemented in Phase 7.

## DR-27: Dynamic Roadmap Phase Linkage & Validation
* **Decision:** Tasks can be linked to active sequential phases of the project roadmap. If a phase is deleted or missing, the task UI prints `"Unassigned phase"` rather than crashing. Blocked tasks require a blocker reason on form submission.
* **Reasoning:** Integrates Phase 7 task management with Phase 6 roadmap data while providing resilient, fail-safe rendering of mismatched relations.
* **Status:** Implemented in Phase 7.

## DR-28: Archived Project Task Protection
* **Decision:** Freeze editing capabilities, tasks creation, duplication, and deletion for archived projects. The view remains open to search, filter, and inspect task details, while hiding all mutating buttons.
* **Reasoning:** Preserves architectural consistency, ensuring archived projects remain frozen read-only snapshots.
* **Status:** Implemented in Phase 7.

## DR-29: Structured In-Memory Knowledge State (Phase 8)
* **Decision:** Implement the Phase 8 knowledge base state strictly in-memory using a central project-scoped state manager hook (`useProjectKnowledge.ts`) backed by pre-seeded mock records inside `/src/data/project-knowledge.ts`.
* **Reasoning:** Meets strict guidelines forbidding `localStorage`, local cookies, external APIs, and persistent database stacks inside this phase. Storing mutated states inside a module-level dictionary preserves modified notes, decisions, and error logs during in-app navigation between sidebar tabs while performing clean resets on browser refresh.
* **Status:** Implemented in Phase 8.

## DR-30: Type-Specific Layout Structures and Custom Text Compiling
* **Decision:** Dynamically adapt detailed slide-out displays (`KnowledgeEntryDetails.tsx`) and form layouts (`KnowledgeEntryForm.tsx`) depending on the selected Entry Type. Implement a fully safe, native Markdown-to-React parsing helper rather than adding heavy external rich-text editor packages.
* **Reasoning:** Keeps form inputs highly relevant (e.g. decision statements and consequences for Decisions; stack traces, root causes, and prevention notes for Errors) and prevents unrequested bundle weight. The safe markdown-to-React text compiler parses headings (`#`, `##`, `###`) and bullets without using dangerous rendering methods (avoiding raw unsafe HTML).
* **Status:** Implemented in Phase 8.

## DR-31: Dynamic Cross-Entity Relations & Safe Lookups
* **Decision:** Allow knowledge entries to reference exactly one active roadmap phase or one active project task. The rendering layer lookup dynamically resolves titles instead of displaying raw IDs. If a referenced phase or task is deleted or unpopulated, the card prints `"Referenced item unavailable"` instead of crashing.
* **Reasoning:** Provides tight cross-entity visual integration without writing to or mutating other modules, while ensuring total runtime resilience if referenced roadmap elements are modified or deleted.
* **Status:** Implemented in Phase 8.

## DR-32: Archived Project read-only Lock on Knowledge
* **Decision:** Lock down the knowledge workspace on archived projects, making all wiki nodes, decisions, and error logs strictly read-only. Allow searching, filtering, and copying safe text strings, while hiding creation buttons, edit actions, duplicate controls, deletion buttons, and status modifications.
* **Reasoning:** Strictly conforms to read-only specifications for frozen projects, protecting project history while preserving exploration and diagnostic copy utilities.
* **Status:** Implemented in Phase 8.

## DR-33: Command Palette Visual Consistency
* **Decision:** Re-aligned the Command Palette (Command/Ctrl + K overlay) with ProjectDock's light-mode design system by replacing glass-heavy dark surfaces with warm, off-white or white surfaces (`bg-surface`), a fine neutral border (`border-border-subtle`), subtle floating shadow (`shadow-floating`), soft selected-result background (`bg-accent-soft`), clear charcoal text (`text-text-primary`), and a dimmed translucent page overlay (`bg-black/25` with no backdrop blur).
* **Reasoning:** Conforms to Phase 11.1 requirements, ensuring total aesthetic harmony with the rest of ProjectDock's high-contrast, cream-based technical control layouts, preventing dark-mode and glassmorphism inconsistency.
* **Status:** Implemented in Phase 11.1.




