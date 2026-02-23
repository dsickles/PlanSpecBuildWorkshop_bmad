---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-02-22'
inputDocuments: [
  "_bmad-output/planning-artifacts/prd.md",
  "_bmad-output/planning-artifacts/ux-design-specification.md",
  "_bmad-output/planning-artifacts/decision-matrix.md",
  "_bmad-output/planning-artifacts/technical-architecture.md"
]
workflowType: 'architecture'
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
Performance is paramount. The architecture must support near-instantaneous (0ms) client-side routing and a sub-1.0s FCP to maintain the "Command Center" user experience required by the UX Specification.

**Scale & Complexity:**
The data scale is minimal (low latency/storage needs), but the UI complexity is moderate due to the 3-column responsive layout requirements.

- Primary domain: Frontend Web (Jamstack/SSG)
- Complexity level: Low-to-Medium
- Estimated architectural components: ~5 core UI molecules (Universal Compound Cards, Document Modals, Grid Controllers).

### Technical Constraints & Dependencies

- Must be deployable to edge/static hosting (Vercel/Netlify) without dedicated backend container management.
- Content ingestion is strictly constrained to parsing markdown files and frontmatter from the Git repository.

### Cross-Cutting Concerns Identified

- **Markdown Abstraction:** Ensuring the markdown parser cleanly integrates with the tailored UI components without requiring manual HTML authoring.
- **Performance Budgeting:** Maintaining 0ms filter transitions as the portfolio grows to 10+ projects.

## Starter Template Evaluation

### Primary Technology Domain

Frontend Web Application (Jamstack/SSG) based on project requirements analysis.

### Starter Options Considered

A variety of Next.js 15 starters incorporating Tailwind CSS and shadcn/ui were evaluated. Many third-party templates include unnecessary abstractions (databases, authentication wrappers) that conflict with the simple, Git-backed markdown parsing required by the project.

### Selected Starter: Official Next.js + shadcn/ui Initialization

**Rationale for Selection:**
By using the official `create-next-app` combined with `shadcn-ui init`, we establish a zero-bloat foundation that aligns perfectly with the requirement for absolute control over the DOM markup and Tailwind configuration. This guarantees we can execute the precise "Linear Purist" aesthetic defined in the UX Specification without battling pre-existing theme logic. The Next.js App Router sets up the ideal architecture for our server-side markdown parsing and client-side (0ms) state filtering.

**Initialization Command:**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npx shadcn@latest init
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript on Node.js (Next.js 15).

**Styling Solution:**
Tailwind CSS v4 managed via a global CSS file, enabling our bespoke Tinted Neutrality design system.

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

**Markdown Ingestion Strategy: Custom Parser (`gray-matter` + `react-markdown`)**
- *Rationale:* Keeps source markdown files completely pure/agnostic (no React code inside the `.md` files).
- *Benefit:* Ensures that the portfolio markdown is fully portable to other stacks in the future. Total control over mapping plain markdown rules to specific Shadcn UI components.
- *Affects:* Core data fetching logic for the grid and document display.

### Frontend Architecture

**State Management: URL Query Parameters (`useSearchParams`)**
- *Rationale:* The UX Spec requires 0ms filtering across a 3-column layout. Using `?filter=` queries natively aligns with Next.js App Router capabilities.
- *Benefit:* Provides deep-linkable, shareable URLs for specific portfolio states (e.g., `?project=bmad&tab=docs`) without relying on brittle localized React state (`useState`) propagating across complex layouts.
- *Affects:* The 3-Column UI Grid and routing layer.

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
4. Implement the root layout using `useSearchParams` to control the display grid.

**Cross-Component Dependencies:**
The choice of `react-markdown` necessitates creating a strict mapping dictionary that ties standard HTML tags to our stylized Next.js components (e.g., intercepting a standard `<a>` tag and replacing it with a Next.js `<Link>`).

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
4 areas where AI agents could make different choices (Frontmatter schemas, content location, component boundaries, and error handling).

### Naming Patterns

**Frontmatter Naming Conventions:**
All markdown files must use strictly `camelCase` for YAML frontmatter keys (e.g., `publishDate`, `shortDescription`, `actionType`). This maps 1:1 with TypeScript interfaces and eliminates translation layers in the frontend code.

### Structure Patterns

**Content Organization:**
Markdown content is strictly decoupled from the Next.js `src` directory.
- All content lives in a root `/content/` directory.
- Projects are organized hierarchically: `/content/[project-slug]/[tab-name]/document.md` (e.g., `/content/plan-spec-build/docs/prd.md`).
- A project's UI display metadata is controlled via a `/content/[project-slug]/index.md` file (using the `title` and `order` frontmatter).

**Component Boundaries:**
- Primitive UI components installed by shadcn/ui go in `src/components/ui/` and **MUST NOT** be modified directly by AI agents to achieve custom designs.
- All custom composed components (e.g., `UniversalCompoundCard`, `ProjectSidebar`) must be placed in `src/components/custom/`.
- **The Compound Component Mandate:** The 3-column grid must be populated by a single `UniversalCompoundCard` architecture, not distinct card components. This component must expose a strict compound pattern (`<ProjectCard.Root>`, `<ProjectCard.Header>`, `<ProjectCard.Metadata>`, `<ProjectCard.Body>`) to ensure identical border, padding, and hover-state behavior across all columns, regardless of the internal data rendered.
- **Markdown Mapping Boundary:** A dedicated `MarkdownRenderer.tsx` wrapper must exist in `/src/components/custom/`. This acts as the *exclusive* dictionary mapping raw markdown syntax to styled shadcn primitives (e.g., converting `<a>` to `<Link>`).

### Process Patterns

**Routing & Application Behavior:**
- **Mobile Degradation (FR7):** The 3-column layout must NOT degrade into a single long vertical scroll. It must utilize a **Sticky Top Tab Bar** (`[Studio] | [Blueprints] | [Lab]`) on mobile (320px-767px) that swaps the visible column container, preserving the spatial mental model without scroll fatigue.
- **Missing Content:** If a requested markdown file does not exist, the Next.js server component must use the native `notFound()` function to gracefully trigger the 404 UI boundary.
- **Card Actions:** The UI behavior of a document or project card is controlled entirely by the `actionType` frontmatter string (or inferred by its column type / specific icon interactons):
    - `filter-view`: Updates the global URL parameter (e.g., `?project=x`) to filter the entire dashboard view. Triggered by the global Project Filter dropdowns at the top of the page, OR the local 'Layers' icon shortcut on a Blueprint or Prototype Card.
    - `document-view`: Updates URL parameters (e.g., `?project=x&document=y`) to open the markdown file in the internal reading pane.
    - `external-link`: Renders a standard `<a target="_blank">` tag using the accompanying `actionUrl` frontmatter string (used by the Prototype Rocket CTA).
    - `none`: The card body is strictly informational and does not trigger routing (e.g., Agent Studio and Prototype card bodies).

### Enforcement Guidelines

**All AI Agents MUST:**
- Never modify shadcn primitive components in `/ui/`.
- Always use `camelCase` for frontmatter schemas.
- Place all content in the root `/content/` directory following the strict hierarchical path.

**Documentation Enforcement:**
- A dedicated **`/content/README.md`** (or `README-CONTENT.md` at root) file MUST be created. This file will explicitly document the Content Creator (Product Manager) end-to-end flow, including the folder structure rules, the copy-pasteable YAML frontmatter schema, and the definitions of how `actionType` controls routing behavior. 
- The frontmatter schema must be strictly enforced in the codebase using **Zod validation**. Missing or malformed keys will throw a localized compilation error to notify the author.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
plan-spec-build-portfolio/
├── content/                     # 🔴 CONTENT BOUNDARY (Markdown Only)
│   ├── README-CONTENT.md        # The E2E PM guide + Frontmatter schemas
│   └── [project-slug]/          # e.g., plan-spec-build/
│       ├── index.md             # UI Display Metadata
│       ├── tools/               
│       ├── docs/                
│       │   └── [document].md    # Target markdown file
│       └── prototypes/          
├── src/                         # 🔵 LOGIC BOUNDARY (React/Next.js)
│   ├── app/                     # Routing & Layouts
│   │   ├── layout.tsx           # Global Shell (Sidebar + Main Grid)
│   │   ├── page.tsx             # Reads ?project= & ?document= state
│   │   ├── not-found.tsx        # Graceful 404 for missing markdown
│   │   └── globals.css          # Tailwind Tokens (Linear Purist)
│   ├── components/              
│   │   ├── ui/                  # ⚠️ SHADCN PRIMITIVES (DO NOT EDIT)
│   │   └── custom/              # 🟢 COMPOSED COMPONENTS
│   │       ├── ProjectSidebar.tsx
│   │       ├── UniversalCompoundCard.tsx
│   │       ├── GridController.tsx
│   │       └── MarkdownRenderer.tsx
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
The UI reacts to URL state (e.g., `?project=bmad&tab=docs`). The Next.js `page.tsx` reads these parameters and requests the corresponding parsed markdown data from `parser.ts`.

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
Both primary views defined in the UX Spec (the Navigation Sidebar and the 3-Column Document Grid) are fully supported by the Next.js App Router and the custom `ProjectSidebar.tsx` / `GridController.tsx` components.

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
