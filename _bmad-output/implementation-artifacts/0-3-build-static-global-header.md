# Story 0.3: Build Static Global Header

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to see a consistent, persistent top navigation bar containing the project title and utility icons,
so that the visual branding and core utility actions are always accessible.

## Acceptance Criteria

1.  **Given** the application layout,
2.  **When** navigating through the app,
3.  **Then** the Global Header component is rendered consistently at the top of the viewport.
4.  **And** it matches a clean flex layout, including placeholder/stub icons for the theme toggle and info icons.

## Tasks / Subtasks

- [x] Task 1: Scaffolding the Header Component (AC: 1, 2, 3)
  - [x] Subtask 1.1: Create `src/components/layout/global-header.tsx`.
  - [x] Subtask 1.2: Implement a semantic `<header>` element with **sticky** positioning at the top of the viewport, ensuring it rests above standard content using an appropriate z-index.
- [x] Task 2: Implement Header Content & Layout (AC: 4)
  - [x] Subtask 2.1: Add the application title aligned to the left side of the header.
  - [x] Subtask 2.2: Add a flex container to the right side of the header to hold utility icons.
  - [x] Subtask 2.3: Import temporary stub icons from `lucide-react` (e.g., `Sun`/`Moon` for theme, `Info` for about) and place them in the right-side flex container.
- [x] Task 3: Integrate Header into Global Layout (AC: 1, 2, 3)
  - [x] Subtask 3.1: Mount the `GlobalHeader` component within `src/app/layout.tsx` so it persists across potential route changes.

## Dev Notes

- **Layout Structure:** The header must be globally persistent. Mounting it inside `src/app/layout.tsx` before the main `{children}` container is the correct architectural approach for Next.js app router.
- **Aesthetic Direction:** We are following a premium "Apple/Linear" design standard. Use generous whitespace, a glassmorphic or highly subtle border-bottom, and ensure the title typography aligns with our `--font-sans` Inter configuration.
- **Icons:** We have already installed `lucide-react` as part of the shadcn/ui initialization. Use those for the stubbed icons. Do not build functionality into the icons yet—this story is purely structural packaging.

### Project Structure Notes

- New components that are strictly structural/layout should reside in `src/components/layout/` to separate them from generic UI primitives in `src/components/ui/`.

### References

- [Source: epics.md#Story 0.3: Build Static Global Header]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

- Created `GlobalHeader` component using a semantic `<header>` element in `src/components/layout/global-header.tsx`.
- Styled header with **sticky** positioning (not fixed — sticky keeps the element in document flow), backdrop blur, and proper z-index to match premium styling.
- Used `lucide-react` to stub `Info`, `Sun`, and `Moon` toggle buttons.
- Injected `<GlobalHeader />` structurally into the `src/app/layout.tsx` body using a Next.js standard Flex-col layout wrapping the main children container.
- Updated page metadata in `layout.tsx` from default Next.js scaffolding to actual project title and description.
- **Review Fixes Applied:** Extracted shared `iconButtonClass` constant to eliminate CSS duplication. Added `relative` to the `iconButtonClass` to fix Moon icon absolute positioning. Removed redundant `sm:inline-block` from desktop title span. Corrected story text from "fixed" to "sticky" to match actual implementation.

### File List

- `src/components/layout/global-header.tsx`
- `src/app/layout.tsx`
