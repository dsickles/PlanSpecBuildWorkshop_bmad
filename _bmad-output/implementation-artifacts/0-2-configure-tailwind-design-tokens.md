# Story 0.2: Configure Tailwind Design Tokens

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a UI Developer,
I want to extend the Tailwind configuration with the required color tokens ("Tinted Neutrality") and typography (Inter) from the UX Mockup,
so that I can build interface components using semantic utility classes instead of hardcoded hex values.

## Acceptance Criteria

1.  **Given** the Next.js/Tailwind repository,
2.  **When** developing components,
3.  **Then** the Inter font face is available as the default sans typography plugin.
4.  **And** the Tailwind theme is extended with specific semantic aliases for status pills (e.g., `theme.colors.status.live = '#...'`, `theme.colors.status.wip = '#...'`) mapping to the exact hex codes from the HTML mockup.

## Tasks / Subtasks

- [x] Task 1: Initialize Inter font via Next.js `next/font/google` (AC: 1, 2, 3)
  - [x] Subtask 1.1: Import and configure `Inter` in `src/app/layout.tsx`.
  - [x] Subtask 1.2: Apply the `inter.className` or CSS variable to the `<body>` tag.
- [x] Task 2: Configure Tailwind design tokens for "Tinted Neutrality" (AC: 4)
  - [x] Subtask 2.1: Add global CSS variables in `src/app/globals.css` mapping to the custom status colors (Live, WIP, Concept, Archived) based on the UX Design Specification.
  - [x] Subtask 2.2: Ensure the base theme remains "Zinc/Slate" grayscale for structural UI.

## Dev Notes

- **Typography:** The primary font must be Inter. Use Next.js optimized font loading (`next/font/google`). Do NOT use overly technical typography (terminal/monospace) for primary body copy or headings.
- **Color System:** Implement the "Tinted Neutrality" color system.
  - Status pills use tints (e.g. 10% opacity background with 80% opacity text).
  - `[Live]`: Muted Emerald / Mint
  - `[WIP]`: Muted Amber / Yellow (label is "WIP")
  - `[Concept]`: Muted Zinc / Gray (no color)
  - `[Archived]`: Muted Red / Rose
  - A single strong primary color (`bg-blue-600`) is reserved exclusively for primary actions like the "Launch Prototype" CTA.
  - Structural UI (90%) borrows strictly from a Slate or Zinc grayscale palette.
  - Use `zinc-950` for global backgrounds and `zinc-50` for text in dark mode.
- **Tailwind Version:** Remember this is Tailwind v4, which no longer heavily relies on `tailwind.config.ts`. Design tokens and CSS variables should be configured primarily in `src/app/globals.css` utilizing `@theme` directives.

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming).
- Keep changes contained to `src/app/globals.css` and `src/app/layout.tsx`.

### References

- [Source: epics.md#Story 0.2: Configure Tailwind Design Tokens]
- [Source: ux-design-specification.md#Visual Design Foundation]
- [Source: ux-design-specification.md#The Tagging System]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### Completion Notes List

- Switched from default Geist to `Inter` font in `src/app/layout.tsx`.
- Applied standard responsive global layout variables to `<body>` element in `globals.css` (`bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50`).
- Configured "Tinted Neutrality" UX Design Specification variables within the Tailwind `@theme inline` block in `src/app/globals.css`. Colors included: Live, WIP, Concept, Archived.
- Built a temporary prototyping UI in `page.tsx` utilizing the raw Tailwind v4 semantic utility classes (`bg-status-live-bg`, etc).
- **Review Fixes Applied:** Updated `globals.css` body apply block to respect both light and dark mode preferences. Updated `page.tsx` test UI to strictly utilize the Tailwind semantic utilities injected by `@theme inline` instead of passing CSS variables into square bracket classes. Updated the File List to document the `page.tsx` modifications.

### File List

- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/app/page.tsx`
