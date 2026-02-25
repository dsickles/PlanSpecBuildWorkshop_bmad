# Story 3.3: Wire Tri-Modal Filtering to Grid Data

Status: done

## Story

As a User,
I want the Command Center grid to instantly update when I select a filter,
so that I can view only the projects or artifacts matching my specific criteria without delay.

## Acceptance Criteria

1. **Given** the active URL filters and the complete data array from Epic 2, **When** a filter changes in the URL, **Then** the `DashboardGrid` conditionally hides or shows `ProjectCard` components to match the active filters.
2. **Given** a change in filters, **When** the grid updates, **Then** the filtering logic must be strictly client-side via React `useMemo` hooks against the full initial data payload, avoiding any network requests on filter changes to guarantee <100ms response times.
3. **Given** the "Focus Mode" (a project is selected), **When** a project is active, **Then** all document rows in the Blueprints column for that project should auto-expand to reveal their metadata (What/Why/Tags).
4. **Given** multiple Domain or Tech filters, **When** selected, **Then** the logic should perform an OR-filter (an item is visible if it matches at least one selected domain/tech).

## Tasks / Subtasks

- [x] Task 1: Create `DiscoveryGrid` Client Component
  - [x] Subtask 1.1: Create `src/components/custom/DiscoveryGrid.tsx` as a Client Component.
  - [x] Subtask 1.2: Move data partitioning (splitting `allContent` into `agents`, `docs`, `prototypes`) from `page.tsx` into this component.
  - [x] Subtask 1.3: Move `docsByProject` grouping logic into this component.
  - [x] Subtask 1.4: Wrap logic in `useMemo` to ensure it only recalculates when filters or content change.
- [x] Task 2: Implement Client-Side Filtering Logic
  - [x] Subtask 2.1: Use `useFilterState` hook to get `activeProject`, `activeDomains`, and `activeTech`.
  - [x] Subtask 2.2: Implement Project filtering: if `activeProject` is set, filter all artifact arrays to only include items matching that `projectSlug`.
  - [x] Subtask 2.3: Implement Domain/Tech filtering: if filters are active, filter artifact arrays to only include items where at least one item tag matches the selection.
- [x] Task 3: Refactor Server/Client Boundary in `page.tsx`
  - [x] Subtask 3.1: Pass raw `allContent` and `errors` directly to `DiscoveryGrid`.
  - [x] Subtask 3.2: Remove unused partitioning and grouping code from `page.tsx`.
- [x] Task 4: Implement Focus Mode Auto-Expansion
  - [x] Subtask 4.1: Pass an `isFocused` prop from `DiscoveryGrid` to `BlueprintGroup` when `activeProject` matches the project slug.
  - [x] Subtask 4.2: Update `BlueprintGroup.tsx` to force expansion of all rows when `isFocused` is true.
- [x] Task 5: Testing & Quality Assurance
  - [x] Subtask 5.1: Fix property names in `src/hooks/__tests__/useFilterState.test.tsx` to match actual implementation.
  - [x] Subtask 5.2: Create `src/components/custom/__tests__/DiscoveryGrid.test.tsx` to verify filtering logic.
  - [x] Subtask 5.3: Ensure `npm test` passes for all related components.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.

## Dev Notes

- **Architecture Compliance:**
  - Filtering must be strictly client-side via `useMemo` (per NFR2).
  - Use `useFilterState` hook for all URL parameter reading.
  - Do NOT trigger server-side re-fetching on filter changes.

- **Focus Mode Logic:**
  - "Focus Mode" is defined as `activeProject` being non-null. 
  - Implementation: `isFocused = activeProject === projectSlug`.

- **Filtering Specs:**
  - Project: Exclusive (only one project slug).
  - Domain/Tech: OR-filtering (match ANY selected tag).
  - Empty states (dashed borders) must be preserved for columns that become empty after filtering.

### Project Structure Notes

- Logic belongs in `src/components/custom/DiscoveryGrid.tsx`.
- `DashboardGrid` in `src/components/layout/` remains a pure layout wrapper.

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend-Architecture]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Focus-&-Routing-Mechanics]

## Dev Agent Record

### Agent Model Used

Antigravity

### Debug Log References

### Completion Notes List

### File List

- `src/components/custom/DiscoveryGrid.tsx` (New)
- `src/app/page.tsx` (Modified)
- `src/components/content/blueprint-group.tsx` (Modified - for `isFocused`)
- `src/lib/schema.ts` (Modified - added `isError` support)
- `src/hooks/__tests__/useFilterState.test.tsx` (Fixed)
- `src/components/custom/__tests__/DiscoveryGrid.test.tsx` (New)
- `src/components/content/__tests__/BlueprintGroup.test.tsx` (New)
- `package.json` / `package-lock.json` (Updated dependencies/scripts)
