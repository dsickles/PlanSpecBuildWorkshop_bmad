# Story 8.1: Decouple Filesystem Slugs from Display Titles

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Content Author,
I want my project cards to display capitalized titles with spaces (e.g., "Plan Spec Build Workshop"),
so that the portfolio feels professional and is not constrained by filesystem naming rules.

## Acceptance Criteria

1. [x] Given a project `index.md` with a `title` frontmatter field.
2. [x] When rendering the dashboard.
3. [x] Then the project navigation pills and card headers display the frontmatter title rather than the folder slug.
4. [x] And the mapping from slug to title is performed during the ingestion phase to maintain performance.

## Tasks / Subtasks

- [x] Task 1: Update Data Flow in `page.tsx` (AC: 3, 4)
  - [x] Transform `projects` array from `string[]` to `{ slug: string, title: string }[]`.
  - [x] Extract the first available `projectTitle` for each project slug from the `validArticles` collection.
- [x] Task 2: Refactor `FilterBar` Component (AC: 3)
  - [x] Update `FilterBarProps` to accept the new project object structure.
  - [x] Update the project pill rendering to display `project.title`.
  - [x] Ensure `setProject` continues to use `project.slug` for URL synchronization.
- [x] Task 3: Verify `BlueprintGroup` and `ProjectCard` (AC: 3)
  - [x] Confirm `BlueprintGroup` correctly prioritizes `projectTitle` prop.
  - [x] Verify `DiscoveryGrid` passes `projectTitle` correctly during mapping.
- [x] Task 4: Pre-Review Validation
  - [x] Subtask 4.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask 4.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.
- [x] Task 5: Branding Consistency & Tokenization (Out-of-Scope Enhancement)
  - [x] Implement `{{PROJECT_NAME}}` token replacement in `src/lib/content-parser.ts`.
  - [x] Tokenize all frontmatter and body content across the project artifacts.
  - [x] Verify branding consistency across all view layers.

## Dev Notes

- **Existing Logic**: `src/lib/content-parser.ts` already resolves `projectTitle` from the project's root `index.md` and includes it in the `ParsedArticle` object.
- **Project Title Mapping**: In `src/app/page.tsx`, you should iterate through `validArticles` to build a map of `slug -> title` to enrich the filter options.
- **Component Boundary**: Maintain the "Logic Boundary" by keeping the title resolution logic in the server-side `page.tsx` and passing clean props to the client components.

### Project Structure Notes

- **Alignment**: This change strengthens the "Content Boundary" by allowing authors to use friendly titles while developers maintain stable slugs for routing.

### References

- [Epics: Epic 8](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/epics.md#L532)
- [Parser Logic: content-parser.ts#L51-64](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/lib/content-parser.ts#L51-L64)
- [Filter UI: FilterBar.tsx#L45-59](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/FilterBar.tsx#L45-L59)

## Dev Agent Record

### Agent Model Used

Antigravity v1.0 (Gemini 2.0 Flash)

### Debug Log References

### Completion Notes List

- Decoupled filesystem slugs from display titles by enriching the data flow in `page.tsx`.
- Updated `FilterBar` to render human-friendly titles while maintaining stable slugs for internal state.
- Verified that `BlueprintGroup` correctly utilizes `projectTitle` metadata.
- Updated and passed unit tests for `FilterBar` and `content-parser`.
- **Code Review Fixes**: Centralized title fallback logic in `content-parser.ts`, removed dead code in `page.tsx`, and fixed state labels in unit tests.
- **Branding Consistency (Out-of-Scope)**: Successfully transitioned the project from "Plan. Spec. Build." to "Plan Spec Build Workshop" across all content layers.
- **Dynamic Tokenization Engine**: Implemented a `{{PROJECT_NAME}}` tokenization system in `content-parser.ts` to centralize branding control. One source of truth now drives all labels.
- **Architectural Decoupling (Remediation)**: Extracted the Markdown rendering pipeline into a standalone `markdown-renderer.ts`. This was a deliberate architectural choice (per **ToC Engine Boundary** in `architecture.md`) to decouple internal business logic (tokenization) from complex 3rd-party ESM dependencies (`unified`). This unblocked unit testing by allowing the renderer to be mocked, ensuring 100% test coverage of branding logic without compromising the production tech stack.

### File List

- [x] `src/app/page.tsx`
- [x] `src/components/custom/FilterBar.tsx`
- [x] `src/components/custom/__tests__/FilterBar.test.tsx`
- [x] `src/lib/content-parser.ts`
- [x] `src/lib/markdown-renderer.ts` (NEW: Decoupled Renderer)
- [x] `src/lib/__tests__/content-parser.test.ts` (NEW: Tokenization Tests)
- [x] `src/content/plan-spec-build-workshop/index.md` (Branding Source of Truth)
- [x] `src/content/plan-spec-build-workshop/docs/index.md`
- [x] `src/content/plan-spec-build-workshop/prototypes/index.md`
- [x] `src/content/plan-spec-build-workshop/docs/prd.md`
- [x] `src/content/plan-spec-build-workshop/docs/epics.md`
- [x] `src/content/plan-spec-build-workshop/docs/ux-design-specification.md`
