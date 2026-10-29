# Plan Spec Build Workshop

A zero-fluff, file-driven portfolio that documents an Enterprise PM's agentic development journey. Rather than hiding behind polished demos, the site intentionally exposes the "messy middle" — the tools used, the docs that shaped each decision, and the prototypes that shipped — through an interlocking **3-column "Command Center"**: **Agent Studio → Blueprints → Build Lab**.

The portfolio itself is **Project #1** (the "Meta-Blueprint"): it was planned, specified, and built with the same agentic workflow it showcases. Fork the repo, drop in your own markdown, and you have your own workshop in under 30 minutes.

🔗 **Live site:** https://plan-spec-build-workshop.vercel.app

## What's Inside

- **Agent Studio** — the AI tools and agents used across projects (BMad Method, Cursor, SpecKit, Lovable, Antigravity, …)
- **Blueprints** — the actual planning docs: PRDs, architecture, UX specs, epics, decision matrices
- **Build Lab** — links/embeds for the working prototypes
- **Tri-modal filtering** by Project, Domain, and Tech Stack — applied across all three columns
- **Git-based CMS** — adding a project means dropping markdown files into `src/content/<project-slug>/` and updating `sort-config.yaml`. No CMS, no database, no UI code.
- **Plan and changelog** — each project can publish its milestones and a weekly changelog of what shipped, what changed direction and what got cut, with the issue, tool and PR behind each change
- **Shareable pages** — every project, blueprint and tool has its own URL with a link preview
- **Dark/Light mode**, with an automated WCAG 2.1 AA scan on every PR

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, SSG) + [React 19](https://react.dev)
- TypeScript, [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com), [Radix UI](https://www.radix-ui.com)
- Markdown pipeline: `gray-matter` + `remark` / `remark-gfm` / `remark-rehype` / `rehype-sanitize`
- [Zod](https://zod.dev) for frontmatter schema validation
- [Jest](https://jestjs.io) + Testing Library for unit/integration tests
- Deployed on [Vercel](https://vercel.com)

## Getting Started

### Prerequisites

- **Node.js 20+** (matches `@types/node`)
- npm (or yarn / pnpm / bun — examples below use npm)

### 1. Clone & install

```bash
git clone https://github.com/dsickles/PlanSpecBuildWorkshop_bmad.git
cd PlanSpecBuildWorkshop_bmad
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page is the 3-column dashboard; the page auto-updates as you edit files.

### 3. Useful scripts

```bash
npm run dev              # Next.js dev server
npm run build            # Runs prebuild sync + next build (SSG)
npm run start            # Serve the production build
npm run lint             # ESLint
npm test                 # Jest (jsdom)
npm run publish-check    # Fails on private data or status files a project hasn't opted to publish
npm run e2e              # Playwright smoke tests + accessibility scan (run after a build)
npm run check-demos      # Checks every Live prototype link answers
npm run new-project -- <slug> --title "Title"   # Scaffold a new project
npm run generate-icons   # Regenerate favicons/app icons from source
```

`npm run build` automatically runs `scripts/sync-content.ts` first (the **Pre-Build Sync** step) to resolve any `source_path` pointers in markdown frontmatter to files that live outside `src/content/`.

## Project Structure

```
src/
  app/                       # Next.js App Router (home, /about, layout, globals)
  components/
    custom/                  # FilterBar, DiscoveryGrid, AboutModal, project cards
    layout/                  # Global header, theme provider wrappers
    ui/                      # shadcn/ui primitives
  content/
    _shared/agents/          # Shared agent .md files (Cursor, BMadMethod, …)
    plan-spec-build-workshop/
      index.md               # Project overview (the Meta-Blueprint)
      docs/                  # Blueprint docs (prd, architecture, ux-design, epics)
      prototypes/            # Build Lab cards / external prototype pointers
    sort-config.yaml         # Central display-order manifest (FR20)
    sort-config.schema.json  # JSON Schema for the manifest
  hooks/                     # useFilterState, etc.
  lib/                       # content-parser, schema (Zod), sort-utils, markdown-renderer
scripts/
  sync-content.ts            # Pre-build sync for remote/source_path artifacts
  generate-icons.js          # Favicon/app-icon generation via sharp
_bmad/                       # BMad Method agent/workflow definitions (the "how")
_bmad-output/                # Planning + implementation artifacts (the "why")
public/                      # Static assets and generated icons
```

## Adding a New Project

```bash
npm run new-project -- my-project --title "My Project"
```

That creates the overview, a first Blueprints row and a Build Lab card, and adds the project to `sort-config.yaml`. Fill in the frontmatter, add docs under `docs/`, and open a PR. No React or CSS changes needed.

The full guide, including the frontmatter reference, how to publish a plan and weekly changelog, and what must never be committed to a public repo, is in [`docs/AUTHORING.md`](docs/AUTHORING.md).

Copied the setup and have thoughts? [Open a feedback issue](https://github.com/dsickles/PlanSpecBuildWorkshop_bmad/issues/new?template=feedback.yml).

## Deploying

The site is set up for [Vercel](https://vercel.com) (see `vercel.json`):

```
framework: nextjs
buildCommand: npm run build
installCommand: npm install
outputDirectory: .next
```

Connect the GitHub repo to Vercel and every push to `main` triggers a fresh SSG build. Any other static/edge host that runs `npm run build` will work too.

## Learn More

- [`_bmad-output/planning-artifacts/prd.md`](_bmad-output/planning-artifacts/prd.md) — full product requirements for this site
- [`_bmad-output/planning-artifacts/architecture.md`](_bmad-output/planning-artifacts/architecture.md) — system architecture & decisions
- [`_bmad-output/planning-artifacts/ux-design-specification.md`](_bmad-output/planning-artifacts/ux-design-specification.md) — UX spec
- [`_bmad/`](_bmad/) — the BMad Method workflows and agents that produced the above
