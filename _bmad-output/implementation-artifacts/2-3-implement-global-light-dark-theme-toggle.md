# Story 2.3: Implement Global Light/Dark Theme Toggle

## Story Description
As a User,
I want to toggle the interface between the default Dark mode and a Light mode,
So that I can view the portfolio according to my accessibility preferences.

## Acceptance Criteria
*   **Given** the Global Header from Epic 0,
*   **When** clicking the theme toggle icon,
*   **Then** the `next-themes` provider successfully flips the Tailwind root variables between the light and "Tinted Neutrality" dark themes across the entire application viewport.
*   **And** the `suppressHydrationWarning` prop is explicitly added to the root `<html>` tag in the root layout to prevent standard React hydration mismatch errors on first load.

## Implementation Tasks
1. [x] Install `next-themes` package.
2. [x] Add `ThemeProvider` component wrapping exactly what the docs say.
3. [x] Add `suppressHydrationWarning` to `<html>` in `src/app/layout.tsx`.
4. [x] Update `src/components/layout/global-header.tsx` to wire the moon/sun icon click to the theme toggle.

## Dev Agent Record
**File List:**
- `src/app/layout.tsx`
- `src/components/theme-provider.tsx`
- `src/components/layout/global-header.tsx`
