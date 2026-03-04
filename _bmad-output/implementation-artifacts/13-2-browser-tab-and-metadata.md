# Story 13.2: Browser Tab and Metadata

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to see the new branded icon in my browser tab, bookmarks, and mobile home screen,
So that the application has a recognizable and premium identity outside the main viewport.

## Acceptance Criteria

1. **Given** a browser or mobile device, **When** opening the application or saving it to the home screen, **Then** the default Next.js favicon is replaced with the new 32x32/16x16 branding.
2. **And** an `apple-icon.png` (180x180) is provided.
3. **And** the `metadata` object in `src/app/layout.tsx` is updated to reference these visual assets correctly.

## Tasks / Subtasks

- [x] Task 1: Remove Default Next.js Favicon (AC: 1)
  - [x] Subtask 1.1: Delete `src/app/favicon.ico` (the default Next.js blue-N icon). Next.js App Router precedence: explicit `metadata.icons` in `layout.tsx` takes effect as long as no `favicon.ico` file-convention file overrides it — delete to prevent conflict.
- [x] Task 2: Wire Branded Icons via Next.js Metadata API (AC: 1, 2, 3)
  - [x] Subtask 2.1: Update the `metadata` export in `src/app/layout.tsx` to add an `icons` field referencing the PNG assets already deposited in `public/` during Story 13-1.
  - [x] Subtask 2.2: Added `icon` array entries for 16x16 and 32x32 (`image/png`) — covers browser tab and bookmark favicon display.
  - [x] Subtask 2.3: Added `apple` entry for `apple-icon.png` (180x180) — covers iOS/Android home-screen icon.
  - [x] Subtask 2.4: Existing `title` and `description` values preserved unchanged.
- [x] Task 3: Verify Visual Result (AC: 1, 2, 3)
  - [x] Subtask 3.1: `src/app/favicon.ico` deleted; `layout.tsx` updated. **Visually confirmed** — the branded blue/white/gray layers icon displays in the browser tab in place of the default Next.js favicon. Icon size was also corrected post-implementation by tightening the viewBox in `scripts/generate-icons.js` from `"0 0 200 200"` to `"26 10 148 148"` and regenerating all PNGs.
  - [x] Subtask 3.2: `npx eslint src/app/layout.tsx` returned clean (no output = no errors). Next.js will emit correct `<link rel="icon">` and `<link rel="apple-touch-icon">` tags from the `metadata.icons` API.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: `npm run lint` — 7 pre-existing errors in other files; `layout.tsx` is lint-clean (confirmed via `npx eslint src/app/layout.tsx` → no output).
  - [x] Subtask N.2: `git diff --name-status HEAD` confirms: `D src/app/favicon.ico`, `M src/app/layout.tsx`. Both files documented in File List.

## Dev Notes

### Critical Implementation Details

**Next.js App Router Favicon Precedence (Important — prevents silent override failures):**
Next.js resolves icons in this priority order:
1. File-based convention: if `src/app/favicon.ico` exists, the runtime uses it for the `/favicon.ico` route regardless of `metadata.icons`.
2. `metadata.icons` in `layout.tsx` populates `<link>` tags in `<head>` only if no file-convention ico is present.

**Action required:** Delete `src/app/favicon.ico` before wiring `metadata.icons`. The branded PNGs deposited in `public/` by Story 13-1 will then take effect via the metadata API.

**Exact `metadata.icons` pattern to use:**

```typescript
export const metadata: Metadata = {
  title: "Plan Spec Build Workshop",
  description: "A portfolio showcasing a full AI-assisted product development workflow.",
  icons: {
    icon: [
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};
```

**Asset availability (regenerated during this story with tighter viewBox crop):**
- `public/icon-16x16.png` ✅ exists (689 bytes — regenerated with `viewBox="26 10 148 148"`)
- `public/icon-32x32.png` ✅ exists (1,955 bytes — regenerated with `viewBox="26 10 148 148"`)
- `public/apple-icon.png` ✅ exists (19,212 bytes — 180x180, regenerated with `viewBox="26 10 148 148"`)
- `public/icon-512x512.png` ✅ exists (regenerated — reserved for PWA manifest in future)

**No SVG favicon:** Modern browsers accept PNG favicons. No SVG conversion of `LogoIcon.tsx` is required for this story. The `LogoIcon.tsx` SVG component is a React component for in-page use, not a static asset file.

**No manifest.json for this story:** A full `manifest.json` (Web App Manifest with `512x512` icon) would be required for installable PWA support, but that is explicitly out of Epic 13 scope. The `icon-512x512.png` exists in `public/` for that future work.

**⚠️ Next.js file-convention override risk (for Story 13-3 awareness):** Just as `src/app/favicon.ico` silently overrides `metadata.icons.icon`, placing an `apple-icon.png` file inside `src/app/` would similarly override `metadata.icons.apple`. Both assets must live in `public/` (not `src/app/`) when using the `metadata` API approach chosen here. This is relevant if any future story restructures the `src/app/` directory.

### Architecture Compliance

- **Component Boundaries:** This story only touches `src/app/layout.tsx` metadata. No UI components are modified. Fully compliant with the architecture document's component boundary rules.
- **Custom components:** `src/components/custom/` — not touched by this story.
- **shadcn primitives:** `src/components/ui/` — not touched.
- **Next.js Metadata API:** Using the official Next.js 15 `Metadata` type from `next`. Do not use `<Head>` tags or custom `<link>` elements in JSX — the `metadata` export is the correct App Router pattern for this.

### Previous Story Intelligence (Story 13-1)

- All four PNG assets (16x16, 32x32, 180x180, 512x512) were generated from the `LogoIcon.tsx` SVG source using `scripts/generate-icons.js` (run via `npm run generate-icons`).
- The `sharp` npm package (v0.34.5) handles the SVG-to-PNG conversion. It is already a project dependency.
- `LogoIcon.tsx` is located at `src/components/custom/LogoIcon.tsx` (not `src/components/`).
- The icon uses a fixed 3D isometric palette (blue/white/dark-gray) — no dark mode adaptation is needed for the browser tab icon.
- Code review from Story 13-1 resolved: `role="img"`, `aria-label`, `<title>`, `focusable="false"` on the SVG element.

### Git Intelligence (Recent Commits)

- Recent commits focus on Epic 13 Story 13-1: `src/components/custom/LogoIcon.tsx` and public PNG assets.
- Before that: Sprint 12 deployment (Vercel CI/CD, E2E flow). Codebase is stable and deployed.
- No pending lint failures or TypeScript errors in the core application layer.

### Project Structure Notes

- `src/app/layout.tsx` is the **only** file to modify for this story.
- `src/app/favicon.ico` is the **only** file to delete for this story.
- No new files need to be created.
- `public/` icons: already in place — do NOT regenerate them.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-13.2:-Browser-Tab-and-Metadata]
- [Source: _bmad-output/planning-artifacts/architecture.md#Component-Boundaries]
- [Source: _bmad-output/implementation-artifacts/13-1-logo-asset-integration.md] (PNG assets deposited)
- [Next.js Docs: Metadata API — Icons](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#icons)
- [Next.js Docs: Favicon, Icon, and Apple Icon file conventions](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)

## Dev Agent Record

### Agent Model Used

Gemini 2.5 Pro

### Debug Log References

- `npx eslint src/app/layout.tsx` → no output (clean)
- `npm run lint` → 14 problems (7 errors, 7 warnings) — all pre-existing in files not touched by this story
- `git diff --name-status HEAD` → `D src/app/favicon.ico`, `M src/app/layout.tsx`, `M sprint-status.yaml` (+ pre-existing 13-1 untracked files)

### Completion Notes List

- Deleted `src/app/favicon.ico` to remove the default Next.js blue-N icon and prevent the file-convention route from silently overriding `metadata.icons`.
- Updated `metadata` export in `src/app/layout.tsx` to add an `icons` field: 16x16 PNG and 32x32 PNG as browser tab favicons; 180x180 `apple-icon.png` as iOS/Android home-screen touch icon.
- Tightened `scripts/generate-icons.js` viewBox from `"0 0 200 200"` → `"26 10 148 148"` after visual review revealed icon appeared small relative to other browser tab icons. Regenerated all 4 PNGs with the corrected crop. User confirmed icon now matches visual weight of other browser tab icons.
- `title` and `description` metadata values preserved unchanged.
- `layout.tsx` is lint-clean; no new lint errors introduced.
- All 3 ACs satisfied: (1) default favicon replaced and visually confirmed, (2) apple-icon provided, (3) `metadata` updated.
- ✅ Resolved review finding [High]: Added 5 missing files to File List (generate-icons.js + 4 regenerated PNGs).
- ✅ Resolved review finding [Medium]: Updated stale asset byte sizes in Dev Notes to reflect post-regeneration values.
- ✅ Resolved review finding [Medium]: Added Next.js file-convention override warning for `apple-icon.png` in Dev Notes.
- ✅ Resolved review finding [Low]: Subtask 3.1 updated to record confirmed visual result rather than prediction.
- ✅ Resolved review finding [Low]: `icon-512x512.png` added to File List.

### File List

<!-- ⚠️ POPULATE THIS AT STORY START, not at the end. Add every file you plan to touch here BEFORE you begin implementing.
     Update throughout development. Final check: run `git status --porcelain` before moving to review and confirm this list matches. -->

- `src/app/layout.tsx` (modified — added `icons` field to `metadata`)
- `src/app/favicon.ico` (deleted — replaced by metadata API icons)
- `scripts/generate-icons.js` (modified — viewBox tightened from `"0 0 200 200"` to `"26 10 148 148"` to crop icon content to fill the PNG canvas)
- `public/icon-16x16.png` (regenerated — new viewBox crop; 494 → 689 bytes)
- `public/icon-32x32.png` (regenerated — new viewBox crop; 1,255 → 1,955 bytes)
- `public/apple-icon.png` (regenerated — new viewBox crop; 13,529 → 19,212 bytes)
- `public/icon-512x512.png` (regenerated — new viewBox crop)
