---
# 1. Core Identity
title: "AI Digest"
date: "2026-05-24"
status: "WIP"

# 2. Taxonomy
taxonomy:
  domain:
    - "AI Content Curation"
  tech_stack:
    - "Python"
    - "Astro"
    - "SQLite"
    - "Gemini"
---

A personal weekly AI digest pipeline. Ingests a curated set of RSS feeds, YouTube channels, and newsletters; summarizes, dedups, categorizes, and ranks each item with Gemini; and publishes a "Sunday morning read" as a dark-themed Astro dashboard with full archive.

Built end-to-end with the **GSD** (Get Shit Done) planning system, driven by **Cursor**. Phases 1–4 of 5 are shipping; Phase 5 (unattended weekly automation with a residential-IP worker for YouTube transcript catch-up and a cloud-scheduled publish pipeline) is the remaining slice.
