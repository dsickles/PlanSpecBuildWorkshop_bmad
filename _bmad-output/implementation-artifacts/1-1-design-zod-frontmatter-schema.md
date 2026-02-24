# Story 1.1: Design Zod Frontmatter Schema

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a System Architect,
I want to define a strict Zod schema for Markdown Frontmatter mapping to Domain, Tech Stack, and Status requirements,
so that the application knows exactly what data shape to expect and prevents bad data from breaking the UI.

## Acceptance Criteria

1.  **Given** the Next.js application,
2.  **When** designing the data layer,
3.  **Then** a `schema.ts` file exports a Zod object (`FrontmatterSchema`) defining all required PRD Frontmatter metadata fields.
4.  **And** it includes relational fields (`parent_project`, `related_docs`) to explicitly support deep linking in future Epics.
5.  **And** a specific `ErrorFrontmatter` fallback object definition exists for parsing failures, capturing the file path and a human-readable error message.

## Tasks / Subtasks

- [x] Task 1: Install Zod (Pre-Review Validation)
  - [x] Subtask 1.1: Add `zod` as a production dependency: `npm install zod`.
- [x] Task 2: Design the Zod Schema (AC: 3, 4)
  - [x] Subtask 2.1: Create `src/lib/schema.ts`.
  - [x] Subtask 2.2: Define the `FrontmatterSchema` Zod object with all required fields.
  - [x] Subtask 2.3: Export `FrontmatterData` as a TypeScript type.
- [x] Task 3: Define the Error Fallback Schema (AC: 5)
  - [x] Subtask 3.1: Define and export the `ErrorFrontmatter` interface.
  - [x] Subtask 3.2: Define and export a `ParsedContent` union type.
  - [x] Subtask 3.3: Export the `isError()` type-guard helper.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: `npm run lint` — clean.
  - [x] Subtask N.2: `git status --porcelain` — `src/lib/schema.ts` confirmed in the new `src/` untracked tree.

## Dev Notes

- **Schema Location:** `src/lib/` is the correct location for shared, non-React utility code. Do not put this in `src/components/` or `src/app/`.
- **Status Values:** The 4 status enum values (`Live`, `WIP`, `Concept`, `Archived`) MUST match exactly the token names configured in `globals.css` from Story 0.2 (they are used for the CSS class suffix, e.g., `bg-status-live-bg`).
- **Date as String:** Use `z.string()` for the date field, NOT `z.date()`. gray-matter (Story 1.3) parses YAML dates as JavaScript `Date` objects in some environments, not strings. Normalizing to `z.string()` at the schema level avoids downstream inconsistencies.  Convert to Date objects only in presentation/formatting utility functions.
- **No Runtime Validation Yet:** This story is purely the schema DEFINITION. The actual `gray-matter` parsing and Zod `.parse()` / `.safeParse()` calls happen in Story 1.3. Keep this file as pure type/schema exports with no file system or network calls.
- **Error Fallback Design:** The `ErrorFrontmatter` type uses a discriminated union pattern (`_error: true`). The `isError` type guard is the canonical way to differentiate between valid and error states throughout the rendering pipeline. Never throw — always return the error fallback.

### Project Structure Notes

- New file: `src/lib/schema.ts`
- No changes required to `src/app/` or `src/components/` in this story.
- This schema is the **single source of truth** for content shape across the entire app.

### References

- [Source: epics.md#Story 1.1: Design Zod Frontmatter Schema]
- [Source: prd.md#FR1, FR2, FR3 — Content Ingestion Requirements]
- [Source: ux-design-specification.md#Status Pills — 4 canonical values: Live, WIP, Concept, Archived]
- [Source: ux-design-specification.md#Error/Fallback state — dashed border, [Error] pill]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

- Zod was already present as a transitive dependency of shadcn/ui — no new package install required.
- Created `src/lib/schema.ts` as the single source of truth for all content shape in the application.
- `FrontmatterSchema` exports 10 fields covering all PRD requirements (FR1–FR4).
- `status` enum values are exactly `Live`, `WIP`, `Concept`, `Archived` — matching Story 0.2 CSS token names.
- `date` stored as `z.string()` (not `z.date()`) to avoid gray-matter YAML date parsing inconsistencies.
- `ErrorFrontmatter` uses `_error: true` discriminant; `isError()` type guard is the canonical way to narrow the union.
- Also exported `STATUS_VALUES`, `ARTIFACT_TYPES` as `as const` arrays for reuse in filter UI components (Epic 3).
- **Review Fix Applied:** Replaced Zod v3-style `errorMap` callback with Zod v4's `error` string param on `z.enum(STATUS_VALUES)`. The project uses Zod v4.3.6 (via shadcn/ui) and `errorMap` was removed in v4.

### File List

<!-- ⚠️ POPULATE THIS AT STORY START, not at the end. Add every file you plan to touch here BEFORE you begin implementing.
     Update throughout development. Final check: run `git status --porcelain` before moving to review and confirm this list matches. -->

- `src/lib/schema.ts`
- `package.json`
- `package-lock.json`
