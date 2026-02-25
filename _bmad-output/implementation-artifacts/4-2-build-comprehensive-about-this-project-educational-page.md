# Story 4.2: Build Comprehensive "About this Project" Educational Page

Status: done

## Story

As a User,
I want a dedicated, standalone educational page that explains the Tri-Pillar philosophy, quantitative metrics, and provides resources,
so that I can comprehend the portfolio's purpose and instantly assess the volume of work presented.

## Acceptance Criteria

1. **Given** the Global Header from Epic 0, **When** clicking the designated "Info" icon, **Then** the user is routed to a static `/about/page.tsx` that replaces the complex `DashboardGrid` with a centered typographic layout. (AC: 1)
2. **Given** the `/about` route, **Then** it must render three specific sections:
    - **Philosophy:** Static markdown prose explaining the Agent/Blueprint/Prototype relationship. (AC: 2.1)
    - **At a Glance:** A dynamic, quantitative rollup calculating the total number of projects, documents, and agent sets ingested from the file system. (AC: 2.2)
    - **Open Source:** An explicit CTA linking to the forkable GitHub repository template. (AC: 2.3)
3. **Given** the "Linear Purist" aesthetic, **Then** the page must use Zinc grayscale colors and Inter typography with generous whitespace. (AC: 3)
4. **Given** any error in data fetching for metrics, **Then** the page should gracefully handle the error and display fallback information. (AC: 4)

## Tasks / Subtasks

- [x] Task 1: Create the About Page Route & Layout (AC: 1, 3)
    - [x] Create `src/app/about/page.tsx` using the `DashboardGrid`'s parent container for width consistency (`max-w-7xl`).
    - [x] Implement a centered, typographic-heavy layout using `zinc-50` for headings and `zinc-400` for body copy.
- [x] Task 2: Implement Philosophy Section (AC: 2.1)
    - [x] Add static markdown-styled content explaining the "Plan. Spec. Build." philosophy.
- [x] Task 3: Implement Dynamic "At a Glance" Metrics (AC: 2.2)
    - [x] Import `getAllArticles` and `getProjects` (or equivalent) from `src/lib/content-parser.ts`.
    - [x] Calculate the total count of projects, agent cards, blueprint documents, and prototypes.
    - [x] Render metrics in a clean, horizontal list or grid with large, clear numbers.
- [x] Task 4: Implement Open Source CTA (AC: 2.3)
    - [x] Add the "Fork a Workshop" section with a clear CTA button (using `bg-blue-600` for prominence).
    - [x] Target the GitHub link: `https://github.com/Sickles/PlanSpecBuildWorkshop_bmad` (to be confirmed/replaced with correct repo URL).
- [x] Task 5: Wire up Global Header Navigation (AC: 1)
    - [x] Update `GlobalHeader.tsx` to ensure the "Info" icon routes to `/about`.
- [x] Task 6: Pre-Review Validation
    - [x] Subtask 6.1: Run `npm run lint` and confirm output is clean.
    - [x] Subtask 6.2: Verify all metrics are calculating correctly by adding a test project/document.
- [x] Task 7: Senior Developer Review Fixes (Adversarial)
    - [x] Fix brittle path resolution in `content-parser.ts`.
    - [x] Improve test assertion precision in `page.test.tsx`.
    - [x] Update documentation with missing file references.

## Dev Notes

- **Architecture Compliance:**
    - Reuses `src/lib/content-parser.ts` for metrics derivation.
    - Follows "Decision Impact Analysis" for static route creation.
    - Uses `src/components/custom/MarkdownRenderer.tsx` for any markdown content inside the page.
    - [AI-Fix] Added graceful error handling (AC: 4) for metrics calculation.
    - [AI-Review] Refactored `content-parser.ts` for robust path handling (Step 3 Medium finding).
- **Source Tree Components:**
    - `src/app/about/page.tsx` (New)
    - `src/components/layout/global-header.tsx` (Modified)
    - `src/lib/metrics.ts` (New)
    - `src/lib/content-parser.ts` (Modified)

### Project Structure Notes

- New route created in standard Next.js `app` router structure.

### References

- [Source: epics.md#Story-4.2]
- [Source: ux-design-specification.md#Component-Strategy]
- [Source: architecture.md#Implementation-Patterns]
- [Source: decision-matrix.md#Deferred-Implementation]

## Dev Agent Record

### Agent Model Used

Antigravity

### Debug Log References

### Completion Notes List

### File List

- `src/app/about/page.tsx`
- `src/components/layout/global-header.tsx`
- `src/lib/metrics.ts`
- `src/lib/content-parser.ts`
- `src/lib/__tests__/metrics.test.ts`
- `src/app/about/__tests__/page.test.tsx`
- `_bmad-output/planning-artifacts/decision-matrix.md`
- `_bmad-output/planning-artifacts/architecture.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
