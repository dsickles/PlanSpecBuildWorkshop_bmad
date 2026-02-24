# Story 2.1: Build Universal ProjectCard Component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to see summary metadata (Title, Domain, Tech Stack, Status) for both Projects and Artifacts in a consistent visual format,
so that I can quickly scan and evaluate the portfolio content before clicking.

## Acceptance Criteria

1. **Given** the UX mockup design,
2. **When** rendering a project or artifact,
3. **Then** a `ProjectCard` compound component is displayed matching the visual schema (borders, typography, hover states).
4. **And** it implements conditional rendering for the primary actionable link target based on the Artifact Type (e.g., rendering an external `target="_blank"` link with the solid blue CTA specifically for Prototypes, and standard internal router links for Docs/Agents).

## Tasks / Subtasks

- [x] Task 1: Install required shadcn/ui primitives (AC: 3)
  - [x] Subtask 1.1: Ran `npx shadcn@latest add card badge button separator --yes`. 4 components installed into `src/components/ui/`.
  - [x] Subtask 1.2: Confirmed components NOT modified — unaltered shadcn primitives.
- [x] Task 2: Create `ProjectCardRoot` sub-component (AC: 3)
  - [x] Subtask 2.1: Created `src/components/content/project-card.tsx`.
  - [x] Subtask 2.2: Implemented `ProjectCardRoot` with border, padding, hover-state. `transition-colors duration-200`.
  - [x] Subtask 2.3: Hover background shifts `bg-zinc-900` → `bg-zinc-800/80`. No drop-shadows confirmed.
- [x] Task 3: Create `ProjectCardHeader` sub-component (AC: 3)
  - [x] Subtask 3.1: Title rendered as `<h3>` with `text-lg font-semibold text-white line-clamp-2`.
  - [x] Subtask 3.2: Date rendered as `text-xs text-zinc-500`.
  - [x] Subtask 3.3: `StatusPill` implemented with exact rgba values from UX spec via `STATUS_STYLES` map.
- [x] Task 4: Create `ProjectCardMetadata` sub-component (AC: 3)
  - [x] Subtask 4.1: `FnTag`: `bg-zinc-800 text-zinc-300`.
  - [x] Subtask 4.2: `TechTag`: `border border-zinc-800 text-zinc-400 bg-transparent`.
- [x] Task 5: Create `ProjectCardBody` sub-component (AC: 3)
  - [x] Subtask 5.1: Description renders as `text-sm text-zinc-400 line-clamp-3`.
- [x] Task 6: Implement CardActions (AC: 4) — conditional by artifact type
  - [x] Subtask 6.1: Prototype: blue Rocket button (`bg-blue-600`) as `<a target="_blank">`. Hidden in Concept state.
  - [x] Subtask 6.2: Doc: FileText `IconButton` with `onDocOpen` callback (placeholder for Epic 3 Document Modal).
  - [x] Subtask 6.3: Agent: no action icons — purely informational.
  - [x] Subtask 6.4: All secondary icons use `text-zinc-500 hover:text-white hover:bg-zinc-800` transition.
- [x] Task 7: Export `ProjectCard` namespace object — `{ Root, Header, Metadata, Body }` (AC: 3)
  - [x] Subtask 7.1: Exported via `ProjectCard.Root = ProjectCardRoot` etc. Also exposes `StatusPill`, `FnTag`, `TechTag`.
- [x] Task 8: Wire into page.tsx for smoke-test visual (AC: 3)
  - [x] Subtask 8.1: `page.tsx` updated with one Agent, one Doc, and one Prototype card in the 3 column slots.
  - [x] Subtask 8.2: All 3 cards visible in browser matching expected layout.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: `npm run lint` — clean (0 errors, 0 warnings after removing unused imports).
  - [x] Subtask N.2: `npx tsc --noEmit` — clean.
  - [x] Subtask N.3: `git status --porcelain` verified — all 7 files documented in File List.

## Dev Notes

### ⚠️ Architecture Compliance — YOU MUST FOLLOW THESE RULES

1. **Component Boundaries (CRITICAL):**
   - Shadcn/ui primitive components (Card, Badge, Button) go in `src/components/ui/` — **NEVER modify files in `/ui/`**.
   - All custom composed components (including `ProjectCard`) go in **`src/components/content/`** (NOT `custom/` — architecture originally specified `custom/` but the existing project uses `content/` per Epic 0 retro).
   - Adjust any architecture references to `custom/` → use `content/` for consistency with the established project structure.

2. **Compound Component Pattern (MANDATORY):**
   The architecture explicitly mandates: _"The Compound Component Mandate: The 3-column grid must be populated by a single `UniversalCompoundCard` architecture, not distinct card components."_
   - Named in this story as `ProjectCard` for clarity.
   - Must expose: `ProjectCard.Root`, `ProjectCard.Header`, `ProjectCard.Metadata`, `ProjectCard.Body`.
   - **This ensures identical border, padding, and hover-state behavior across all three columns regardless of internal data.**

3. **Type Safety — use `ParsedArticle` from Epic 1:**
   - `ParsedArticle` and `ErrorFrontmatter` from `src/lib/content-parser.ts` are the canonical data types.
   - `ParsedArticle.artifactType` (type `ArtifactType` from schema.ts) drives the action rendering.
   - `ArtifactType` values: `"agent"`, `"doc"`, `"prototype"` — confirmed from `ARTIFACT_TYPES` in `src/lib/schema.ts`.
   - Status values: `"Live"`, `"WIP"`, `"Concept"`, `"Archived"` — confirmed from `STATUS_VALUES` in `src/lib/schema.ts`.

4. **No `actionType` frontmatter needed for this story:**
   The architecture document shows an `actionType` schema field, but the Epic 1 Zod schema (`FrontmatterSchema`) already determines behavior via `artifact_type`. **Do not add a new `actionType` field to the schema.** Route actions by `artifactType` instead, as the Zod schema is the established source of truth.

### "Tinted Neutrality" Status Pills — Exact Color Values

These are non-negotiable from the UX spec. Use `style=` props with the exact rgba values rather than Tailwind classes (which would round to nearest preset):

| Status | Background | Text | Border |
|---|---|---|---|
| `Live` | `rgba(16,185,129,.1)` | `#34d399` | `rgba(16,185,129,.2)` |
| `WIP` | `rgba(245,158,11,.1)` | `#fbbf24` | `rgba(245,158,11,.2)` |
| `Concept` | `rgba(161,161,170,.08)` | `#a1a1aa` | `#3f3f46` |
| `Archived` | `rgba(244,63,94,.08)` | `#fb7185` | `rgba(244,63,94,.2)` |

Pill anatomy: `rounded-full px-2 py-0.5 text-xs font-medium` with above inline styles.

### Card Layouts by ArtifactType

**Agent Card** (Studio column):
- Status pill inline to the right of H3 title
- Description body — 2-sentence executive summary
- Functional Tags (`tag-fn`) row
- Tech Stack Tags (`tag-tc`) row
- **No action icons whatsoever**

**Doc Card** (Blueprints column):
- Status pill inline to the right of the row title
- Date (`text-xs text-zinc-500`)
- File icon button → will trigger Document Modal in Epic 3 (placeholder `onClick` for now)
- Chevron icon to expand/collapse document rows (state managed with `useState` — blueprint card only exception to URL state strategy)

**Prototype Card** (Build Lab column):
- Title H3 + Status pill inline
- Right-aligned actions: Layers icon + GitHub icon + Rocket 🚀 button (`bg-blue-600`)
- Description body — one sentence
- Functional Tags + Tech Stack Tags rows
- **Concept state**: border-dashed, no Rocket CTA, no GitHub icon, `[Concept]` pill

### Hover & Focus Rules

- Mouse hover: Background shifts `bg-zinc-900` → `bg-zinc-800/80`. **No drop-shadows.** `transition-colors duration-200`.
- Keyboard focus: `focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2`. Separate visual from hover.
- Secondary icons: `text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md p-1 transition-colors`

### line-clamp Defensive Rendering

From Story 2.2 AC: All text-heavy content must use `line-clamp` to prevent grid blow-out:
- Titles: `line-clamp-2`
- Descriptions: `line-clamp-3`
- Tag lists: `flex-wrap` with `max-h-12 overflow-hidden` to prevent unbounded growth

### Lucide-React Icons

These are already installed (`"lucide-react": "^0.575.0"` in package.json). Import as needed:
- Rocket: `import { Rocket } from "lucide-react"`
- Layers: `import { Layers } from "lucide-react"`
- Github: `import { Github } from "lucide-react"`
- FileText: `import { FileText } from "lucide-react"`
- ChevronDown: `import { ChevronDown } from "lucide-react"`

### Anti-Patterns — DO NOT DO THESE

- ❌ Do not create `AgentCard.tsx`, `DocCard.tsx`, `PrototypeCard.tsx` separately — one compound component only.
- ❌ Do not add `actionType` to the Zod schema — use `artifactType` from the existing schema.
- ❌ Do not modify files in `src/components/ui/` — shadcn primitives are immutable.
- ❌ Do not use `box-shadow` or Tailwind `shadow-*` for hover states — background shift only.
- ❌ Do not use Tailwind color classes for status pill colors — use inline `style=` with exact rgba values from the table above.

### From Previous Stories

- `"use server"` is for Server Actions only — utility modules use comment annotation.
- All Epic 1 server-side utilities (`content-parser.ts`, `content-utils.ts`) are already stable and importable.
- The Zod schema uses `snake_case` for frontmatter keys (`tech_stack`, `artifact_type`, `parent_project`, `related_docs`).
- `ParsedArticle` type: `FrontmatterData & { html: string; projectSlug: string; artifactType: ArtifactType }`.

### Project Structure Notes

New files created:
- `src/components/content/project-card.tsx` — The universal compound card component

Modified files:
- `src/app/page.tsx` — Updated smoke test to render sample cards in each column slot
- `src/components/ui/*.tsx` — New shadcn primitives (added by `shadcn add` — do not edit)

### References

- [Source: ux-design-specification.md#Custom Components] — Full card anatomy specs for all 3 types
- [Source: ux-design-specification.md#The Tagging System ("Tinted Neutrality")] — Exact status pill rgba values
- [Source: ux-design-specification.md#Interactive Feedback (Focus & Hover States)] — Hover/focus rules
- [Source: architecture.md#Component Boundaries] — `src/components/content/` for custom components
- [Source: architecture.md#The Compound Component Mandate] — Single `ProjectCard` compound pattern
- [Source: epics.md#Story 2.1] — Acceptance criteria

## Dev Agent Record

### Agent Model Used

Gemini 2.5 Pro

### Debug Log References

### Completion Notes List

- Installed shadcn primitives: `card`, `badge`, `button`, `separator` via `npx shadcn@latest add --yes`. All in `src/components/ui/`, untouched.
- Created `ProjectCard` compound component with sub-components: `Root`, `Header`, `Metadata`, `Body`, `StatusPill`, `FnTag`, `TechTag`, `IconButton`.
- Status pills use exact rgba values from UX spec (`STATUS_STYLES` map). No Tailwind color classes — inline `style=` props as specified.
- Hover state: `transition-colors duration-200 hover:bg-zinc-800/80 hover:border-zinc-700`. No box-shadows.
- Keyboard a11y: `focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2` on Root and all interactive buttons.
- All 3 artifact types handled: Agent (no icons), Doc (FileText icon → Epic 3 modal), Prototype (Rocket blue CTA + optional GitHub + Layers).
- Prototype Concept state: `isDashed=true` border, Rocket and GitHub icons hidden.
- `line-clamp-2` on titles, `line-clamp-3` on descriptions, `max-h-12 overflow-hidden` on tag rows — defensive grid layout protection.
- Removed `useState` and `ChevronDown` imports (blueprint expand/collapse is Story 3.x scope) to pass ESLint clean.
- `page.tsx` updated with representative cards in all 3 columns for visual smoke test.
- ESLint: ✅ 0 errors, 0 warnings. TypeScript `--noEmit`: ✅ clean.

### File List

- `src/components/content/project-card.tsx` [NEW]
- `src/components/ui/card.tsx` [NEW - shadcn]
- `src/components/ui/badge.tsx` [NEW - shadcn]
- `src/components/ui/button.tsx` [NEW - shadcn]
- `src/components/ui/separator.tsx` [NEW - shadcn]
- `src/app/page.tsx` [MODIFIED]

## Senior Developer Review (AI)

**Date:** 2026-02-23
**Outcome:** Changes Requested → Auto-Fixed → ✅ Approved

### Action Items

- [x] [HIGH] `"use client"` comment appeared before the directive — must be FIRST line per Next.js App Router spec. Swapped order.
- [x] [MEDIUM] `isConcept` guard missed `Archived` prototypes — Rocket and GitHub icons would appear on deprecated/dead links. Renamed to `isInactive = status === "Concept" || status === "Archived"` and applied to `isDashed` and CTA visibility.
- [x] [MEDIUM] Empty doc `actions` fragment was always truthy — caused `ProjectCardHeader` to render an empty `<div>`. Made actions conditional (inline ternary, `undefined` when both callbacks absent).
- [x] [MEDIUM] `focus-visible` ring on `ProjectCardRoot` `<div>` is dead CSS — non-focusable element never triggers `focus-visible`. Removed from Root; interactive children (buttons/anchors inside `IconButton`) correctly apply their own rings.
- [x] [LOW] `externalUrl` prop naming mismatch vs Zod schema `external_url` — added JSDoc comment documenting the required mapping for Story 2.2 dev.

### Post-Fix Validation

- `npm run lint`: ✅ 0 errors, 0 warnings
- `npx tsc --noEmit`: ✅ clean
