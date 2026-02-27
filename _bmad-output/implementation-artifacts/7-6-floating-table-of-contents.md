# Story 7.6: Floating Table of Contents

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want an interactive Table of Contents for long documents,
so that I can quickly understand the document's structure and jump to relevant sections.

## Acceptance Criteria

1. **ToC Side-Rail**: An interactive Table of Contents (ToC) side-rail is displayed when the modal is open on desktop (≥1024px).
2. **Header Extraction**: The system extracts H2 and H3 headers from the document markdown to populate the ToC.
3. **Interactive Scrolling**: Clicking a ToC entry scrolls the document container smoothly to the corresponding section.
4. **Architectural Boundary**: ToC extraction logic resides in the content parsing layer (`src/lib/`) rather than the UI layer.
5. **Heading Stability**: Document headings have matching unique `id` attributes that sync with ToC slugs.
6. **Wayfinding**: The ToC provides clear vertical rhythm and structural wayfinding for long technical documents.

## Tasks / Subtasks

- [x] Implement Header Extraction Logic (AC: 2, 4) <!-- id: 10 -->
  - [x] Implement `extractToc` and `generateSlug` in `src/lib/toc-engine.ts`.
  - [x] Add unit tests for header extraction.
- [x] Update Content Pipeline for ToC (AC: 4, 5) <!-- id: 11 -->
  - [x] Update `ParsedArticle` schema to include ToC metadata.
  - [x] Modify `parseMarkdownFile` to generate ToC and inject header IDs into HTML.
- [x] Implement ToC UI Component (AC: 1, 3, 6) <!-- id: 12 -->
  - [x] Build `TableOfContents` as a nested component in `MarkdownDocumentModal.tsx`.
  - [x] Implement smooth scrolling and `scroll-margin-top` for headings.
  - [x] Ensure side-rail is only visible in desktop view (`md:` or `lg:` breakpoints).
- [x] Finalize & Verify <!-- id: 13 -->
  - [x] Task N: Pre-Review Validation
    - [x] Subtask N.1: Run `npm run lint` and confirm output is clean.
    - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.
  - [x] Verify ToC interaction in the browser.

## Dev Notes

- **ToC Engine**: Use a robust regex or a lightweight parser in `src/lib/toc-engine.ts` to identify `##` and `###`.
- **Slugs**: Slugs should be lowercase, space-to-hyphen, and stripped of special characters.
- **Scroll Behavior**: Use `scroll-behavior: smooth` and Tailwind `scroll-mt-32` (adjust for sticky header height) on headings.
- **Layout**: The modal container already uses `max-w-7xl`. The main content is `max-w-[70ch]`. The ToC can float in the remaining sidebar space.

### Project Structure Notes

- Data logic: `src/lib/toc-engine.ts`, `src/lib/content-parser.ts`, `src/lib/schema.ts`.
- UI logic: `src/components/custom/MarkdownDocumentModal.tsx`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.6]
- [Source: _bmad-output/planning-artifacts/architecture.md#ToC Engine Boundary]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#3. The Markdown Document Modal]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

- [MODIFY] [schema.ts](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/lib/schema.ts)
- [NEW] [toc-engine.ts](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/lib/toc-engine.ts)
- [MODIFY] [content-parser.ts](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/lib/content-parser.ts)
- [MODIFY] [MarkdownDocumentModal.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/MarkdownDocumentModal.tsx)
- [NEW] [toc-engine.test.ts](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/lib/__tests__/toc-engine.test.ts)
- [NEW] [MarkdownDocumentModal.test.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/__tests__/MarkdownDocumentModal.test.tsx)
- [MODIFY] [sprint-status.yaml](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/implementation-artifacts/sprint-status.yaml)

## Code Review Findings (AI Adversarial Review) - [RESOLVED]

### 🟢 HIGH SEVERITY (FIXED)
- **Duplicate Header Breakdown**: [FIXED] Unique slugs generated via counter suffix.
- **ID Injection Loop Logic**: [FIXED] Sequential non-global matching prevents double injection.
- **Slug Collision Bug**: [FIXED] Implemented a global uniqueness check (`seenSlugs` set) that handles manually named headers (e.g., "Overview 1").

### 🟢 MEDIUM SEVERITY (FIXED)
- **Breakpoint Mismatch**: [FIXED] Updated to `lg:block`.
- **ToC Pollution**: [FIXED] Code blocks are ignored during extraction.
- **Missing Documentation**: [FIXED] Added `MarkdownDocumentModal.test.tsx` and `toc-engine.test.ts` to File List.
- **ResizeObserver Performance**: [FIXED] Optimized via `requestAnimationFrame` debouncing in `MarkdownDocumentModal.tsx`.

### 🟢 LOW SEVERITY (FIXED)
- **No Active Highlighting**: [FIXED] Implemented IntersectionObserver logic.
- **Slug Collision**: [FIXED] Uniqueness logic handles sequential collisions.
- **Case-Insensitive Fuzzy Match**: [FIXED] Using `i` flag with `lastIndex` tracking for stable sequential matching.
