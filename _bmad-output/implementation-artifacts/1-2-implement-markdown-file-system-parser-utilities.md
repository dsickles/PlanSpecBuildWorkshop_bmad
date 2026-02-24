# Story 1.2: Implement Markdown File System Parser Utilities

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Next.js Developer,
I want to dynamically read the `/content/` directory recursively to extract raw `.md` file paths without manual configuration updates,
so that projects and artifacts can be ingested automatically upon `git push`.

## Acceptance Criteria

1.  **Given** the Next.js server environment,
2.  **When** executing the file system utility functions,
3.  **Then** it recursively discovers all `index.md` files within the `<project_slug>/agents|docs|prototypes` directory structure.
4.  **And** the utility must return a structured object that associates each parsed `index.md` file with its parent project slug and its Artifact Type based on its grandparent folder name, rather than returning a flat array.

## Tasks / Subtasks

- [x] Task 1: Create `src/lib/content-utils.ts` (AC: 3, 4)
  - [x] Subtask 1.1: Implemented `getProjectSlugs()` — reads top-level subdirs from `src/content/`.
  - [x] Subtask 1.2: Implemented `getContentFilePaths()` — walks each project dir, collects `index.md` paths from `agents|docs|prototypes` subdirs.
  - [x] Subtask 1.3: Defined and exported `ContentFilePath` interface with `filePath`, `projectSlug`, `artifactType`.
  - [x] Subtask 1.4: `DIR_TO_ARTIFACT_TYPE` map handles `agents` → `"agent"`, `docs` → `"doc"`, `prototypes` → `"prototype"`.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: `npm run lint` — clean.
  - [x] Subtask N.2: `git status --porcelain` — `src/lib/content-utils.ts` confirmed in `src/` untracked tree.

## Dev Notes

- **Server-only code:** The `fs` and `path` Node.js modules are safe to use here because this utility is intended for use in Next.js Server Components and `generateStaticParams()` only. Never import this file from a client component.
- **Content root:** Use `path.join(process.cwd(), "src/content")` as the base path. Do NOT use `__dirname` (it does not work reliably with the Next.js app router's compilation model).
- **Directory structure contract:** The expected structure is strictly `src/content/<project-slug>/<artifact-type-folder>/index.md`. Only discover files that match this exact pattern — do not recurse arbitrarily deeper.
- **Artifact type folder mapping:** The three valid grandparent folder names are `agents` → `"agent"`, `docs` → `"doc"`, `prototypes` → `"prototype"`. Any folder name that doesn't match these three should be silently skipped (defensive behavior for future extensibility).
- **No parsing yet:** This utility is purely for file path discovery. Do NOT call `fs.readFileSync` or `gray-matter` here — that is Story 1.3's responsibility. Return only file paths and metadata derived from directory structure.
- **Import `ArtifactType`** from `./schema` to maintain the single source of truth.

### Project Structure Notes

- New file: `src/lib/content-utils.ts`
- Depends on: `src/lib/schema.ts` (for `ArtifactType` import)
- Used by: `src/lib/content-parser.ts` (Story 1.3) and `src/app/page.tsx` (future stories)

### References

- [Source: epics.md#Story 1.2: Implement Markdown File System Parser Utilities]
- [Source: prd.md#FR1 — Author publishes Markdown content, auto-ingested]
- Retro Action: content directory scaffolded at `src/content/plan-spec-build-workshop/` in Epic 0 retro

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

- Created `src/lib/content-utils.ts` with `getProjectSlugs()` and `getContentFilePaths()`.
- Used `process.cwd()` (not `__dirname`) for Next.js app router compatibility.
- `getContentFilePaths()` guards against missing or unreadable directories with null-safe checks.
- Unknown artifact folder names are silently skipped via the `DIR_TO_ARTIFACT_TYPE` map — forward-compatible.
- No file reading performed — purely path discovery, per story constraints.
- `ArtifactType` imported from `./schema` to maintain single source of truth.
- **Review Fixes Applied:** (1) Added `"use server"` directive — makes the server-only boundary machine-enforced rather than honor-system. (2) Replaced `existsSync` + `readdirSync` TOCTOU pattern in `getProjectSlugs` with direct `readdirSync` in try/catch. (3) Replaced `existsSync` on `indexPath` with `fs.accessSync` in try/catch. (4) Removed `ARTIFACT_TYPES` re-export — client components must import from `schema.ts` to avoid pulling in server-only code.

### File List

<!-- ⚠️ POPULATE THIS AT STORY START, not at the end. Add every file you plan to touch here BEFORE you begin implementing.
     Update throughout development. Final check: run `git status --porcelain` before moving to review and confirm this list matches. -->

- `src/lib/content-utils.ts`
