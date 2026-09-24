---
# 1. Core Identity
title: "Family Calendar"
date: "2026-09-21"
status: "WIP"
artifact_type: "prototype"
description: "An ad-free, zero-subscription family wall calendar PWA for touch-first full-screen kiosk. Fed by ICS calendars and local weather, built with Spec Kit + Cursor."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
  tech_stack:
    - "Next.js"
    - "TypeScript"
    - "React"
    - "Tailwind CSS"
    - "Docker"
    - "PWA"

# 3. Relations & Connectivity
relations:
  projects: []
links:
  - label: "GitHub"
    url: "https://github.com/dsickles/FamilyCalendar"
---

An ad-free, zero-subscription family wall calendar: a modular, touch-first, full-screen PWA that a household can glance at from about three feet. Think Cozi or DAKboard, without a monthly bill.

This is a wall appliance, not a general website and not a SaaS product. A public clone boots **demo mode** with sample events. A live install (Docker on a home NAS, or optionally Vercel) loads private ICS calendars and local weather behind a PIN-gate.

**Note**: There is no public prototype URL for this project — it's a private family kiosk, not a live demo. The source of truth is the [public GitHub repository](https://github.com/dsickles/FamilyCalendar), where the core shell, PWA packaging, PIN-gate, demo data, and Docker deployment are shipped. Calendar engine, weather engine, and the ambient month/week/day UI are still landing.
