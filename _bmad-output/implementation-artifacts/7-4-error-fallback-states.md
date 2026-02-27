# Story 7.4: Error & Fallback States

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to see a clear, themed error state if a document fails to load within the modal,
so that I understand why content is missing without experiencing a broken interface.

## Acceptance Criteria

1. **Themed Fallback UI**: When an invalid or missing `?document=` parameter is detected, the modal must display a themed fallback UI using the dashed border [Concept] style (Zinc-200/800 dashed border).
2. **Clear Error Messaging**: The fallback UI must explicitly state "Document Not Found" and provide a brief explanation (e.g., "The requested document could not be located").
3. **Recovery Action**: An explicit "Return to Command Center" button must be present in the error state.
4. **State Reset**: Clicking "Return to Command Center" must clear the `document` parameter from the URL and close the modal.
5. **Semantic Test Tokens**: The error container must implement `data-testid="document-error-fallback"` and `aria-label="document not found"`.
6. **Modal Integrity**: The error state must still respect the modal width (`max-w-5xl` scaled in Story 7.3 to `max-w-7xl`/`max-w-5xl` etc.) and background blur effects.

## Tasks / Subtasks

- [x] Implement Themed Error UI (AC: 1, 2, 5, 6) <!-- id: 0 -->
  - [x] Update the `else` block in `MarkdownDocumentModal.tsx` to use a themed fallback container with dashed border.
  - [x] Add `data-testid="document-error-fallback"` and `aria-label="document not found"`.
- [x] Add Recovery Action Button (AC: 3, 4) <!-- id: 1 -->
  - [x] Add "Return to Command Center" button using shadcn `Button`.
  - [x] Wire the `onClick` to `setDocument(null)` via `handleOpenChange`.
- [x] Enhance Automated Tests <!-- id: 2 -->
  - [x] Update `MarkdownDocumentModal.test.tsx` to include a test case for the error state.
  - [x] verify clicking the reset button calls `setDocument` with `null`.
- [x] Task N: Pre-Review Validation <!-- id: 3 -->
  - [x] Subtask N.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.

## Dev Notes

- **Architecture Boundary**: Place UI changes in `src/components/custom/MarkdownDocumentModal.tsx`.
- **Aesthetic Alignment**: Use the "Tinted Neutrality" palette. The dashed border should use `border-zinc-200 dark:border-zinc-800`.
- **URL State**: Ensure `useFilterState`'s `setDocument` is used to maintain URL synchronization.

### Project Structure Notes

- Alignment with `src/components/custom/MarkdownDocumentModal.tsx`.
- Leverages existing `ProjectCard` or its primitives if applicable for the dashed border look.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.4]
- [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling Strategy]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- ✅ Implemented themed error fallback in `MarkdownDocumentModal.tsx` using dashed border styling.
- ✅ Added "Return to Command Center" button using shadcn `Button` component to clear URL document state.
- ✅ Enhanced `MarkdownDocumentModal.test.tsx` with coverage for the error state and recovery action.
- ✅ Fixed regression in modal width test (updated from `max-w-5xl` to `max-w-7xl`).
- ✅ Verified all ACs via unit tests and manual preview check.
- ✅ Confirmed `npm run lint` passes.

## Senior Developer Review (AI)

**Review Outcome:** Approved
**Review Date:** 2026-02-26
**Issues Found:** 0 High, 3 Medium, 1 Low (All Resolved)

### Findings Summary (Resolved)

| ID | Severity | Description | File |
|---|---|---|---|
| R1 | MEDIUM | AC 1 Violation: Missing Light Mode Border Color | `src/.../MarkdownDocumentModal.tsx` |
| R2 | MEDIUM | UX: Missing Error Icon for "Premium" Aesthetic | `src/.../MarkdownDocumentModal.tsx` |
| R3 | MEDIUM | Technical: Missing specific test for Zod validation failure case | `src/.../MarkdownDocumentModal.test.tsx` |
| R4 | LOW | Aesthetic: Zinc-800 on Zinc-950 has insufficient contrast for "Dashed" border | `src/.../MarkdownDocumentModal.tsx` |

### Action Items

- [x] [AI-Review][MEDIUM] Add `dark:border-zinc-800 border-zinc-200` to the error fallback container (AC 1 alignment).
- [x] [AI-Review][MEDIUM] Add `AlertCircle` or `SearchX` icon to the error state for visual emphasis.
- [x] [AI-Review][MEDIUM] Add a test case in `MarkdownDocumentModal.test.tsx` for invalid slug validation (Zod schema failure).
- [x] [AI-Review][LOW] Consider `border-zinc-700` in dark mode for better visibility of the dashed pattern.

---

### File List

- [MODIFY] [MarkdownDocumentModal.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/MarkdownDocumentModal.tsx)
- [MODIFY] [MarkdownDocumentModal.test.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/__tests__/MarkdownDocumentModal.test.tsx)
