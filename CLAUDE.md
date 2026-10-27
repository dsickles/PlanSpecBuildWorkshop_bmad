# CLAUDE.md

Plan Spec Build Workshop is a static Next.js portfolio that shows Dan's agentic development work in three columns: **Agent Studio** (tools), **Blueprints** (planning docs), and **Build Lab** (prototypes). Content is markdown in the repo; there is no database or CMS.

The site was originally planned and built with the BMad Method. That process is no longer followed: don't run BMAD workflows, write story files, or update `sprint-status.yaml`. Work is tracked in Linear. The docs in `_bmad-output/` are historical background only, and the code is the source of truth wherever they disagree (see "Where the old docs have drifted" below).

## Commands

```bash
npm run dev     # dev server; Zod frontmatter errors throw here
npm run lint
npx tsc --noEmit
npm test        # Jest + Testing Library (jsdom)
npm run build   # runs scripts/sync-content.ts first, then next build
```

CI (`.github/workflows/ci.yml`) runs lint, typecheck, test, and build on every PR. Run all four locally before calling work done. Node 20.

## Where things live

- `src/content/<project-slug>/index.md` is the project overview. `docs/` feeds Blueprints, `prototypes/` feeds Build Lab.
- `src/content/_shared/agents/*.md` feeds Agent Studio. `_shared` is reserved and is not a project. Never add per-project `agents/` folders.
- `src/content/sort-config.yaml` controls all display order (agents, blueprints per project, build lab, project pills). Entries are filename stems. Never add an `order` field to frontmatter.
- `src/lib/schema.ts` is the Zod frontmatter schema and the single authority on content shape.
- `src/lib/content-parser.ts` handles ingestion and `{{PROJECT_NAME}}` token replacement. `src/lib/markdown-renderer.ts` is the only place the ESM-only unified/remark/rehype pipeline runs, so the parser stays mockable in Jest. Keep that split.
- `src/lib/toc-engine.ts` holds header extraction. Parsing logic stays in `src/lib/`, not in components.
- `src/components/ui/` holds shadcn primitives. **Do not edit them.** Compose new UI in `src/components/custom/`, `content/`, or `layout/`.

## Content rules

- Frontmatter uses the three commented groups, in this order:

  ```yaml
  ---
  # 1. Core Identity
  title: "Document Title"
  date: "2026-10-27"
  status: "Live"        # Live | WIP | Concept | Archived
  artifact_type: "doc"  # agent | doc | prototype (optional)
  description: "..."

  # 2. Taxonomy
  taxonomy:
    domain: []
    tech_stack: []

  # 3. Relations & Connectivity
  relations:
    projects: []
  links: []
  ---
  ```

- Keys match `schema.ts` exactly (`tech_stack`, `artifact_type`, `source_path`). Don't rename existing keys.
- Use `{{PROJECT_NAME}}` instead of hardcoding a project's title in its docs.
- Adding a project means new markdown plus a `sort-config.yaml` entry. It should never need React or CSS changes. If it does, stop and flag it.
- `source_path` points a content file at a doc elsewhere in the repo (usually `_bmad-output/`). Paths are relative to the repo root; absolute paths and `..` are rejected.
- **Author-first metadata:** don't change a project's title, status, or `projects` associations unless the ticket asks for it or Dan confirms. If a test fails because a field looks "missing", check whether Dan removed it on purpose before "fixing" it.

## Code rules

- Filter state lives in URL params (`?project=`, `?domain=`, `?tech=`, `?document=`, multi-select comma-separated). `page.tsx` reads `searchParams` as a server prop; client components use `useSearchParams`. Card expand/collapse is the only local `useState` exception.
- New global utility views follow the `AboutModal` pattern: a URL-synced modal layered on the grid that never clears filter state.
- One bad file must never break the site. Invalid frontmatter renders an `[Error]` card; missing folders render the dashed `[Concept]` empty state. Build logs warnings and keeps going.
- Fallback and error rows get a `data-testid` and a context-specific `aria-label` (for example `aria-label="agent content unavailable"`) so tests don't collide across columns.
- Markdown HTML must stay sanitized through `rehype-sanitize`.
- Use the semantic theme variables in `globals.css`, not hardcoded zinc/neutral classes.
- If a layout needs more than two magic-number offsets to line up, stop and raise it instead of stacking more.
- Tests sit in `__tests__/` next to the code. Every change ships with tests, and never report tests as passing without running them.

## Where the old docs have drifted

The BMAD architecture doc predates some refactors. Follow the code on these:

- Content lives in `src/content/`, not a root `/content/`.
- Frontmatter keys are the snake_case ones in `schema.ts`, even though the architecture doc says camelCase.
- Composed components are split across `custom/`, `content/`, and `layout/`, not only `custom/`. The parser is `content-parser.ts`, not `parser.ts`.

If you find another mismatch, follow the code. There's no need to update the old doc.

## Handing work off for review

Hopper reviews PRs on GitHub and can't see the Claude project thread. Before you call a ticket ready for review, check both of these:

1. **Proof is on GitHub.** Everything the ticket's acceptance criteria ask for (screenshots, preview links, test output) is in the PR body or a PR comment, not only in the project thread. The GitHub API can't upload image attachments, so if you can't embed a screenshot, say so in the PR and ask Dan to drag the files into a PR comment.
2. **The Linear ticket is in In Review.** Linking a PR moves the ticket to In Progress automatically. Move it to In Review yourself when the PR is ready, because Hopper picks up work from that status.

Then comment on the ticket with the PR link.
