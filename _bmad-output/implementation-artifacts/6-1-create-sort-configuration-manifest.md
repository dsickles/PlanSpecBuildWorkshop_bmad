# Story 6.1: Create Sort Configuration Manifest

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Content Author,
I want a single YAML file that defines the display order for all content sections,
so that I can control presentation ordering from one place without editing multiple markdown files.

## Acceptance Criteria

1. **Manifest File**: `sort-config.yaml` exists at `/src/content/sort-config.yaml`.
2. **Standardized Structure**: Defines ordering arrays for `agent_studio`, `blueprints` (per project), `build_lab`, and `projects`.
3. **Identifier Format**: Values in the arrays are filename stems (without `.md`).
4. **Initial Population**: Initial manifest includes all current content files in the desired display order.
5. **Semantic Test Tokens**: Fallback and error components include `data-testid` and `aria-label` to prevent dashboard test collisions.

## Tasks / Subtasks

- [x] Create/Refine `/src/content/sort-config.yaml` (AC: 1, 2)
  - [x] Populate `agent_studio` with current agent stems: `BMadMethod`, `Lovable`, `SpecKit`, `GetShitDone`.
  - [x] Populate `blueprints` for `plan-spec-build-workshop`: `prd`, `architecture`, `ux-design-specification`, `epics`, `index`.
  - [x] Populate `projects` and `build_lab` with `plan-spec-build-workshop`.
- [x] Implement Semantic Test Tokens (AC: 5)
  - [x] Add `context` prop to `ProjectCard` and `FallbackCard` in `@/components/content/project-card`.
  - [x] Implement `data-testid` and specialized `aria-label` (e.g., `aria-label="agent content unavailable"`) in `FallbackCard`.
  - [x] Implement `data-testid` and `aria-label` in `BlueprintErrorRow` in `@/components/content/blueprint-group`.
- [x] Update Documentation
  - [x] Reflect `sort-config.yaml` as the exclusive ordering mechanism in `architecture.md`.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: Run `npm run lint` and confirm output is clean.
  - [x] Subtask N.2: Run `git status --porcelain` and verify every changed/new file is documented in the **File List** below.

## Dev Notes

- **Architecture Compliance**: Display ordering is now external to the content files. The `order` field in frontmatter is deprecated (to be removed in 6.3).
- **Testing Guardrails**: Use semantic tokens to resolve collisions identified in the Epic 5 retrospective where generic text like "Content unavailable" caused test assertion failures.

### Project Structure Notes

- All content config lives in `src/content/`.
- UI components live in `src/components/content/` (shared logic) and `src/components/custom/` (composed views).

### References

- [Architecture: Sort Order Configuration](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/planning-artifacts/architecture.md#L115)
- [Epic 5 Retrospective: Testing Challenges](file:///c:/Users/Sickl/.gemini/antigravity/Projects/PlanSpecBuildWorkshop_bmad/_bmad-output/implementation-artifacts/epic-5-retro-2026-02-25.md#L19)

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

- Redefined `ProjectCard` and `FallbackCard` to accept a `context` prop ('agent', 'doc', 'prototype').
- Implemented `data-testid` and context-aware `aria-label` (e.g., `aria-label="agent content unavailable"`) to resolve selector collisions in dashboard tests.
- Wired internal `context` logic into `DiscoveryGrid` to automatically assign correct test tokens based on the column context.
- Verified `sort-config.yaml` population with BMadMethod, Lovable, SpecKit, and GetShitDone stems.
- Documentation: Updated `architecture.md` with the new Semantic Test Token standard under Error Handling.
- [Code Review Fixes]: Cleaned up unused `date` prop and normalized semantic tokens in `BlueprintErrorRow` to match `FallbackCard`.
- All tests (37/37) and lint passed.

### File List

- src/content/sort-config.yaml
- src/components/content/project-card.tsx
- src/components/content/blueprint-group.tsx
- src/components/custom/DiscoveryGrid.tsx
- _bmad-output/planning-artifacts/architecture.md
