# Authoring guide

Everything on the site is a markdown file in `src/content/`. There is no CMS and no database. You add or change a file, open a pull request, and the site rebuilds when it merges.

This guide covers how to add a project, what each frontmatter field does, how to publish a project's plan and weekly progress, and the checks that run before anything goes live. If you forked the repo to make your own workshop, this is the page to start from.

## Add a project

```bash
npm run new-project -- my-project --title "My Project"
```

That creates:

```
src/content/my-project/
  index.md                 the project overview
  docs/coming-soon.md      the first Blueprints row
  prototypes/index.md      the Build Lab card
```

and adds `my-project` to the `blueprints`, `build_lab` and `projects` lists in `src/content/sort-config.yaml`.

The new project starts as a `Concept` with `publish: "none"`. Fill in the description and taxonomy, then run `npm run dev` to see it. Adding a project should never need React or CSS changes. If it does, that's a bug in the site, not in your content.

The slug becomes the project's URL (`/my-project`), so it must be lowercase words joined by hyphens. A few names are taken by the site itself: `tools`, `about`, `changelog` and `_shared`.

## Where files go

| Folder | Shows up in | Notes |
| --- | --- | --- |
| `src/content/<slug>/index.md` | Project pill, project page | One per project. |
| `src/content/<slug>/docs/*.md` | Blueprints column | Planning docs: PRD, architecture, specs. |
| `src/content/<slug>/prototypes/*.md` | Build Lab column | Links out to demos and repos. |
| `src/content/<slug>/status/` | Plan panel, Changelog | Plan and week notes. See [Publish progress](#publish-progress). |
| `src/content/_shared/agents/*.md` | Agent Studio column | Tools shared across projects. Never add per-project `agents/` folders. |
| `src/content/sort-config.yaml` | Display order everywhere | Entries are filename stems. Anything not listed sorts alphabetically after the listed items. |

## Frontmatter

Every content file starts with frontmatter in three commented groups, in this order:

```yaml
---
# 1. Core Identity
title: "Document Title"
date: "2026-10-27"
status: "Live"          # Live | WIP | Concept | Archived
artifact_type: "doc"    # agent | doc | prototype (optional; inferred from the folder)
description: "One sentence shown on cards and in link previews."
source_path: "_bmad-output/planning-artifacts/prd.md"   # optional
publish: "full"         # project index.md only: full | status | none

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

`src/lib/schema.ts` is the authority on these fields. A file that fails it renders as an `[Error]` card instead of breaking the site, and `npm run dev` prints the reason.

| Field | What it does |
| --- | --- |
| `title` | Card and page heading. |
| `date` | `YYYY-MM-DD`. |
| `status` | The coloured pill. `Concept` cards are dashed. |
| `artifact_type` | Overrides the type the folder implies. Rarely needed. |
| `description` | Card summary and the text in link previews. |
| `source_path` | Pulls the body from another file in the repo, relative to the repo root. Absolute paths and `..` are rejected. If the target is missing, the page shows a notice instead of an empty body. |
| `publish` | Project `index.md` only. Controls what of the project's progress is public. |
| `taxonomy.domain` | The Domain filter pills. |
| `taxonomy.tech_stack` | The Tech filter pills. |
| `relations.projects` | For shared agents: which projects used the tool. |
| `links` | `label` and `url` pairs. Build Lab uses them for the demo and repo buttons. |

Don't add an `order` field. Order lives in `sort-config.yaml`.

Write `{{PROJECT_NAME}}` instead of a project's title in its own docs. The site swaps in the current title, so renaming a project doesn't leave stale copies behind.

## Publish progress

A project can show a plan with milestones and a weekly changelog. What's public is set by `publish` in the project's `index.md`:

| `publish` | Plan panel | Changelog | Status files allowed in the repo |
| --- | --- | --- | --- |
| `full` | Milestones with summaries | Week notes with every change | `plan.md` and `week-*.md` |
| `status` | Milestone names, states and dates only | Nothing | `plan.md` only |
| `none` (default) | Nothing | Nothing | None |

Leaving `publish` out means `none`. The repo is public, so `none` means the status files must not be committed at all, not just hidden. The publish check enforces this.

### status/plan.md

```yaml
---
title: "Plan"
updated: "2026-10-29"
milestones:
  - name: "Safety net"
    state: "done"          # done | active | planned | paused
    started: "2026-10-18"  # optional
    finished: "2026-10-26" # optional
    summary: "CI on every PR, Dependabot and a protected main branch."  # optional
---
```

A plan needs at least one milestone. The panel shows "X of Y milestones done" and a progress bar.

### status/week-YYYY-MM-DD.md

One file per week. The date in the file name must match `week`.

```yaml
---
title: "A safety net, then a bigger ambition"
week: "2026-10-26"
author: "Gates"            # optional: who wrote the note
changes:
  - date: "2026-10-26"
    title: "Added CI on every PR"
    kind: "shipped"        # shipped | changed | fixed | reverted | cut | started | decided
    approach:              # optional; every field is optional
      issue: "DAS-100"     # shown as text, never linked
      tool: "Claude Code"
      pr: "https://github.com/owner/repo/pull/7"
      result: "https://example.org/the-thing"
---

**What moved:** a short paragraph or two in markdown.
```

`kind` is how the changelog shows the messy middle: `reverted` and `cut` belong there as much as `shipped`. The `approach` fields are the visible "how": which issue asked for it, which tool did it, the PR, and a link to the result.

Issue IDs are shown as plain text because the tracker is private. Put a public URL in `pr` or `result` instead.

## What must never be committed

The repo is public. Everything under `src/content/` is published, whether or not the site renders it. Keep out:

- personal email addresses, phone numbers and home addresses
- API keys, tokens, passwords and private keys
- calendar feed links (`webcal://`, `.ics` URLs, Google Calendar iCal links)
- URLs carrying `token=`, `key=`, `sig=` or similar
- real PINs or access codes

Use demo data instead: `@example.com` addresses, made-up names, and screenshots of demo accounts.

## Checks before merge

CI runs these on every pull request. Run them locally first:

```bash
npm run lint
npx tsc --noEmit
npm run publish-check   # private data and publish settings
npm test                # unit tests
npm run build           # static build
npm run e2e             # smoke tests and accessibility scan, after a build
```

**Publish check** (`scripts/publish-check.ts`) scans every file under `src/content/` for the private data listed above, and checks each project's status files against its `publish` setting and the schema. If it flags something that is genuinely fine to publish, add the exact matched text to `scripts/publish-check.allow`.

**Smoke tests and accessibility scan** (`e2e/`) open the built site in Chromium, click through the grid, filters, documents, changelog and shareable pages, and run axe against each view in light and dark mode. Serious or critical WCAG 2.1 AA problems fail the build.

**Demo check** (`scripts/check-demos.ts`) runs nightly. It opens every link on every `Live` prototype and fails if one doesn't answer. It reports only: changing a prototype's status is still your call. Run it any time with `npm run check-demos`.

## Shareable pages

Every project, blueprint and Agent Studio tool gets its own page with a link preview:

| Content | URL |
| --- | --- |
| Project overview | `/<slug>` |
| Blueprint | `/<slug>/<file-stem>` (`docs/index.md` becomes `/overview`) |
| Agent Studio tool | `/tools/<file-stem>` |

Pages are generated from the content, so a new file gets a page with no extra work. Set `NEXT_PUBLIC_SITE_URL` if you deploy somewhere other than the default URL, so link previews and the sitemap point at your site.

## Feedback

Copied the setup and found something confusing or missing? [Open a feedback issue](https://github.com/dsickles/PlanSpecBuildWorkshop_bmad/issues/new?template=feedback.yml).
