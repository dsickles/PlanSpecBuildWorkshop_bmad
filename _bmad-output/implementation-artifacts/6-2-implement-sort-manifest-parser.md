# Story 6.2: Implement Sort Manifest Parser

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want the content parser to read `sort-config.yaml` and apply its ordering to all parsed content arrays,
so that the UI displays items in the author-defined order.

## Acceptance Criteria

1. **Manifest Parsing**: The ingestion engine reads `src/content/sort-config.yaml` using `gray-matter` (to extract keys) or `yaml` parser.
2. **Hierarchical Sorting**:
    - **Agents**: Sorted by `agent_studio` array in manifest, fallback to alphabetical.
    - **Prototypes**: Sorted by `build_lab` array in manifest, fallback to alphabetical.
    - **Projects/Blueprints**: `projects` array in manifest controls both filter pill order and Blueprint group order.
    - **Documents**: Within each project, docs are sorted by the project-specific array in `blueprints` map, fallback to alphabetical.
3. **Robust Fallback**: If manifest is missing or malformed, data falls back to alphabetical sorting by title. Items not in the manifest appear after listed items.
4. **Pinned Legacy Replacement**: The hardcoded `PINNED_PROJECT_SLUG` logic is replaced by the manifest-driven ordering.

## Tasks / Subtasks

- [x] Implement Sort Manifest Parser in `src/lib/content-parser.ts`
  - [x] Define `SortConfig` type and `loadSortConfig` helper
  - [x] Implement `applySortOrder` logic for Agents, Prototypes, and Project groups
  - [x] Update `getSortedParsedContent` to use the manifest
- [x] Verification & Cleanup
  - [x] Create unit tests in `src/lib/__tests__/content-parser.test.ts`
  - [x] Verify sorting in the UI with various manifest configurations
  - [x] Run `npm run lint` and `npm test`
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.

## Dev Notes

- **Source Files**: `src/lib/content-parser.ts`, `src/lib/content-utils.ts`.
- **Manifest**: `src/content/sort-config.yaml`.
- **Patterns**: Use `useMemo` in `DiscoveryGrid` for client-side filtering, but the initial array from the server should be pre-sorted by this engine.

### Project Structure Notes

- Parsers live in `src/lib/`.
- Content configuration lives in `src/content/`.

### References

- [Architecture: Sort Order Configuration](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/architecture.md#L115)
- [Sort Manifest File](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/content/sort-config.yaml)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

- src/lib/content-parser.ts
- src/lib/sort-utils.ts
- src/lib/schema.ts
- src/app/page.tsx
- src/components/custom/DiscoveryGrid.tsx
- src/components/content/blueprint-group.tsx
- src/lib/metrics.ts
- src/lib/__tests__/content-parser.test.ts
- src/components/custom/__tests__/DiscoveryGrid.test.tsx
- src/components/content/__tests__/BlueprintGroup.test.tsx
- src/lib/__tests__/metrics.test.ts
- _bmad-output/implementation-artifacts/6-2-implement-sort-manifest-parser.md

## Change Log

- 2026-02-26: Initial implementation of hierarchical sorting logic and manifest parser. Refactored sorting to `sort-utils.ts` and moved shared types to `schema.ts`.
- 2026-02-26: Fixed agent sorting bug where it was using `title` instead of filename stem, causing mismatches with `sort-config.yaml`.
- 2026-02-26: [Code Review] Fixed critical import regressions in components and tests caused by `ParsedArticle` type move.
- 2026-02-26: [Code Review] Removed deprecated `PINNED_PROJECT_SLUG` logic and fixed implicit 'any' types in `BlueprintGroup`.
