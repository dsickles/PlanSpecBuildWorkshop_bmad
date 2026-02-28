# Story 8.2: Agent Studio External Link Support

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a User,
I want to see icons linking to GitHub or demo sites directly on Agent Studio cards,
so that I can quickly explore the tools being showcased.

## Acceptance Criteria

1. [ ] Given an agent markdown file.
2. [ ] When the `external_links` frontmatter array is present.
3. [ ] Then the Agent Studio card renders a small cluster of icons in the top-right corner.
4. [ ] And the icons match the link type (e.g., GitHub logo for repo links, Globe for websites).

## Tasks / Subtasks

- [x] Task 1: Update Frontmatter Schema (AC: 1, 2)
  - [x] Add `external_links` to `FrontmatterSchema` in `src/lib/schema.ts`.
  - [x] Support `label` and `url` fields in the objects.
- [x] Task 2: Refactor `ProjectCard` for Agent Icons (AC: 3, 4)
  - [x] Update `ProjectCardProps` to include `externalLinks`.
  - [x] Modify `artifactType === 'agent'` branch to render icons in the header.
  - [x] Implement icon mapping logic (e.g., label "GitHub" -> `<Github />`, default -> `<Globe />`).
- [x] Task 3: Wire Data in `DiscoveryGrid` (AC: 3)
  - [x] Pass `agent.external_links` from `DiscoveryGrid.tsx` to `ProjectCard`.
- [x] Task 4: Content Update & Verification (AC: 1, 2)
  - [x] Add `external_links` to `src/content/_shared/agents/Lovable.md` as a test case.
  - [x] Create `src/components/content/__tests__/ProjectCard.test.tsx` for unit testing.
- [x] Task 5: Pre-Review Validation
  - [x] Subtask 5.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask 5.2: Run `git status --porcelain` and verify every changed/new file is documented below.

## Dev Notes

- **Architecture Compliance**: Follow "Branding Tokenization" rules if applicable. Maintain "Logic Boundary" by keeping schema updates in `lib/schema.ts`.
- **Icon Set**: Use `lucide-react` (GitHub, Globe) to match existing Prototype card styles.
- **Styling**: Icons should match the Quaternary style (`text-zinc-500`, brightens on hover) of the existing Prototype/Doc icons.

### Project Structure Notes

- **Alignment**: This Story extends the `ProjectCard` to share behavior between Agents and Prototypes while maintaining the "Link Rot" mitigation strategy (Phase 1 simplicity).

### References

- [Epics: Epic 8.2](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/epics.md#L547)
- [Architecture: Component Boundaries](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/architecture.md#L242)
- [UX Spec: Color System](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/ux-design-specification.md#L154)

## Dev Agent Record

### Agent Model Used

Antigravity v1.0 (Gemini 2.0 Flash)

### Debug Log References

### Completion Notes List

- Added `external_links` support to `FrontmatterSchema`.
- Refactored `ProjectCard` to render agent icons for external links (GitHub, Globe).
- Updated `DiscoveryGrid` to pass agent metadata to cards.
- Added verification content to `Lovable.md`.
- Achieved 100% test pass rate across unit and UI tests.

### Senior Developer Review (AI) - 2026-02-28
- [x] Fixed `onLayersClick` logic gap in `ProjectCard` for agent cards.
- [x] Improved accessibility with descriptive `aria-label` for external links.
- [x] Corrected `Lovable.md` content to include all claimed links.
- [x] Refined Zod error messages for nested links.

### File List

- [x] `src/lib/schema.ts`
- [x] `src/components/content/project-card.tsx`
- [x] `src/components/custom/DiscoveryGrid.tsx`
- [x] `src/content/_shared/agents/Lovable.md`
- [x] `src/components/content/__tests__/ProjectCard.test.tsx` (NEW)
- [x] `src/lib/__tests__/schema.test.ts` (NEW)
