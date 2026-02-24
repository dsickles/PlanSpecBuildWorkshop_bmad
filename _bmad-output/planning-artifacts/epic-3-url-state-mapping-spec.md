# Epic 3 Technical Preparation: URL State Mapping Specification

**Author:** Winston (Architect) & Sally (QA)
**Status:** Approved for Implementation
**Prerequisite For:** Epic 3 (Stories 3.1, 3.2, 3.3, 3.4)

## 1. Goal

Epic 3 introduces Tri-Modal Filtering (Project, Domain, Tech Stack). To ensure blazing fast (<100ms) client-side filtering without brittle React state propagation or server-side hydration mismatches, **the URL is the single source of truth**. This specification dictates exactly how URL `searchParams` map to the filtered UI state.

## 2. Core Principles

1. **Server vs. Client Matrix:** 
   - `page.tsx` (Server Component) reads the files, parses the MD, and generates the `initialData` array. 
   - It passes `initialData` down to `DashboardGrid` (Client Component). 
   - `FilterBar.tsx` and `DashboardGrid.tsx` use the `useSearchParams()` hook to read the URL and derive the filtered view via `useMemo` against the `initialData`.
2. **Shallow Routing Only:** All filter clicks must push to the Next.js router with `{ scroll: false }` or use `window.history.replaceState` to prevent triggering a full Next.js server data fetch lifecycle.
3. **Additive vs. Exclusive:** Filter rules are strict.
   - `project` = Exclusive (only one project can be viewed at a time in Focus Mode).
   - `domain` / `tech` = Additive OR filters (e.g., Domain A OR Domain B).
   - Cross-category = AND filters (e.g., Project A AND (Domain A OR Domain B)).

## 3. URL Parameter Definitions

### `?project=` (String)
*   **Purpose:** Triggers "Focus Mode". Filters all columns to show only artifacts belonging to this `projectSlug`.
*   **Format:** Single lower-case slug string (e.g., `?project=plan-spec-build`).
*   **UI Impact:** Unhides the "Clear Filter" button. Automatically expands all document rows in the Blueprints column for this project.

### `?domain=` (Comma-separated String)
*   **Purpose:** Filters all columns to show artifacts containing ANY of the specified domains.
*   **Format:** Comma-separated string. Exact match against the Zod schema strings (e.g., `?domain=Requirements,Design`).
*   **UI Impact:** Hides any card that lacks at least one of the active domain tags.

### `?tech=` (Comma-separated String)
*   **Purpose:** Filters all columns to show artifacts containing ANY of the specified tech stack tags.
*   **Format:** Comma-separated string. Exact match (e.g., `?tech=TypeScript,React`).
*   **UI Impact:** Hides any card that lacks at least one of the active tech tags.

## 4. Derived State Rules (`useMemo` Logic)

The `DashboardGrid.tsx` client component must execute the following logic synchronously:

```typescript
// Conceptual filter loop execution order:
const filteredData = useMemo(() => {
  return initialData.filter((item) => {
    // 1. Project Filter (AND)
    if (activeProject && item.projectSlug !== activeProject) return false;

    // 2. Domain Filter (AND condition with an internal OR)
    if (activeDomains.length > 0) {
      const hasMatchingDomain = item.tags.domain.some(d => activeDomains.includes(d));
      if (!hasMatchingDomain) return false;
    }

    // 3. Tech Stack Filter (AND condition with an internal OR)
    if (activeTech.length > 0) {
      const hasMatchingTech = item.tags.tech.some(t => activeTech.includes(t));
      if (!hasMatchingTech) return false;
    }

    return true; // Item passed all active filters
  });
}, [initialData, searchParams]);
```

## 5. Defensive Routing & Invalid State Playbook (QA Requirements)

For test automation and resilience, the app must self-heal when presented with invalid URL state:

| Scenario | URL State | System Response |
| :--- | :--- | :--- |
| **Orphaned Project** | `?project=does_not_exist` | The filter yields 0 results. The Dashboard renders the `<FallbackCard>` empty states for all 3 columns. *Do not crash or redirect.* |
| **Invalid Case** | `?project=Plan-Spec` | URL is case-sensitive. Treats as an orphaned project -> 0 results -> Fallback Empty State. |
| **Orphaned Domain/Tech** | `?domain=FakeDomain` | Treats as a 0-result filter -> Fallback Empty State. |
| **Mixed Validity** | `?tech=React,FakeJS` | The `FakeJS` tag is ignored by the system data payload. Any items tagged with `React` will render successfully (OR logic). |
| **Empty Parameter** | `?project=` | Treated as null/undefined. Reverts to default "Browse Mode" (shows all projects). |

## 6. Interaction Boundaries

*   **Pill Click:** Toggles the state. If the param exists in the comma-separated string, remove it. If it doesn't, append it.
*   **Clear Filters:** `router.push('/')` (removes all query params instantly).
*   **Layers Icon Click:** Standard card 'Layers' icon forcefully sets `?project=slug`. It *preserves* existing domain/tech parameters.

## 7. Next Steps for Implementation
Dev agents should use this specification as the absolute source of truth when fulfilling Stories 3.1 (FilterBar), 3.2 (URL State Hook), 3.3 (Data Filtering), and 3.4 (Clear Action).
