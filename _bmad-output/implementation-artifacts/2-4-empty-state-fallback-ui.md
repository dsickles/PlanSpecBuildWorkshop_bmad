# Story 2.4: Empty State & Fallback UI

Status: review

## Story

As a User,
I want to see a clear placeholder if a specific column is empty for a given project,
So that I am not confused by jarring blank spaces in the structural grid.

## Acceptance Criteria

1. **Given** a project that lacks a specific artifact type (e.g., no Prototypes exist yet),
2. **When** the `DashboardGrid` attempts to render that column,
3. **Then** a styled fallback component matching the `[Concept]` status (dashed border) is rendered in that specific slot to maintain the structural rhythm of the page, rather than collapsing the grid or showing unstyled text.

## Tasks / Subtasks

- [x] Task 1: Create Fallback Card UI
  - [x] Subtask 1.1: Build an empty state card leveraging `ProjectCardRoot` with `isDashed={true}`.
  - [x] Subtask 1.2: Include a relevant placeholder message (e.g., "No Agents Available") and a `Concept` status pill.
- [x] Task 2: Implement Conditional Rendering in DashboardGrid Columns
  - [x] Subtask 2.1: Update `page.tsx`'s Agent Studio column logic to render the empty state card if no agents (or agent errors) are found.
  - [x] Subtask 2.2: Update the Blueprints column logic to render an empty state if no docs are found.
  - [x] Subtask 2.3: Update the Build Lab column logic to render an empty state if no prototypes are found.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Temporarily clear content folders to test empty states in the browser, ensuring layout stability.
  - [x] Subtask N.2: Run `npm run lint` and `npx tsc --noEmit`.

## Dev Notes
- Empty states ensure the CSS Grid columns don't visually collapse or look broken when data is missing for a given artifact type.
- Architecture states: "If a content file has malformed frontmatter, the affected card renders with a dashed border...". We extend this dashed visual language to the "Missing/Empty" states to maintain "Tinted Neutrality" UX consistency.

## Dev Agent Record

### Agent Model Used
Gemini 2.5 Pro

### Completion Notes List
- Extracted dashed border logic into a reusable `<FallbackCard>` export in `project-card.tsx`.
- Applied `<FallbackCard>` internally to replace hardcoded `<ProjectCard status="Concept"/>` error states across all columns in `page.tsx`.
- Implemented conditional Empty State fallbacks in `page.tsx` that render if arrays (agents, docs, prototypes) are length 0 and no error states are present for that type.

### File List
- `src/components/content/project-card.tsx` [MODIFIED]
- `src/app/page.tsx` [MODIFIED]
