# Story 3.1: Build Interactive Filter Bar Component

Status: done

## Story

As a User,
I want an interactive row of filter pills across the top of the interface,
so that I can easily select Project, Domain, and Tech Stack constraints to narrow down the view.

## Acceptance Criteria

1. **Given** the filtering requirements, **When** rendering the filter bar, **Then** visual pill components matching the mockup's variants are displayed for each available filter category.
2. **Given** the filter UI components, **When** deriving their 'active' visual state, **Then** they must directly read the current `searchParams` from the URL, rather than relying on internal component state, ensuring truth remains solely in the URL.
3. **Given** user interaction with a filter pill, **When** toggled, **Then** state updates must strictly use `window.history.replaceState` or Next.js `router.push` with `{ scroll: false }` to ensure purely shallow routing without triggering layout data re-fetching from the server.
4. **Given** the active project filter, **When** a project is selected (Focus Mode), **Then** a `✕ Clear Filter` button appears inline in the Projects filter row, which explicitly dismisses project-scoped context to resume "Browse Mode" (`router.push('/')`).

## Tasks / Subtasks

- [x] Task 1: Create `FilterBar` component structure
  - [x] Subtask 1.1: Create `src/components/custom/FilterBar.tsx` as a Client Component (`"use client"`).
  - [x] Subtask 1.2: Implement the three-row layout (Projects, Domain, Tech) with `gap-3` and fixed width (`w-16`) labels (10px uppercase, `text-zinc-600`).
  - [x] Subtask 1.3: Apply `mb-10` bottom margin to the component.
- [x] Task 2: Implement Filter Pills and Chips styling
  - [x] Subtask 2.1: Implement Project pills (`.filter-pill`, rounded-full). Active project gets `bg-blue-600` fill.
  - [x] Subtask 2.2: Implement Domain and Tech chips (`.chip-toggle`, rounded-md, smaller than project pills). Active state gets `bg-zinc-800` fill.
- [x] Task 3: Implement URL state syncing logic via `useSearchParams` and `useRouter`
  - [x] Subtask 3.1: Read current active state from `searchParams` (`?project=`, `?domain=`, `?tech=`).
  - [x] Subtask 3.2: Implement project pill toggle logic (exclusive single slug updating `?project=`).
  - [x] Subtask 3.3: Implement domain/tech chip toggle logic (additive CSV updates updating `?domain=` and `?tech=`).
  - [x] Subtask 3.4: Use `router.push('...', { scroll: false })` or `window.history.replaceState` for instant shallow routing on toggles.
- [x] Task 4: Implement `✕ Clear Filter` behavior
  - [x] Subtask 4.1: Conditionally render the "✕ Clear Filter" muted-red ghost button (`border-red-500/30`, `text-red-400`, `bg-red-500/5`) trailing the Project row only when a project filter is active.
  - [x] Subtask 4.2: Clicking the button resets URL to default without parameters (`router.push('/')`).
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Run `npm run lint` (or equivalent) and confirm output is clean.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented.

## Dev Notes

- **Architecture Compliance:**
  - Placed in `src/components/custom/FilterBar.tsx`. Do NOT modify base `src/components/ui/` primitives directly.
  - The component must ingest available projects, domains, and tech tags as props from the Server Component parent (`page.tsx`) to render the available toggle choices.
  - No internal component React state (`useState`) should be used for the filters; the URL parameter is the single source of truth.

- **URL State Mapping Details ([epic-3-url-state-mapping-spec.md]):**
  - `?project=`: Single string. Exclusive.
  - `?domain=` / `?tech=`: Comma-separated strings.
  - Shallow routing is required to achieve <100ms response.

- **UX Identity Requirements:**
  - **Linear Purist aesthetic:** `bg-zinc-950` backgrounds, subtle borders, no drop shadows on hover. Use hover background lightening (`bg-zinc-900` to `bg-zinc-800/80`).
  - **Clear Filter Button:** The muted red treatment is specific: `border-red-500/30 text-red-400 bg-red-500/5`, keeping with the Tinted Neutrality system.

- **Previous Story Intelligence (from Epic 2 Retro):**
  - **Prop Parity:** Ensure the interface for props passed into `FilterBar` (e.g., the lists of unique domains and tech stacks) accurately matches the downstream logic expectations, avoiding schema mismatches.

### Project Structure Notes

- Keep all logic inside the `custom` component namespace to preserve shadcn atom integrity.

### References

- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Three-Row-Filter-Bar]
- [Source: _bmad-output/planning-artifacts/epic-3-url-state-mapping-spec.md#URL-Parameter-Definitions]

## Dev Agent Record

### Agent Model Used

Antigravity

### Debug Log References

### Completion Notes List

- Implemented `FilterBar.tsx` matching UX requirements.
- Configured purely URL-state driven mapping using `useSearchParams`.
- Wrapped `FilterBar` into `<Suspense fallback={null}>` inside `page.tsx` to fix static prerendering issues caused by Next JS accessing URL parameters.
- Linter passed cleanly.

**Senior Developer Review (AI) - Resolutions:**
- ✅ Fixed missing ARIA states (`aria-pressed`) on filter pills for accessibility (High Issue).
- ✅ Replaced hardcoded URL params with constants (`PROJECT_PARAM`, `DOMAIN_PARAM`, `TECH_PARAM`) (Medium Issue).
- ✅ Added Jest configuration and React Testing Library setup.
- ✅ Authored unit tests to verify `FilterBar` state syncing, click behavior, and ARIA updates (High Issue).
- ✅ Reverted undocumented/uncommitted changes from `prd.md` and `ux-design-specification.md` (Medium Issue).

### File List

- `src/components/custom/FilterBar.tsx` (Created/Modified)
- `src/app/page.tsx` (Modified)
- `src/components/custom/__tests__/FilterBar.test.tsx` (Created)
- `package.json` (Modified - test scripts/dependencies)
- `jest.config.ts` (Created)
- `jest.setup.ts` (Created)
