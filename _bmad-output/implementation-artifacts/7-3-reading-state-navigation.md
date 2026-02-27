# Story 7.3: Reading State & Navigation

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want a sticky navigation header inside the modal and smooth scroll behavior,
so that I can easily track my progress through long documents and exit effortlessly.

## Acceptance Criteria

1. **Sticky Header**: The modal header (containing document title, status, and metadata) must remain sticky at the top of the modal viewport as the user scrolls the document content.
2. **Smooth Exit Focus**: Closing the modal (via X button, Escape key, or backdrop click) must return focus to the specific document row in the `DiscoveryGrid` that triggered the modal.
3. **Custom Scrollbar Styling**: The modal's scrolling content must implement a custom "thin" scrollbar matching the "Linear Purist" aesthetic (Zinc-800 track, Zinc-600 thumb, 4-6px width).
4. **Scroll Positioning**: Opening the modal must ensure the scroll position starts at the top of the document content, regardless of previous modal states.
5. **Dismissal Animation**: The modal dismissal must use a clean, non-jarring fade-out animation (standard shadcn/Radix transition is sufficient if not intentionally slowed down).

## Tasks / Subtasks

- [x] Implement Sticky Modal Header (AC: 1)
  - [x] Apply `sticky top-0 z-10` to the `DialogHeader` container in `MarkdownDocumentModal.tsx`.
  - [x] Add a subtle border or solid background to ensure content doesn't bleed under the header during scroll.
- [x] Implement Custom Scrollbar Styling (AC: 3)
  - [x] Add Tailwind scrollbar utility classes (e.g., `scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-800/50`) or custom CSS in `globals.css` if utilities aren't available.
- [x] Ensure Smooth Exit Focus Management (AC: 2)
  - [x] Verify `Dialog` auto-focus behavior. If necessary, explicitly manage focus restoration using a ref to the trigger element.
- [x] Verify Scroll Behavior & State (AC: 4, 5)
  - [x] Ensure `overflow-y-auto` is correctly containerized to prevent double-scrollbars on high-resolution screens.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.

## Dev Notes

- **Architecture Boundary**: Place all UI changes in `src/components/custom/MarkdownDocumentModal.tsx`. Do not touch primitive shadcn files in `src/components/ui/`.
- **SCROLLBAR TIP**: Tailwind v4 doesn't have native `scrollbar-thin` but you can use arbitrary values or standard CSS `::-webkit-scrollbar` in `globals.css` within the `.prose` or modal container classes.
- **Header Aesthetics**: The header must maintain the `bg-zinc-950/80 backdrop-blur-md` styling from Story 7.2 to maintain the premium feel.

### Project Structure Notes

- Alignment with `src/components/custom/MarkdownDocumentModal.tsx`.
- Uses `Dialog` primitives which handle Radix focus management automatically, but verify that URL-driven state changes don't break focus restoration.

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Reading State & Navigation]
- [Source: _bmad-output/planning-artifacts/architecture.md#Decision Priority Analysis]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Applied `max-w-7xl` to `DialogContent` to achieve 2/3 screen width requirement.
- Implemented custom "thin" scrollbar in `globals.css` using `::-webkit-scrollbar` with Zinc-600/800 colors.
- Refactored `MarkdownDocumentModal` to use an inner scrollable div, allowing the 'X' button to remain fixed while content scrolls.
- Added `z-60` to the close button via `globals.css` to prevent overlap by the sticky header.
- Implemented manual focus restoration using `useRef` and `requestAnimationFrame` to ensure the trigger icon is re-focused on close.
- Verified scroll position reset on modal open using `useEffect`.
- **Code Review Fixes**:
  - Memoized `handleDocOpen` in `DiscoveryGrid` to prevent unnecessary child re-renders.
  - Hardened document matching logic by prefixing slugs with `projectSlug:` to prevent collisions.
  - Updated `DocumentSlugSchema` to support underscores and colons.
  - Synchronized `File List` with actual git changes.

### File List

- [MODIFY] [MarkdownDocumentModal.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/MarkdownDocumentModal.tsx)
- [MODIFY] [DiscoveryGrid.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/DiscoveryGrid.tsx)
- [MODIFY] [globals.css](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/app/globals.css)
- [MODIFY] [useFilterState.ts](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/hooks/useFilterState.ts)
- [MODIFY] [useFilterState.test.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/hooks/__tests__/useFilterState.test.tsx)
- [MODIFY] [constants.ts](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/lib/constants.ts)
- [MODIFY] [sprint-status.yaml](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/implementation-artifacts/sprint-status.yaml)
