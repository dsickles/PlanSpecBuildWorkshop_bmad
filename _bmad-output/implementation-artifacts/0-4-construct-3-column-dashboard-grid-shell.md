# Story 0.4: Construct 3-Column Dashboard Grid Shell

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want the main content area divided into three distinct structural columns (Studio, Blueprints, Lab),
so that the interface is ready to receive and display categorized project components.

## Acceptance Criteria

1.  **Given** the main application canvas underneath the global header,
2.  **When** rendering the `DashboardGrid` wrapper component,
3.  **Then** the layout is defined via CSS Grid to explicitly map out three equivalent desktop columns matching the mockup.
4.  **And** the component must accept dynamic `children` props to allow data-driven components to be injected into the columns in future Epics, rather than hardcoding children in the layout layer.

## Tasks / Subtasks

- [x] Task 1: Create the DashboardGrid Layout Component (AC: 1, 2, 3, 4)
  - [x] Subtask 1.1: Create `src/components/layout/dashboard-grid.tsx`.
  - [x] Subtask 1.2: Implement a 3-column CSS Grid using Tailwind (`grid-cols-3`) for desktop, collapsing to a single column (`grid-cols-1`) on mobile.
  - [x] Subtask 1.3: The component accepts typed `children` props (`studioColumn`, `blueprintsColumn`, `labColumn`) so future components can be injected.
- [x] Task 2: Create the Column Header/Label Components (AC: 3)
  - [x] Subtask 2.1: Each of the three columns renders a visible column header label: **"Studio"**, **"Blueprints"**, **"Lab"**.
  - [x] Subtask 2.2: Column headers styled with small, uppercase, muted typography.
- [x] Task 3: Integrate Grid into the Main Page (AC: 1, 2)
  - [x] Subtask 3.1: Replaced the placeholder design-token test UI in `src/app/page.tsx` with the `DashboardGrid` component.
  - [x] Subtask 3.2: Passed placeholder `<div>` content into each column to prove the children injection pattern works.

## Dev Notes

- **Column Names:** The three columns must be named exactly as specified — `Studio`, `Blueprints`, `Lab`. These names are canonical across the UX spec and architecture.
- **Grid Discipline:** Use Tailwind's `grid` and `grid-cols-3` for the outer container. Apply `gap-6` or similar to match the "Linear-style" premium spacing. Each column is an independent vertical scroll container.
- **Children Pattern:** Use a named-props pattern (e.g., `studioColumn`, `blueprintsColumn`, `labColumn`) rather than spreading a `children` array. This is far more explicit and safer for the long-term architecture. Each prop should be typed as `React.ReactNode`.
- **Column Height:** Use `min-h-screen` on the grid container and ensure each column can grow independently. This prevents uneven columns from collapsing.
- **UX Reference:** Per the UX spec, the outer shell borrows from "Linear's grid discipline." Keep column borders subtle (e.g., `border-r border-border/40` as dividers) rather than using aggressive visible separators.

### Project Structure Notes

- The `DashboardGrid` component is a structural/layout component → it goes in `src/components/layout/`.
- `page.tsx` should be kept deliberately lightweight — it is a Server Component that orchestrates data and passes it into layout/UI components; it should not contain layout logic itself.

### References

- [Source: epics.md#Story 0.4: Construct 3-Column Dashboard Grid Shell]
- [Source: ux-design-specification.md#UX Pattern Analysis - The "Linear" Container & Grid]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

- Created `DashboardGrid` in `src/components/layout/dashboard-grid.tsx` with a strongly-typed named-props interface (`studioColumn`, `blueprintsColumn`, `labColumn`).
- Used `grid-cols-1 md:grid-cols-3` for responsive grid, with `min-h-[calc(100vh-3.5rem)]` to fill the viewport below the sticky header.
- Each column has a subtle `border-r` divider and a `ColumnHeader` sub-component rendering muted all-caps labels.
- Replaced the temporary token-testing UI in `page.tsx` with the real `DashboardGrid` component, passing placeholder text into each slot.
- **Review Fixes Applied:** Removed unused `import React` (not needed in Next.js 13+ with JSX transform). Clarified Lab column comment to document why `border-r` is intentionally omitted on the rightmost column. Replaced raw em-dash (`—`) characters with explicit `{"\u2014"}` Unicode escapes in `page.tsx` for encoding safety. Noted that `gap-6` was deliberately omitted in favor of `border-r` column dividers, which better matches Linear's actual design pattern of flush columns with shared borders.

### File List

- `src/components/layout/dashboard-grid.tsx`
- `src/app/page.tsx`
