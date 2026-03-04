# Story 13.1: Logo Asset Integration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a UI Developer,
I want to add the new "Layers" icon assets to the codebase as a responsive SVG component and static PNGs,
So that they are available for use across the application interface and metadata.

## Acceptance Criteria

1. **Given** the provided icon design,
2. **When** viewing the codebase,
3. **Then** a scalable `LogoIcon.tsx` component exists in `src/components/custom/`.
4. **And** crisp static PNGs (16x16, 32x32, 180x180, 512x512) are correctly deposited into the `public/` directory.

## Tasks / Subtasks

- [x] Task 1: Create the SVG Component (AC: 1, 3)
  - [x] Subtask 1.1: Create `src/components/custom/LogoIcon.tsx`
  - [x] Subtask 1.2: Implement the "Layers" icon SVG with React `SVGProps<SVGSVGElement>` to enable responsive CSS classes (`className` support).
  - [x] Subtask 1.3: Dark Mode — component uses fixed-color 3D isometric palette (blue/white/gray) by design decision. Dark mode appearance to be reviewed manually in context. Accessibility standards addressed via `role="img"`, `aria-label`, `<title>`, and `focusable="false"`.
- [x] Task 2: Add Static PNG Assets (AC: 1, 4)
  - [x] Subtask 2.1: Deposit 16x16 PNG into `public/icon-16x16.png`
  - [x] Subtask 2.2: Deposit 32x32 PNG into `public/icon-32x32.png`
  - [x] Subtask 2.3: Deposit 180x180 PNG into `public/apple-icon.png` (or `apple-touch-icon.png`)
  - [x] Subtask 2.4: Deposit 512x512 PNG into `public/icon-512x512.png`
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Run `npm run lint` (or equivalent). Pre-existing codebase lint errors present; `LogoIcon.tsx` is clean. `generate-icons.js` uses CommonJS `require()` imports which trigger `@typescript-eslint/no-require-imports` — this is expected for a plain Node.js script outside the TypeScript compilation boundary.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.
- [x] Task R: Code Review Follow-ups (resolved)
  - [x] Add `scripts/generate-icons.js` to File List (was missing)
  - [x] Add `package.json` / `package-lock.json` to File List (dependency `sharp` added)
  - [x] Add `npm run generate-icons` script to `package.json` for discoverability
  - [x] Add `role="img"`, `aria-label`, `<title>`, `focusable="false"` to `LogoIcon.tsx`
  - [x] Fix stale radius comment in `generate-icons.js` (90px → 110px)

## Dev Notes

- **Component Location Boundary:** Follow the strict architecture mandate. Custom composed components MUST reside in `src/components/custom/`. Do not place `LogoIcon.tsx` directly in `src/components/` or `src/components/ui/`.
- **SVG Scalability:** The SVG component must accept an optional `className` prop to allow sizing and coloring overrides from parent components (e.g., when it will be placed in the Global Header in a future story). Default size is `w-8 h-8` (32px) matching the header icon slot.
- **Dark Mode:** Component uses a fixed-color 3D isometric palette (blue/white/gray) by design decision. The icon is intentional brand color and does not adapt to dark mode. Consuming parent may add `aria-hidden="true"` if used purely decoratively alongside text.
- **Accessibility:** `role="img"`, `aria-label="Plan Spec Build Workshop logo"`, `<title>Plan Spec Build Workshop Logo</title>`, and `focusable="false"` are implemented on the SVG element.
- **Icon Regeneration:** Run `npm run generate-icons` to regenerate PNG assets from the SVG source in `scripts/generate-icons.js`.

### Project Structure Notes

- Alignment with unified project structure: `LogoIcon.tsx` belongs in `src/components/custom/`. Standard static assets must reside in `public/`.

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Component-Boundaries]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-13:-Visual-Branding-and-Identity-Integration]

## Dev Agent Record

### Agent Model Used

Gemini 2.5 Pro

### Debug Log References

- Ran `git status --porcelain` to identify added files.
- Ran `npm run lint` which resulted in existing codebase lint errors. `LogoIcon.tsx` is clean. `generate-icons.js` has expected `require()` lint warnings (plain Node.js script, not in TS compilation boundary).

### Completion Notes List

- Created `LogoIcon.tsx` with a 3D isometric stack of three rounded rectangular tiles (blue/white/gray) implemented as SVG with layered gradients, ambient occlusion shadows, and a unified vertex specular highlight. Component is accessible (`role="img"`, `aria-label`, `<title>`, `focusable="false"`) and size-overridable via `className`.
- Created `scripts/generate-icons.js` using `sharp` to generate PNG assets at 16x16, 32x32, 180x180, and 512x512 from the SVG source. Added `npm run generate-icons` to `package.json` for discoverability.
- Added `sharp` as a dependency (`^0.34.5`).
- All acceptance criteria implemented and code review findings resolved.

### File List

- `src/components/custom/LogoIcon.tsx`
- `scripts/generate-icons.js`
- `public/icon-16x16.png`
- `public/icon-32x32.png`
- `public/apple-icon.png`
- `public/icon-512x512.png`
- `package.json`
- `package-lock.json`
