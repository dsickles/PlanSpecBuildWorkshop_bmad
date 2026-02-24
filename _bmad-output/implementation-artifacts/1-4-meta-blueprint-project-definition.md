# Story 1.4: "Meta-Blueprint" Project Definition

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the Content Author,
I want the "Plan. Spec. Build." project itself to exist as the foundational piece of Markdown content in the system,
so that I can validate the ingestion pipeline using realistic portfolio data.

## Acceptance Criteria

1.  **Given** the `/content/` directory,
2.  **When** establishing the project baseline,
3.  **Then** the `src/content/plan-spec-build-workshop/` folder structure exists and contains valid `index.md` files for its agents and docs.
4.  **And** the data fetching functions include hardcoded logic or explicit sorting rules to ensure this specific project is always presented as the first selectable item in the portfolio view (FR16).

## Tasks / Subtasks

- [x] Task 1: Create Agents content file (AC: 3)
  - [x] Subtask 1.1: Created `src/content/plan-spec-build-workshop/agents/index.md` with all required Zod frontmatter.
- [x] Task 2: Create Docs content file (AC: 3)
  - [x] Subtask 2.1: Created `src/content/plan-spec-build-workshop/docs/index.md` with all required Zod frontmatter.
- [x] Task 3: Add priority sort to content-parser (AC: 4)
  - [x] Subtask 3.1: Added `PINNED_PROJECT_SLUG = "plan-spec-build-workshop"` constant.
  - [x] Subtask 3.2: Exported `getSortedParsedContent()` with stable stable sort that pins the Meta-Blueprint project first.
- [x] Task 4: Smoke test — wire into page.tsx
  - [x] Subtask 4.1: Updated `page.tsx` to call `getSortedParsedContent()` as an async Server Component; renders parsed/error counts.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: `npm run lint` — clean. `npx tsc --noEmit` — clean.
  - [x] Subtask N.2: `git status --porcelain` — all 4 new/modified files confirmed.

## Dev Notes

- **Slug decision:** The directory we scaffolded in the Epic 0 retro is `plan-spec-build-workshop`. The epics.md mentioned `plan-spec-build` — use the actual scaffolded directory name: `plan-spec-build-workshop`.
- **Valid frontmatter:** Every index.md MUST pass `FrontmatterSchema.safeParse` — include all required fields: `title`, `date`, `status`, `domain`, `tech_stack`.
- **Sort stability:** The sort should be stable — only pin the one project slug, all others maintain their relative insertion order.
- **page.tsx is temporary:** The smoke test wiring in page.tsx will be replaced in Epic 2 with proper rendering. Keep it minimal (just validate the data flows without crashing).
- **No Prototype artifact:** The `prototypes/` directory has a `.gitkeep` but no real content planned for this project yet — that's fine. The parser only discovers `index.md` files, so empty directories are silently skipped.

### Project Structure Notes

- New files: `src/content/plan-spec-build-workshop/agents/index.md`, `src/content/plan-spec-build-workshop/docs/index.md`
- Modified: `src/lib/content-parser.ts` (add PINNED constant + `getSortedParsedContent`)
- Modified: `src/app/page.tsx` (smoke test — temporary)

### References

- [Source: epics.md#Story 1.4: "Meta-Blueprint" Project Definition]
- [Source: prd.md#FR16 — Plan. Spec. Build. is always first in the portfolio view]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

- Created `agents/index.md` with 7 BMAD agent descriptions and valid frontmatter (`status: Live`, `domain: [AI/ML, Developer Tooling, Productivity]`).
- Created `docs/index.md` representing the full design doc suite with `status: WIP` (accurate — Epic 2+ still in progress).
- Both files pass `FrontmatterSchema.safeParse` with all required fields.
- Added `PINNED_PROJECT_SLUG` constant and `getSortedParsedContent()` to `content-parser.ts`. Sort is stable — uses index-preserving `0` return for non-pinned pairs.
- Updated `page.tsx` to async Server Component calling `getSortedParsedContent()` with parsed/error count display. Pipeline confirmed working end-to-end.
- **Review Fix:** Replaced raw `"_error" in a` discriminant in `getSortedParsedContent` with the canonical `isError()` type guard from `schema.ts`. `isError` now imported in `content-parser.ts`. Type narrowing cleaner — `a.projectSlug` accessible without cast.

### File List

<!-- ⚠️ POPULATE THIS AT STORY START, not at the end. Add every file you plan to touch here BEFORE you begin implementing.
     Update throughout development. Final check: run `git status --porcelain` before moving to review and confirm this list matches. -->

- `src/content/plan-spec-build-workshop/agents/index.md`
- `src/content/plan-spec-build-workshop/docs/index.md`
- `src/lib/content-parser.ts`
- `src/app/page.tsx`
