---
# 1. Core Identity
title: "Core & Security"
date: "2026-09-21"
status: "WIP"
artifact_type: "doc"
description: "Core scaffolding, PWA shell, and PIN-gate security specification — the bootable kiosk surface with environment-driven config and server-side authentication."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
  tech_stack: []
---

# Specification: Core Scaffolding, PWA Shell & PIN-Gate Security

**Feature ID**: `01-core-and-security`
**Created**: 2026-09-21
**Status**: Phase 1 / 1.5 human review complete 2026-09-21

This specification covers only the bootable PWA shell, environment-driven
config, type contracts, PIN-gate, explicit relock, demo-mode fallback,
health probe, and Docker packaging. Calendar engine, weather engine, and
dashboard widgets are out of scope.

## Overview

A portfolio visitor or new developer clones the public repo, copies nothing
into `.env.local`, and runs the dev server. The dashboard loads immediately
with no PIN prompt. Sample calendars ("Alex", "Jordan", "Family", "School")
are available as data. No family secrets exist in the tree.

An operator sets `DASHBOARD_PIN` and at least one `CAL_*_URL`. The iPad
(or any browser) cannot see the dashboard or data APIs until the correct
PIN is entered on a touch PIN pad. A valid session lasts 30 days via an
httpOnly cookie.

## Key Requirements

### PIN-Gate Architecture

- Middleware inspects the `dash_session` httpOnly cookie on every request except the skip list
- Missing or invalid cookie redirects to `/unlock` for page routes
- Protected API routes MUST NOT return calendar or weather payloads without a valid cookie
- `POST /api/auth/unlock` accepts JSON `{ pin: string }`, compares against `DASHBOARD_PIN` using server-side hash, and on success sets `dash_session`
- Session token helpers in `lib/auth.ts` provide `hashPin`, `verifyPin`, `createSessionCookie`, `verifySessionCookie`, and `clearSessionCookie`
- Rate limiter tracks `{ count, resetAt }` per client IP in a `Map`, capping 5 failures per 15 minutes
- Unlock page presents a 3×4 touch PIN pad (digits 0–9, backspace, submit), error shake on failure, no PIN hints
- In demo mode (`isDemoMode() === true`), middleware allows all requests through without a cookie
- `lib/demo-data.ts` exports `generateDemoEvents(): UnifiedEvent[]` producing ~25–30 events across calendars labeled "Alex", "Jordan", "Family", and "School"

### Explicit Relock

- `POST /api/auth/lock` calls `clearSessionCookie()`, returns 200, and sits behind the PIN-gate (not on the skip list)
- In demo mode the handler no-ops with 200
- Relock is per-browser cookie, not a global NAS interlock
- Live mode renders a lock control on the dashboard shell: Lucide `Lock` icon, minimum 44×44pt hit target, bottom-left of viewport
- Tap opens confirm overlay ("Lock dashboard? PIN will be required.") with Cancel as default/larger action and Lock as confirming action
- Confirm POSTs `/api/auth/lock` then navigates to `/unlock`
- The control is hidden in demo mode
- Idle timers MUST NEVER invoke this endpoint

### PWA & Kiosk Shell

- `app/manifest.ts` returns manifest with `name: "Family Wall Dashboard"`, `display: "standalone"`, `orientation: "landscape"`, icons at `/icons/icon-192x192.png` and `/icons/icon-512x512.png`
- Root layout metadata includes title "Family Wall Dashboard", Apple web-app capable, `statusBarStyle: "black-translucent"`, and non-scalable cover viewport
- `globals.css` imports Tailwind v4 (`@import "tailwindcss"`) and applies kiosk resets
- `next.config.ts` sets `output: "standalone"`
- Visiting `/` in a booting scaffold shows a blank dark page (`#0a0a0f`) with correct meta tags
- At 1180×820 landscape, the shell has no document scrollbar, no overscroll bounce, and no pinch-zoom

### Environment & Health

- `lib/config.ts` exports `getCalendarSources()`, `getDashboardConfig()`, and `isDemoMode()`
- Type files implement the data contracts: `CalendarSource`, `DashboardConfig`, `RawIcsEvent`, `UnifiedEvent`, `WeatherData`, `CalendarViewMode`, `CalendarViewState`
- `.env.example` documents every variable with comments and empty secrets
- `.gitignore` excludes `.env.local`, `.env.*.local`, `.next/`, `out/`, `node_modules/`, `.DS_Store`
- `GET /api/health` is unauthenticated and returns `{ status: "ok", mode: "live" | "demo", timestamp: string }`
- `Dockerfile` and `docker-compose.yml` match multi-stage Node 20 Alpine, compose env_file, restart, healthcheck

## Success Criteria

- A clone with no `.env.local` reaches a dark full-viewport shell in one `npm run dev` without a PIN prompt (demo mode)
- With `DASHBOARD_PIN` and at least one `CAL_*_URL` set, unauthenticated visitors cannot see dashboard HTML or calendar/weather API data
- Five wrong PIN submissions from one IP within 15 minutes lock out further attempts until the window resets
- After a confirmed lock, this browser requires the PIN again; Cancel and idle time do not
- Demo mode shows no lock control and never forces `/unlock`
- Client JavaScript contains no PIN, no ICS URLs, and no `DASHBOARD_PIN` string from env
