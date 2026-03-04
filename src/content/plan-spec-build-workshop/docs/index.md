---
title: "Overview"
date: "2026-02-23"
status: "WIP"
domain:
  - "Portfolio"
  - "Product Strategy"
artifact_type: "doc"
tech_stack:
  - "Next.js"
  - "TypeScript"
  - "React"
  - "Tailwind CSS"
description: "This project! The complete design and planning documentation for the {{PROJECT_NAME}} — PRD, Architecture, UX Specification, and Epics."
parent_project: "plan-spec-build-workshop"
related_docs:
  - "plan-spec-build-workshop/agents"
---

# {{PROJECT_NAME}} — Portfolio Design System

Comprehensive planning and design documentation for the **{{PROJECT_NAME}}** portfolio application — built end-to-end using the BMAD AI agent workflow.

## Documents in this Blueprint

| Document | Status | Purpose |
|---|---|---|
| Product Requirements (PRD) | ✅ Complete | User needs, functional requirements, constraints |
| Architecture | ✅ Complete | System design, data layer, component structure |
| UX Design Specification | ✅ Complete | Visual system, interaction patterns, component specs |
| Epics & Stories | ✅ Complete | Full implementation breakdown across 5 Epics |
| Implementation Readiness Report | ✅ Complete | Pre-implementation gap analysis |

## Tech Stack

The portfolio is built on a modern, statically-optimized Next.js stack:

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Content:** Markdown + YAML Frontmatter, validated with Zod
- **Parsing:** gray-matter + remark/rehype (GFM + XSS-safe)
- **Deployment:** Vercel

## Design Philosophy

The "Linear-style" dark-mode command center layout — three columns (Studio, Blueprints, Lab) — reflects the natural phases of AI-assisted product development: Plan → Spec → Build.
