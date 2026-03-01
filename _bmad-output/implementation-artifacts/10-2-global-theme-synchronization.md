# Story 10.2: Global Theme Synchronization

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want the Filter Bar and Modal Reader to reflect my theme preference,
so that the UI remains visually consistent and accessible across all modes.

## Acceptance Criteria

1. **Filter Bar Cohesion**: The background, borders, and text colors of the Filter Bar must transition correctly between Light and Dark modes without hardcoded "dark-only" values.
2. **Modal Reader Synchronization**: Markdown Document Modal background, header, and border colors must synchronize with the global theme preference.
3. **Typography Legibility**: Typography (headings, paragraphs, code blocks) in the reader must maintain high contrast (WCAG AA) and legibility in both light and dark backgrounds.
4. **About Modal Alignment**: About Modal sections, item dividers, and metrics must use semantic theme variables instead of fixed dark-mode tints.
5. **Architectural Compliance**: All changes must use Tailwind 4 semantic classes or `dark:` variants, adhering to the "Tinted Neutrality" design system.

## Tasks / Subtasks

- [x] Task 1: Update FilterBar.tsx (AC: 1, 5)
  - [x] Replace `bg-zinc-900`, `border-zinc-800`, and `text-zinc-400` with semantic classes or `dark:` variants.
  - [x] Ensure "All" pill and active toggle chips transition correctly.
- [x] Task 2: Refactor MarkdownDocumentModal.tsx (AC: 2, 3)
  - [x] Switch modal container to `bg-background` and `border-border`.
  - [x] Refine prose overrides (`prose-zinc dark:prose-invert`) to ensure legibility on light backgrounds.
  - [x] Fix hardcoded `zinc-800` borders in ToC and header.
- [x] Task 3: Enhance AboutModal.tsx (AC: 4)
  - [x] Replace fixed `bg-zinc-950` and `text-zinc-100` with `bg-background` and `text-foreground`.
  - [x] Update section dividers and iconography to be theme-aware.
- [x] Task 4: Global CSS Polish (AC: 5)
  - [x] Verify `oklch` light mode values in `globals.css` for optimal contrast.
- [x] Task 5: Pre-Review Validation
  - [x] Subtask 5.1: Run `npm run lint` and confirm output is clean. (Note: Unrelated errors in markdown-renderer.ts ignored)
  - [x] Subtask 5.2: Run `git status --porcelain` and verify every changed/new file is documented below.

## Dev Notes

- **Design System**: Strict adherence to the "Tinted Neutrality" color system.
- **Component Strategy**: Avoid inline hardcoded colors; prefer CSS variables or standard Tailwind color scales.
- **Dependencies**: Relies on `ThemeProvider` in `layout.tsx`.

### Project Structure Notes

- Components located in `src/components/custom/`.
- Global styles in `src/app/globals.css`.

### References

- [Source: planning-artifacts/architecture.md#Visual-Identity]
- [Source: planning-artifacts/ux-design-specification.md#Color-System]

## Dev Agent Record

### Agent Model Used

Antigravity (Custom BMAD Configuration)

### Debug Log References

- [Verified] FilterBar transitions correctly in Light/Dark mode.
- [Verified] MarkdownModal uses background/foreground semantic variables.
- [Verified] AboutModal premium feel maintained in light mode with primary CTA update.

### Completion Notes List

- Implemented semantic theme synchronization for Filter Bar, Markdown Modal, and About Modal using Tailwind 4 CSS variables and shadcn-inspired patterns.
- Verified contrast and legibility in both Light and Dark modes.
- Updated destructive ghost button styles in `constants.ts` for better visibility and theme compliance.
- Verified that existing lint errors are unrelated to this story's changes.

### File List

- [src/components/custom/FilterBar.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/FilterBar.tsx)
- [src/components/custom/MarkdownDocumentModal.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/MarkdownDocumentModal.tsx)
- [src/components/custom/AboutModal.tsx](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/components/custom/AboutModal.tsx)
- [src/lib/constants.ts](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/src/lib/constants.ts)
