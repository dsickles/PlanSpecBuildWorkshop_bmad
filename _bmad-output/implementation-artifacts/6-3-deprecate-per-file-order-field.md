# Story 6.3: Deprecate Per-File Order Field

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want the `order` frontmatter field removed from the Zod schema and all content files,
so that there is a single, unambiguous mechanism for controlling display order via `sort-config.yaml`.

## Acceptance Criteria

1. **Schema Cleanup**: The `order` field is removed from both `projectSchema` (if applicable) and `documentSchema` in `src/lib/schema.ts`.
2. **Content Sanitization**: No content `.md` files in `src/content/` or its subdirectories contain an `order` frontmatter field.
3. **Documentation Alignment**: The Architecture document (`_bmad-output/planning-artifacts/architecture.md`) explicitly reflects that `sort-config.yaml` is the exclusive ordering mechanism and the `order` field is deprecated.
4. **Sorting Integrity**: The system continues to sort items correctly using the central manifest, falling back to alphabetical as verified in Story 6.2.

## Tasks / Subtasks

- [x] Cleanup Schema & Code
  - [x] Remove `order` field from `FrontmatterSchema` in `src/lib/schema.ts`.
  - [x] Update `ParsedContent` and `ParsedArticle` types if they were explicitly using `order`.
  - [x] Scan `src/lib/content-parser.ts` and `src/lib/sort-utils.ts` for any dead code referencing `order`.
- [x] Content Sanitization
  - [x] Run a global search for `order:` in `src/content/`.
  - [x] Remove any residual fields from Markdown files.
- [x] Documentation Update
  - [x] Update `_bmad-output/planning-artifacts/architecture.md` to remove or mark `order` as deprecated in the schema examples and text.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.

## Dev Notes

- **Source Files**: `src/lib/schema.ts`, `src/lib/content-parser.ts`.
- **Reference**: Story 6.2 established the `sort-config.yaml` parser. This story is the cleanup phase.
- **Testing**: Ensure that items still sort correctly. The logic in `sort-utils.ts` should already be manifest-first.

### Project Structure Notes

- Parsers live in `src/lib/`.
- Content configuration lives in `src/content/`.

### References

- [Architecture: Sort Order Configuration](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/architecture.md#L115)
- [Sort Manifest File](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/content/sort-config.yaml)

## Dev Agent Record

### Agent Model Used

antigravity-v1

### Debug Log References

### Completion Notes List

- Verified that `order` field is removed from `schema.ts`.
- Confirmed no `order:` fields remain in `src/content/`.
- Updated comments in `src/lib/sort-utils.ts` to remove stale terminology.
- Explicitly marked `order` as DEPRECATED in `_bmad-output/planning-artifacts/architecture.md`.
- Fixed minor lint warning in `src/lib/__tests__/content-parser.test.ts`.
- Ran all tests (`npm test`) and confirmed they pass.

### File List

- src/lib/schema.ts
- src/lib/sort-utils.ts
- src/lib/__tests__/content-parser.test.ts
- _bmad-output/planning-artifacts/architecture.md
- _bmad-output/implementation-artifacts/6-3-deprecate-per-file-order-field.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
