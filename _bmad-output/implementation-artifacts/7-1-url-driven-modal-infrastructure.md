# Story 7.1: URL-Driven Modal Infrastructure

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Front-End Developer,
I want to synchronize the document modal state with the URL `?document=` parameter,
so that users can bookmark, share, and navigate directly to specific documents with full state persistence.

## Acceptance Criteria

1. **URL Synchronization**: The document modal state is driven by the `?document=` parameter in the URL.
2. **Auto-Mount**: When a valid `?document=` parameter is present on page load or navigation, the `MarkdownDocumentModal` automatically opens and displays the document.
3. **Parameter Validation**: The `?document=` value is validated against the active project's file list using Zod to prevent invalid file stems from causing errors.
4. **State Preservation**: Closing the modal removes only the `document` parameter from the URL, preserving all other active project, domain, and tech filters.
5. **Phase 1 Performance**: Modal transitions use 0ms hard cuts to ensure stability and predictability.

## Tasks / Subtasks

- [x] Define Constants & Types
  - [x] Add `DOCUMENT_PARAM = 'document'` to `src/lib/constants.ts`.
- [x] Update URL State Hook
  - [x] Update `useFilterState.ts` to include `activeDocument` and a `setDocument` function.
  - [x] Ensure `clearAllFilters` or context-specific clears handle the `document` parameter correctly.
- [x] Implement Document Modal Controller
  - [x] Create `shadcn` Dialog component (`src/components/ui/dialog.tsx`).
  - [x] Create `src/components/custom/MarkdownDocumentModal.tsx` (using shadcn/ui Dialog).
  - [x] Implement Zod validation in the modal or parent to verify document existence before rendering.
- [x] Wire DiscoveryGrid Trigger
  - [x] Update `BlueprintGroup.tsx` document rows to use `setDocument` on title/icon click.
  - [x] Update `DiscoveryGrid.tsx` to render the `MarkdownDocumentModal` when `activeDocument` is present.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.

## Dev Notes

- **Architecture Patterns**: Follow the URL-driven state patterns established in Epic 3. Use `searchParams` for deep-linking.
- **Guardrails**: Implement Semantic Test Tokens (`data-testid`, `aria-label`) for the modal and any fallback/error states within it, as learned in Epic 6.
- **Constraints**: Maintain the "Linear Purist" aesthetic (zinc-950, 65-75ch line length, backdrop-blur-md).

### Project Structure Notes

- New components go in `src/components/custom/`.
- Logic for state management stays in `src/hooks/useFilterState.ts`.
- Content parsing logic in `src/lib/content-parser.ts` should already support fetching documents by slug.

### References

- [Epic 7: Deep Document Discovery](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/epics.md#L431)
- [Architecture: URL-Driven State](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/architecture.md#L154)
- [UX: Modal Experience](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/ux-design-specification.md#L323)

## Dev Agent Record

### Agent Model Used

antigravity-v1

### Debug Log References

### Completion Notes List

- Implemented `DOCUMENT_PARAM` in `constants.ts`.
- Updated `useFilterState` hook to synchronize `activeDocument` with the URL.
- Added 10 tests to `useFilterState.test.tsx` (4 existing, 6 new) to verify URL synchronization.
- Added `shadcn/ui` Dialog component.
- Implemented `MarkdownDocumentModal` with "Linear Purist" styling and accessibility test tokens.
- Integrated the modal into `DiscoveryGrid` and wired triggers in `BlueprintGroup`.
- Verified 100% test pass rate (44/44 tests).
- Verified clean lint output.

### File List

- src/lib/constants.ts
- src/hooks/useFilterState.ts
- src/hooks/__tests__/useFilterState.test.tsx
- src/components/ui/dialog.tsx
- src/components/custom/MarkdownDocumentModal.tsx
- src/components/content/blueprint-group.tsx
- src/components/custom/DiscoveryGrid.tsx
- _bmad-output/implementation-artifacts/7-1-url-driven-modal-infrastructure.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
