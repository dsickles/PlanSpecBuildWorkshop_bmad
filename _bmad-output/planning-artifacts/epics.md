---
stepsCompleted: []
inputDocuments: [
  "_bmad-output/planning-artifacts/prd.md",
  "_bmad-output/planning-artifacts/architecture.md",
  "_bmad-output/planning-artifacts/ux-design-specification.md"
]
---

# Projects - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Projects, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1: The Author can publish new projects by adding markdown folders to the project repository.
- FR2: The Author can update project metadata (e.g., Domain, Tech Stack) via frontmatter configuration.
- FR3: The Author can publish distinct artifact types (PRD, Test Plan, Decision Matrix) for a single project.
- FR4: The System can parse standard markdown elements (headers, lists, bold/italics), specifically GitHub-flavored markdown (tables, code blocks).
- FR5: The System must display projects and their artifacts in a 3-column layout (Agent Studio, Blueprints, Build Lab).
- FR6: The User can navigate between a project's tools, documents, and prototypes instantly (0ms UI re-render) without triggering a full page reload.
- FR7: The System must adapt the 3-column layout to a stacked, usable layout on mobile devices.
- FR8: The User can toggle between Light and Dark interface modes.
- FR9: The User can filter the portfolio view by "Project".
- FR10: The User can filter the portfolio view by "Functional Domain" (e.g., Internal Tools, B2B SaaS).
- FR11: The User can filter the portfolio view by "Tech Stack" (e.g., Python, React).
- FR12: The User can view "at a glance" summary metadata on all project and artifact cards prior to clicking them.
- FR13: The User can navigate directly from a specific prototype back to its accompanying documentation (e.g., its specific Decision Matrix) via explicit intra-linking.
- FR14: The User can access an "About this Project" educational page from the global navigation.
- FR15: The User can access a "Fork a Workshop" link to copy the underlying repository template.
- FR16: The System must present the portfolio itself ("Plan. Spec. Build.") as the first selectable project (The Meta-Blueprint).
- FR17: The User can view all portfolio content (projects, blueprints, prototypes) without requiring authentication or an account on any external platform.

### NonFunctional Requirements

- NFR1: First Contentful Paint (FCP) must occur within 1.0 second on a standard 4G connection.
- NFR2: Client-side routing between the three main columns (Studio, Blueprints, Lab) must complete in under 100 milliseconds.
- NFR3: The application must achieve a Google Lighthouse Performance score of 90+.
- NFR4: The application must strictly adhere to WCAG 2.1 Level AA conformance.
- NFR5: The application must achieve a Google Lighthouse Accessibility score of 95+ (verifying contrast ratios, ARIA labels, and keyboard navigability).
- NFR6: The system must support automated deployments triggered directly from `git push` events without manual server configuration.
- NFR7: System uptime will rely entirely on the chosen edge hosting provider's SLA (e.g., Vercel or Netlify's 99.99% edge network uptime), requiring no dedicated backend container management.
- NFR8: The application must achieve a Google Lighthouse SEO score of 90+.
- NFR9: Full site rebuild (SSG) must complete in under 60 seconds with up to 20 projects.

### Additional Requirements

#### Technical Requirements (from Architecture)
- **Starter Template:** Official Next.js + shadcn/ui Initialization (Next.js 15, Tailwind CSS v4, TypeScript). Note: Project initialization using this command should be the first implementation story.
- **Infrastructure:** Vercel for hosting and automated CI/CD.
- **Data Architecture:** Git-CMS utilizing `gray-matter` for frontmatter parsing and `react-markdown` for content rendering.
- **State Management:** URL Query Parameters (`useSearchParams`) for 0ms filtering states.
- **Structure:** Content lives strictly in `/content/` directory, organized hierarchically, separate from `/src/`.
- **Component Boundaries:** Primitive shadcn/ui components in `src/components/ui/` must not be modified directly. Custom composed components reside in `src/components/custom/`.
- **Error Handling:** Graceful 404 for missing markdown. Zod validation errors for frontmatter must log and skip rendering without crashing the build.
- **Frontmatter Schema:** Strictly enforce camelCase keys validated via Zod.

#### Design Requirements (from UX Spec)
- **Design System:** shadcn/ui + Tailwind CSS with a "Tinted Neutrality" dark mode palette (Zinc preset).
- **Responsive Layout:** 3-column desktop, 2-column tablet, and sticky top tab bar for mobile to maintain the spatial model without scroll fatigue.
- **Interactions:** Instantaneous (0ms) hard cuts for filtering (Phase 1). No drop shadows; use subtle background shifts for hover states. Keyboard focus requires explicit high-contrast rings.
- **Empty States:** Missing prototypes display a dashed border card with a specific Status Pill (e.g., `[Concept]`).

### FR Coverage Map

- FR1: Epic 3 - Author publishing via markdown folders
- FR2: Epic 3 - Metadata updates via frontmatter
- FR3: Epic 3 - Different artifact parsing types
- FR4: Epic 3 - Markdown elements parsing
- FR5: Epic 2 - The 3-column core layout
- FR6: Epic 4 - 0ms filtering state
- FR7: Epic 2 - Mobile-responsive layout constraints
- FR8: Epic 1 - Dark/Light mode theme system
- FR9: Epic 4 - Filtering by Project
- FR10: Epic 4 - Filtering by Functional Domain
- FR11: Epic 4 - Filtering by Tech Stack
- FR12: Epic 4 - Project Card metadata structure
- FR13: Epic 5 - Prototype to Document intra-linking
- FR14: Epic 6 - About this Project global page
- FR15: Epic 6 - Fork a Workshop external link
- FR16: Epic 2 - Meta-Blueprint first project selection
- FR17: Epic 5 - Unauthenticated content access

## Epic List

### Epic 1: The Design System & Foundational UI
As a developer/designer, I can reference a living "Design System" `/design-system` page that validates all core shadcn/ui components (buttons, badges, cards, typography) and the custom "Tinted Neutrality" dark/light mode styling in one place, ensuring visual consistency before building complex layouts.
**FRs covered:** FR8

### Epic 2: The "Meta-Blueprint" 3-Column Command Center
As a user evaluating the portfolio, I land on a fast, responsive 3-column "Command Center" layout that immediately presents the portfolio's core framework (Project #1: "Plan. Spec. Build."). This proves the structural integrity of the application.
**FRs covered:** FR5, FR7, FR16

### Epic 3: The "Git-CMS" Publishing Engine
As an Author, I can publish new projects, update metadata, and add various artifact types simply by committing markdown files (with validated frontmatter) to a specific repository structure, triggering an automated deployment.
**FRs covered:** FR1, FR2, FR3, FR4

### Epic 4: Tri-Modal Filtering & Discovery
As a user evaluating the portfolio, I can instantly (0ms) filter the displayed projects by "Project name," "Functional Domain," or "Tech Stack" without page reloads, allowing me to find exactly the experience I'm looking for. Let it also be known I can see "at a glance" summary metadata for the projects.
**FRs covered:** FR6, FR9, FR10, FR11, FR12

### Epic 5: The "Aha!" Interlocking Ecosystem
As an evaluator, I can traverse fluidly from a working prototype directly back to the specific architectural or design document that defined it, proving the PM's strategic rigor.
**FRs covered:** FR13, FR17

### Epic 6: The "Peer PM" Educational Onboarding
As a Peer PM inspired by the portfolio, I can read a dedicated "About this Project" page explaining the philosophy and then seamlessly fork the underlying repository to start my own journey.
**FRs covered:** FR14, FR15

<!-- Repeat for each epic in epics_list (N = 1, 2, 3...) -->

## Epic 1: The Design System & Foundational UI

As a developer/designer, I can reference a living "Design System" `/design-system` page that validates all core shadcn/ui components (buttons, badges, cards, typography) and the custom "Tinted Neutrality" dark/light mode styling in one place, ensuring visual consistency before building complex layouts.

### Story 1.1: System Initialization

As a developer,
I want to initialize the Next.js and shadcn/ui starter template,
So that I have a functional local development environment.

**Acceptance Criteria:**

**Given** an empty repository
**When** I run the Next.js initialization command documented in the Architecture
**Then** a Next.js 15 app with Tailwind CSS v4 and TypeScript is created
**And** the local dev server starts without errors
**And** strict TypeScript and ESLint configuration passes without warnings locally.

### Story 1.2: "Tinted Neutrality" Global Styling

As a designer,
I want the global CSS and Tailwind config to enforce the "Tinted Neutrality" color system and typography scale,
So that all future components automatically inherit the premium studio aesthetic.

**Acceptance Criteria:**

**Given** the initialized Next.js app
**When** I configure `globals.css` and `tailwind.config.ts`
**Then** the strict Zinc-based grayscale palette is available
**And** Inter is established as the primary sans-serif font
**And** dark/light mode CSS variables are accessible to Tailwind.

### Story 1.3: Core shadcn/ui Primitives

As a developer,
I want to install the core shadcn/ui primitive components,
So that I can compose complex layouts without modifying vendor code.

**Acceptance Criteria:**

**Given** the configured Tailwind environment and `shadcn` CLI
**When** I install the Badge, Button, and Card components
**Then** they are placed in `src/components/ui/` without custom modifications
**And** composed custom layouts utilizing them are enforced to live in `src/components/custom/`
**And** base component styles respect the "Tinted Neutrality" design system (specifically no drop shadows, only subtle background shifts on hover).

### Story 1.4: The Living Design System Route

As a developer/designer,
I want a dedicated `/design-system` route displaying all customized components and tags in both Light and Dark modes,
So that I can visually validate the UI foundation before building the main portfolio views.

**Acceptance Criteria:**

**Given** the installed shadcn primitives and global CSS
**When** I navigate to `/design-system`
**Then** I see all typographic scales (H1-p)
**And** I see examples of all 4 Status Pill variations (Live, In Progress, Concept, Archived)
**And** I see the dashed border "Empty State" component pattern
**And** I can toggle between Light and Dark mode to visually verify contrast.
