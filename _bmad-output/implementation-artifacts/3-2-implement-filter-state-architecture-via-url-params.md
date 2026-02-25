# Story 3.2: Implement Filter State Architecture via URL Params

Status: done

## Story

As a Front-End Developer,
I want the application to maintain the user's selected filters in the URL,
so that filter context is preserved even upon refreshing or bookmarking the page.

## Acceptance Criteria

1. **Given** the Next.js App Router, **When** a user interacts with a filter pill, **Then** custom React hooks synchronize component state with Next.js URL Search Parameters. [x]
2. **Given** the filter interaction, **When** state updates, **Then** it must strictly use `window.history.replaceState` or Next.js `router.push` with `{ scroll: false }` to ensure purely shallow routing without triggering layout data re-fetching from the server. [x]
3. **Given** the root layout, **When** rendering the initial page, **Then** the root `page.tsx` must remain a Server Component that fetches the initial static data array, while `searchParams` consumption is isolated to specific nested Client Components (e.g., `FilterBar`) to preserve Static Site Generation (SSG). [x]

## Tasks / Subtasks

- [x] Task 1: Create URL State Custom Hook Architecture
  - [x] Subtask 1.1: Create `src/hooks/useFilterState.ts` (or similar utility) to abstract reading from and writing to `useSearchParams`.
  - [x] Subtask 1.2: Migrate the hardcoded parameters (`PROJECT_PARAM`, `DOMAIN_PARAM`, `TECH_PARAM`) from `FilterBar.tsx` into a central shared constants file (e.g. `src/lib/constants.ts`) so both the Server Component (`page.tsx`) and Client hook can share identical keys.
  - [x] Subtask 1.3: Update `FilterBar.tsx` to consume the newly created `useFilterState` hook rather than directly mutating the URL inline, separating the view from the URL routing logic.
- [x] Task 2: Server-Side Parameter Parsing
  - [x] Subtask 2.1: Update `src/app/page.tsx` to strongly type and accept `searchParams` as an async prop (Next.js 15 standard).
  - [x] Subtask 2.2: Pass the initial server-read filters down to child components if necessary (preparation for Story 3.3 data wiring).
- [x] Task N: Pre-Review Validation & Tests
  - [x] Subtask N.1: Verify `FilterBar.test.tsx` still passes after the refactor to the custom hook. Update the tests to mock the new hook if necessary.
  - [x] Subtask N.2: Ensure the `FilterBar` UI still retains the accessibility (`aria-pressed`) updates from Story 3.1.
  - [x] Subtask N.3: Run `npm run lint` and confirm output is clean.
  - [x] Subtask N.4: Run `git status --porcelain` and verify every changed/new file is documented.

## Dev Notes

### Technical Requirements
- **Framework:** Next.js 15 (App Router). `searchParams` in `page.tsx` is an async Promise in Next.js 15, so it must be `await`ed.
- **Client Components:** Any component using `useSearchParams` must be boundaries with `"use client"` and wrapped in `<Suspense>` locally if imported directly into a Server Component (this was already implemented in Story 3.1 in `page.tsx`).
- **Performance Constraints:** NFR2 requires <100ms routing. You must use `{ scroll: false }` for router pushes to ensure the grid doesn't jump.

### Architecture Compliance
- **Server/Client Boundary:** The root `page.tsx` is an exclusive Server Component. Do NOT add `"use client"` to `page.tsx`. State filtering for UI rendering should ideally be purely derived from the URL parameters.
- **No Database:** All URL parameter values correspond exactly to the `projectSlug`, `domain` array, and `tech_stack` array parsed from the markdown files by `gray-matter`.

### Previous Story Intelligence (Learnings to Carry Forward)
- **Accessibility:** Ensure any interaction uses proper ARIA attributes. `FilterBar.tsx` was fixed in Story 3.1 to use `aria-pressed={isActive}`. Do not regress this when refactoring to the custom hook!
- **Testing:** We implemented Jest + React Testing Library. Ensure unit tests are written for the new `useFilterState` hook and existing UI tests are updated.
- **String Constants:** In Story 3.1, `PROJECT_PARAM`, `DOMAIN_PARAM`, and `TECH_PARAM` were refactored inside `FilterBar.tsx`. They must be hoisted to a globally shared file (e.g. `src/lib/constants.ts`) to avoid duplicate declarations between the Client hook and Server `page.tsx`.

### Project Structure Notes
- New hooks should be placed in `src/hooks/`.
- Shared constants should be placed in `src/lib/constants.ts`.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-3-Tri-Modal-Discovery--Instant-Filtering]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture]

## Dev Agent Record

### Agent Model Used
- Antigravity (LLM)

### Debug Log References
- Code Review 3-2: Identified hardcoded navigation and missing server-side logic extraction.

### Completion Notes List
- Implemented robust `useFilterState` hook with dynamic `pathname`.
- Restored `searchParams` extraction in `page.tsx` (wrapped in eslint-disable until wiring in 3.3).
- Cleaned up redundant comments in `FilterBar.tsx`.

### File List
- `src/app/page.tsx`
- `src/components/custom/FilterBar.tsx`
- `src/hooks/useFilterState.ts`
- `src/lib/constants.ts`
- `src/components/custom/__tests__/FilterBar.test.tsx`
