# Project Context: ProjectDock

## Product Name
**ProjectDock**

## Product Positioning
**A personal engineering workspace for planning, building, documenting, and shipping every project from one place.**

## Product Purpose
ProjectDock serves as a highly crafted productivity dashboard and control room for individual developers. Instead of scattering task managers, decision journals, code metrics, documentation links, and deploy logs across distinct browser tabs and SaaS products, ProjectDock provides a centralized command station.

## Primary User
* **Individual Software Engineers:** Single-user workspace focused on speed, dense terminal-style organization, keyboard commands, visual momentum, and structural clarity.

## Technology Stack
* **Vite + React 19:** Optimized client-side Single Page Application (SPA).
* **TypeScript:** Absolute type safety for component APIs and state schemas.
* **Tailwind CSS v4:** Meticulous global styling tokens mapped directly inside `src/index.css` via native variables.
* **React Router:** Professional routing engine supporting client navigation, nested and dynamic views, query parameters, layouts, and robust 404 handling.
* **Framer Motion:** High-performance sliding tabs, responsive alerts, and transition animations via `motion/react`.
* **Lucide React:** Iconography used uniformly.

## Architectural Justification
ProjectDock permanently uses Vite and React Router as its core frontend architecture. This choice was selected because ProjectDock is initially designed as a private, client-rendered engineering workspace. It does not require server-side rendering (SSR), dynamic edge loading, or public SEO optimizations, making a lean client-side Vite + React Router architecture exceptionally fast, modular, and simple to maintain.

## Design & Visual Direction
* **Theme:** Refined Light-Mode-Only interface.
* **Colors:** Warm off-white page background (`#fdfdfc`), elevated crisp-white container surfaces (`#ffffff`), deep charcoal body text (`#1a1a1a`), and a controlled indigo accent (`#5f5af6`).
* **Sizing & Spacing:** Compact and efficient padding following professional design scales.
* **Radius System:** Restrained corner rounding to highlight a crisp, technical product layout.

## Current Implementation Phase
* **Phase 8: Project Knowledge & Decisions:** Completed high-fidelity interactive wiki records, ADR decision registers, and error-solution diagnostic logs linked directly to roadmap phases and tasks. Integrates custom state managers, adaptive detail views, secure custom markdown compilers, and full read-only safety locks for archived repositories.

## Projects Directory & Information Hierarchy
1. **Portfolio Metrics Strip:** Displays five compact, stable KPI indicators (Active Projects, On Track, Needs Attention, Blocked, Archived) calculated using the complete in-memory portfolio collection (unaffected by quick-search inputs).
2. **Dynamic Search & Filters:** Supports quick search by name, description, category, and tech stack. Features dropdown selectors for project status, health, priority, category, and archive visibility scope. Includes active query chips and matching result counts displayed directly in the search field.
3. **Responsive Visual Layouts:** Grid view with rich visual badges, progress meters, and dynamic menus; List view with high-density tabular metadata for advanced developers.
4. **Interactive Modal Workflows:** Dialog forms for creating new engineering workspaces, editing metadata/timelines/tech goals, and confirming archiving operations.
5. **Contextual Action Menus:** Actions to edit, duplicate, archive, or restore projects. Selecting "Delete project" displays an informational toast alerting the user that permanent deletion is deferred until a persistent database is established.

## Mock-Data Status
All data is statically initialized inside `src/data/projects.ts` using strongly typed model schemas from `src/types.ts`. Dynamic updates (creation, editing, duplication, archiving, and restoration) are processed cleanly in an in-memory React state via custom hooks (`useProjectsState`), maintaining layout synchronization between the dashboard and projects pages.

## App Shell & Routing Model
* **Collapsible Desktop Sidebar:** Transition-smooth panel with a width of `264px` (expanded) or `72px` (collapsed). Houses product branding, static workspace ownership ("Manoj Pawar"), primary links, and a user profile dropdown. State is saved directly in client `localStorage` for cross-session persistence.
* **Mobile Navigation Header:** Stays sticky at the viewport top on mobile screens. Swaps the sidebar for a responsive menu button that opens the fully accessible `<Sheet />` menu, supporting key navigation items, user details, and direct links to the design system.
* **Main Content Area:** Constrained readable page widths (max width `5xl` centered) with fluid responsive gutters, ensuring the interface remains dense and technical without horizontal overflow.
* **Global Utility Actions:** Fixed desktop utility top-bar presenting icon-only Search, Create, and Notifications controls with accessible tooltips and clear informational toast prompts.

## Active Route Architecture
* `/` — **Overview Dashboard:** Landing portal displaying workspace identity, phase status markers, design-system index, and Phase 3 Overview telemetry teaser.
* `/projects` — **Projects Directory:** Highly polished responsive engineering directory for search, filters, creation, duplication, and archive controls.
* `/projects/:projectId` — **Project Detail Shell:** Dedicated nested project workspace layout wrapping all sub-pages.
  * `/projects/:projectId/` (index) — **Overview Page:** Premium read-focused dashboard detailing technical objectives, checklists, health, risk factors, coordinates, and upcoming actions.
  * `/projects/:projectId/tasks` — **Project Tasks Planner:** High-density list and kanban lanes with blocker alerts, priorities, labels, and linked roadmap phases.
  * `/projects/:projectId/roadmap` — **Project Roadmap Planner:** Interactive milestones dependency calendar, timeline index, and sequential phases scheduler.
  * `/projects/:projectId/knowledge` — **Project Knowledge Base:** High-density engineering wiki notes, ADR (Architecture Decision Records) entries, and diagnostic error-solution logs.
  * `/projects/:projectId/prompts` — **Prompts Placeholder:** System prompts and AI engineering library placeholder.
  * `/projects/:projectId/resources` — **Resources Placeholder:** Structured external links catalog placeholder.
  * `/projects/:projectId/activity` — **Activity Placeholder:** Chronological remote activity streams placeholder.
* `/tasks` — **Global Task Planner:** Universal task and sprint coordination board.
* `/prompts` — **Prompt Library:** Centralized repository for structured JSON AI templates.
* `/knowledge` — **Knowledge Base:** System architecture wiki and decision journals.
* `/settings` — **Workspace Preferences:** Local environment control preferences.
* `/design-system` — **Design System Showcase:** Kept as an unconstrained, standalone view outside the shell.

## Individual Project Workspace (Phase 5)
* **Objective:** Replace placeholder project pages with a high-fidelity, read-focused workspace. Provides deep architectural understanding of single workspaces: objectives, milestones, priorities, diagnostics, tech stacks, and chronological timelines.
* **Composition Layer:** Blends existing core attributes (name, category, status, health, priority, progress, dates) in `src/data/projects.ts` with supplementary fields (objectives, checklists, activity logs, future roadmaps) in `src/data/project-workspaces.ts`. High-fidelity fallback metrics are generated dynamically for minor projects.
* **Unknown & Archive Handling:** Visually prominent notices flag frozen archived repositories and disable active controls, while unknown slugs or invalid IDs trigger a polished 404 project-not-found dashboard.
* **Module Deferrals:** Features like actionable task boards, roadmap milestones editing, and event logging are represented by high-fidelity, project-contextual placeholders indicating their future integration phases.

## Explicitly Excluded Features (Deferred to Future Stages)
* **Persistent Database Syncing:** Cloud database persistence (Supabase, Firebase, or PostgreSQL) remains out of scope for the current local-first UI.
* **Permanent Project Deletion:** Functional permanent project deletion is deferred until database-level referential integrity and user policies are established in Phase 5.
* **User Authentication:** Multi-user accounts, auth flows, and session tokens are excluded (ProjectDock remains a private, local-first single-user dashboard).
* **Automated Notification Streams:** Background pushes and live file-system hooks are deferred.
