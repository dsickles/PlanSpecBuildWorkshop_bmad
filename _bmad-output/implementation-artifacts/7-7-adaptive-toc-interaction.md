# Story 7.7: Adaptive TOC Interaction

Status: done

## Story

As a User,
I want the Table of Contents and the document header to adjust dynamically as I scroll,
so that I can maintain my reading rhythm without the TOC overlapping the header or losing my place in the sidebar.

## Acceptance Criteria

1. **TOC Stickiness**: The TOC side-rail offset remains visible just below the sticky header, preventing overlap.
2. **Sidebar Auto-Scroll**: The TOC sidebar automatically scrolls to keep the currently active heading entry vertically centered and visible (Active Item Centering).
3. **Smooth Transitions**: Sidebar scrolling is smooth and non-jarring.

## Tasks / Subtasks

- [x] Refine TOC Stickiness <!-- id: 11 -->
  - [x] Update `TableOfContents` sticky `top` property to follow `headerHeight`.
- [x] Implement Sidebar Auto-Scroll Logic <!-- id: 12 -->
  - [x] Add `useEffect` to monitor `activeToCId`.
  - [x] Use `scrollIntoView({ behavior: 'smooth', block: 'center' })` on active TOC item.
- [x] Verification & Testing <!-- id: 13 -->
  - [x] Manually verify scrolling rhythm on long documents.

## Dev Agent Record

### File List
- [MarkdownDocumentModal.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/MarkdownDocumentModal.tsx)
- [MarkdownDocumentModal.test.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/__tests__/MarkdownDocumentModal.test.tsx)
- [architecture.md](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/architecture.md)
- [ux-design-specification.md](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/ux-design-specification.md)
- [content-parser.ts](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/lib/content-parser.ts)

### Change Log

#### 2026-02-27 - Initial Implementation
- Implemented `isCompressed` state with 50px threshold.
- Added dynamic `headerHeight` measurement using `ResizeObserver`.
- Updated TOC sidebar with sticky dynamic offset and Active Item Centering (auto-scroll).
- Added test coverage for head compression behavior.

#### 2026-02-27 - Header Compression Reversal
- Removed `isCompressed` state and threshold logic after user feedback.
- Restored persistent header size for stability.
- Retained dynamic TOC stickiness and Sidebar Auto-Scroll features.

#### 2026-02-27 - Code Review Refinements (AI)
- Fixed `headerHeight` prop passing to TOC component.
- Added `scrollPaddingTop` to main content container for precise anchor jumps.
- Extracted `TOC_HIGHLIGHT_THRESHOLD` constant.
- Synced documentation File List with actual modifications.

## Dev Notes
...

- Use the existing `headerHeight` calculation for stickiness.
- Ensure the compression threshold (50px) doesn't cause "flicker" on minor scroll bounces.
- The TOC sidebar container needs to be the scroll target for centering.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.7]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Adaptive Interactions]
