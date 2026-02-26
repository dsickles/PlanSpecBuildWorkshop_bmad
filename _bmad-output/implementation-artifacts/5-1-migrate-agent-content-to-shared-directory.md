# Story 5.1: Migrate Agent Content to Shared Directory

Status: done

## Story

As a Content Author,
I want all Agent Studio markdown files to live in a single `_shared/agents/` directory,
so that agents used across multiple projects are not duplicated in each project's folder.

## Acceptance Criteria

1. **Given** the content directory structure, **When** organizing Agent Studio content, **Then** all agent `.md` files exist in `/content/_shared/agents/` and per-project `agents/` subfolders are removed.
2. **And** agents that are associated with specific projects have a `projects` frontmatter array listing the relevant project slugs (e.g., `projects: ["plan-spec-build-workshop"]`).
3. **And** agents that are not associated with any specific project omit the `projects` field or have an empty array.

## Tasks / Subtasks

- [ ] Task 1: Migrate Agent Content to Shared Directory (AC: 1)
  - [ ] Create `src/content/_shared/agents/` directory if it doesn't exist.
  - [ ] Move all agent `.md` files from project-specific directories (e.g., `src/content/plan-spec-build-workshop/agents/`) to the shared directory.
  - [ ] Add `projects` frontmatter array to moved files (e.g., `projects: ["plan-spec-build-workshop"]`).
  - [ ] Remove empty per-project `agents/` directories.
- [ ] Task 2: Update Frontmatter Schema (AC: 2, 3)
  - [ ] Modify `src/lib/schema.ts` to add `projects: z.array(z.string()).optional()` to `FrontmatterSchema`.
- [ ] Task 3: Update Content Utilities for Shared Discovery (AC: 1)
  - [ ] Update `getProjectSlugs()` in `src/lib/content-utils.ts` to exclude `_shared` from the project list.
  - [ ] Update `getContentFilePaths()` in `src/lib/content-utils.ts` to scan `_shared/agents/` and assign a synthetic `projectSlug: "_shared"` to these items.
- [ ] Task 3.5: Filter _shared from Dropdown
  - [ ] Update `src/app/page.tsx` to filter out the `_shared` slug from the `FilterBar` projects list.
- [ ] Task 4: Implement Project-Scoped Filtering for Agents (AC: 2, 3)
  - [ ] Update `DiscoveryGrid.tsx` filtering logic:
    - [ ] If `activeProject` is null (Browse Mode), show all agents.
    - [ ] If `activeProject` is set (Focus Mode), show only agents whose `projects` array contains the `activeProject` slug.
- [ ] Task 5: Pre-Review Validation
  - [ ] Subtask 5.1: Run `npm run lint` and confirm output is clean.
  - [ ] Subtask 5.2: Update `DiscoveryGrid.test.tsx` to include test cases for shared agent filtering and verify all tests pass.

## Dev Notes

- **Architecture Compliance:**
  - Follows "Shared Agent Studio Items" pattern defined in `architecture.md#Structure-Patterns`.
  - Maintains "Git-CMS" principle by using frontmatter for associations.
  - Reuses the existing `DiscoveryGrid` filtering architecture (URL params).
- **Source Tree Components:**
  - `src/lib/schema.ts` (Modified)
  - `src/lib/content-utils.ts` (Modified)
  - `src/components/custom/DiscoveryGrid.tsx` (Modified)
- **Testing Standards:**
  - Update `DiscoveryGrid.test.tsx` to mocking `useFilterState` with various `activeProject` scenarios.

### Project Structure Notes

- `src/content/_shared/agents/` becomes the canonical home for all agent cards.
- `_shared` is treated as a reserved keyword in the content system.

### References

- [Source: planning-artifacts/epics.md#Story-5.1]
- [Source: planning-artifacts/prd.md#FR19]
- [Source: planning-artifacts/architecture.md#Shared-Agent-Studio-Items-(FR19)]

## Dev Agent Record

### Agent Model Used

Antigravity

### Debug Log References

### Completion Notes List

### File List

- `src/content/_shared/agents/BMadMethod.md`
- `src/content/_shared/agents/GetShitDone.md`
- `src/content/_shared/agents/Lovable.md`
- `src/content/_shared/agents/SpecKit.md`
- `src/lib/schema.ts`
- `src/lib/content-utils.ts`
- `src/app/page.tsx`
- `src/components/custom/DiscoveryGrid.tsx`
- `src/components/custom/__tests__/DiscoveryGrid.test.tsx`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `_bmad-output/implementation-artifacts/5-1-migrate-agent-content-to-shared-directory.md`
