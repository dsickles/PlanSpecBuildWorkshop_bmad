# Story 7.2: Focused Markdown Reading Experience

## Description
As a User, I want a large, readable modal (2/3 screen width) with optimized line lengths and a blurred background, so that I can focus on technical prose without losing my sense of place in the portfolio.

## Requirements
- [x] Modal width must be approximately 2/3 of the screen (`max-w-5xl`).
- [x] The dialog backdrop must use `backdrop-blur-md` with a semi-transparent `zinc-950` overlay.
- [x] The inner content column (the markdown text) must be constrained to `65-75ch` to maintain ideal typographic line lengths for long-form reading.
- [x] Maintain the "Linear Purist" aesthetic (zinc-950 background, zinc-800 borders, high-contrast typography).

## Dev Notes
- Update `src/components/custom/MarkdownDocumentModal.tsx` to use `max-w-5xl` for the `DialogContent`.
- Modify `src/components/ui/dialog.tsx` to allow customizing the overlay class, or apply the blur/zinc-950 theme to the base `DialogOverlay` if it aligns with the global UX spec.
- Wrap the `<article>` content in a container that enforces the `65-75ch` limit (e.g., `mx-auto max-w-[70ch]`).
- Ensure the sticky header remains full-width of the modal while the content is centered.

## Acceptance Criteria
- [x] **Given** the document modal is open,
- [x] **When** viewing the content,
- [x] **Then** the modal width is approximately 2/3 of the screen (`max-w-5xl`).
- [x] **And** the background uses `backdrop-blur-md` with a semi-transparent `zinc-950` overlay to keep the grid visible but secondary.
- [x] **And** the inner content column is constrained to `65-75ch` to maintain ideal typographic line lengths for long-form reading.

## Files to Modify
- [MODIFY] [MarkdownDocumentModal.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/MarkdownDocumentModal.tsx)
- [MODIFY] [dialog.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/ui/dialog.tsx) (if needed for overlay styling)

## Dev Agent Record (AI)
### Implementation Plan
- [x] Task 1: Update Modal Width and Backdrop Styling
  - [x] Subtask 1.1: Update `DialogContent` className in `MarkdownDocumentModal.tsx` to `max-w-5xl`.
  - [x] Subtask 1.2: Add `backdrop-blur-md` and `bg-zinc-950/50` (or similar) to `DialogOverlay` in `dialog.tsx`.
- [x] Task 2: Constraint Markdown Content Width
  - [x] Subtask 2.1: Wrap the article content in a `div` with `max-w-[70ch]` and `mx-auto`.

### Debug Log
- Story initialized.
- Implemented Task 1 and 2.
- Verified with unit tests in `src/components/custom/__tests__/MarkdownDocumentModal.test.tsx`.

### Completion Notes
- Modal width increased to `max-w-5xl`.
- Fixed a conflict in `src/components/ui/dialog.tsx` where a hardcoded `sm:max-w-lg` class was overriding custom widths. The base component is now more flexible.
- Backdrop blur added to `DialogOverlay` for consistent focus across all modal usages (About modal, doc modal).
- Article content centered and constrained to `70ch` for optimal reading.

## Change Log
- 2026-02-26: Initial story creation and start of implementation.
- 2026-02-26: Completed implementation and verification.

## Status
- Status: done
