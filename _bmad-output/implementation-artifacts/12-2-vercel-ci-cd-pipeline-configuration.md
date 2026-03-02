# Story 12.2: Vercel CI/CD Pipeline Configuration

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Release Engineer,
I want the repository connected to Vercel with strict build requirements,
so that `git push` automatically triggers deployments only when Zod schemas and TypeScript typings are fully validated.

## Acceptance Criteria

1. **Successful Build on Push**: A `git push` to the main branch triggers a Vercel deployment that invokes `npm run build` (including the `prebuild` sync hook from Story 12.1) and completes without errors.
2. **Type Error Gatekeeping**: The build fails explicitly before deployment if any TypeScript compilation errors are detected (i.e., `tsc --noEmit` is effectively enforced during the Next.js build).
3. **Zod Validation Gatekeeping**: The build fails explicitly before deployment if any Zod path validation or schema type mismatch errors are detected during SSG.
4. **Zero Manual Configuration Required**: The deployment pipeline functions entirely from settings in the repository (e.g., `vercel.json` or `package.json`) — no Vercel dashboard CLI wizards or dashboard-only settings are required for baseline zero-config behavior.
5. **Clean Build Verification**: A successful local `npm run build` (without errors) is verified and documented before connecting to Vercel — proving the build is clean prior to CI integration.

## Tasks / Subtasks

- [ ] Task 1: Verify Clean Local Build (AC: 5)
  - [ ] Subtask 1.1: Run `npm run build` locally and confirm output: "Compiled successfully" with zero TypeScript or Zod errors.
  - [ ] Subtask 1.2: Confirm `prebuild` sync script runs and all `source_path` targets verify cleanly (expect ✓ for all 4 files in `_bmad-output/planning-artifacts/`).
  - [ ] Subtask 1.3: Document the build output summary (build time, pages generated, bundle sizes) in the Dev Agent Record.
- [ ] Task 2: Create `vercel.json` Explicit Configuration (AC: 4)
  - [ ] Subtask 2.1: Create `vercel.json` at the project root with explicit `buildCommand` and `framework` fields to lock in the expected build pipeline (see Dev Notes for template).
  - [ ] Subtask 2.2: Ensure `vercel.json` does not introduce any non-zero-config settings that would prevent a clean fork of the repository from building without Vercel account configuration.
- [ ] Task 3: Connect Repository to Vercel (AC: 1)
  - [ ] Subtask 3.1: Use the Vercel web dashboard (vercel.com) to import the GitHub repository. Select "Next.js" as the framework preset.
  - [ ] Subtask 3.2: Set the **Root Directory** to the project root (i.e., `./` or leave blank — do NOT set to `/src`).
  - [ ] Subtask 3.3: Confirm the auto-detected Build Command is `npm run build` (the `prebuild` hook runs automatically) and Output Directory is `.next`.
  - [ ] Subtask 3.4: Trigger an initial deployment and verify it completes successfully.
- [ ] Task 4: Validate Gatekeeping Behavior (AC: 2, 3)
  - [ ] Subtask 4.1: Intentionally introduce a TypeScript type error in a non-critical file, push to a test branch, and verify Vercel rejects the deploy with a build failure. Revert the test change.
  - [ ] Subtask 4.2: Confirm that `next build` fails-fast on TypeScript errors (the `typescript.ignoreBuildErrors` flag must NOT be set to `true` in `next.config.ts`).
- [ ] Task 5: Pre-Review Validation
  - [ ] Subtask 5.1: Run `npm run lint` and confirm output is clean.
  - [ ] Subtask 5.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.

## Dev Notes

### Core Context: What Story 12.1 Already Solved

Story 12.1 established the critical infrastructure insight: **Vercel clones the entire git repository before building**, meaning ALL files committed to the repo — including `_bmad-output/planning-artifacts/*.md` (the `source_path` targets) — are available at `process.cwd()` during the Vercel build. The `prebuild` hook (`ts-node --project scripts/tsconfig.json scripts/sync-content.ts`) verifies these paths and logs results before `next build` runs.

**No Vercel-specific environment variables are required** for this story. The `source_path` pattern is fully repo-committed-based.

### Vercel Build Pipeline (How It Works)

When Vercel triggers a deployment:
1. **Clone**: Full git repo is cloned (all branches/files committed).
2. **`npm install`**: Dependencies installed from `package.json`.
3. **`npm run build`**: Vercel invokes this command. npm lifecycle hooks apply:
   - **`prebuild`** runs first: `ts-node --project scripts/tsconfig.json scripts/sync-content.ts` → audits all `source_path` pointers.
   - **`next build`** runs second: SSG compilation, TypeScript checking, Zod validation during data ingestion.
4. **Deploy**: Only if the build exits with code 0.

### `vercel.json` Template

Create a minimal `vercel.json` at the project root. This makes the deployment configuration **explicit and repo-committed** rather than relying solely on Vercel dashboard presets:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

> **Why this matters:** Without `vercel.json`, Vercel's behavior is driven by dashboard presets which can be changed by any team member with dashboard access. Committing `vercel.json` makes the CI/CD pipeline version-controlled and reproducible in a forked environment.

### TypeScript Strictness Verification

The current `next.config.ts` does NOT include `typescript: { ignoreBuildErrors: true }`. This means TypeScript errors **will** fail the build. Verify this remains the case — do NOT add this flag even if build errors are encountered during testing. Fix the errors instead.

**Key check**: Review `next.config.ts` — it should only contain the `transpilePackages` array. Any addition of `ignoreBuildErrors: true` would break AC 2.

### Current Build Known State (from Story 12.1)

As of Story 12.1 completion:
- **Test suite**: 15 new tests (sync-content) + pre-existing tests pass.
- **Pre-existing test failures** in `MarkdownDocumentModal` and `DiscoveryGrid` were resolved during Story 12.1's review.
- **`npm run build`** should produce a clean SSG output. If new TypeScript or Zod errors appear, they must be fixed in this story before connecting to Vercel.

### Vercel Project Settings (Dashboard Reference)

When importing in the Vercel dashboard:
| Setting | Required Value |
|---|---|
| Framework Preset | Next.js |
| Root Directory | ` ` (blank / project root) |
| Build Command | `npm run build` (auto-detected) |
| Output Directory | `.next` (auto-detected) |
| Install Command | `npm install` (auto-detected) |
| Node.js Version | 18.x or 20.x (select 20.x for best compatibility) |

> **Critical**: Do NOT set the Root Directory to `/src`. The Next.js application root is at the project root, not inside `src/`.

### `transpilePackages` in `next.config.ts`

The current `next.config.ts` has a large `transpilePackages` array for ESM-only packages (`unified`, `remark`, `rehype`, etc.). This configuration is **essential for a successful build** — Vercel must use this config as-is. Do not modify `next.config.ts` in this story.

### Architecture Compliance Snapshot

- **NFR6**: "The system must support automated deployments triggered directly from git push events without manual server configuration." — Story 12.2 directly fulfills this.
- **NFR7**: "System uptime will rely entirely on the chosen edge hosting provider's SLA (e.g., Vercel's 99.99% edge network uptime), requiring no dedicated backend container management." — Connecting to Vercel fulfills this.
- **Hosting Decision**: Architecture.md §Infrastructure & Deployment: "Vercel — The native hosting platform for Next.js, providing zero-configuration deployments. Automatically optimizes images and completely automates the CI/CD pipeline linked to the primary GitHub branch."
- **No environment variables** are needed at the Vercel project level for Phase 1 MVP (all `source_path` files are repo-committed).

### Previous Story Intelligence (12.1)

**Patterns to follow:**
- The `prebuild` script (`scripts/sync-content.ts`) runs automatically as part of `npm run build` — no separate invocation needed.
- `scripts/tsconfig.json` uses CommonJS (`"module": "commonjs"`) for `ts-node` compatibility — do not change this.
- Pattern for commits: "chore: complete story 12.2 vercel ci/cd pipeline configuration" (match prior epic commit style).

**Files created/modified in 12.1 that this story builds upon:**
- `package.json` — has `prebuild` hook (do not modify in this story)
- `scripts/sync-content.ts` — the pre-build sync logic (do not modify)
- `scripts/tsconfig.json` — CommonJS tsconfig for ts-node (do not modify)

### Git Intelligence

Recent commits (post-Epic 11):
- `de8e105 (HEAD)` — chore: complete epic 11 retrospective and synchronize sprint status
- `46f9fb8` — UI Polish: Unify card header spacing between title and status pill

**Commit convention**: Story changes committed as atomic changesets. This story's primary deliverable is the `vercel.json` file and documented proof of a successful Vercel deployment.

### Project Structure Notes

New file introduced by this story:
```
plan-spec-build-portfolio/
├── vercel.json            ← NEW: Explicit Vercel build configuration
└── (no other changes)
```

This is a pure infrastructure story — no changes to `src/`, `content/`, or `scripts/`.

### References

- [Source: epics.md#Epic 12: MVP Deployment & Go-Live]
- [Source: epics.md#Story 12.2: Vercel CI/CD Pipeline Configuration]
- [Source: architecture.md#Infrastructure & Deployment]  
- [Source: architecture.md#NFR6, NFR7]
- [Source: package.json] — confirms `prebuild` hook from Story 12.1
- [Source: next.config.ts] — contains `transpilePackages` (do NOT add `ignoreBuildErrors`)
- [Source: _bmad-output/implementation-artifacts/12-1-pre-build-sync-automation.md] — Story 12.1 completion details
- [Vercel Docs: https://vercel.com/docs/projects/project-configuration] — `vercel.json` schema reference

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

<!-- ⚠️ POPULATE THIS AT STORY START, not at the end. Add every file you plan to touch here BEFORE you begin implementing.
     Update throughout development. Final check: run `git status --porcelain` before moving to review and confirm this list matches. -->

- `vercel.json` — NEW: Explicit Vercel build configuration (framework, buildCommand, outputDirectory, installCommand)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — MODIFIED: story status → review
