# Story 9.2: Agentic Tool Documentation Viewer

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to view deep-dives into "how it works" for specific agentic tools, including a list of projects that used them,
so that I can understand the methodology and history behind the tools in the Agent Studio.

## Acceptance Criteria

1. **Given** an Agent Studio card,
2. **When** clicking the documentation icon (FileText icon),
3. **Then** the `MarkdownDocumentModal` opens displaying the agent's full documentation.
4. **And** an auto-generated list of associated projects (titles and links) is displayed at the bottom of the document.
5. **And** the project list is derived from the `projects` frontmatter field in the agent's markdown file.
6. **And** the display names (titles) for these projects are resolved from their respective `index.md` files.

## Tasks / Subtasks

- [x] Task 1: Update Schema (AC: 4, 5)
  - [x] Add `associatedProjects?: { slug: string; title: string }[]` to `ParsedArticle` type in `src/lib/schema.ts`.
- [x] Task 2: Enhance Parsing Logic (AC: 5, 6)
  - [x] Update `parseMarkdownFile` in `src/lib/content-parser.ts` to resolve `projects` slugs into `associatedProjects` (slug + title) objects.
  - [x] Ensure the resolution uses the `TITLE_CACHE` for efficiency.
- [x] Task 3: Wire UI Interaction (AC: 1, 2, 3)
  - [x] Update `DiscoveryGrid.tsx` to pass `onDocOpen={handleDocOpen}` to `ProjectCard` in the Agent Studio column.
- [x] Task 4: Render Associated Projects List (AC: 4)
  - [x] Update `MarkdownDocumentModal.tsx` to detect if the active document is an agent and has `associatedProjects`.
  - [x] Render a "Projects using this tool" section at the bottom of the document body.
- [x] Task 5: Pre-Review Validation
  - [x] Subtask 5.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask 5.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.
  - [x] Subtask 5.3: Verify documentation modal opens for agents and shows the project list.

## Dev Notes

- **Associated Projects Resolution**: The `projects` field in agent frontmatter contains project slugs. Use `TITLE_CACHE` (already implemented in `content-parser.ts`) to get the human-readable titles.
- **UI Logic**: Agent cards already have `onDocOpen` support in `ProjectCard.tsx`, but `DiscoveryGrid.tsx` currently doesn't pass the handler to them.
- **Rendering**: The project list in the modal should be styled to match the "Linear Purist" aesthetic (muted, Zinc-based styling).
- **Filtering Logic**: Implemented `updateFilters` in `useFilterState.ts` to solve a race condition when simultaneously clearing the document view and applying a project filter.

### Project Structure Notes

- Schema: `src/lib/schema.ts`
- Parser: `src/lib/content-parser.ts`
- Dashboard: `src/components/custom/DiscoveryGrid.tsx`
- Modal: `src/components/custom/MarkdownDocumentModal.tsx`
- State: `src/hooks/useFilterState.ts`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 9.2]
- [Source: src/lib/schema.ts]
- [Source: src/lib/content-parser.ts]

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Flash)

### Debug Log References

- Fixed race condition in project filtering via bulk parameter update.
- Updated `DocumentSlugSchema` to support PascalCase agent IDs.
- Aligned modal styling with design system (`border-zinc-800/50`).

### Completion Notes List

- All ACs implemented and verified.
- Unit tests added for `associatedProjects` resolution.
- UI race conditions resolved.

### File List

- `src/lib/schema.ts`
- `src/lib/content-parser.ts`
- `src/components/custom/DiscoveryGrid.tsx`
- `src/components/custom/MarkdownDocumentModal.tsx`
- `src/hooks/useFilterState.ts`
- `src/lib/__tests__/content-parser.test.ts`
- `src/content/_shared/agents/SpecKit.md`

