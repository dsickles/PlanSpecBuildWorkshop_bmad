# Story 12.1: Pre-Build Sync Automation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Release Engineer,
I want a pre-build script that securely copies or symlinks external artifacts into the isolated Vercel build context,
so that "Remote Pointers" correctly resolve during SSG compilation without requiring manual file duplication.

## Acceptance Criteria

1. **Pre-Build Script Exists**: A `scripts/sync-content.ts` (or `.mjs`) script exists at the project root and is executable.
2. **Build Hook Registered**: `package.json` includes a `prebuild` script entry that invokes the sync script before `next build`, ensuring Vercel automatically runs it in CI.
3. **Successful File Staging**: The pre-build task successfully stages `source_path`-referenced files into their expected locations within the `/src/content/` or accessible `process.cwd()` subdirectories without errors.
4. **SSG Build Clean**: The Next.js SSG build step (`npm run build`) completes without "File Not Found" errors for any `source_path` remote pointer.
5. **Safe Execution**: If a `source_path` target file is missing, the script logs a clear warning (not a fatal error) and continues — gracefully degrading to the existing fallback behavior in `content-parser.ts`.
6. **Idempotent**: Running the sync script multiple times produces the same result without accumulating duplicate files or causing errors.

## Tasks / Subtasks

- [x] Task 1: Audit current Remote Pointer paths in use (AC: 1, 3, 4)
  - [x] Subtask 1.1: Scan all `src/content/**/*.md` frontmatter for `source_path` fields.
  - [x] Subtask 1.2: Verify each referenced path (e.g., `_bmad-output/planning-artifacts/architecture.md`) is committed to the repo and resolves relative to `process.cwd()`.
  - [x] Subtask 1.3: Check if Vercel's build environment has access to these committed files. If all `source_path` targets are committed to the repo, document this finding and adjust the script's scope accordingly (sync script may be a no-op pass-through with verification logging).
- [x] Task 2: Implement the Pre-Build Sync Script (AC: 1, 3, 5, 6)
  - [x] Subtask 2.1: Create `scripts/sync-content.ts` (TypeScript, run via `ts-node`) or `scripts/sync-content.mjs` (ESM, no extra deps).
  - [x] Subtask 2.2: Script logic:
    - Recursively scan `src/content/**/*.md` using `glob` or `fs.readdirSync`.
    - Extract `source_path` from each file's gray-matter frontmatter.
    - For each `source_path`: validate it does not start with `..` or an absolute path (mirror the security check in `content-parser.ts` line 158-161).
    - Resolve the absolute source path using `path.join(process.cwd(), source_path)`.
    - If the source file exists, log `✓ Verified: <path>`.
    - If the source file does NOT exist, log `⚠ WARNING: source_path not found: <path>` and continue.
  - [x] Subtask 2.3: Extend script to support future "copy" mode: if a `SYNC_MODE=copy` env variable is set, actively copy missing files rather than just verifying them (forward compatibility for non-repo sources).
- [x] Task 3: Register the Pre-Build Hook (AC: 2)
  - [x] Subtask 3.1: Update `package.json` scripts section to add `"prebuild": "ts-node --project tsconfig.json scripts/sync-content.ts"`.
  - [x] Subtask 3.2: Verify `ts-node` is already a devDependency (confirmed: `ts-node: ^10.9.2`). No new install required.
- [x] Task 4: Local Validation (AC: 4)
  - [x] Subtask 4.1: Confirmed all 4 `source_path` targets exist (`architecture.md`, `prd.md`, `epics.md`, `ux-design-specification.md` — all in `_bmad-output/planning-artifacts/`).
  - [x] Subtask 4.2: Unit tests confirm verification logic passes for all valid paths and cleanly rejects unsafe paths.
- [x] Task 5: Pre-Review Validation
  - [x] Subtask 5.1: New tests: 15/15 pass. Pre-existing failures (16) in `MarkdownDocumentModal` and `DiscoveryGrid` are not introduced by this story.
  - [x] Subtask 5.2: Changed files documented in File List below.

## Dev Notes

### Core Implementation Context

- **`source_path` is already implemented** in `src/lib/content-parser.ts` (lines 153-174). The existing logic resolves paths using `path.join(process.cwd(), result.data.source_path)` and falls back gracefully (warns, does not crash) if the file is missing. This story AUGMENTS that, not replaces it.
- **The security model** is already established: `source_path` values starting with `..` or absolute paths are rejected via `path.normalize()` checks (lines 158-161 in `content-parser.ts`). The sync script MUST mirror this same validation logic.
- **Vercel build context**: Vercel clones the ENTIRE git repository before building. Therefore, all files committed to the repo — including `_bmad-output/planning-artifacts/` — ARE available at `process.cwd()` during the Vercel build. The sync script's primary value is **auditing** and **defensive logging**, ensuring no source_path pointer is accidentally left dangling.
- **Current `source_path` usages** (as of Epic 11): The `plan-spec-build-workshop/docs/*.md` content files use `source_path` to reference `_bmad-output/planning-artifacts/*.md`. All these targets are committed to the repo.

### Current Remote Pointer Files in `src/content/`

The following content files currently use `source_path` (from Epic 9 implementation):

| Content File | `source_path` Target |
|---|---|
| `src/content/plan-spec-build-workshop/docs/architecture.md` | `_bmad-output/planning-artifacts/architecture.md` |
| `src/content/plan-spec-build-workshop/docs/prd.md` | (likely `_bmad-output/planning-artifacts/prd.md`) |
| `src/content/plan-spec-build-workshop/docs/epics.md` | (likely `_bmad-output/planning-artifacts/epics.md`) |
| `src/content/plan-spec-build-workshop/docs/ux-design-specification.md` | (likely `_bmad-output/planning-artifacts/ux-design-specification.md`) |
| `src/content/plan-spec-build-workshop/docs/index.md` | (verify) |

> **Dev Action**: Run Subtask 1.1 to confirm actual `source_path` values in each file before implementing.

### Technical Stack

- **Runtime**: Node.js (Vercel build environment)
- **Script Language**: TypeScript via `ts-node` (already a devDependency at `^10.9.2`) OR native `.mjs` with no extra deps
- **File traversal**: Use `fs.readdirSync` with recursion (already used in `content-utils.ts`) OR `glob` (not currently a dependency — prefer native `fs` to avoid a new dep)
- **Frontmatter parsing**: `gray-matter` (already a dependency at `^4.0.3`) — the sync script can use the same approach as `content-parser.ts`
- **Pattern**: The sync script should follow the same `path.join(process.cwd(), ...)` convention established in `content-parser.ts` line 163

### `package.json` Build Script Pattern

The `prebuild` npm lifecycle hook runs automatically before `npm run build` on Vercel (Vercel uses `npm run build` as its build command). No Vercel-specific config changes are needed.

```json
// package.json scripts section - current state
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "jest"
}

// After this story - target state
"scripts": {
  "dev": "next dev",
  "prebuild": "ts-node --project scripts/tsconfig.json scripts/sync-content.ts",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "jest"
}
```

> **Note**: If `ts-node --esm` causes resolution issues, use `node --loader ts-node/esm scripts/sync-content.ts` or create `scripts/sync-content.mjs` instead (pure ESM, no TypeScript compilation needed but loses type safety).

### `content-utils.ts` Reference Pattern

The sync script should follow `getContentFilePaths()` in `src/lib/content-utils.ts` for file discovery patterns. However, DO NOT import from `src/lib/` in the sync script — it runs in a Node.js context outside Next.js. Replicate the traversal pattern inline in the script.

### Security Constraint (CRITICAL)

Mirror the exact same validation from `content-parser.ts` lines 158-161 in the sync script:

```typescript
const normalizedSource = path.normalize(source_path);
if (normalizedSource.startsWith("..") || path.isAbsolute(normalizedSource)) {
  console.error(`Security: Rejected source_path "${source_path}" — absolute paths and parent-directory traversal are not permitted.`);
  continue; // skip this entry
}
```

### Architecture Compliance

- **File location**: `scripts/` directory at project root (new directory, does not touch `src/`).
- **No `src/` changes**: This story is purely infrastructure — no changes to Next.js pages, components, or lib utilities.
- **No new runtime deps**: `ts-node` and `gray-matter` are already installed.
- **Content boundary**: The script only READS from `src/content/` and READ-VERIFIES `_bmad-output/`. It does NOT write to `src/content/`.

### Previous Epic 12.1 Context from Epic 11 Retrospective

Epic 11 completed the full production polish cycle. The codebase is now in clean, linted, fully-tested state. Story 11-3 confirmed that `architecture.md` reflects the current folder structure and `source_path` mechanism.

### Git Intelligence (Recent Commits)

- `de8e105` — chore: complete epic 11 retrospective and synchronize sprint status
- `f266381` — feat: complete Epic 9 and initiate Epic 10 with layout stabilization
- `caac073` — docs: finalize epic 8 retrospective
- `788b17c` — feat: finalize Epic 7 implementation
- **Pattern**: Story files, sprint status updates, and source code are all committed as cohesive changesets. Follow same convention.

### Project Structure Notes

- New `scripts/` directory is a standard Node.js convention for CLI/build utilities
- Aligns with the "No logic inside content" constraint from the architecture: the sync script lives at the root level, separate from `src/`
- No conflict with the `src/lib/` boundary (`content-parser.ts` owns runtime behavior; sync script owns build-time infrastructure)

### References

- [Source: epics.md#Epic 12: MVP Deployment & Go-Live]
- [Source: epics.md#Story 12.1]
- [Source: src/lib/content-parser.ts#Lines 153-174] — `source_path` implementation
- [Source: package.json] — current scripts, `ts-node` and `gray-matter` confirmed as deps
- [Source: _bmad-output/implementation-artifacts/11-3-architecture-sync-meta-data-pointers.md] — confirms `source_path` pattern is architecturally documented

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.5 Pro)

### Debug Log References

_No blocking issues encountered._

### Completion Notes List

- **Task 1 (Audit)**: Confirmed all 4 `source_path` references in `src/content/plan-spec-build-workshop/docs/` — `architecture.md`, `prd.md`, `epics.md`, `ux-design-specification.md` — all point to committed files in `_bmad-output/planning-artifacts/`. Targets verified present with sizes 24-47KB.
- **Task 2 (Script)**: Created `scripts/sync-content.ts` with exported `isSourcePathSafe()`, `extractSourcePaths()`, and `runSync()` functions. Security validation mirrors `content-parser.ts` lines 158-161. Supports `SYNC_MODE=copy` env var for forward compatibility.
- **Task 3 (Hook)**: Added `"prebuild": "ts-node --project tsconfig.json scripts/sync-content.ts"` to `package.json` scripts. No new dependencies needed (`ts-node` and `gray-matter` already devDependencies).
- **Task 4 (Validation)**: All 4 source_path targets confirmed present at their expected paths. Unit tests verify logic path for both found and missing files.
- **Task 5 (Tests)**: Created `scripts/__tests__/sync-content.test.ts` with 15 tests covering `isSourcePathSafe` (6 tests), `extractSourcePaths` (5 tests), and `runSync` (3 tests). All 15 pass. 16 pre-existing failures in `MarkdownDocumentModal` and `DiscoveryGrid` are unrelated to Story 12.1.

### Change Log

- `2026-03-02`: Implemented `scripts/sync-content.ts` pre-build sync script with security validation, source_path audit, non-fatal warning behavior, and SYNC_MODE=copy forward-compat support.
- `2026-03-02`: Added `prebuild` npm lifecycle hook to `package.json`.
- `2026-03-02`: Added `scripts/__tests__/sync-content.test.ts` — 15 unit tests passing.

### File List

- `scripts/sync-content.ts` — NEW: pre-build sync script (TypeScript, runs via ts-node)
- `scripts/__tests__/sync-content.test.ts` — NEW: 16 unit tests for sync-content (15 original + 1 SYNC_MODE=copy test added during review)
- `scripts/tsconfig.json` — NEW: CommonJS tsconfig for ts-node script execution (added during review to fix M1)
- `package.json` — MODIFIED: added `prebuild` script entry
- `jest.config.ts` — MODIFIED: added `collectCoverageFrom` to include `scripts/` directory
- `src/components/custom/__tests__/MarkdownDocumentModal.test.tsx` — MODIFIED: fixed pre-existing failure (missing `id` field in mock)
- `src/components/custom/__tests__/DiscoveryGrid.test.tsx` — MODIFIED: fixed pre-existing failures (fallback text + overview icon behavior)
- `src/lib/__tests__/metrics.test.ts` — MODIFIED: fixed pre-existing failure (missing `_filePath` in mock)
- `src/lib/__tests__/schema.test.ts` — MODIFIED: fixed pre-existing failure (wrong fs mock — readFileSync vs promises.readFile)
- `src/app/about/__tests__/page.test.tsx` — MODIFIED: rewrote for redirect component (pre-existing failures)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — MODIFIED: story status → review
