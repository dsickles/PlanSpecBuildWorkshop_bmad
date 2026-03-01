# Story 10.1: About Modal Transition & Density Optimization

Status: completed

## Story

As a User,
I want the About content to be accessible within a large modal triggered from the workspace header,
so that I can quickly reference workshop philosophy and activity metrics without losing my current browsing context.

## Acceptance Criteria

1. **Modal Infrastructure**: The About experience is a `Dialog` triggered by the "Information" icon in the global header, replacing the legacy standalone page.
2. **URL Persistence & Context**: Modal state is synchronized with the URL (`?about=true`) to ensure shareability, deep-linking, and context restoration on page load.
3. **Stacked Row Architecture**: The layout is structured as a series of full-width horizontal bands (Philosophy, Operations, System Activity), creating a modular and linear narrative flow.
4. **Internal Dual-Column Modularity**:
    - **Philosophy Row**: methodology ("Plan/Spec/Build") on the left and implementation ("The Framework in Practice") on the right.
    - **Operations Row**: workspace mode descriptions on the left and a structured "Artifact Identifiers" icon grid on the right.
5. **Typographic Symmetry & Refinement**:
    - **Universal Standard**: Every list item across Philosophy and Operations uses a unified `StructureItem` component with identical `text-base` bold titles and `text-sm` descriptions.
    - **Secondary Header Scaling**: Section-level sub-headers (e.g., "Workspace Modes") use `text-sm` for improved visual impact and hierarchical clarity.
    - **Natural Casing**: Removed all `uppercase` transformations for a modern, breathable, and readable typographic style.
6. **Horizontal Activity Alignment**: The "System Activity" row aligns the metrics grid and the repository CTA card side-by-side in a 2-column grid to maximize horizontal space.
7. **Accessibility Compliance**: Includes a visually hidden `DialogTitle` within the `DialogHeader` to resolve Radix UI console warnings and support screen reader navigation.

## Tasks / Subtasks

- [x] Task 1: Modal & URL Infrastructure (AC: 1, 2, 7)
  - [x] Implement URL-sync logic in `useFilterState.ts` using `ABOUT_PARAM`.
  - [x] Resolve accessibility warnings with hidden `DialogTitle`.
- [x] Task 2: Content Migration & Layout Pivot (AC: 3, 4)
  - [x] Restructure `AboutModal.tsx` from vertical columns into full-width horizontal rows.
  - [x] Implement internal 2-column grid splits for all primary informational rows.
- [x] Task 3: Typography & Symmetry Alignment (AC: 5)
  - [x] Modularize all content points into a shared `StructureItem` pattern.
  - [x] Remove `uppercase` from all headers and labels.
  - [x] Standardize secondary header font sizes to `text-sm`.
- [x] Task 4: Global UX & Redirects (AC: 6)
  - [x] Replace header Links with programmatic state triggers.
  - [x] Configure client-side redirect in legacy `/about` route.
- [x] Task 5: Metrics & Footer Layout (AC: 6)
  - [x] Correct `calculateMetrics` logic for project/agent filtering.
  - [x] Align footer metrics and CTA card horizontally in a 2-column layout.
- [x] Task 6: AI-Review Follow-ups (AC: 5, 6)
  - [x] Fix Metrics Engine to count shared agents correctly (`metrics.ts`).
  - [x] Increase metric label font size to `text-xs` for legibility (`AboutModal.tsx`).
  - [x] Remove redundant backdrop blur from modal header.
  - [x] Synchronize alignment in the System Activity section.

## Completion Notes List

- ✅ **Architectural Pivot**: Successfully transitioned the About experience from a standalone page to a high-density, row-based modal that preserves user browsing context.
- ✅ **Design Symmetry**: Achieved perfect visual balance across the Philosophy and Operations sections by unifying typography and modularizing item components.
- ✅ **Typographic Refinement**: Modernized the design by removing all-caps styling and scaling headers for a cleaner, high-density professional aesthetic.
- ✅ **Spatial Efficiency**: Optimized horizontal space in the footer by aligning metrics and call-to-action cards side-by-side.
- ✅ **Verified Metrics**: Resolved a critical bug where shared agents were not being counted in the system activity rollup.
- ✅ **Accessibility & Standards**: Ensured full DOM compliance with Radix UI and screen reader standards through proper structural labeling.

### File List

- `src/lib/constants.ts`
- `src/hooks/useFilterState.ts`
- `src/components/custom/AboutModal.tsx`
- `src/components/layout/global-header.tsx`
- `src/app/page.tsx`
- `src/app/about/page.tsx` (Redirect)
- `src/lib/metrics.ts`
