# Story 7.8: Refining Reading Rhythm & Focus

Status: done

## Story

As a User,
I want the focus to be correctly restored after closing the modal and the document to be perfectly aligned with the sticky header,
so that my reading experience remains stable and authoritative without technical "jitter".

## Acceptance Criteria

1. **Declarative Focus Restoration**: Closing the modal (via any method) must restore focus to the trigger icon in the grid using a declarative approach (e.g., Radix `onCloseAutoFocus`).
2. **Stable Document Anchoring**: Clicking a Table of Contents link must land the document exactly at the header, respecting the layout's alignment.
3. **Clean Technical Debt**: Remove any manual focus hacks (like redundant refs) or measurement logic that is no longer required by the refined implementation.

## Tasks / Subtasks

- [x] Implement Declarative Focus Management (AC: 1)
  - [x] Refactor `MarkdownDocumentModal.tsx` to use `onCloseAutoFocus` on `DialogContent`.
  - [x] Ensure the focus is returned to the element that triggered the modal opening.
- [x] Refine ToC Anchoring & Scroll Padding (AC: 2)
  - [x] Align document container with sticky header behavior.
  - [x] Coordinate with `headerHeight` measurement to ensure pixel-perfect jumps.
- [x] Technical Debt Cleanup (AC: 3)
  - [x] Remove `lastFocusedElement` ref and any manually managed focus trackers.
  - [x] Clean up redundant measurement logic in `MarkdownDocumentModal.tsx`.
- [x] Verification & Testing
  - [x] Verify focus restoration using keyboard navigation.
  - [x] Verify ToC anchor alignment on long documents.
  - [x] Run existing tests and update if necessary.

## Dev Notes

- **Architecture Boundary**: Focus on `src/components/custom/MarkdownDocumentModal.tsx`.
- **Radix Tip**: Use the `onCloseAutoFocus` prop to prevent the default "focus first element in body" behavior and target the previous trigger.
- **Focus Restoration**: By removing the `key` on `DialogContent`, Radix now correctly restores focus to the triggering element automatically. Explicit `onCloseAutoFocus` added for architectural alignment.
- **Anchoring Fix**: Removed redundant `scrollPaddingTop` which was causing over-scrolling in the `flex-col` layout.

## Dev Agent Record

### Implementation Notes

- **Code Review Fixes**: 
  - Implemented explicit `onCloseAutoFocus` hook in `MarkdownDocumentModal.tsx` to satisfy architectural requirements.
  - Fixed anchoring regression: Removed `scrollPaddingTop` which was causing ToC links to scroll too far down in the `flex-col` layout (where the header is a sibling, not an overlay).
  - Updated File List to include all registration and tracking artifacts.
- Removed `lastFocusedElement` ref and manual focus capturing logic.
- Added stable IDs to `BlueprintGroup` and `ProjectCard` document triggers (`doc-trigger-*`).
- Added unit tests for scrolling behavior and verified focus restoration behavior (7 tests passing).

### File List

- [MODIFY] [MarkdownDocumentModal.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/MarkdownDocumentModal.tsx)
- [MODIFY] [BlueprintGroup.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/content/blueprint-group.tsx)
- [MODIFY] [ProjectCard.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/content/project-card.tsx)
- [MODIFY] [MarkdownDocumentModal.test.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/__tests__/MarkdownDocumentModal.test.tsx)
- [MODIFY] [epics.md](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/epics.md)
- [MODIFY] [architecture.md](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/architecture.md)
- [MODIFY] [sprint-status.yaml](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/implementation-artifacts/sprint-status.yaml)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.8]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Adaptive Interactions]
