---
# 1. Core Identity
title: "Family Calendar"
date: "2026-09-21"
status: "Live"

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
---

An ad-free, zero-subscription family wall calendar built for a touch-first full-screen kiosk. A modular PWA designed for an always-on iPad Air mounted on the wall, running in landscape Guided Access mode, fed by private ICS calendars and local weather from Open-Meteo.

This isn't a SaaS product or a general website. It's a wall appliance. A public clone boots demo mode with sample events. A live install (Docker on a home NAS, or optionally Vercel) loads private ICS feeds and weather behind a PIN-gate. After unlock, the wall is view-only until someone explicitly locks it again.

Built with **Spec Kit** planning artifacts and developed with **Cursor**, the project is specified before it's coded. Core shell, PWA packaging, PIN-gate, demo data, health check, and Docker deployment are shipped. Calendar engine, weather engine, and the ambient month/week/day UI are still landing.

Source of truth is the [public GitHub repository](https://github.com/dsickles/FamilyCalendar). A [public portfolio demo](https://familycalendar-demo.vercel.app) shows sample events with no PIN. The real family kiosk stays private.
