# Story 1.3: Markdown Content and Metadata Ingestion Engine

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Next.js Developer,
I want to parse the extracted files into structured Frontmatter metadata and HTML content,
so that the raw Markdown is transformed into the required React props for the Universal Compound Card components.

## Acceptance Criteria

1.  **Given** the raw file contents from the file system utility,
2.  **When** processing the content,
3.  **Then** `gray-matter` successfully extracts the Frontmatter and validates it against the Zod schema from Story 1.1, returning the `[Error]` fallback state on validation failure.
4.  **And** the `[Error]` fallback UI must explicitly surface the specific Zod validation error messages (e.g., "Missing required field: tech_stack") to the Author instead of a generic failure message.
5.  **And** HTML generation safely parses GitHub-flavored markdown (specifically tables and code blocks) using `remark/rehype` without allowing the execution of raw script tags (XSS protection).

## Tasks / Subtasks

- [x] Task 1: Install dependencies (AC: 3, 5)
  - [x] Subtask 1.1: Installed `gray-matter remark remark-gfm rehype-stringify remark-rehype rehype-sanitize` (93 packages added).
- [x] Task 2: Create `src/lib/content-parser.ts` (AC: 3, 4, 5)
  - [x] Subtask 2.1: Implemented `parseMarkdownFile()` with 6-step pipeline.
  - [x] Subtask 2.2: Zod validation failures return `ErrorFrontmatter` with field-level messages.
  - [x] Subtask 2.3: remark/rehype pipeline with `rehype-sanitize` (default schema) for XSS protection.
  - [x] Subtask 2.4: Implemented `getAllParsedContent()` calling `getContentFilePaths()` + `parseMarkdownFile`.
- [x] Task 3: Export `ParsedArticle` type (AC: 3)
  - [x] Subtask 3.1: Exported `ParsedArticle = FrontmatterData & { html, projectSlug, artifactType }`.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: `npm run lint` — clean. `npx tsc --noEmit` — clean.
  - [x] Subtask N.2: `git status --porcelain` — `src/lib/content-parser.ts` confirmed.

## Dev Notes

- **`gray-matter` date behavior:** gray-matter parses YAML dates as JS `Date` objects by default. Pass `{ engines: { yaml: { ... } } }` options or use `matter.read()` with `{ excerpt: false }` to avoid it. The Zod schema uses `z.string()` for date — gray-matter's Date objects will fail validation. Use `String(data.date)` or `JSON.stringify` normalization before passing to Zod.
- **Zod `safeParse` not `parse`:** Always use `FrontmatterSchema.safeParse(data)` — never `.parse()`. The `.parse()` variant throws on failure, which would crash the Next.js build for one bad content file.
- **Error message formatting:** Extract error messages via `result.error.errors.map(e => e.message).join("; ")` — this surfaces the specific field-level messages required by AC 4.
- **`rehype-sanitize` defaults:** The default `defaultSchema` from `rehype-sanitize` strips `<script>` tags and event handler attributes, satisfying AC 5's XSS requirement. Do not disable or override `defaultSchema`.
- **Server-only:** This file uses `fs.readFileSync` and must remain server-only. Add `"use server"` directive.
- **`artifact_type` field:** If frontmatter does NOT include `artifact_type`, inject it from the `artifactType` param derived from directory structure. This ensures Story 1.2's directory-derived type is always the fallback truth.

### Project Structure Notes

- New file: `src/lib/content-parser.ts`
- Depends on: `src/lib/schema.ts`, `src/lib/content-utils.ts`
- Used by: `src/app/page.tsx` (future stories)

### References

- [Source: epics.md#Story 1.3: Markdown Content and Metadata Ingestion Engine]
- [Source: prd.md#FR1, FR2 — Content ingestion and error fallback]
- [Source: ux-design-specification.md#Error/Fallback state — dashed border, [Error] pill with specific message]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

- Created `src/lib/content-parser.ts` with 6-step pipeline: read → matter → normalize dates → inject artifact_type → safeParse → remark/rehype.
- `gray-matter` date normalization: used `normalizeDates()` recursive helper to convert `Date` objects to `"YYYY-MM-DD"` strings before Zod validation.
- Zod error message format: `issue.path.map(String).join(".") + ": " + issue.message` surfaces field-level errors to Authors (AC 4).
- `rehype-sanitize` with default schema strips `<script>` and all event handler attributes (XSS, AC 5).
- `satisfies ParsedArticle` operator used for return value type safety.
- **Implementation Fixes Found During Dev:** (1) Zod v4 uses `.issues` not `.errors`. (2) Zod v4 `issue.path` is `PropertyKey[]` (includes `symbol`); fixed with `.map(String)`. (3) `ParsedArticle | ErrorFrontmatter` is the correct return type (not `ParsedContent`) since `ParsedArticle` is a superset of `FrontmatterData`.

### File List

<!-- ⚠️ POPULATE THIS AT STORY START, not at the end. Add every file you plan to touch here BEFORE you begin implementing.
     Update throughout development. Final check: run `git status --porcelain` before moving to review and confirm this list matches. -->

- `src/lib/content-parser.ts`
- `package.json`
- `package-lock.json`
