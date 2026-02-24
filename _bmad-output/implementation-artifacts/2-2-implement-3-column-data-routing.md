# Story 2.2: Implement 3-Column Data Routing

Status: review

## Story

As a User,
I want the parsed markdown content to be automatically sorted into the correct visual columns,
so that I can easily differentiate between Agents, Blueprints, and Prototypes.

## Acceptance Criteria

1. **Given** the parsed structured data from Epic 1,
2. **When** the `DashboardGrid` component renders,
3. **Then** it iterates over the data array and renders `ProjectCard` components into the appropriate `children` slots of the 3-column CSS Grid.
4. **And** the mapping logic determines which column a card belongs in strictly based on the `artifactType` metadata — **NOT** by parsing URLs or text strings.
5. **And** the `ProjectCard` component enforces a defensive maximum height constraint via `line-clamp` to prevent anomalous markdown data from blowing out the grid.

## Tasks / Subtasks

- [x] Task 1: Implement `routeContentToColumns()` utility in `page.tsx`
  - [x] Subtask 1.1: Calling `getSortedParsedContent()` in Server Component.
  - [x] Subtask 1.2: Partitioned into `agents`, `docs`, `prototypes`, `errors` arrays using `isError()` guard.
  - [x] Subtask 1.3: Routing strictly by `item.artifactType` — no URL or string parsing.
- [x] Task 2: Render Agent Studio column with real data
  - [x] Subtask 2.1: `agents` array mapped to `<ProjectCard artifactType="agent">`.
  - [x] Subtask 2.2: Props: `title`, `status`, `description`, `domain`, `tech_stack` from `ParsedArticle`.
- [x] Task 3: Render Lab (Prototype) column with real data
  - [x] Subtask 3.1: `prototypes` array mapped to `<ProjectCard artifactType="prototype">`.
  - [x] Subtask 3.2: `externalUrl={proto.external_url}` mapping applied (snake_case → camelCase).
- [x] Task 4: Render Blueprints column with project-grouped document list
  - [x] Subtask 4.1: Docs grouped by `projectSlug` via `Map<string, ParsedArticle[]>`.
  - [x] Subtask 4.2: Created `BlueprintGroup` component — project header with doc count.
  - [x] Subtask 4.3: Each doc renders as compact row: title + `StatusPill`. No expand/collapse yet.
- [x] Task 5: Handle error items gracefully
  - [x] Subtask 5.1: `ErrorFrontmatter` items partitioned into `errors[]` and rendered as dashed fallback cards per column.
- [x] Task N: Pre-Review Validation
  - [x] Subtask N.1: `npm run lint` — clean (0 errors, 0 warnings).
  - [x] Subtask N.2: `npx tsc --noEmit` — clean.
  - [x] Subtask N.3: Browser smoke test — real content from `src/content/` renders in all 3 columns.

## Dev Notes

### Key Type Reference — ParsedArticle

```typescript
type ParsedArticle = FrontmatterData & {
  html: string;
  projectSlug: string;   // e.g., "plan-spec-build-workshop"
  artifactType: ArtifactType;  // "agent" | "doc" | "prototype"
};

// FrontmatterData fields:
// title: string
// date: string
// status: "Live" | "WIP" | "Concept" | "Archived"
// domain: string[]
// tech_stack: string[]
// description?: string
// external_url?: string   ← note: snake_case (Zod schema)
// artifact_type?: ArtifactType
```

### Critical: prop name mapping for ProjectCard

`FrontmatterData.external_url` (snake_case) → `ProjectCardProps.externalUrl` (camelCase). Must map explicitly: `externalUrl={article.external_url}`.

### Blueprint Column — Grouped Layout

The Blueprints column is NOT a flat list of cards. It uses a project-grouped layout:
- One `BlueprintGroup` per unique `projectSlug`  
- Each group shows: project name header + count of docs
- Under the header: a flat list of document rows (title + status pill)
- No expand/collapse yet — document rows are always visible (Epic 3 adds toggle)

### Error Fallback Card

Architecture mandates: "If a content file has malformed frontmatter, the affected card renders with a dashed border and an `[Error]` pill." 
- Use `<ProjectCard.Root isDashed>` + `<ProjectCard.Header title="Content unavailable" status="Concept"/>` for the error state.

### File Structure

- `src/app/page.tsx` — main data fetch + column routing (Server Component)
- `src/components/content/blueprint-group.tsx` [NEW] — Blueprint column project group

### References

- [Source: architecture.md#Error Handling Strategy]
- [Source: epics.md#Story 2.2]
- [Source: content-parser.ts] — `getSortedParsedContent`, `ParsedArticle`, `ErrorFrontmatter`
- [Source: schema.ts] — `isError`, `ArtifactType`

## Dev Agent Record

### Agent Model Used

Gemini 2.5 Pro

### Debug Log References

### Completion Notes List

- `page.tsx` now calls `getSortedParsedContent()` (Server Component — runs at build/request time).
- Content partitioned into 4 buckets: `agents`, `docs`, `prototypes`, `errors` using `isError()` guard.
- Routing: strictly by `item.artifactType` — zero URL/text string parsing.
- `external_url` (snake_case Zod field) → `externalUrl` (camelCase prop) explicit mapping applied.
- Blueprint column: `Map<string, ParsedArticle[]>` groups docs by `projectSlug`. `BlueprintGroup` renders project header + compact doc rows.
- Error fallback: `errors[]` filtered by path substring (`/agents/`, `/docs/`, `/prototypes/`) to route to the correct column fallback.
- ESLint: ✅ 0 errors, 0 warnings. TypeScript: ✅ clean.

### File List

- `src/app/page.tsx` [MODIFIED]
- `src/components/content/blueprint-group.tsx` [NEW]
