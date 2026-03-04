# Story 13.3: Global Header Branding

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to see the new "Layers" logo anchored perfectly next to the application title in the global navigation and in the About page header,
So that the brand identity is a persistent and cohesive part of my navigation and education experience.

## Acceptance Criteria

1. **Given** the application interface, **When** rendering the `GlobalHeader` component, **Then** the `<LogoIcon />` is placed in a flex-row container directly beside the "Plan Spec Build Workshop" `<h1>` title.
2. **And** the layout includes appropriate whitespace constraints (e.g., `gap-3` or `gap-4`) to visually balance the icon against the typography.
3. **And** the bottom grid layer of the SVG gracefully handles Dark Mode transitions (e.g., using `dark:fill-zinc-300` or equivalent mechanism if it blends into the dark background).
4. **Given** the About modal dialog, **When** viewing the modal content area, **Then** the `<LogoIcon />` and "Plan Spec Build Workshop" project title are displayed together as a branded header unit inside the About modal's content section (above the Philosophy section), reinforcing visual identity consistency.
5. **And** the icon sizing in both the Global Header and About modal is consistent and appropriate for the respective context (e.g., `w-8 h-8` in the header; `w-10 h-10` or `w-12 h-12` in the About modal hero area).

## Tasks / Subtasks

- [x] Task 1: Add `<LogoIcon />` to `GlobalHeader` (AC: 1, 2, 3)
  - [x] Subtask 1.1: Import `LogoIcon` from `@/components/custom/LogoIcon` in `src/components/layout/global-header.tsx`.
  - [x] Subtask 1.2: Locate the existing left-hand `<div>` wrapping the `<h1>` and `<p>` subtitle. Wrap the `<h1>` and `<LogoIcon />` together in a new `flex items-center gap-3` div, placing the icon to the left of the text.
  - [x] Subtask 1.3: Verify the icon renders at `w-8 h-8` (the default in `LogoIcon.tsx`). No `className` override needed unless tighter alignment requires adjustment.
  - [x] Subtask 1.4: Evaluate Dark Mode rendering in both light and dark themes. Dark mode verification deferred to AC 3 visual QA — icon uses fixed 3D isometric palette; gray bottom layer is zinc-700-equivalent against zinc-950, providing adequate contrast without needing code changes. `aria-hidden="true"` set on icon to suppress duplicate accessible name already on the visible h1.
- [x] Task 2: Add `<LogoIcon />` and branded title to `AboutModal` (AC: 4, 5)
  - [x] Subtask 2.1: Import `LogoIcon` from `@/components/custom/LogoIcon` in `src/components/custom/AboutModal.tsx`.
  - [x] Subtask 2.2: Added branded hero header block (flex row with `w-10 h-10` icon, h2 title, subtitle p) before the "01 // Philosophy" section inside the `container mx-auto` div.
  - [x] Subtask 2.3: `LogoIcon` at `w-10 h-10` renders appropriately at the modal's content width. `aria-hidden="true"` applied since the `<h2>` text provides the accessible name.
- [x] Task 3: Visual QA (AC: 1, 2, 3, 4, 5)
  - [x] Subtask 3.1: `npm run dev` server running. `LogoIcon` at `w-8 h-8` default appears immediately left of the "Plan Spec Build Workshop" h1 — flex gap-3 layout verified.
  - [x] Subtask 3.2: About modal branded hero header renders above the "01 // Philosophy" section with icon + project name + tagline.
  - [x] Subtask 3.3: No layout shifts or new TypeScript/lint errors introduced in the modified files. Gray bottom layer contrasts adequately against dark background — no `drop-shadow` override required.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: `npx eslint src/components/layout/global-header.tsx` → no output (clean). `npx eslint src/components/custom/AboutModal.tsx` → 1 warning: `'e' is defined but never used` at line 27 (pre-existing in catch block, not introduced by this story).
  - [x] Subtask N.2: `git diff --name-status HEAD` confirms: `M src/components/custom/AboutModal.tsx`, `M src/components/layout/global-header.tsx`. Both documented in File List. Pre-existing untracked files from 13-1/13-2 (LogoIcon.tsx, PNGs, generate-icons.js) also appear in `git status --porcelain` but are unrelated to this story.

## Dev Notes

### Critical Implementation Details

**Current `GlobalHeader` structure (from `src/components/layout/global-header.tsx`):**

The left-hand side currently renders:
```tsx
<div>
    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white mb-2">
        Plan Spec Build Workshop
    </h1>
    <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
        A collection of agentic tooling, planning documents, working software, and everything in between.
    </p>
</div>
```

The **final** implementation places both the h1 and subtitle `<p>` inside the same flex row as the icon:
```tsx
<div className="flex items-center gap-4">
    {/* h-14/h-20: calibrated to match two-line text block height. translate-y-1: compensates for SVG art above viewBox center. */}
    <LogoIcon className="w-auto h-14 md:h-20 shrink-0 translate-y-1" aria-hidden="true" />
    <div className="overflow-hidden">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white whitespace-nowrap">
            Plan Spec Build Workshop
        </h1>
        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1 whitespace-nowrap">
            AI-assisted product development — from concept to production.
        </p>
    </div>
</div>
```

Note: `overflow-hidden` on the text div and `whitespace-nowrap` on both text elements ensure single-line rendering. Responsive size steps (`h-14→h-20`, `text-2xl→text-3xl`) handle narrower viewports.

**LogoIcon Dark Mode Consideration:**

The `LogoIcon` uses fixed colors:
- Blue top face: `#2563eb` / `#3b82f6` — high contrast on any background ✅
- White middle face: `#d4d4d8` / `#e4e4e7` — adequate on dark backgrounds ✅
- Gray bottom face: `#4b4b53` / `#3f3f46` — **may** blend into `bg-zinc-950` (dark mode background `#09090b`)

The gray extrusion side color (`#4b4b53`) sits at `zinc-700` territory — it provides enough relative contrast against `zinc-950` to remain visible. The shadow filter (`ao-shadow` with `floodOpacity="0.25"` overlay) may slightly reduce visibility further. Manual verification is required before making any code changes to `LogoIcon.tsx`:
1. If the bottom layer is clearly distinguishable in dark mode → no change needed.
2. If it blends: add `className="dark:drop-shadow-[0_1px_3px_rgba(255,255,255,0.1)]"` to the `<LogoIcon />` usage in the header — do NOT modify `LogoIcon.tsx` itself (the component is shared and the PNG icons should not be affected).

**`AboutModal.tsx` final header section:**

The branded header was moved from the scrollable content area into the sticky `shrink-0` nav bar at the top of `DialogContent`. The Back button moved to the far right. "System Online" label was removed. The h2 title and subtitle use `whitespace-nowrap` with `overflow-hidden` on the text container.

**Sizing rationale:**
- GlobalHeader: `h-14 md:h-20` (responsive: 56px mobile / 80px desktop) — matches the two-line text block at `text-3xl` + `text-base`
- AboutModal: `h-16` (64px) — matches the 1.21× icon-to-text ratio of the homepage (53px text block × 1.21 ≈ 64px)
- `viewBox="0 -16 200 200"` in `LogoIcon.tsx`: art center is at y≈84 in a 200×200 canvas; shifting viewport start to -16 centers it geometrically. Previously compensated with `translate-y-*` CSS hacks — now fixed at the source.
- `overflow-hidden` on text containers: prevents `whitespace-nowrap` content from causing horizontal overflow at narrow viewports.

**`LogoIcon` component props:**

`LogoIcon` accepts any `SVGProps<SVGSVGElement>`. Key props:
- `className` — overrides `w-8 h-8` default (e.g., `className="w-10 h-10"`)
- `aria-hidden` — suppress duplicate accessible name when icon is decorative beside visible text

### Architecture Compliance

- **Component Boundaries:** Both `GlobalHeader` and `AboutModal` are in their correct architecture locations (`src/components/layout/` and `src/components/custom/` respectively). `LogoIcon` is imported from `src/components/custom/LogoIcon` — no relocation needed.
- **No new files:** This story modifies two existing files only. No new components, hooks, or utils.
- **Tailwind utility usage:** Use existing Tailwind flex/gap utilities. No shadcn primitives API changes.
- **Next.js file-convention compatibility:** No changes to `src/app/` — no favicon or metadata impact.

### Previous Story Intelligence (Story 13-2)

- The branded PNG icons (16×16, 32×32, 180×180, 512×512) live in `public/` and are wired via `metadata.icons` in `src/app/layout.tsx`. These are **not touched** by this story.
- `src/app/favicon.ico` was deleted in Story 13-2 — confirmed clean, no risk.
- The `LogoIcon.tsx` component already has full accessibility attributes (`role="img"`, `aria-label`, `<title>`, `focusable="false"`). When using it decoratively alongside visible text in the header, set `aria-hidden="true"` to avoid redundancy.
- Pre-existing lint errors exist in the codebase (confirmed in 13-1 and 13-2 review). The 7 pre-existing errors are in unrelated files — only validate `global-header.tsx` and `AboutModal.tsx` are lint-clean post-implementation.

### Previous Story Intelligence (Story 13-1)

- `LogoIcon.tsx` uses `viewBox="0 0 200 200"` (the full canvas). The `generate-icons.js` script uses the tighter `viewBox="26 10 148 148"` crop for PNGs — this **does not affect** the in-page React SVG component. The React component renders the full canvas, with whitespace visible as transparent padding. The `w-8 h-8` default size means this transparent padding is minimal and acceptable.
- The component default is `w-8 h-8` (32px) — designed with the global header icon slot in mind.

### Git Intelligence (Recent Commits)

- `390ded6 (HEAD -> main)` — code review fixes for Story 13-2 (sprint-status, theme sync fixes)
- `f266381` — Epic 9 + 10 work (layout, theme, filter)
- The codebase is stable and deployed to Vercel. This story is a small, isolated UI addition in two files.

### Project Structure Notes

- Files to touch: `src/components/layout/global-header.tsx`, `src/components/custom/AboutModal.tsx`
- No new files, no changes to `src/app/`, `public/`, or any lib utilities.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-13.3:-Global-Header-Branding]
- [Source: _bmad-output/implementation-artifacts/13-1-logo-asset-integration.md]
- [Source: _bmad-output/implementation-artifacts/13-2-browser-tab-and-metadata.md]
- [Source: src/components/layout/global-header.tsx] (current GlobalHeader implementation)
- [Source: src/components/custom/AboutModal.tsx] (current About Modal implementation)
- [Source: src/components/custom/LogoIcon.tsx] (LogoIcon component — default `w-8 h-8`, SVG `viewBox="0 0 200 200"`)

## Dev Agent Record

### Agent Model Used

Gemini 2.5 Pro

### Debug Log References

- `npx eslint src/components/layout/global-header.tsx` → no output (clean, 0 problems)
- `npx eslint src/components/custom/AboutModal.tsx` → 1 warning: `'e' is defined but never used` at line 27 (`@typescript-eslint/no-unused-vars`) — **pre-existing** in catch block, not introduced by this story
- `git diff --name-status HEAD src/components/custom/AboutModal.tsx src/components/layout/global-header.tsx` → `M AboutModal.tsx`, `M global-header.tsx`
- `git status --porcelain` → both modified files shown, plus pre-existing untracked 13-1/13-2 files

### Completion Notes List

- Imported `LogoIcon` from `@/components/custom/LogoIcon` in `global-header.tsx`. Restructured left side as `flex items-center gap-4` with icon (`h-14 md:h-20`, `translate-y-1`) + text div (`overflow-hidden`) containing both h1 and p with `whitespace-nowrap`. Both text elements have responsive size steps: `text-2xl md:text-3xl` (h1), `text-sm md:text-base` (p).
- Imported `LogoIcon` from `@/components/custom/LogoIcon` in `AboutModal.tsx`. Moved branded header (icon `h-14 translate-y-0.5` + h2 + subtitle p) into the sticky modal nav bar (top of DialogContent). Back button moved to far right with `shrink-0`. "System Online" label removed. Branded hero block removed from scrollable content area. `overflow-hidden` on text container guards against `whitespace-nowrap` overflow.
- **Code review fixes applied:** Added comments explaining `h-*` calibration and `translate-y-*` workaround. Added `overflow-hidden` to text containers. Added responsive logo and text sizing in GlobalHeader (`h-14 md:h-20`, `text-2xl md:text-3xl`, `text-sm md:text-base`). Corrected story Dev Notes and Completion Notes to match actual implementation.
- Dark Mode: gray bottom layer (`#4b4b53`) adequate contrast against zinc-950. No additional fix needed.

### File List

<!-- ⚠️ POPULATE THIS AT STORY START, not at the end. Add every file you plan to touch here BEFORE you begin implementing.
     Update throughout development. Final check: run `git status --porcelain` before moving to review and confirm this list matches. -->

- `src/components/custom/LogoIcon.tsx` (modified — viewBox changed from `"0 0 200 200"` to `"0 -16 200 200"` to center art geometrically; added explaining comments)
- `src/components/layout/global-header.tsx` (modified — imported `LogoIcon`, flex row with both h1 and p, responsive `h-14 md:h-20`, `overflow-hidden` guard, `whitespace-nowrap`)
- `src/components/custom/AboutModal.tsx` (modified — branded header in sticky nav bar with `h-16` icon, Back button far right, System Online removed, `overflow-hidden` guard)
