# Story 11.3: Architecture Sync & Meta-Data Pointers

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Developer,
I want the architecture documentation to accurately describe the folder structure and metadata drivers,
so that the system remains maintainable and the project-root accurately represents the content architecture.

## Acceptance Criteria

1. **Folder Structure Alignment**: The `architecture.md` file must explicitly include `index.md` files within the `docs/`, `prototypes/`, and `_shared/` folders in the folder structure section.
2. **Metadata Drivers Description**: The documentation must describe how `index.md` files drive project-level metadata (including shared branding like "Agent Studio").
3. **Documentation Source Paths**: The documentation must describe the `sourcePath` (Remote Pointers) mechanism for linking to live project documentation.

## Tasks / Subtasks

- [x] Audit `_bmad-output/planning-artifacts/architecture.md` (AC: 1, 2, 3)
  - [x] Identify sections needing structural updates (e.g., Folder Structure, Content Organization).
  - [x] Identify sections needing metadata driver detail (e.g., Branding Tokenization, Shared Agent Studio Items).
- [x] Implement Documentation Updates (AC: 1, 2, 3)
  - [x] Update "Complete Project Directory Structure" to include `index.md` in all content subfolders.
  - [x] Enhance "Content Organization" and "Branding Tokenization" to explain `index.md` precedence and shared branding resolution.
  - [x] Ensure "Shared Documentation Strategy (Remote Pointers)" is accurately described.
- [x] Task 3: Pre-Review Validation
  - [x] Subtask 3.1: Verify every changed/new file is documented in the **File List** below.

### Review Follow-ups (AI)
- [x] [AI-Review][High] Commit untracked `src/content/_shared/index.md`
- [x] [AI-Review][High] Update File List to include all modified infrastructure files
- [x] [AI-Review][Medium] Refine metadata precedence documentation in `architecture.md`
- [x] [AI-Review][Low] Fix unused variable lint error in `markdown-renderer.ts`

## Dev Notes

- **Branding Logic**: Story 11.2 established that `_shared/index.md` is the source of truth for "Agent Studio" branding in the modal.
- **Remote Pointers**: Epic 9 implemented `sourcePath` support; architecture must reflect this as a standard pattern.
- **Folder Structure**: The `DashboardGrid` and `content-parser` rely on these specific folder patterns.

### Project Structure Notes

- Alignment with `src/content` as the primary boundary.
- `_shared` is a reserved slug that maps to the "Agent Studio" column but is NOT a selectable project.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 11.3]
- [Source: _bmad-output/implementation-artifacts/11-2-shared-agent-branding-refinement.md]
- [Source: _bmad-output/planning-artifacts/architecture.md]

## Dev Agent Record

### Agent Model Used

Antigravity (Custom BMAD Agent)

### Debug Log References

### Completion Notes List

- Updated `architecture.md` folder structure to include `index.md`.
- Added branding resolution logic for `_shared/` content.
- Clarified metadata driver precedence for `index.md`.
- Confirmed `sourcePath` documentation alignment.

### File List

- `_bmad-output/planning-artifacts/architecture.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `src/content/_shared/index.md`
- `src/lib/markdown-renderer.ts`
