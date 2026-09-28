---
# 1. Core Identity
title: "Tasks"
date: "2026-09-21"
status: "Live"
artifact_type: "doc"
description: "Eight Spec Kit task documents (01–08) implementing the Family Wall Dashboard: core/security, calendar engine, weather engine, layout/widgets, month view, week/day views, filter bar, and idle reset."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
  tech_stack: []
---

# Family Wall Dashboard Tasks

This document contains all eight Spec Kit task implementations for the Family Wall Dashboard, from core scaffolding through kiosk polish. Tasks are organized in phases, with each phase blocked by verification gates that must pass before the next phase begins.

---

## 01 — Core Scaffolding, PWA Shell & PIN-Gate Security

**Input**: `.spec/specifications/01-core-and-security.md`
**Status**: Phase 1 / 1.5 human review complete 2026-09-21

**Organization**: Phase 1 (scaffold) then Phase 1.5 (auth). Phase 1.5 depends on Phase 1 files existing.

### Phase 1: Project Scaffolding & Configuration

**Purpose**: Bootable Next.js project with Tailwind v4, type definitions, env loader, PWA shell, kiosk CSS, icons, and Docker-ready Next config.

- **T001** [US3] Step 1.1 — Scaffold Next.js project at repository root
- **T002** Step 1.2 — Install runtime dependencies `node-ical swr framer-motion lucide-react` and dev dependency `@types/node`
- **T003** [US3] Step 1.3 — Configure Tailwind v4 in `postcss.config.mjs` and `app/globals.css`
- **T004** [P] [US1] Step 1.4 — Create type definitions in `lib/types/`
- **T005** [US1] Step 1.5 — Create env-based config loader in `lib/config.ts`
- **T006** [P] [US1] Step 1.6 — Create committed `.env.example`
- **T007** [P] [US1] Step 1.7 — Create/update `.gitignore`
- **T008** [US3] Step 1.8 — Set up PWA manifest in `app/manifest.ts` and Apple/viewport meta
- **T009** [US3] Step 1.9 — Apply kiosk CSS resets to `app/globals.css`
- **T010** [P] [US3] Step 1.10 — Generate PWA icons
- **T011** [US4] Step 1.11 — Configure Next.js for Docker: `output: "standalone"`

**Pass criteria**: Dev server boots without errors. Visiting `/` shows a blank dark page. Manifest route returns standalone + landscape. At 1180×820: no document scrollbar, no overscroll. `.env.example` tracked; `.env.local` is gitignored.

### Phase 1.5: Authentication & Security Scaffolding

**Purpose**: PIN-gate middleware protecting all routes, unlock page, explicit relock, demo mode fallback, health probe, and Docker packaging.

- **T012** [P] [US2] Step 1.5.1 — Implement auth utilities in `lib/auth.ts`
- **T013** [US1] [US2] Step 1.5.2 — Implement `middleware.ts`: check `dash_session` on every request
- **T014** [US2] Step 1.5.3 — Implement `app/api/auth/unlock/route.ts` `POST`
- **T015** [US2] Step 1.5.4 — Build `app/unlock/page.tsx` touch-optimized PIN pad
- **T016** [P] [US1] Step 1.5.5 — Implement `lib/demo-data.ts` `generateDemoEvents()`
- **T017** [P] [US4] Step 1.5.6 — Implement `app/api/health/route.ts` `GET`
- **T018** [US4] Step 1.5.7 — Create `Dockerfile` and `docker-compose.yml`
- **T019** [US5] Step 1.5.8 — Implement `app/api/auth/lock/route.ts` `POST`
- **T020** [US5] Step 1.5.9 — Build `components/layout/LockControl.tsx` and mount it

**Pass criteria**: Demo mode (no `CAL_*_URL`) loads without PIN. Live (PIN + `CAL_*_URL`) redirects to `/unlock`. Correct PIN sets `dash_session`. Wrong PIN 5 times rate-limits. Explicit relock works. Idle does not PIN-lock. `GET /api/health` always returns 200. Client bundle has no PIN, no ICS URL.

---

## 02 — Calendar Data Engine (Server-Side)

**Input**: `.spec/specifications/02-calendar-engine.md`
**Status**: Implemented 2026-09-21

**Purpose**: Working `GET /api/calendar` that returns `UnifiedEvent[]` inside `CalendarApiResponse` from demo data, `fixture:mock.ics`, or real ICS feeds, with RRULE expansion, TZ normalize, and a 10-minute memory cache.

### Phase 2: Calendar Data Engine

- **T021** [P] [US4] Step 2.1 — Implement calendar cache in `lib/calendar-cache.ts`
- **T022** [P] [US2] Step 2.2 — Implement date utilities in `lib/date-utils.ts`
- **T023** [P] [US5] Step 2.5 — Add mock ICS fixture `lib/__fixtures__/mock.ics`
- **T024** [US2] [US3] [US5] Step 2.3 — Implement calendar engine in `lib/calendar-engine.ts`
- **T025** [US1] [US2] [US3] [US4] Step 2.4 — Implement `app/api/calendar/route.ts` `GET`
- **T026** [US1] [US2] [US4] [US5] Step 2.6 — Verification only

**Pass criteria**: Demo API returns ~25–30 events without a cookie. Live + `fixture:mock.ics` expands recurring events. Envelope is `CalendarApiResponse` with no `icsUrl`. Cache hit on second GET within TTL. Partial feeds return events + error metadata. Stale serve works. Timeout fails in ≤ 8s. Client bundles and calendar JSON have no PIN and no ICS URLs.

---

## 03 — Weather Data Engine (Server-Side)

**Input**: `.spec/specifications/03-weather-engine.md`
**Status**: Implemented 2026-09-21

**Purpose**: Working `GET /api/weather` that returns `WeatherData` inside `WeatherApiResponse` from Open-Meteo (no API key), with a 30-minute memory cache and a readable browser page.

### Phase 3: Weather Data Engine

- **T027** [P] [US3] Step 3.1 — Implement weather cache in `lib/weather-cache.ts`
- **T028** [P] [US5] Step 3.2 — Implement WMO lookup in `lib/wmo-codes.ts`
- **T029** [P] [US1] [US2] Step 3.3 — Implement the Open-Meteo engine in `lib/weather-engine.ts`
- **T030** [US1] [US2] [US3] [US4] Step 3.4 — Implement `app/api/weather/route.ts` `GET`
- **T031** [US1] [US2] [US3] [US4] [US5] Step 3.5 — Verification only

**Pass criteria**: `GET /api/weather` returns current conditions and ≥ 3-day forecast from Open-Meteo, no API key. Demo mode (no `CAL_*_URL`) returns payload without a cookie. Cache hit on second GET within 30 minutes. Stale serve works. Browser GET shows readable HTML. WMO codes map correctly. JSON payload and client bundles contain no PIN and no ICS URL.

---

## 04 — Base Layout and Ambient Widgets

**Input**: `.spec/specifications/04-layout-widgets.md`
**Status**: Implemented 2026-09-22

**Purpose**: Kiosk shell on `/` with a clock and a weather widget inside the 1180×820 bound, zero document scroll. Lock control stays bottom-left and hidden in demo mode.

### Phase 4: Base Layout and Ambient Widgets

- **T032** [P] [US2] Step 4.1 — Implement `components/widgets/ClockWidget.tsx` as a Client Component
- **T033** [P] [US3] Step 4.2 — Implement `lib/hooks/useWeather.ts` and `components/widgets/WeatherWidget.tsx`
- **T034** [US1] [US2] [US3] Step 4.3 — Compose the shell with `components/layout/DashboardShell.tsx` and update `app/page.tsx`
- **T035** [US1] [US2] [US3] Step 4.4 — Verification only

**Pass criteria**: At 1180×820 landscape: no document scrollbar. Header has clock (start) and weather (end). Main under header is empty. Clock shows AM/PM, updates on the minute via rAF, no `setInterval`. Weather SWR shows location, current temp, WMO label, Lucide SVG, and 3 daily rows. Day/night swaps `Sun`→`Moon`, `CloudSun`→`CloudMoon`. Lock control unchanged. Client props do not include latitude, longitude, PIN, or ICS URL.

---

## 05 — Rolling 4-Week Month View

**Input**: `.spec/specifications/05-month-view.md`
**Status**: Implemented 2026-09-22

**Purpose**: Fill the empty main under the Phase 4 header with a 4-week grid anchored on today, week starting Sunday, inside the 1180×820 bound with zero document scroll.

### Phase 5: Rolling 4-Week Month View

- **T036** [US2] Step 5.1 — Implement `lib/hooks/useCalendar.ts` as a client hook
- **T037** [US1] [US2] Step 5.2 — Implement `components/calendar/MonthView.tsx` as a Client Component
- **T038** [US1] [US2] Step 5.3 — Mount the grid in the existing shell
- **T039** [US1] [US2] Step 5.4 — Verification only

**Pass criteria**: At 1180×820 landscape: no document scrollbar, no cell scrollbar. Exactly 4 week rows and 7 columns. Default config: first column Sunday, first day is the Sunday of the current week, today is marked and lies on the 28-day span. SWR request is `GET /api/calendar` with JSON accept. In-range demo events show `title` and `calendarColor`. Chips clip inside the cell. Date roll uses rAF, not `setInterval`. Lock and header unchanged. Client props do not include latitude, longitude, PIN, `idleTimeoutMs`, or ICS URL.

---

## 06 — Week View and Day View

**Input**: `.spec/specifications/06-week-day-views.md`
**Status**: Implemented 2026-09-22

**Purpose**: From the month grid, a tap opens that day. Week is the next tap. It shows that day's Sunday-start week as seven columns, an all-day band, and a 24-hour grid. Contained vertical scroll exists only in that hour grid.

### Phase 6: Week View and Day View

- **T040** [P] [US2] Step 6.1 — Implement `components/calendar/DayView.tsx` as a Client Component
- **T041** [P] [US3] Step 6.2 — Implement `components/calendar/WeekView.tsx` as a Client Component
- **T042** [US1] [US2] [US3] Step 6.3 — Wire navigation with `components/calendar/CalendarViewMachine.tsx`
- **T043** [US1] [US2] [US3] Step 6.4 — Verification only

**Pass criteria**: At 1180×820: no document scrollbar. Stage fills viewport. Month-day tap opens that day. Month returns to 4×7 grid. Day shows events with time and color. Week path: open day, then activate Week → seven columns, all-day band (no scroll), hour grid (scrolls). Week scroll: `scrollHeight` > client height, `overscroll-behavior: contain`, scrolling it leaves document scroll at 0. Week to day: activating today's week heading opens that day. Header unchanged. No filter chips, no idle timer. Client props do not include `idleTimeoutMs`. `.kiosk-stage` no longer uses `scale(min(1, …))`.

---

## 07 — Filter Bar

**Input**: `.spec/specifications/07-filter-bar.md`
**Status**: Implemented 2026-09-22

**Purpose**: One chip per calendar (dot + label) subsets the events already returned by `GET /api/calendar`. They do not refetch and they do not add query parameters. 28px row under the header.

### Phase 7: Filter Bar

- **T044** [P] [US2] Step 7.1 — Add `lib/calendar-filters.ts`
- **T045** [P] [US1] Step 7.2 — Add `components/calendar/FilterBar.tsx` as a Client Component
- **T046** [P] [US2] Step 7.3 — Teach `MonthView` to filter before it places chips
- **T047** [P] [US2] Step 7.3 — Teach `DayView` the same filter
- **T048** [P] [US2] Step 7.3 — Teach `WeekView` the same filter
- **T049** [US1] [US2] Step 7.4 — Mount the bar and stop clearing the filter on navigation
- **T050** [US1] [US2] Step 7.5 — Verification only

**Pass criteria**: At 1180×820 on 4-week, week, and day: no document scrollbar. Filter row is one 28px line, labeled "Filters:", one button per calendar with dot in `calendarColor`, each ≥ 44×44pt. Toggling a calendar subsets events without refetching. Filter survives navigation. `lastInteractionAt` not updated. Week grid still scrolls (`overscroll-behavior: contain`). Client props do not include `idleTimeoutMs`. Navigation unchanged.

---

## 08 — Calendar Idle Reset and Kiosk Polish

**Input**: `.spec/specifications/08-idle-reset.md`
**Status**: Draft — awaiting review

**Purpose**: After `idleTimeoutMs` (default 90_000) with no pointer or touch activity, Week or Day returns to the today-anchored 4-week grid. Month view and the session cookie stay put. A horizontal swipe steps the day or the week.

### Phase 8: Idle Reset and Kiosk Polish

- **T051** [US1] Step 8.1 — Pass the timeout number into the machine via `app/page.tsx`
- **T052** [US1] Step 8.2 — Arm the view-reset and stop writing `lastInteractionAt: 0` on user actions
- **T053** [P] [US2] Step 8.3 — Swipe the day list
- **T054** [P] [US2] Step 8.3 — Swipe the week chrome only
- **T055** [US1] [US2] Step 8.4 — Verification only

**Pass criteria**: At 1180×820 on month, week, and day after swipe and idle return: no document scrollbar. Idle from week: after configured timeout, the main region is the 4-week grid. Hidden calendar stays hidden. No `GET /api/calendar` sent. Idle from day: after quiet wait, today-anchored 4-week grid returns. Idle on month: mode stays month, no jump. Session: URL stays, no `POST /api/auth/lock`, no `/unlock`. Day swipe: leftward drag ≥ 48px (more horizontal than vertical) opens next day. Week swipe: same drag on day-header/all-day band steps week. Week grid drag does not change range, still scrolls. Client props add only `idleTimeoutMs` number.
