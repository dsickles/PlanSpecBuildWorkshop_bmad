# Story 8.3: project-overview-cta-mapping


Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want the Blueprint card's primary document icon to open the project's `index.md` content,
so that I can read a high-level overview of the project as my starting point.

## Acceptance Criteria

1. **Given** a project card in the Blueprints column,
2. **When** clicking the "Doc" CTA or a designated "Overview" link,
3. **Then** the Markdown Modal opens with the content parsed from the project's `docs/index.md` (Blueprint Overview).
4. Surface the "Overview" CTA (FileText icon) consistently in Blueprint Group headers to open the project's overview document. Ensure Agent and Prototype cards do NOT display document icons at this time.

## Tasks / Subtasks

- [x] Task 1: Update Ingestion Layer for `index.md` Discovery (AC: 3)
  - [x] Modify `src/lib/content-utils.ts`'s `getContentFilePaths` to include `index.md` at the project root level.
- [x] Task 2: Map Overview Docs in DiscoveryGrid (AC: 1, 4)
  - [x] Update `src/components/custom/DiscoveryGrid.tsx` to identify the `index.md` for each project.
  - [x] Pass the `overviewDoc` to `BlueprintGroup` and `ProjectCard`.
- [x] Task 3: Implement UI CTAs (AC: 1, 4)
  - [x] Add `FileText` icon to `BlueprintGroup` header in `src/components/content/blueprint-group.tsx`.
  - [x] Add `FileText` icon to `ProjectCard` header actions for agents/prototypes in `src/components/content/project-card.tsx`.
- [x] Task 4: Content ID Strategy Pivot (Code Review)
  - [x] Implement path-based unique IDs in `src/lib/schema.ts`.
  - [x] Update `src/lib/content-parser.ts` to assign IDs during ingestion.
  - [x] Robustify `src/lib/utils.ts` for consistent ID generation.
  - [x] Simplify `src/components/custom/MarkdownDocumentModal.tsx` lookup logic.
  - [x] Add missing test coverage in `src/components/custom/__tests__/DiscoveryGrid.test.tsx`.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.
  - [x] Subtask N.3: Run existing tests in `src/lib/__tests__/` and `src/components/custom/__tests__/`.

## Dev Notes

- **Architecture**: Next.js 15 App Router. Data is ingested on the server and passed to client components.
- **Pattern**: The "Overview" doc is essentially the root `index.md` of a project folder.
- **Icons**: Use Lucide `FileText` for consistency with other document triggers.
- **Filtering**: Ensure the `index.md` doc itself doesn't appear as a standalone row in the Blueprints document list to avoid redundancy.
- **IDs**: All document triggers and URL parameters use a consistent `${projectSlug}:${fileStem}` format via `getDocIdFromPath`.

### Project Structure Notes

- Files touched:
  - `src/lib/content-utils.ts`
  - `src/components/custom/DiscoveryGrid.tsx`
  - `src/components/content/blueprint-group.tsx`
  - `src/components/content/project-card.tsx`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 8.3]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md]

## Dev Agent Record

### Agent Model Used

Antigravity (Gemini 2.0 Flash Agentic)

### File List

- `src/lib/schema.ts`
- `src/lib/utils.ts`
- `src/lib/content-parser.ts`
- `src/lib/content-utils.ts`
- `src/components/custom/DiscoveryGrid.tsx`
- `src/components/content/blueprint-group.tsx`
- `src/components/custom/MarkdownDocumentModal.tsx`
- `src/lib/__tests__/content-utils.test.ts`
- `src/components/custom/__tests__/DiscoveryGrid.test.tsx`

## Change Log

- 2026-02-28: Implemented project-level `index.md` discovery and overview CTA mapping for Blueprints.
- 2026-02-28: Implemented path-based ID pivot across schema, parser, and UI to resolve document collision issues.
- 2026-02-28: Verified that Agents and Prototypes do not render incorrect document icons.
