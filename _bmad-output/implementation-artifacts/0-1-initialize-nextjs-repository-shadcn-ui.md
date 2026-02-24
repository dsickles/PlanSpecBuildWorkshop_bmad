# Story 0.1: Initialize Next.js Repository & shadcn/ui

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want to initialize a standard Next.js 15 application shell with Tailwind v4 and shadcn/ui,
so that I have a clean, runnable environment to build the portfolio.

## Acceptance Criteria

1.  **Given** a clean repository,
2.  **When** running `npm install` and `npm run dev`,
3.  **Then** the default Next.js starter page loads successfully on localhost without console or build errors.
4.  **And** the shadcn/ui configuration file (`components.json`) is present and correctly mapped to the `@/*` alias.

## Tasks / Subtasks

- [x] Task 1: Initialize Next.js 15 application (AC: 1, 2, 3)
  - [x] Subtask 1.1: Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"` in the project root.
- [x] Task 2: Initialize shadcn/ui (AC: 4)
  - [x] Subtask 2.1: Run `npx shadcn@latest init` to set up `components.json`.

## Dev Notes

- **Starter Template:** Official Next.js (15) app router with TypeScript, Tailwind CSS v4, and shadcn/ui.
- **Initialization Command:**
  ```bash
  npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
  npx shadcn@latest init
  ```
- **Constraint:** Do NOT integrate external component libraries beyond shadcn/ui. The repository must remain runnable via `npm run dev` with zero additional configuration or environment variables to support easy forking.

### Architecture Compliance

- **Language & Runtime:** TypeScript on Node.js (Next.js 15).
- **Styling Solution:** Tailwind CSS v4.
- **Code Organization:** Next.js App Router (`src/app`) for layout nesting and server components.

### Library / Framework Requirements

- Next.js 15
- Tailwind CSS v4
- shadcn/ui

### File Structure Requirements

- Use `src-dir` to ensure the app router is located in `src/app`.
- Use the `@/*` import alias.

### Project Structure Notes

- Alignment with unified project structure (paths, modules, naming).
- Detected conflicts or variances (with rationale).

### References

- [Source: epics.md#Story 0.1: Initialize Next.js Repository & shadcn/ui]
- [Source: architecture.md#Selected Starter: Official Next.js + shadcn/ui Initialization]

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

- Successfully initialized the Next.js 15 application using the `create-next-app` CLI. 
- Integrated `shadcn/ui` with the `new-york` style and `neutral` base color. Verified that `components.json` is configured correctly for the `@/*` alias.
- Verified that the `npm run dev` command starts the development server successfully.
- **Review Fixes Applied:** Moved all initialization files from the `plan-spec-build-workshop` subdirectory to the root repository to comply with architectural standards (fixing the critical issue).
- Details in the File List have been corrected to accurately reflect root location and actual generated files (e.g., `postcss.config.mjs` instead of `tailwind.config.ts`).

### File List

- `package.json`
- `components.json`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `next.config.ts`
- `postcss.config.mjs`
- `tsconfig.json`
- `eslint.config.mjs`
- `.gitignore`
- `public/` directory assets
