# Story 9.1: Remote Pointer Parser Implementation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Content Author,
I want to link to "real" documentation files in my repository (e.g., `/_bmad-output/planning-artifacts/prd.md`) instead of copy-pasting them into the `/content/` folder,
so that my portfolio always displays the live, current versions of my work.

## Architect (Winston) & Dev (Amelia) Perspective

- **Single Source of Truth**: The "real" doc remains the source of truth for content, while the `/src/content/` pointer file serves as the source of truth for portfolio-specific metadata (Status, Project Association).
- **Pragmatic Pathing**: `source_path` is resolved relative to the repository root (`process.cwd()`) for maximum stability across environments.
- **Fail-Safe Ingestion**: If a remote path is broken, the parser logs a build-time error but gracefully falls back to the pointer's local content, preventing UI breakage.
- **Content Merging**: The parser will extract the raw body from the remote file (stripping its own frontmatter) and process it through the existing tokenization and rendering pipeline.

## Maintainer Workflow (Practical Use)

To keep things straight for the author, we'll establish a clear separation between the **UI View (Pointer)** and the **System Data (Source)**:

1. **Mirroring Approach**: Instead of creating generic pointers, the author updates their existing content files (e.g., `src/content/.../docs/prd.md`) to include the `source_path`.
2. **MetaData Configuration**: All frontmatter required for filters remains in the "Pointer" file at `/src/content/`.
3. **Content Linking**: The `source_path` field links the Pointer to the "Real" live file (e.g., `source_path: "_bmad-output/planning-artifacts/prd.md"`).
4. **Author Benefit**: The author maintains only one version of the *content* (in the repository root) while managing *UI presentation* independently in the content directory. This prevents duplication and ensures the portfolio is always current.

## Acceptance Criteria

1. **Given** a document markdown file with a `source_path` frontmatter field,
2. **When** the content is ingested via `parseMarkdownFile`,
3. **Then** the parser resolves the `source_path` relative to the project root and returns the content of that remote file.
4. **And** the parser must strip the frontmatter from the remote file before merging it with the pointer's metadata.
5. **And** if the path is invalid, a clear build-time error or warning is logged, and the system falls back to the pointer file's own body content (if any).

## Tasks / Subtasks

- [x] Task 1: Update Schema (AC: 1)
  - [x] Add `source_path: z.string().optional()` to `FrontmatterSchema` in `src/lib/schema.ts`.
- [x] Task 2: Implement Remote Parsing Logic (AC: 2, 3, 4, 5)
  - [x] Update `parseMarkdownFile` in `src/lib/content-parser.ts` to check for `source_path`.
  - [x] Implement `fs.readFileSync` for the resolved `source_path`.
  - [x] Use `gray-matter` to separate frontmatter from content in the remote file.
  - [x] Replace the pointer's `content` variable with the remote content before HTML rendering.
- [x] Task 3: Add Unit Tests
  - [x] Create a new test case in `src/lib/__tests__/content-parser.test.ts` mocking a remote file read.
- [ ] Task 4: Pre-Review Validation
  - [x] Subtask 4.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask 4.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.
  - [x] Subtask 4.3: Mirroring Migration (Convert standard docs to pointers)
  - [x] Subtask 4.4: Remove Redundant Test Documents (source-pointer.md)
  - [x] Subtask 4.5: Verify with real mirroring pointers.

- [x] Task 5: Review Follow-ups (Auto-Fix)
  - [x] Fix Path Traversal Vulnerability (Security)
  - [x] Implement Project Title Cache (Performance)
  - [x] Switch to Async I/O (Async/Await)
  - [x] Update File List and Sync Status

## Dev Notes

- **Source Path Resolution**: Use `path.join(process.cwd(), source_path)` to ensure resolution works from the repository root.
- **Content Merging**: The frontmatter in the pointer file (the one in `/content/`) should take precedence over any frontmatter in the remote file. The remote file should ideally just be raw markdown, but if it has frontmatter, it should be ignored.
- **Error Handling**: Use the existing `buildError` helper if the `source_path` is provided but the file is missing.

### Project Structure Notes

- Alignment with unified project structure:
  - Schema: `src/lib/schema.ts`
  - Parser: `src/lib/content-parser.ts`
  - Tests: `src/lib/__tests__/content-parser.test.ts`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 9.1]
- [Plan: brain/16ebb2c0-7653-4bad-9932-df338bedbb1c/implementation_plan.md]

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Flash Agentic)

### Debug Log References

- [Tests Passing]: `npm test src/lib/__tests__/content-parser.test.ts`
- [Lint Passing]: `npx eslint src/lib/schema.ts src/lib/content-parser.ts src/lib/__tests__/content-parser.test.ts`

### Completion Notes List

- ✅ Implemented `source_path` in `FrontmatterSchema`.
- ✅ Updated `parseMarkdownFile` to support content redirection from external files.
- ✅ Ensured remote frontmatter is stripped during merging.
- ✅ Added fail-safe fallback to local content if `source_path` is invalid.
- ✅ Added unit tests for redirection logic.
- ✅ Fixed pre-existing lint errors in `content-parser.ts`.
- ✅ Mirroring Migration: Converted standard docs to pointers.
- ✅ Removed Redundant Test Documents (source-pointer.md).
- ✅ **Adversarial Review Fixes**:
  - Implemented Path Traversal protection for `source_path`.
  - Added `TITLE_CACHE` to reduce redundant disk I/O.
  - Converted parsing engine to full Async/Await.

### File List

- `src/lib/schema.ts`
- `src/lib/content-parser.ts`
- `src/lib/__tests__/content-parser.test.ts`
- `src/content/plan-spec-build-workshop/docs/prd.md` (Converted to Pointer)
- `src/content/plan-spec-build-workshop/docs/architecture.md` (Converted to Pointer)
- `src/content/plan-spec-build-workshop/docs/epics.md` (Converted to Pointer)
- `src/content/plan-spec-build-workshop/docs/ux-design-specification.md` (Converted to Pointer)
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

Status: done
