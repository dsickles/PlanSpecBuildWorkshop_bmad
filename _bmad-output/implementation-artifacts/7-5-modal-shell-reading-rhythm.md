# Story 7.5: Modal Shell & Reading Rhythm

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want a document modal that provides immediate project context, clear navigation paths, and a comfortable reading rhythm,
so that I can consume long-form technical content without visual fatigue or losing my place.

## Acceptance Criteria

1. **Header Breadcrumb**: A "Sector Breadcrumb" (`{PROJECT_TITLE}`) is displayed above the document title in the modal header.
2. **Back Button**: The standard close 'X' is replaced with a localized, ghost-variant "Back" button to reinforce the navigation flow.
3. **Reading Progress Bar**: A thin horizontal progress bar is docked at the bottom of the sticky header, accurately reflecting vertical scroll progress.
4. **Typography & Spacing**: The markdown content utilizing generous vertical rhythm:
   - `prose-p:mb-10` (or equivalent Tailwind spacing)
   - `prose-headings:mt-16` (for H1/H2/H3)
   - `prose-p:leading-loose` (line-height)
5. **Sticky Header**: The modal header remains sticky during scroll, maintaining access to the breadcrumb, back button, and progress bar.
6. **Aesthetic Alignment**: Maintain "Linear Purist" styling (Zinc grayscale, subtle borders, backdrop-blur-md).

## Tasks / Subtasks

- [x] Implement Sector Breadcrumb & Localized Back Button (AC: 1, 2, 5) <!-- id: 0 -->
  - [x] Update `MarkdownDocumentModal.tsx` header section.
  - [x] Fetch the active project title for the breadcrumb.
  - [x] Replace `DialogClose` or 'X' button with a ghost-variant `Button` labeled "Back".
- [x] Implement Reading Progress Bar (AC: 3, 5) <!-- id: 1 -->
  - [x] Create a `useScrollProgress` hook or similar mechanism inside `MarkdownDocumentModal`.
  - [x] Render the progress bar at the bottom of the sticky header.
- [x] Apply Typographic Rhythm (AC: 4) <!-- id: 2 -->
  - [x] Update `MarkdownDocumentModal` to apply specific spacing classes.
  - [x] Ensure `leading-loose` and generous margins are applied to paragraphs and headings.
- [x] Finalize & Verify <!-- id: 3 -->
  - [x] Task N: Pre-Review Validation
    - [x] Subtask N.1: Run `npm run lint` and confirm output is clean.
    - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.
  - [x] Run unit tests for `MarkdownDocumentModal` to ensure progress bar and breadcrumb are present.

## Dev Notes

- **Project Context**: Access the project title from the `projects` data array (find the one matching `projectSlug` from `useFilterState`).
- **Progress Bar**: Can be a simple `motion.div` (if using Framer Motion) or a standard `div` with `transition-all` on width.
- **Typography**: Check if `src/components/custom/MarkdownRenderer.tsx` has a central configuration for `prose` classes. If so, update it there to benefit all markdown views.
- **Modal Width**: Keep `max-w-7xl` as established in 7.4.

### Project Structure Notes

- Logic primarily stays in `src/components/custom/MarkdownDocumentModal.tsx`.
- Spacing overrides might touch `src/components/custom/MarkdownRenderer.tsx`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.5]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#The Markdown Document Modal]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- ✅ Developed the "Sector Breadcrumb" in the modal header for immediate project context.
- ✅ Replaced the standard close 'X' with a localized "Back" button (ghost variant) for better navigation consistency.
- ✅ Implemented a sticky header with a docked scroll progress bar.
- ✅ Enhanced typographic rhythm using `prose-p:mb-10` and `prose-p:leading-loose`.
- ✅ Verified implementation with updated unit tests in `MarkdownDocumentModal.test.tsx`.
- ✅ Confirmed `npm run lint` passes (resolved initial warning via key-prop state reset refactoring).

## Senior Developer Review (AI)

**Review Outcome:** Changes Requested
**Review Date:** 2026-02-27
**Issues Found:** 0 High, 3 Medium, 2 Low

### Findings Summary

| ID | Severity | Description | File |
|---|---|---|---|
| R1 | MEDIUM | Accessibility: Progress bar missing `role="progressbar"` and `aria-valuenow` | `MarkdownDocumentModal.tsx` |
| R2 | MEDIUM | Documentation: `sprint-status.yaml` missing from File List | `7-5-modal-shell-reading-rhythm.md` |
| R3 | MEDIUM | Test Quality: Progress bar test only checks container existence, not progression | `MarkdownDocumentModal.test.tsx` |
| R4 | LOW | Aesthetic: Project Title fallback for breadcrumb is limited to simple uppercase | `MarkdownDocumentModal.tsx` |
| R5 | LOW | Typographic: `prose-headings:mt-16` may apply to H4+ which might be too large | `MarkdownDocumentModal.tsx` |

### Action Items

- [x] [AI-Review][MEDIUM] Add `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="100"`, and `aria-valuenow={Math.round(scrollProgress)}` to the progress bar.
- [x] [AI-Review][MEDIUM] Update the story File List to include `sprint-status.yaml`.
- [x] [AI-Review][MEDIUM] Add a test case that simulates scroll and verifies progress bar width change.
- [x] [AI-Review][LOW] Refine breadcrumb logic to prioritize `activeDoc.projectTitle` and handle missing cases more gracefully.
- [x] [AI-Review][LOW] Consider limiting the large top margin to `H1`, `H2`, and `H3`.

---

### File List

- [MODIFY] [MarkdownDocumentModal.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/MarkdownDocumentModal.tsx)
- [MODIFY] [MarkdownDocumentModal.test.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/__tests__/MarkdownDocumentModal.test.tsx)
- [MODIFY] [sprint-status.yaml](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/implementation-artifacts/sprint-status.yaml)
