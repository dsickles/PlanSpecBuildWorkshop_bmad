---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-02-22'
inputDocuments: [
  "_bmad-output/planning-artifacts/prd.md",
  "_bmad-output/planning-artifacts/ux-design-specification.md",
  "_bmad-output/planning-artifacts/decision-matrix.md"
]
project_name: 'Projects'
user_name: 'Dan'
date: '2026-02-22T20:46:00Z'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The system primarily functions as a read-only content-delivery SPA (Single Page Application) handling a specialized document structure (Tools -> Docs -> Prototypes). It requires robust Git-based markdown ingestion rather than complex database transactions or user state manipulation.

**Non-Functional Requirements:**
Performance is paramount. The architecture must support near-instantaneous client-side routing (target: <100ms per NFR2) and a sub-1.0s FCP to maintain the "Command Center" user experience required by the UX Specification.

**Scale & Complexity:**
The data scale is minimal (low latency/storage needs), but the UI complexity is moderate due to the 3-column desktop layout requirements.

- Primary domain: Frontend Web (Jamstack/SSG)
- Complexity level: Low-to-Medium
- Estimated architectural components: ~6 core UI molecules (Universal Compound Card, Markdown Document Modal, Dashboard Grid, Global Header, Filter Bar, About Modal).

### Technical Constraints & Dependencies

- Must be deployable to edge/static hosting (Vercel/Netlify) without dedicated backend container management.
- Content ingestion is strictly constrained to parsing markdown files and frontmatter from the Git repository.

### Cross-Cutting Concerns Identified

- **Markdown Abstraction:** Ensuring the markdown parser cleanly integrates with the tailored UI components without requiring manual HTML authoring.
- **Performance Budgeting:** Maintaining <100ms filter transitions (per NFR2) as the portfolio grows to 10+ projects.

## Starter Template Evaluation

### Primary Technology Domain

Frontend Web Application (Jamstack/SSG) based on project requirements analysis.

### Starter Options Considered

A variety of Next.js 15 starters incorporating Tailwind CSS and shadcn/ui were evaluated. Many third-party templates include unnecessary abstractions (databases, authentication wrappers) that conflict with the simple, Git-backed markdown parsing required by the project.

### Selected Starter: Official Next.js + shadcn/ui Initialization

**Rationale for Selection:**
By using the official `create-next-app` combined with `shadcn-ui init`, we establish a zero-bloat foundation that aligns perfectly with the requirement for absolute control over the DOM markup and Tailwind configuration. This guarantees we can execute the precise "Linear Purist" aesthetic defined in the UX Specification without battling pre-existing theme logic. The Next.js App Router sets up the ideal architecture for our server-side markdown parsing and client-side state filtering (target: <100ms per NFR2).

**Initialization Command:**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npx shadcn@latest init
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript on Node.js (Next.js 15).

**Styling Solution:**
Tailwind CSS v4 managed via a global CSS file, enabling our bespoke Tinted Neutrality design system. Light mode token values (color palette, backgrounds, borders) will be defined during the design system implementation story. The architecture supports dual-mode natively via Tailwind's standard `dark:` variant strategy and shadcn/ui's built-in theme switching.

**Build Tooling:**
Next.js built-in webpack/Turbopack with strict ESLinting.

**Testing Framework:**
To be determined (Next.js supports standard Jest/Playwright configurations).

**Code Organization:**
Next.js App Router (`src/app`) for layout nesting and server components.

**Development Experience:**
Next.js local dev server (`npm run dev`) with Fast Refresh.

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Markdown Parsing Strategy
- Grid State Management Strategy

**Important Decisions (Shape Architecture):**
- CI/CD & Infrastructure Hosting

**Deferred Decisions (Post-MVP):**
- Testing Framework Setup (Cypress/Playwright vs Jest) - To be determined when specific test coverage needs are clear as the components stabilize.

### Data Architecture (The "Git-CMS")

The application does not use a traditional database. The GitHub repository serves as the single source of truth.

**Markdown Ingestion Strategy: Decoupled Custom Parser (`gray-matter` + `markdown-renderer.ts`)**
- *Rationale:* Decouples content parsing (business logic) from the complex Markdown-to-HTML rendering pipeline (technical dependency).
- *Benefit:* Ensures that branding tokenization and frontmatter validation can be 100% unit tested by mocking the renderer, bypassing ESM transformation issues in test environments (Jest).
- *Implementation:* `src/lib/content-parser.ts` handles ingestion and tokenization; `src/lib/markdown-renderer.ts` (ESM-only) handles the `unified`/`remark`/`rehype` conversion.
- *Affects:* Core data fetching logic and the ingestion pipeline stability.

### Sort Order Configuration (FR20)

Display ordering across all UI sections is controlled by a central manifest file rather than per-file frontmatter fields. This provides a single location to view and rearrange content ordering without opening multiple markdown files.

**Manifest Location:** `/content/sort-config.yaml`

**Format:**

```yaml
agent_studio:
  - BMadMethod        # filename stems (without .md)
  - Lovable
  - SpecKit
  - GetShitDone

blueprints:
  plan-spec-build-workshop:  # per-project document ordering
    - prd
    - architecture
    - ux-design-specification
    - epics

build_lab:
  - plan-spec-build-workshop

projects:              # filter bar pill order and Blueprint group order
  - plan-spec-build-workshop
```

**Parsing Rules:**
- The manifest is read at build time alongside content parsing.
- Each section's array defines display priority. The first item in the array is displayed first.
- Identifiers are filename stems (the `.md` filename without the extension).
- Items not listed in the manifest appear after all listed items, sorted alphabetically by title.
- If the manifest file is missing or malformed, all items fall back to alphabetical ordering.
- The `projects` key controls both the order of project pills in the Filter Bar and the order of Blueprint card groups in the Blueprints column.

### Frontend Architecture

**Global State Management: URL Query Parameters**
- *Rationale:* The UX Spec requires <100ms filtering (per NFR2) across a 3-column layout. URL query parameters natively align with Next.js App Router capabilities.
- *Rendering Model:* The Next.js `page.tsx` is a **Server Component** that receives `searchParams` as an async prop — it does NOT use the `useSearchParams` hook. Filter state is read server-side and passed down. **Client Components** (e.g., `FilterBar.tsx`) use the `useSearchParams` hook for interactive filter updates without full page re-renders.
- *Benefit:* Provides deep-linkable, shareable URLs for specific portfolio states (e.g., `?project=plan-spec-build&domain=Requirements,Design`) without relying on brittle localized React state propagating across complex layouts.
- *URL Parameters:* `?project=` (project slug), `?domain=` (functional domain filter), `?tech=` (technology stack filter), `?document=` (opens a specific markdown document in the modal viewer — value is the filename stem, e.g., `?document=prd`, scoped to the active `?project=` parameter). Multi-select filters use **comma-separated values** (e.g., `?domain=Requirements,Design`).
- *Affects:* The 3-Column UI Grid, Filter Bar, and routing layer.

**Local UI State: Card Expand/Collapse (`useState`)**
- *Rationale:* Blueprint card document rows have expand/collapse toggles and per-card `[Expand All]` / `[Collapse All]` controls. This is ephemeral presentation state that does not need to be deep-linkable or shareable.
- *Behavior:* When the `?project=` parameter transitions from empty to a specific project (entering Focus Mode), all document rows in that project's Blueprint card auto-expand. When the filter is cleared (returning to Browse Mode), document rows return to their prior collapsed state.
- *Implementation:* Managed via `useState` or `useReducer` within the Blueprint card component. This is the only exception to the URL-driven state strategy.
- *Affects:* Blueprint card component only.

### Shared Documentation Strategy (Remote Pointers)
- *Rationale:* To eliminate redundancy, the system must support linking to "live" documentation (PRDs, Architectures) residing in the `_bmad-output/` or other root directories, rather than requiring manual copy-pasting into `/content/`.
- *Implementation:* The `FrontmatterSchema` will be extended with an optional `sourcePath` string. If present, the `parser.ts` utility will resolve this path relative to the project root and ingest the content from the external file.
- *Constraint:* Standard `/content/` files always take precedence. Remote pointers are only resolved if the local file body is empty or explicitly configured as a link.
- *Affects:* `src/lib/parser.ts` and `src/lib/schema.ts`.

### Infrastructure & Deployment

**Hosting Strategy: Vercel**
- *Rationale:* The native hosting platform for Next.js, providing zero-configuration deployments.
- *Benefit:* Automatically optimizes images and completely automates the CI/CD pipeline linked to the primary GitHub branch. Keeps development cycles focused strictly on CSS and data mapping.
- *Affects:* Deployment workflows and repository settings.

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize the Next.js `create-next-app` starter.
2. Establish the base `global.css` "Linear Purist" Tailwind configuration.
3. Build the core utility wrapper for `gray-matter` to parse a test `.md` file.
4. Implement the root layout using URL `searchParams` (server prop) and `FilterBar` (client component) to control the display grid.

**Cross-Component Dependencies:**
The choice of a standard HTML pipeline (`unified`) combined with `@tailwindcss/typography` necessitates creating a strict mapping dictionary or bespoke CSS overrides to tie standard HTML tags to our stylized Next.js components.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
4 areas where AI agents could make different choices (Frontmatter schemas, content location, component boundaries, and error handling).

### Naming Patterns

**Frontmatter Naming Conventions:**
All markdown files must use strictly `camelCase` for YAML frontmatter keys (e.g., `publishDate`, `shortDescription`, `actionType`). This maps 1:1 with TypeScript interfaces and eliminates translation layers in the frontend code.

**Branding Tokenization (Centralized Control):**
To ensure branding consistency without mass-editing files, the ingestion engine supports a `{{PROJECT_NAME}}` token.
- **Source of Truth:** The `title` field in a project's root `index.md` (e.g., `/content/plan-spec-build/index.md`).
- **Processing:** The `content-parser.ts` recursively replaces this token in all frontmatter strings and the Markdown body before rendering.
- **Shared Branding:** For shared items in `_shared/`, the branding title is resolved from `/content/_shared/index.md` (e.g., "Agent Studio"). This ensures system slugs like `_shared` are never displayed to the user.
- **Rules:** Authors should use the token in headers, descriptions, and body text whenever referring to the project name.

**Metadata Resolution Hierarchy:**
To prevent ambiguity when attributes are defined in multiple locations, the system follows this precedence order:

1.  **Project Root `index.md`**: Overrides a folder's existence. (Source for `title`, `domain`, `tech_stack`).
2.  **Explicit Frontmatter**: Local attributes within individual `.md` files.
3.  **Folder-Level `index.md`**: Optional overrides for specific sub-columns (e.g., `docs/index.md`).
4.  **Filesystem Slug**: Final fallback for titles/identifiers if no markdown metadata is found.

### Structure Patterns

**Content Organization:**
Markdown content is strictly decoupled from the Next.js `src` directory.
- All content lives in a root `/content/` directory.
- Projects are organized hierarchically: `/content/[project-slug]/[folder]/document.md`.
- **Shared content** lives in a reserved `/content/_shared/` directory (see Shared Agent Studio Items below).
- **Metadata Drivers:** Project-level metadata (title, domain, tech_stack) is primarily driven by the `index.md` file located in the project's root or the `_shared/` directory. If `index.md` is missing, the system falls back to the filesystem slug.
- **Canonical content folder names** (mapping content folder → UI column):

  | Content Folder | UI Column | Example |
  |---|---|---|
  | `_shared/agents/` | Agent Studio | `/content/_shared/agents/BMadMethod.md` |
  | `docs/` | Blueprints | `/content/plan-spec-build/docs/prd.md` |
  | `prototypes/` | Build Lab | `/content/plan-spec-build/prototypes/portfolio.md` |
- A project's UI display metadata is controlled via a `/content/[project-slug]/index.md` or `/content/_shared/index.md` file (using the `title` frontmatter).
- Display ordering across all sections is controlled via a central `/content/sort-config.yaml` manifest (see Sort Order Configuration below).

**Shared Agent Studio Items (FR19):**
Agent Studio content lives in a single shared folder (`/content/_shared/agents/`) rather than per-project `agents/` subfolders. This prevents file duplication when the same agent (e.g., Lovable) is used across multiple projects.

- Each agent `.md` file has an optional `projects` frontmatter array listing the project slugs it is associated with (e.g., `projects: ["plan-spec-build-workshop"]`).
- **Branding:** The "Agent Studio" header in the UI is derived from `/content/_shared/index.md`.
- **Filtering rules:**
  - **Browse Mode (no project filter):** All agents display regardless of their `projects` field.
  - **Focus Mode (project filter active):** Only agents whose `projects` array includes the active project slug are displayed. Agents with no `projects` field or an empty `projects` array are hidden.
- Domain and Tech Stack filters continue to apply on top of project filtering using the same OR logic as other columns.
- The `_shared` directory is a reserved prefix. The content parser must exclude it from `getProjectSlugs()` — it is not a project.

**Content Model by Folder:**
- **`_shared/agents/`**: Each `.md` file represents one AI agent card. Uses `documentSchema` with `actionType` always set to `"none"` (agent cards have no interactive actions). Body contains a 2-sentence executive summary. The optional `projects` frontmatter array controls project association.
- **`docs/`**: Each `.md` file represents one Blueprint document (PRD, Architecture, Decision Matrix, etc.). Uses `documentSchema` with `actionType` set to `"document-view"`. Body contains the full markdown document rendered in the Document Modal. Clicking the document title or the FileText icon opens the Markdown Document Modal by updating the URL to `?project=x&document=y`.
- **`prototypes/`**: Each `.md` file represents one Build Lab prototype card. Uses `documentSchema` with `actionType` set to `"external-link"` and `actionUrl` pointing to the live deployment. Optional `githubUrl` field for the GitHub icon link. Body is optional (extended description or changelog).

**Component Boundaries:**
- Primitive UI components installed by shadcn/ui go in `src/components/ui/` and **MUST NOT** be modified directly by AI agents to achieve custom designs.
- All custom composed components (e.g., `UniversalCompoundCard`, `GlobalHeader`, `FilterBar`, `AboutModal`) must be placed in `src/components/custom/`.
- **The Compound Component Mandate:** The 3-column grid must be populated by a single `UniversalCompoundCard` architecture, not distinct card components. This component must expose a strict compound pattern (`<ProjectCard.Root>`, `<ProjectCard.Header>`, `<ProjectCard.Metadata>`, `<ProjectCard.Body>`) to ensure identical border, padding, and hover-state behavior across all columns, regardless of the internal data rendered.
- **Markdown Mapping Boundary:** A dedicated `MarkdownRenderer.tsx` wrapper must exist in `/src/components/custom/`. This acts as the *exclusive* dictionary mapping raw markdown syntax to styled shadcn primitives (e.g., converting `<a>` to `<Link>`).
- **About Modal Boundary:** `AboutModal.tsx` renders structured content (portfolio metrics, "Fork a Workshop" CTA) rather than parsed markdown. Portfolio metrics (project count, document count, status distributions) are computed at build time from the parsed content data in `/content/`.
- **Dashboard Grid Boundary:** `DashboardGrid.tsx` is the three-column CSS Grid layout wrapper. It receives filtered content arrays and maps them to the Agent Studio, Blueprints, and Build Lab columns. It handles column-level empty states (dashed borders, `[Concept]` pills) and delegates card rendering to `UniversalCompoundCard`.
- **ToC Engine Boundary:** Any logic for structural document parsing (header extraction for Table of Contents) must sit within `src/lib/` (e.g., `src/lib/toc-engine.ts`). This preserves the **Content Boundary** by keeping parsing logic decoupled from React rendering components.
- **Markdown Renderer Boundary:** The heavy Markdown-to-HTML conversion pipeline must reside in `src/lib/markdown-renderer.ts`. This acts as an architectural "airlock" for ESM-only dependencies (`unified`, `remark`), ensuring the rest of the logic layer (`content-parser.ts`) remains clean, lightweight, and fully testable via standard mocking.

### Process Patterns

**Routing & Application Behavior:**
- **Missing Content:** If a requested markdown file does not exist, the Next.js server component must use the native `notFound()` function to gracefully trigger the 404 UI boundary.
- **Card Actions:** The UI behavior of a document or project card is controlled entirely by the `actionType` frontmatter string (or inferred by its column type / specific icon interactons):
    - `filter-view`: Updates the global URL parameter (e.g., `?project=x`) to filter the entire dashboard view. Triggered by the Project filter pills in the Filter Bar, OR the local 'Layers' icon shortcut on a Blueprint or Prototype Card.
    - `document-view`: Updates URL parameters (e.g., `?project=x&document=y`) to open the markdown file in a modal overlay (shadcn `Dialog`). The `?document=` value is the filename stem (e.g., `prd`, `architecture`). Both the document title text link and the FileText icon trigger this action. The header remains persistent in size to ensure stable navigation. Closing the modal (via **Back** button, Escape key, overlay click, or browser back button) removes only the `?document=` parameter from the URL, preserving all other filter state (`?project=`, `?domain=`, `?tech=`). **Focus is restored declaratively to the triggering element in the grid upon dismissal using Radix's `onCloseAutoFocus` primitive.**
    - `external-link`: Renders a standard `<a target="_blank">` tag using the accompanying `actionUrl` frontmatter string (used by the Prototype Rocket CTA).
    - `none`: The card body is strictly informational and does not trigger routing (e.g., Agent Studio and Prototype card bodies).
- **Clear Filter Behavior:** When any project is selected (Focus Mode), a `✕ Clear Filter` button appears inline in the Projects filter row (after the last project pill). Clicking it resets the `?project=` URL parameter to its default empty state, returning to Browse Mode. The button is not rendered when "All" is selected or no project filter is active.

**Error Handling Strategy:**
- **Zod validation failure (single document):** The affected card renders a graceful fallback state — dashed border, `[Error]` pill, "Content unavailable" placeholder text. All other cards render normally. The site never crashes entirely due to one malformed frontmatter file.
- **`react-markdown` parse failure:** Same card-level fallback. The Document Modal displays a "This document could not be rendered" message rather than a raw error stack.
- **Build-time vs Runtime:** During `next build`, Zod validation failures log warnings to the console but do **not** block the build. In `npm run dev`, failures throw errors to surface issues immediately to the author.
- **Missing content folder:** If a project's `index.md` exists but a content subfolder (e.g., `agents/`) is empty or missing, that column renders the standard empty state pattern (dashed border, `[Concept]` pill) rather than an error.
- **Semantic Test Tokens:** To ensure dashboard isolation and prevent selector collisions (e.g., "Content unavailable" appearing in multiple columns), all fallback and error rows must implement `data-testid` and context-specific `aria-label` props (e.g., `aria-label="agent content unavailable"`).

### Enforcement Guidelines

**All AI Agents MUST:**
- Never modify shadcn primitive components in `/ui/`.
- Always use `camelCase` for frontmatter schemas.
- Place all project content in the root `/content/` directory following the strict hierarchical path.
- Place all Agent Studio content in `/content/_shared/agents/` — never in per-project `agents/` subfolders.
- Never use a per-file `order` field to control display ordering — use `sort-config.yaml` exclusively.

**Documentation Enforcement:**
- A dedicated **`/content/README.md`** (or `README-CONTENT.md` at root) file MUST be created. This file will explicitly document the Content Creator (Product Manager) end-to-end flow, including the folder structure rules, the copy-pasteable YAML frontmatter schema, and the definitions of how `actionType` controls routing behavior. 
- The frontmatter schema must be strictly enforced in the codebase using **Zod validation**. Missing or malformed keys will throw a localized compilation error to notify the author.

**Canonical Frontmatter Schemas (Starting Point):**

```typescript
// src/lib/schema.ts — Minimum viable schema for content validation

// Single canonical schema ensures consistency across all artifact types.
const FrontmatterSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  status: z.enum(["Live", "WIP", "Concept", "Archived"]),
  domain: z.array(z.string()).nullish().transform(v => v ?? []),
  tech_stack: z.array(z.string()).nullish().transform(v => v ?? []),
  parent_project: z.string().optional(),
  related_docs: z.array(z.string()).optional(),
  artifact_type: z.enum(["agent", "doc", "prototype"]).optional(),
  // Enhancements for Epic 8/9
  sourcePath: z.string().optional(),
  externalLinks: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
  })).optional(),
  associatedProjects: z.array(z.string()).optional(),
  isOverview: z.boolean().optional(),
});
```

> _This schema is the single source of truth for all content parsing. The `order` field has been removed — display ordering is controlled exclusively via the central `sort-config.yaml` manifest (FR20)._

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
plan-spec-build-portfolio/
├── content/                     # 🔴 CONTENT BOUNDARY (Markdown Only)
│   ├── README-CONTENT.md        # The E2E PM guide + Frontmatter schemas
│   ├── sort-config.yaml         # Central display ordering manifest (FR20)
│   ├── _shared/                 # 🟡 SHARED CONTENT (not a project)
│   │   ├── index.md             # Shared Branding Metadata (e.g. Agent Studio)
│   │   └── agents/              # → Agent Studio column (all agents live here)
│   │       └── [agent].md       # Optional `projects` frontmatter for association
│   └── [project-slug]/          # e.g., plan-spec-build/
│       ├── index.md             # UI Display Metadata
│       ├── docs/                # → Blueprints column
│       │   ├── index.md         # Optional folder-level override
│       │   └── [document].md    # Target markdown file
│       └── prototypes/          # → Build Lab column
│           └── index.md         # Optional folder-level override
├── src/                         # 🔵 LOGIC BOUNDARY (React/Next.js)
│   ├── app/                     # Routing & Layouts
│   │   ├── layout.tsx           # Global Shell (Header + Filter Bar + Grid)
│   │   ├── page.tsx             # Reads ?project=, ?domain=, ?tech= & ?document= state
│   │   ├── not-found.tsx        # Graceful 404 for missing markdown
│   │   └── globals.css          # Tailwind Tokens (Linear Purist)
│   ├── components/              
│   │   ├── ui/                  # ⚠️ SHADCN PRIMITIVES (DO NOT EDIT)
│   │   └── custom/              # 🟢 COMPOSED COMPONENTS
│   │       ├── GlobalHeader.tsx
│   │       ├── FilterBar.tsx
│   │       ├── UniversalCompoundCard.tsx
│   │       ├── DashboardGrid.tsx
│   │       ├── AboutModal.tsx
│   │       ├── MarkdownRenderer.tsx
│   │       └── MarkdownDocumentModal.tsx
│   └── lib/                     # Utilities & Parsers
│       ├── parser.ts            # Parses /content/ using gray-matter
│       ├── schema.ts            # Zod validation for Frontmatter
│       └── utils.ts             # Tailwind merge utilities
├── package.json                 
├── next.config.js               
├── tailwind.config.ts           
└── tsconfig.json                
```

### Architectural Boundaries

**The Content Boundary:**
Markdown files (`/content`) absolutely never leak into `/src`. The application parses this at build-time or server-request time. It is a one-way street (Code reads Content).

**The Component Boundary:**
AI agents cannot touch `/src/components/ui/`. They must compose interfaces utilizing those base primitives inside `/src/components/custom/`.

**The Data Validation Boundary:**
`src/lib/parser.ts` must pass the raw frontmatter through the Zod schema defined in `src/lib/schema.ts`. This acts as the absolute authority on Frontmatter integrity.

### Integration Points

**Internal Communication:**
The UI reacts to URL state (e.g., `?project=plan-spec-build&domain=requirements`). The Next.js `page.tsx` reads these parameters and requests the corresponding parsed markdown data from `parser.ts`.

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
Next.js 15, Tailwind CSS 4, shadcn/ui, and `gray-matter` represent a highly compatible, modern Jamstack pipeline. They integrate natively without conflicting build steps or overlapping concerns.

**Pattern Consistency:**
The strict separation of Markdown data (`/content/`) from React application logic (`/src/`) ensures the Frontmatter YAML (camelCase) maps cleanly and consistently to the composed UI props without complex transformation layers.

**Structure Alignment:**
The physical directory structure perfectly enforces the architectural boundaries. The `/src/components/custom/` rule prevents AI agents from modifying base `/src/components/ui/` primitives, and the `schema.ts` file acts as the ultimate gatekeeper for parsing content.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
All primary views defined in the UX Spec (the Global Header, the Three-Row Filter Bar, and the 3-Column Document Grid) are fully supported by the Next.js App Router and the custom `GlobalHeader.tsx`, `FilterBar.tsx`, and `DashboardGrid.tsx` components.

**Functional Requirements Coverage:**
The `gray-matter` parser combined with React Server Components easily ingests the local GitHub repository markdown text and renders it into the UI without requiring database infrastructure.

**Non-Functional Requirements Coverage:**
Performance targets (sub-1.0s FCP, 0ms transitions) are architecturally guaranteed by utilizing URL query parameters (`?project=`) instead of localized Context state, enabling instant client-side transitions and trivial deep-linking.

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical implementation parameters—from the specific Next.js initialization command to the exact Tailwind styling methodology—are documented.

**Structure Completeness:**
The repository tree is mapped 1:1 with the architectural boundaries, leaving no ambiguity for where files should be placed.

**Pattern Completeness:**
Critical AI conflict points (naming schemas, folder structures, component boundaries, and missing-file error handling) have explicit rules defined to govern future implementation agents.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

**Key Strengths:**
- Zero database dependency ensures ultimate portability of the PM's content.
- Strict component boundaries protect the UI library from destructive overrides during rapid iteration.
- URL-driven state management natively supports the UX Spec's requirement for shareable, direct-linkable views.

**Areas for Future Enhancement:**
- All future enhancements (e.g., full-text search, offline PWA modes) are documented and tracked centrally in the **PRD** under the "Risk Mitigations & Future Enhancements" section to maintain a single source of truth for scope.

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented in this file.
- Use the implementation patterns consistently across all composed components.
- Respect the strict project structure and content boundaries.
- Refer to this document as the absolute source of truth for all architectural questions.

**First Implementation Priority:**
Execute the Next.js / shadcn initialization command defined in the "Starter Template Evaluation" section to establish the base repository.

## Technical Debt

The following technical debt items and functional risks have been identified through architectural analysis and adversarial review. Each item is assigned a criticality level to prioritize remediation.

### [Critical] Security & XSS in Markdown
The requirement to parse GitHub-flavored markdown safely currently lacks a specified sanitization standard. If an author includes an `<iframe>` or an SVG with an `onload` attribute, the application is vulnerable to Cross-Site Scripting (XSS).
*Remediation:* Enforce a strict HTML sanitizer (e.g., DOMPurify or `rehype-sanitize`) within the markdown rendering pipeline before injecting via `dangerouslySetInnerHTML`.

### [Major] Zod Strictness Cascading Failures
While Zod successfully maps project-level parsing failures to `[Error]` UI states, the architecture does not define the blast radius for root-level failures. If a shared configuration file (like `sort-config.yaml` or a core `_shared/index.md` agent) fails validation, it risks bringing down the entire grid rendering process.
*Remediation:* Implement architectural boundary limits for root-level parses, ensuring the application gracefully degrades (e.g., falling back to alphabetical sorting) rather than throwing an unhandled exception during the build or runtime.

### [Major] Client-Side Payload Explosion
The architecture currently performs filter operations incrementally against the entire initial data payload on the client side. As the portfolio scales (30+ projects), this risks O(N) payload explosion, degraded Lighthouse scores, and increased Time to Interactive (TTI).
*Remediation:* Investigate component lazy-loading, pagination, or Server-Driven filtering to constrain the initial hydration payload.

### [Major] E2E Test Brittleness
E2E testing flows are relatively coupled to specific DOM structures and CSS selectors, making the test suite highly brittle to standard UI refactoring or filter logic changes.
*Remediation:* Implement robust `data-testid` strategies and decouple interaction tests from strict layout assertions prior to CI/CD integration.

### [Minor] Flaky Radix Focus Restoration
The document modal relies on Radix's declarative `onCloseAutoFocus` to return focus to the exact grid card upon closing. Because the grid is dynamically filtered via `useMemo`, if the state changes or the DOM reflows while the modal is open, Radix will throw an error attempting to focus a detached DOM node.
*Remediation:* Implement defensive checks before restoring focus, or anchor focus to a stable parent container if the specific trigger node is no longer present in the DOM.

### [Minor] App Router Shallow Routing Caching
Next.js App Router shallow routing edge cases can cause stale UI states to be served when users utilize the browser "Back" navigation after opening and closing multiple modals or activating various filters.
*Remediation:* Explicitly manage router cache invalidation or leverage tools like `nuqs` to handle type-safe, URL-synchronous state without aggressive browser history pollution.

### [Minor] Filter Combinatorial Black Holes
The tri-modal filtering system (Project + Domain + Tech Stack) allows users to select combinations that result in zero content, offering a poor UX "dead end" without a clear path back.
*Remediation:* Implement predictive disabled states for filter pills that would result in zero matches based on the current context.

## Deferred Architectural Patterns (Phase 2)

The following patterns are architecturally sound but explicitly **out of scope for Phase 1 MVP**. They are preserved here so future implementation does not need to re-derive them.

### Mobile Degradation (FR7 — Deferred to v2)
The 3-column layout must NOT degrade into a single long vertical scroll on mobile. It must utilize a **Sticky Top Tab Bar** (`[Studio] | [Blueprints] | [Lab]`) on mobile (320px-767px) that swaps the visible column container, preserving the spatial mental model without scroll fatigue.

> _See PRD FR7 (marked deferred) and UX Spec §Responsive Design for context. Desktop-only (≥1024px) for Phase 1._
