---
# 1. Core Identity
title: "Beads"
date: "2026-09-24"
status: "Concept"
artifact_type: "agent"
description: "Distributed graph issue tracker that provides persistent memory for coding agents, replacing markdown plans with dependency-aware task graphs powered by Dolt."

# 2. Taxonomy
taxonomy:
  domain:
    - "AI DevTools"
  tech_stack: []

# 3. Relations & Connectivity
relations:
  projects: []
links:
  - label: "Website"
    url: "https://yegge.ai/essays/introducing-beads-a-coding-agent-memory-system/"
  - label: "GitHub"
    url: "https://github.com/gastownhall/beads"
---

# Beads

Distributed graph issue tracker that provides persistent memory for coding agents, replacing markdown plans with dependency-aware task graphs powered by Dolt. Created by Steve Yegge, the `bd` CLI tracks issues with first-class dependencies, ready-work detection, atomic claiming, and audit history. Agents use `bd ready`, `bd show`, `bd update --claim`, and `bd remember` to maintain context across sessions without losing track of long-horizon work.
