---
title: "Epics & Stories"
date: "2026-02-23"
status: "WIP"
artifact_type: "doc"
domain:
  - "Developer Tooling"
  - "Portfolio"
  - "Product Management"
tech_stack:
  - "Next.js"
  - "TypeScript"
  - "Tailwind CSS"
description: "Complete epic and story breakdown for the {{PROJECT_NAME}} roadmap."
parent_project: "plan-spec-build-workshop"
stepsCompleted: [1]
inputDocuments: [
  "_bmad-output/planning-artifacts/prd.md",
  "_bmad-output/planning-artifacts/architecture.md",
  "_bmad-output/planning-artifacts/ux-design-specification.md",
  "_bmad-output/planning-artifacts/ux-full-page-mockup.html"
]
---

# {{PROJECT_NAME}} - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for {{PROJECT_NAME}}, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- **FR1:** The System must dynamically ingest and parse markdown folders added to the repository to publish new projects without UI code changes.
- **FR2:** The System must parse project metadata (e.g., Domain, Tech Stack) via frontmatter configuration.
- **FR3:** The System must ingest distinct artifact types (agents, docs, prototypes) and route them to the correct structural column.
- **FR4:** The System can parse standard markdown elements (headers, lists, bold/italics), specifically GitHub-flavored markdown (tables, code blocks).
- **FR5:** The System must display projects and their artifacts in a 3-column layout (Agent Studio, Blueprints, Build Lab).
- **FR6:** The application must utilize client-side rendering for filter changes to prevent full-page reloads and maintain the Command Center context (sub-100ms per NFR2).
- **FR7:** (Deferred to v2) The MVP targets desktop only (≥1024px). Mobile/tablet responsive layout will be designed and implemented in Phase 2.
- **FR8:** The User can toggle between Light and Dark interface modes.
- **FR9:** The User can filter the portfolio view by "Project".
- **FR10:** The User can filter the portfolio view by "Functional Domain" (e.g., Internal Tools, B2B SaaS).
- **FR11:** The User can filter the portfolio view by "Tech Stack" (e.g., Python, React).
- **FR12:** The User can view "at a glance" summary metadata on all project and artifact cards prior to clicking them.
- **FR13:** The User can navigate directly from a specific prototype back to its accompanying documentation via explicit intra-linking.
- **FR14:** The User can access an "About this Project" educational page from the global navigation.
- **FR15:** The User can access a "Fork a Workshop" link to copy the underlying repository template.
- **FR16:** The System must present the portfolio itself ("{{PROJECT_NAME}}") as the first selectable project (The Meta-Blueprint).
- **FR17:** The User can view all portfolio content (projects, blueprints, prototypes) without requiring authentication or an account.
- **FR18:** (Deferred to v2) The System will support basic usage telemetry (e.g., Vercel Analytics) to validate the "Evaluator" user journey (tracking document views vs. prototype launches).
- **FR19:** The System must support shared Agent Studio items associated with zero or more projects via a `projects` frontmatter array, without file duplication. Agents without a `projects` field are hidden when a project filter is active.
- **FR20:** The Author can define display order of Agent Studio cards, Blueprint documents, Build Lab cards, and project filter pills via a central `sort-config.yaml` manifest.

### NonFunctional Requirements

- **NFR1:** First Contentful Paint (FCP) must occur within 1.0 second on a standard 4G connection.
- **NFR2:** Client-side routing between the three main columns must complete in under 100 milliseconds.
- **NFR3:** The application must achieve a Google Lighthouse Performance score of 90+.
- **NFR4:** The application must strictly adhere to WCAG 2.1 Level AA conformance.
- **NFR5:** The application must achieve a Google Lighthouse Accessibility score of 95+ (verifying contrast ratios, ARIA labels, and keyboard navigability).
- **NFR6:** The system must support automated deployments triggered directly from git push events without manual server configuration.
- **NFR7:** System uptime will rely entirely on the chosen edge hosting provider's SLA (e.g., Vercel's 99.99% edge network uptime), requiring no dedicated backend container management.
- **NFR8:** The application must achieve a Google Lighthouse SEO score of 90+.
- **NFR9:** Full site rebuild (SSG) must complete in under 60 seconds with up to 20 projects.

### Additional Requirements

#### Technical & Infrastructure Constraints

- **Starter Template:** Official Next.js (15) app router with TypeScript, Tailwind CSS v4, and shadcn/ui. Initialize with `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` and `npx shadcn@latest init`.
- **Infrastructure:** Vercel for zero-config deployments. No database layer; git repository functions as the CSM. Global URL state (`?project=`, `?domain=`, `?tech=`, `?document=`) coordinates UI filtering cross-components.

#### Structural Integrity Constraints

- **Directory Boundaries:** Markdown parsed from root `/content/` utilizing `<project>/docs|prototypes` folders and `_shared/agents/` for shared Agent Studio items. No logic inside content.
- **Architecture Validation:** Strict reliance on Zod validation for Frontmatter fields defined in `schema.ts`.
- **Missing Content Fallbacks:** Next.js `notFound()` boundaries and Zod partial failures map to customized `[Error]` fallback states instead of 500 crashes. Empty rows use standard `[Concept]` dashed borders instead of generic copy.

#### UI Component Architecture

- **Component Model:** Universal Compound Card (`ProjectCard`) handles layout for all three columns. `DashboardGrid` wrapper maintains the CSS grid structure.
- **UX Mockup Implementation:** Pixel-perfect alignment with `ux-full-page-mockup.html`. Must implement the static header with icons targeting moon and info mappings. Filter bar must implement the exact pill variants (`filter-pill`, `chip-toggle`) aligned identically.

#### Interactive Command Center Experience (UX Constraints)

- **Focus & Routing Mechanics:** "Focus Mode" enables auto-expanding of document rows without modal usage. "Clear Filter" button explicitly dismisses project-scoped context to resume "Browse Mode".
- **Typography & Theme:** "Tinted Neutrality" dark mode base using Zinc grayscale. "Linear Purist" aesthetic mapping `bg-zinc-950` with highly readable font hierarchy (Inter). 
- **Color Discipline:** Muted color usage restricted purely to standard Status Pills (Live, WIP, Concept, Archived). Primary `bg-blue-600` strictly reserved for the external Rocket CTA in prototypes.

### FR Coverage Map

- **FR1:** Epic 1 - CMS ingestion parses markdown folders into projects without UI code.
- **FR2:** Epic 1 - Frontmatter metadata parsing logic.
- **FR3:** Epic 1 - Ingestion routes artifacts (agents, docs, prototypes) to columns.
- **FR4:** Epic 1 - System parses standard and GitHub-flavored markdown.
- **FR5:** Epic 2 - UI layout supports 3 columns using the project data.
- **FR6:** Epic 3 - URL state management enables instant client-side filtering without reloads.
- **FR7:** (Deferred) - MVP targets desktop only; mobile deferred to Phase 2.
- **FR8:** Epic 2 - Toggle between Light and Dark interface modes.
- **FR9:** Epic 3 - Interactive filtering by "Project".
- **FR10:** Epic 3 - Interactive filtering by "Functional Domain".
- **FR11:** Epic 3 - Interactive filtering by "Tech Stack".
- **FR12:** Epic 2 - Render summary metadata on project and artifact cards.
- **FR13:** Epic 4 - Support intra-linking between prototypes and docs.
- **FR14:** Epic 4 - Add "About this Project" educational page in global nav.
- **FR15:** Epic 4 - Add "Fork a Workshop" template repository link.
- **FR16:** Epic 1 - Meta-Blueprint is hardcoded or prioritized as the first selectable project.
- **FR17:** Epic 2 - All content is visible without authentication blocks.
- **FR18:** (Deferred) - Usage telemetry (analytics) deferred to Phase 2.
- **FR19:** Epic 5 - Shared Agent Studio items with project association via frontmatter.
- **FR20:** Epic 6 - Central sort-config.yaml manifest for display ordering.

## Epic List

*   **Epic 0:** Project Scaffolding & Design Foundation
*   **Epic 1:** The "Meta-Blueprint" Foundation & Content Ingestion
*   **Epic 2:** The "Command Center" Grid & Core Navigation
*   **Epic 3:** Tri-Modal Discovery & Instant Filtering
*   **Epic 4:** Deep Linking, Education, & Open Sourcing
*   **Epic 5:** Shared Agent Studio Items
*   **Epic 6:** Central Sort Order Manifest

## Epic 0: Project Scaffolding & Design Foundation
Establish the technical foundation by initializing the Next.js/Tailwind repository. Protect future feature velocity by extracting the exact color tokens ("Tinted Neutrality") and typography (Inter) from the UX HTML mockup into the `tailwind.config.ts`. Construct the global header and the empty 3-Column structural CSS Grid (`DashboardGrid`), providing a ready-made, styled skeleton for subsequent data ingestion and component development.  
*(Anti-goal: DO NOT integrate external component libraries beyond shadcn/ui. The repository must remain runnable via `npm run dev` with zero additional configuration or environment variables to support easy forking).*

### Story 0.1: Initialize Next.js Repository & shadcn/ui
As a Developer,
I want to initialize a standard Next.js 15 application shell with Tailwind v4 and shadcn/ui,
So that I have a clean, runnable environment to build the portfolio.

**Acceptance Criteria:**
*   **Given** a clean repository,
*   **When** running `npm install` and `npm run dev`,
*   **Then** the default Next.js starter page loads successfully on localhost without console or build errors.
*   **And** the shadcn/ui configuration file (`components.json`) is present and correctly mapped to the `@/*` alias.

### Story 0.2: Configure Tailwind Design Tokens
As a UI Developer,
I want to extend the Tailwind configuration with the required color tokens ("Tinted Neutrality") and typography (Inter) from the UX Mockup,
So that I can build interface components using semantic utility classes instead of hardcoded hex values.

**Acceptance Criteria:**
*   **Given** the Next.js/Tailwind repository,
*   **When** developing components,
*   **Then** the Inter font face is available as the default sans typography plugin.
*   **And** the Tailwind theme is extended with specific semantic aliases for status pills (e.g., `theme.colors.status.live = '#...'`, `theme.colors.status.wip = '#...'`) mapping to the exact hex codes from the HTML mockup.

### Story 0.3: Build Static Global Header
As a User,
I want to see a consistent, persistent top navigation bar containing the project title and utility icons,
So that the visual branding and core utility actions are always accessible.

**Acceptance Criteria:**
*   **Given** the application layout,
*   **When** navigating through the app,
*   **Then** the Global Header component is rendered consistently at the top of the viewport.
*   **And** it matches the static HTML mockup's flex layout and includes placeholder/stub icons for the theme toggle and info icons.

### Story 0.4: Construct 3-Column Dashboard Grid Shell
As a User,
I want the main content area divided into three distinct structural columns (Studio, Blueprints, Lab),
So that the interface is ready to receive and display categorized project components.

**Acceptance Criteria:**
*   **Given** the main application canvas underneath the global header,
*   **When** rendering the `DashboardGrid` wrapper component,
*   **Then** the layout is defined via CSS Grid to explicitly map out three equivalent desktop columns matching the mockup.
*   **And** the component must accept dynamic `children` props to allow data-driven components to be injected into the columns in future Epics, rather than hardcoding children in the layout layer.

## Epic 1: The "Meta-Blueprint" Foundation & Content Ingestion
The Author can publish Markdown/Frontmatter content to the repository, and the System successfully parses it into structured data, ensuring the portfolio itself ("{{PROJECT_NAME}}") is the first viewable project.  
*(Constraint: Implementation must use Zod for strict Frontmatter validation, mapping failures to customized `[Error]` fallback states instead of crashing the Next.js build).*
**FRs covered:** FR1, FR2, FR3, FR4, FR16

### Story 1.1: Design Zod Frontmatter Schema
As a System Architect,
I want to define a strict Zod schema for Markdown Frontmatter mapping to Domain, Tech Stack, and Status requirements,
So that the application knows exactly what data shape to expect and prevents bad data from breaking the UI.

**Acceptance Criteria:**
*   **Given** the Next.js application,
*   **When** designing the data layer,
*   **Then** a `schema.ts` file exports a Zod object defining all required PRD Frontmatter metadata.
*   **And** it includes relational fields (e.g., `parent_project`, `related_docs`) to explicitly support deep linking in future Epics.
*   **And** a specific `[Error]` fallback object definition exists for parsing failures.

### Story 1.2: Implement Markdown File System Parser Utilities
As a Next.js Developer,
I want to dynamically read the `/content/` directory recursively to extract raw `.md` file paths without manual configuration updates,
So that projects and artifacts can be ingested automatically upon `git push`.

**Acceptance Criteria:**
*   **Given** the Next.js server environment,
*   **When** executing the file system utility functions,
*   **Then** it recursively discovers all `index.md` files within the `<project_slug>/agents|docs|prototypes` directory structure.
*   **And** the utility must return a structured object that associates each parsed `index.md` file with its parent project slug and its Artifact Type based on its grandparent folder name, rather than returning a flat array.

### Story 1.3: Markdown Content and Metadata Ingestion Engine
As a Next.js Developer,
I want to parse the extracted files into structured Frontmatter metadata and HTML content,
So that the raw Markdown is transformed into the required React props for the Universal Compound Card components.

**Acceptance Criteria:**
*   **Given** the raw file contents from the file system utility,
*   **When** processing the content,
*   **Then** `gray-matter` (or equivalent) successfully extracts the Frontmatter and validates it against the Zod schema from Story 1.1, returning the `[Error]` fallback state on validation failure.
*   **And** the `[Error]` fallback UI must explicitly surface the specific Zod validation error messages (e.g., "Missing required field: tech_stack") to the Author instead of a generic failure message.
*   **And** HTML generation safely parses GitHub-flavored markdown (specifically tables and code blocks) using `remark/rehype` (or equivalent) without allowing the execution of raw script tags (XSS protection).

### Story 1.4: "Meta-Blueprint" Project Definition
As the Content Author,
I want the "{{PROJECT_NAME}}" project itself to exist as the foundational piece of Markdown content in the system,
So that I can validate the ingestion pipeline using realistic portfolio data.

**Acceptance Criteria:**
*   **Given** the `/content/` directory,
*   **When** establishing the project baseline,
*   **Then** the `/content/plan-spec-build/` folder structure exists and contains valid `index.md` files for its specific docs and agents.
*   **And** the data fetching functions include hardcoded logic or explicit sorting rules to ensure this specific project is always presented as the first selectable item in the portfolio view (FR16).

## Epic 2: The "Command Center" Grid & Core Navigation
Users can view the parsed projects and their artifacts in the distinct 3-column "Command Center" layout (Studio, Blueprints, Lab) and switch between Light/Dark modes.
**FRs covered:** FR5, FR8, FR12, FR17

### Story 2.1: Build Universal `ProjectCard` Component
As a User,
I want to see summary metadata (Title, Domain, Tech Stack, Status) for both Projects and Artifacts in a consistent visual format,
So that I can quickly scan and evaluate the portfolio content before clicking.

**Acceptance Criteria:**
*   **Given** the UX mockup design,
*   **When** rendering a project or artifact,
*   **Then** a `ProjectCard` compound component is displayed matching the visual schema (borders, typography, hover states).
*   **And** it implements conditional rendering for the primary actionable link target based on the Artifact Type (e.g., rendering an external `target="_blank"` link with the solid blue CTA specifically for Prototypes, and standard internal router links for Docs/Agents).

### Story 2.2: Implement 3-Column Data Routing
As a User,
I want the parsed markdown content to be automatically sorted into the correct visual columns,
So that I can easily differentiate between Agents, Blueprints, and Prototypes.

**Acceptance Criteria:**
*   **Given** the parsed structured data from Epic 1,
*   **When** the `DashboardGrid` component renders,
*   **Then** it iterates over the data array and renders `ProjectCard` components into the appropriate `children` slots of the 3-column CSS Grid.
*   **And** the mapping logic determines which column a card belongs in strictly based on the Artifact Type metadata provided by Story 1.2, not by parsing URLs or text strings on the fly.
*   **And** the `ProjectCard` component must enforce a defensive maximum height constraint (e.g., CSS `line-clamp`) on text-heavy properties like descriptions or titles to prevent anomalous markdown data from blowing out the structural limits of the grid.

### Story 2.3: Implement Global Light/Dark Theme Toggle
As a User,
I want to toggle the interface between the default Dark mode and a Light mode,
So that I can view the portfolio according to my accessibility preferences.

**Acceptance Criteria:**
*   **Given** the Global Header from Epic 0,
*   **When** clicking the theme toggle icon,
*   **Then** the `next-themes` provider successfully flips the Tailwind root variables between the light and "Tinted Neutrality" dark themes across the entire application viewport.
*   **And** the `suppressHydrationWarning` prop is explicitly added to the root `<html>` tag in the root layout to prevent standard React hydration mismatch errors on first load.

### Story 2.4: Empty State & Fallback UI
As a User,
I want to see a clear placeholder if a specific column is empty for a given project,
So that I am not confused by jarring blank spaces in the structural grid.

**Acceptance Criteria:**
*   **Given** a project that lacks a specific artifact type (e.g., no Prototypes exist yet),
*   **When** the `DashboardGrid` attempts to render that column,
*   **Then** a styled fallback component matching the `[Concept]` status (dashed border) is rendered in that specific slot to maintain the structural rhythm of the page, rather than collapsing the grid or showing unstyled text.

### Story 2.5: Wire Blueprint Document Viewer Modal
As a User,
I want to click a Blueprint document title or its file icon to open the full markdown content in a focused reading modal,
So that I can deep-dive into technical documentation without leaving the Command Center context.

**Acceptance Criteria:**
*   **Given** a Blueprint document row in the Blueprints column,
*   **When** the user clicks the document title text link OR the FileText icon button,
*   **Then** the URL updates to include `?document=<filename-stem>` (e.g., `?document=prd`) alongside the existing `?project=` parameter.
*   **And** a `MarkdownDocumentModal` (shadcn `Dialog`) opens, rendering the full markdown body from the already-parsed `ParsedArticle.html` using the `MarkdownRenderer` component.
*   **And** the chevron icon on the document row continues to toggle only the expand/collapse of that row's metadata — it does NOT open the modal.
*   **And** closing the modal (via X button, Escape key, overlay backdrop click, or browser back button) removes only the `?document=` parameter from the URL, preserving all other filter state (`?project=`, `?domain=`, `?tech=`).
*   **And** after closing the modal, the user remains in exactly the same filter/focus state they were in before opening the document.
*   **And** if the requested document cannot be found or rendered, the modal displays a "This document could not be rendered" fallback message.

## Epic 3: Tri-Modal Discovery & Instant Filtering
Users can instantly drill down into specific contexts using the Project, Domain, and Tech Stack filters, experiencing the premium, client-side re-rendering (<100ms) without page reloads.  
*(Constraint: Implementation must rely strictly on Next.js `searchParams` and shallow routing to guarantee sub-100ms filter state changes without DOM thrashing or heavy React Context).*
**FRs covered:** FR6, FR9, FR10, FR11

### Story 3.1: Build Interactive Filter Bar Component
As a User,
I want an interactive row of filter pills across the top of the interface,
So that I can easily select Project, Domain, and Tech Stack constraints to narrow down the view.

**Acceptance Criteria:**
*   **Given** the filtering requirements,
*   **When** rendering the filter bar,
*   **Then** visual pill components matching the mockup's variants are displayed for each available filter category.
*   **And** the filter UI components must derive their 'active' visual state by directly reading the current `searchParams` from the URL, rather than relying on internal component state, ensuring truth remains solely in the URL.

### Story 3.2: Implement Filter State Architecture via URL Params
As a Front-End Developer,
I want the application to maintain the user's selected filters in the URL,
So that filter context is preserved even upon refreshing or bookmarking the page.

**Acceptance Criteria:**
*   **Given** the Next.js App Router,
*   **When** a user interacts with a filter pill,
*   **Then** custom React hooks synchronize component state with Next.js URL Search Parameters.
*   **And** state updates must strictly use `window.history.replaceState` or Next.js `router.push` with `{ scroll: false }` to ensure purely shallow routing without triggering layout data re-fetching from the server.
*   **And** the root `page.tsx` must remain a Server Component that fetches the initial static data array, while `searchParams` consumption is isolated to specific nested Client Components (e.g., `FilterBar`) to preserve Static Site Generation (SSG).

### Story 3.3: Wire Tri-Modal Filtering to Grid Data
As a User,
I want the Command Center grid to instantly update when I select a filter,
So that I can view only the projects or artifacts matching my specific criteria without delay.

**Acceptance Criteria:**
*   **Given** the active URL filters and the complete data array from Epic 2,
*   **When** a filter changes in the URL,
*   **Then** the `DashboardGrid` conditionally hides or shows `ProjectCard` components to match the active filters.
*   **And** the filtering logic must be strictly client-side via React `useMemo` hooks against the full initial data payload, avoiding any network requests on filter changes to guarantee <100ms response times.

### Story 3.4: Implement "Clear Filter" Mechanics
As a User,
I want the ability to explicitly dismiss all my active filters,
So that I can easily return to the full, unadulterated portfolio view in one click.

**Acceptance Criteria:**
*   **Given** active filters in the interface,
*   **When** clicking the "Clear Filters" button in the filter bar,
*   **Then** a single-click action executes a purge of all `?project=`, `?domain=`, and `?tech=` parameters from the URL simultaneously, restoring the full data view.

## Epic 4: Deep Linking, Education, & Open Sourcing
Users can navigate directly between related artifacts (prototype -> docs), learn about the Tri-Pillar philosophy via the "About" page, and easily fork the repository.
**FRs covered:** FR13, FR14, FR15

### Story 4.1: Inter-Artifact Deep Linking ("View Project State")
As a User,
I want to click the "Layers" icon on an artifact card to instantly establish a "View Project State" that hides all unrelated documents,
So that I can focus entirely on the interrelated PRDs, Architecture docs, and Prototypes for a specific project.

**Acceptance Criteria:**
*   **Given** an artifact card rendered within the `DashboardGrid`,
*   **When** a user interacts with the explicit "Layers" action,
*   **Then** the application performs a shallow push (reusing the Epic 3 routing mechanics) to update the URL `searchParams` with the artifact's `parent_project` slug.
*   **And** this guarantees the grid instantly filters to display only artifacts sharing that specific project slug, hiding all unrelated portfolio content without requiring a new page load.

### Story 4.2: Build Comprehensive "About this Project" Educational Page
As a User,
I want a dedicated, standalone educational page that explains the Tri-Pillar philosophy, quantitative metrics, and provides resources,
So that I can comprehend the portfolio's purpose and instantly assess the volume of work presented.

**Acceptance Criteria:**
*   **Given** the Global Header from Epic 0,
*   **When** clicking the designated "Info" icon,
*   **Then** the user is routed to a static `/about/page.tsx` that replaces the complex `DashboardGrid` with a centered typographic layout.
*   **And** this dedicated route must render three specific sections:
    1.  **Philosophy:** Static markdown prose explaining the Agent/Blueprint/Prototype relationship.
    2.  **At a Glance:** A dynamic, quantitative rollup calculating the total number of projects, documents, and agent sets ingested from the file system.
    3.  **Open Source:** An explicit CTA linking to the forkable GitHub repository template (FR15).

### Story 4.3: Add "Fork a Workshop" Repository Link
As a Peer PM or Developer,
I want an easily accessible link to the underlying Git repository template,
So that I can quickly fork the project to start building my own portfolio.

**Acceptance Criteria:**
*   **Given** the Global Header from Epic 0,
*   **When** viewing the interface,
*   **Then** a designated GitHub/Open Source icon is visible in the utility navigation area.
*   **And** clicking the link explicitly opens the project's source GitHub repository in a new tab (`target="_blank"`).

## Epic 5: Shared Agent Studio Items
Agent Studio content is decoupled from per-project folders and stored in a single shared location (`_shared/agents/`), enabling agents to be associated with multiple projects without file duplication. The content parser and filtering logic are updated to support the new `projects` frontmatter field.
**FRs covered:** FR19

### Story 5.1: Migrate Agent Content to Shared Directory
As a Content Author,
I want all Agent Studio markdown files to live in a single `_shared/agents/` directory,
So that agents used across multiple projects are not duplicated in each project's folder.

**Acceptance Criteria:**
*   **Given** the content directory structure,
*   **When** organizing Agent Studio content,
*   **Then** all agent `.md` files exist in `/content/_shared/agents/` and per-project `agents/` subfolders are removed.
*   **And** agents that are associated with specific projects have a `projects` frontmatter array listing the relevant project slugs (e.g., `projects: ["plan-spec-build-workshop"]`).
*   **And** agents that are not associated with any specific project omit the `projects` field or have an empty array.

### Story 5.2: Update Content Parser for Shared Agents
As a Developer,
I want the file system parser to discover agent files from `_shared/agents/` instead of per-project `agents/` folders,
So that the ingestion pipeline correctly loads shared agents alongside project-specific content.

**Acceptance Criteria:**
*   **Given** the content parser utilities,
*   **When** scanning the content directory,
*   **Then** `getProjectSlugs()` excludes `_shared` from the list of project slugs (it is not a project).
*   **And** `getContentFilePaths()` additionally scans `_shared/agents/` and returns those files with `artifactType: "agent"` and a synthetic `projectSlug` of `"_shared"`.
*   **And** the Zod schema includes an optional `projects: z.array(z.string()).optional()` field.

### Story 5.3: Wire Agent Project Filtering in Discovery Grid
As a User,
I want Agent Studio to show only relevant agents when I filter by a specific project,
So that unrelated tools are hidden in Focus Mode and I see a clean, project-scoped view.

**Acceptance Criteria:**
*   **Given** the DiscoveryGrid filtering logic,
*   **When** no project filter is active (Browse Mode),
*   **Then** all agents display regardless of their `projects` field.
*   **And** when a project filter is active (Focus Mode), only agents whose `projects` array includes the active project slug are displayed.
*   **And** agents with no `projects` field or an empty `projects` array are hidden in Focus Mode.
*   **And** Domain/Tech Stack filtering continues to apply on top of project filtering using the existing OR logic.

## Epic 6: Central Sort Order Manifest
Display ordering across all UI sections (Agent Studio, Blueprints, Build Lab, project filter pills) is controlled by a central `sort-config.yaml` manifest file, replacing implicit or per-file ordering. The existing `order` frontmatter field is deprecated and removed.
**FRs covered:** FR20

### Story 6.1: Create Sort Configuration Manifest
As a Content Author,
I want a single YAML file that defines the display order for all content sections,
So that I can control presentation ordering from one place without editing multiple markdown files.

**Acceptance Criteria:**
*   **Given** the content directory,
*   **When** a `sort-config.yaml` file exists at `/content/sort-config.yaml`,
*   **Then** it defines ordering arrays for `agent_studio`, `blueprints` (per project), `build_lab`, and `projects`.
*   **And** values in the arrays are filename stems (without `.md`).
*   **And** the initial manifest includes all current content files in the desired display order.

### Story 6.2: Implement Sort Manifest Parser
As a Developer,
I want the content parser to read `sort-config.yaml` and apply its ordering to all parsed content arrays,
So that the UI displays items in the author-defined order.

**Acceptance Criteria:**
*   **Given** parsed content arrays from the ingestion engine,
*   **When** sort-config.yaml exists and is valid YAML,
*   **Then** items are sorted according to their position in the manifest arrays. Items listed first in the manifest appear first in the UI.
*   **And** items not listed in the manifest appear after all listed items, sorted alphabetically by title.
*   **And** the `projects` key in the manifest controls both filter bar pill order and Blueprint group order.
*   **And** if the manifest is missing or malformed, all items fall back to alphabetical ordering by title.

### Story 6.3: Deprecate Per-File Order Field
As a Developer,
I want the `order` frontmatter field removed from the Zod schema and all content files,
So that there is a single, unambiguous mechanism for controlling display order.

**Acceptance Criteria:**
*   **Given** the Zod schema in `schema.ts`,
*   **When** the deprecation is complete,
*   **Then** the `order` field is removed from both `projectSchema` and `documentSchema`.
*   **And** no content `.md` files reference an `order` frontmatter field.
*   **And** the Architecture document reflects that `sort-config.yaml` is the exclusive ordering mechanism.

<!-- Epic Definitions End -->
