---
# 1. Core Identity
title: "Specifications"
date: "2026-09-21"
status: "WIP"
artifact_type: "doc"
description: "Eight Spec Kit specifications (01–08) defining the Family Wall Dashboard product: core/security, calendar engine, weather engine, layout/widgets, month view, week/day views, filter bar, and idle reset."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
  tech_stack: []
---

# Family Wall Dashboard Specifications

This document contains all eight Spec Kit specifications for the Family Wall Dashboard, from core scaffolding through kiosk polish. Each specification was built before implementation, following Spec-Driven Development principles.

---

## 01 — Core Scaffolding, PWA Shell & PIN-Gate Security

**Feature ID**: `01-core-and-security`
**Created**: 2026-09-21
**Status**: Phase 1 / 1.5 human review complete

This specification covers the bootable PWA shell, environment-driven config, type contracts, PIN-gate, explicit relock, demo-mode fallback, health probe, and Docker packaging. Calendar engine, weather engine, and dashboard widgets are out of scope.

### Overview

A portfolio visitor or new developer clones the public repo, copies nothing into `.env.local`, and runs the dev server. The dashboard loads immediately with no PIN prompt. Sample calendars ("Alex", "Jordan", "Family", "School") are available as data. No family secrets exist in the tree.

An operator sets `DASHBOARD_PIN` and at least one `CAL_*_URL`. The iPad (or any browser) cannot see the dashboard or data APIs until the correct PIN is entered on a touch PIN pad. A valid session lasts 30 days via an httpOnly cookie.

### Key Requirements

**PIN-Gate Architecture**
- Middleware inspects the `dash_session` httpOnly cookie on every request except the skip list
- Missing or invalid cookie redirects to `/unlock` for page routes
- Protected API routes MUST NOT return calendar or weather payloads without a valid cookie
- `POST /api/auth/unlock` accepts JSON `{ pin: string }`, compares against `DASHBOARD_PIN` using server-side hash, and on success sets `dash_session`
- Rate limiter tracks `{ count, resetAt }` per client IP in a `Map`, capping 5 failures per 15 minutes
- Unlock page presents a 3×4 touch PIN pad (digits 0–9, backspace, submit), error shake on failure
- In demo mode, middleware allows all requests through without a cookie

**Explicit Relock**
- `POST /api/auth/lock` calls `clearSessionCookie()`, returns 200
- Live mode renders a lock control: Lucide `Lock` icon, minimum 44×44pt hit target, bottom-left of viewport
- Tap opens confirm overlay with Cancel as default/larger action and Lock as confirming action
- The control is hidden in demo mode
- Idle timers MUST NEVER invoke this endpoint

**PWA & Kiosk Shell**
- `app/manifest.ts` returns manifest with `name: "Family Wall Dashboard"`, `display: "standalone"`, `orientation: "landscape"`
- Root layout metadata includes Apple web-app capable, `statusBarStyle: "black-translucent"`, and non-scalable cover viewport
- `globals.css` imports Tailwind v4 and applies kiosk resets
- At 1180×820 landscape, the shell has no document scrollbar, no overscroll bounce, and no pinch-zoom

**Environment & Health**
- `lib/config.ts` exports `getCalendarSources()`, `getDashboardConfig()`, and `isDemoMode()`
- Type files implement data contracts: `CalendarSource`, `DashboardConfig`, `RawIcsEvent`, `UnifiedEvent`, `WeatherData`, `CalendarViewMode`, `CalendarViewState`
- `GET /api/health` is unauthenticated and returns `{ status: "ok", mode: "live" | "demo", timestamp: string }`

---

## 02 — Calendar Data Engine (Server-Side)

**Feature ID**: `02-calendar-engine`
**Created**: 2026-09-21
**Status**: Implemented 2026-09-21

This specification covers only the server-side calendar pipeline: in-memory cache, date-window helpers, ICS fetch/parse, RRULE expansion, timezone normalization, a committed mock fixture, and `GET /api/calendar` returning unified events.

### Overview

A portfolio visitor or developer runs the app with no `CAL_*_URL` values. `GET /api/calendar` succeeds without a PIN and returns the existing demo generator output, not a live ICS fetch.

An operator has set at least one `CAL_*_URL` (and the existing PIN-gate). The server fetches each enabled feed, parses it with `node-ical`, expands recurrences inside a sliding window, normalizes timestamps to the dashboard timezone, and returns `UnifiedEvent[]` for the wall to consume.

Feeds time out, 404, or contain malformed ICS. The appliance must still return events from healthy feeds, and if every fetch fails it must return the last successful payload even when the cache TTL has expired.

### Key Requirements

**Cache**
- `lib/calendar-cache.ts` implements an in-memory `Map<string, { data: UnifiedEvent[]; expiresAt: number }>` with TTL `get` / `set` / `invalidate`
- Default TTL is 600 seconds from `cacheRevalidateSeconds`
- Cache keys are a hash of enabled feed identity plus the date-window bounds
- `get` returns fresh data; provide expired last-known read for stale serve; prune expired keys on set/fresh-get

**Date Window & Helpers**
- `lib/date-utils.ts` exports: `getWindowStart`, `getWindowEnd`, `getWeekBounds`, `getDayBounds`, `formatTime`, `isSameDay`, `getWeeksInRange`
- Window helpers interpret "today" in the dashboard timezone
- The calendar engine's fetch window is **−7 days** through **+45 days** from dashboard-local today

**Engine**
- `lib/calendar-engine.ts` exports `fetchAndParseCalendars(sources, windowStart, windowEnd)`
- HTTP(S) feeds are fetched with `fetch` and an 8-second `AbortController` timeout
- ICS text is parsed with `node-ical` async `parseICS`
- For each VEVENT with an rrule, the engine expands with `rrule.between(windowStart, windowEnd)`, then applies EXDATE filtering and RECURRENCE-ID overrides
- All occurrence timestamps are normalized to the dashboard timezone
- `icsUrl` MUST NOT appear on `UnifiedEvent` or the HTTP envelope

**API Route**
- `app/api/calendar/route.ts` `GET`: check cache → on miss call the engine → cache successful combined results → return JSON
- Demo mode short-circuits to `generateDemoEvents()` without the ICS engine
- JSON envelope: `{ events: UnifiedEvent[], fetchedAt: string, stale: boolean, cache: "hit" | "miss" | "stale", errors: [] }`
- HTTP status is 200 for empty, partial, stale, and full success

---

## 03 — Weather Data Engine (Server-Side)

**Feature ID**: `03-weather-engine`
**Created**: 2026-09-21
**Status**: Implemented 2026-09-21

This specification covers only the server-side weather pipeline: a 30-minute in-memory cache, an Open-Meteo forecast fetch with no API key, a WMO code lookup, and `GET /api/weather` returning `WeatherData`.

### Overview

An operator or a demo-mode clone requests `GET /api/weather`. The server calls Open-Meteo with the configured latitude and longitude (defaults: Scarsdale, NY), transforms the forecast into `WeatherData`, and returns current conditions plus a daily forecast. No weather API key exists.

The forecast host times out, returns a non-OK status, or returns a body that cannot be mapped. The appliance returns the last successful `WeatherData` even if the 30-minute TTL has expired. With no prior success, it still returns HTTP 200 and an empty weather slot plus an error reason.

### Key Requirements

**Cache**
- `lib/weather-cache.ts` follows the calendar-cache pattern: one process `Map`, TTL `get` / `set` / `invalidate`, fresh `get` returning `null` when missing or expired, and a stale read that returns last-known data after expiry
- Stored value is `WeatherData`. Default TTL is **1800** seconds
- `buildWeatherCacheKey` hashes latitude, longitude, timezone, temperature unit, wind unit, and forecast day count

**WMO Codes**
- `lib/wmo-codes.ts` exports `describeWeatherCode(code: number): { label: string; icon: string }` with labels and Lucide icon names
- Clear sky → Sun, Partly cloudy → CloudSun, Rain → CloudRain, Snow → CloudSnow, Thunderstorm → CloudLightning
- Unknown codes use `Unknown` / `Cloud`

**Engine**
- `lib/weather-engine.ts` exports a server-only function that fetches Open-Meteo and returns either `{ weather: WeatherData }` or `{ weather: null, reason }`
- Uses an 8-second timeout
- Query parameters include current conditions, daily forecast (7 days), temperature/wind units, timezone
- No API key parameter

**API Route**
- `app/api/weather/route.ts` `GET`: build the cache key from config → fresh hit returns cached `WeatherData` → miss calls the engine → success sets the cache → total failure serves stale last-known or `weather: null`
- Demo and live use the same fetch path
- Envelope: `{ weather: WeatherData | null, stale: boolean, cache: "hit" | "miss" | "stale", errors: [] }`
- Content negotiation: prefer HTML only when `Accept` includes `text/html`
- HTML shows location, current conditions, and at least three daily rows
- `Cache-Control: s-maxage=1800, stale-while-revalidate=600`

---

## 04 — Base Layout and Ambient Widgets

**Feature ID**: `04-layout-widgets`
**Created**: 2026-09-22
**Status**: Implemented 2026-09-22

This specification covers the kiosk shell on `/`: a header clock, a header weather widget, and the existing lock control. The region under the header stays empty. Month, week, and day calendars, the filter bar, and the idle view-reset are out of scope.

### Overview

A glance from about 3 feet sees a dark full-screen dashboard. The clock and the weather sit in a header. Nothing on the page scrolls the document. In live mode the existing lock control stays bottom-left. In demo mode it stays hidden.

The header clock shows the time and the date in the dashboard timezone. The default is 12-hour with AM/PM. The clock updates when the displayed minute changes and does not use `setInterval`.

The weather widget reads `GET /api/weather` through SWR and paints the current condition with a Lucide icon. Day and night may swap the clear-sky icons using `current.isDay`. A short strip shows today and the next two forecast days.

### Key Requirements

**Shell**
- `app/page.tsx` stays a Server Component and renders a shell plus the existing lock rule
- `components/layout/DashboardShell.tsx` lays out a header (clock start, weather end) and a flexible empty main that fills the rest of the fixed viewport
- At 1180×820 the header and the empty main together stay inside the viewport with zero document scroll

**Display Props**
The only config values passed into client components are: `timezone`, `timeFormat`, `temperatureUnit`, `locationName`

**Clock**
- `components/widgets/ClockWidget.tsx` is a Client Component
- Displays `formatTime` and a date line
- The clock loop is `requestAnimationFrame`. State updates only when the formatted time or formatted date changes. No `setInterval`

**Weather Widget**
- `lib/hooks/useWeather.ts` exports a client hook using SWR against `GET /api/weather` with `refreshInterval` 1_800_000
- `components/widgets/WeatherWidget.tsx` is a Client Component
- Icon resolution: `Sun` → `Moon` when `isDay === false`, `CloudSun` → `CloudMoon` when `isDay === false`, all other icons unchanged
- Current conditions show location name, rounded temperature, condition label, and one icon
- Forecast strip shows `daily.slice(0, 3)`: short weekday, day icon, rounded high and low

---

## 05 — Rolling 4-Week Month View

**Feature ID**: `05-month-view`
**Created**: 2026-09-22
**Status**: Implemented 2026-09-22

This specification fills the empty main under the existing header with a rolling 4-week month grid. The grid is anchored on today in the dashboard timezone. Weeks start on Sunday when `WEEK_START_DAY=0`. Events come from `GET /api/calendar` through SWR.

### Overview

A glance from about 3 feet sees the same dark shell as Phase 4, plus a month grid in the space under the header. The grid is 4 rows of 7 days. With the default `WEEK_START_DAY=0`, the first column is Sunday. The week that contains today is the first row, and the next three weeks follow. Today is marked.

The grid reads `GET /api/calendar` through SWR and paints each in-range event's title and calendar color on every grid day the event overlaps. Events outside the 28 days stay off the grid even though the API window is wider (−7 / +45).

### Key Requirements

**Shell**
- `app/page.tsx` passes `timezone` and `weekStartDay` into the month view
- `components/layout/DashboardShell.tsx` keeps the header and renders a `main` slot
- At 1180×820 the header and the 4-week grid together stay inside the viewport with zero document scroll

**Grid**
- `components/calendar/MonthView.tsx` is a Client Component with props `timezone` and `weekStartDay`
- It computes today with `Intl` in `timezone`. The 28 cells start at `getWeekBounds(today, weekStartDay, timezone).start`
- The grid is 7 columns and 4 week rows, plus a single weekday label row
- Each cell shows its dashboard day-of-month. The cell for today is marked
- The zoned-date loop is `requestAnimationFrame`. No `setInterval`

**Events**
- `lib/hooks/useCalendar.ts` exports a client hook using SWR against `GET /api/calendar` with `refreshInterval` 600_000
- Before the existing overlap tests, the `events` array is placed using half-open overlap with `getDayBounds`
- In-cell order is `startTime` then `id`
- A chip shows `title` (single line, ellipsis) and `calendarColor` as a left border or swatch
- Cells use `overflow: hidden`. No day-view or week-view affordance

---

## 06 — Week View and Day View

**Feature ID**: `06-week-day-views`
**Created**: 2026-09-22
**Status**: Implemented 2026-09-22

This specification adds week view and day view. From the month grid, a tap opens that day. Week view opens only from that day, and it is the only surface allowed to scroll, and only inside its time grid.

### Overview

**How you move between views**
- Month grid → tap a day cell → Day view
- Day view → tap Week → Week view
- Day view or Week view → Month → 4-week grid
- Week view → tap a day heading → Day view of that date

**What week view looks like**

Same header as month and day. Under the header, the main region is a week planner:
- **Month** button
- Seven day columns (Sun–Sat when `weekStartDay` is `0`). The date number is a button
- Short band under the dates holds all-day events. It does not scroll
- Hour grid is midnight through 11 PM, one row per hour. Timed events sit in the column of their day at the height of their start time
- The hour grid scrolls with `overscroll-behavior: contain`. The document, header, day names, and all-day band stay put

Day view is the one date, a Month button, a Week button, then a vertical list of that day's events. That list does not scroll.

### Key Requirements

**View Machine**
- `components/calendar/CalendarViewMachine.tsx` is a Client Component holding `CalendarViewState`
- Initial value is `mode: "month"`, `anchorDate: ""`, `activeFilters: []`, `lastInteractionAt: 0`
- The machine renders one of `MonthView`, `DayView`, or `WeekView` for the current `mode`
- `.kiosk-stage` fills the viewport at 1180×820, 1366×1024, and 1920×1080. Below 1180×820 on either edge, the stage scales the 1180×820 layout down

**Month Cells**
- `MonthView` gains a required `onSelectDay: (dateKey: string) => void`
- Activating a cell calls it with that cell's `YYYY-MM-DD`

**Day View**
- `components/calendar/DayView.tsx` receives `timezone`, `timeFormat`, `weekStartDay`, `selectedDay`, `onShowMonth`, `onShowWeek`
- The day toolbar: Month button, the selected date, and a Week button. Both buttons are at least 44×44pt
- Events that overlap the selected day: all-day events first, then timed events with `formatTime` start and end
- Each row shows `title`, `calendarColor`, `calendarLabel`, and `location` when non-empty
- The view uses `overflow: hidden`

**Week View**
- `components/calendar/WeekView.tsx` receives `timezone`, `timeFormat`, `weekStartDay`, `selectedWeekStart`, `onShowMonth`, `onSelectDay`
- Composition: Month button; seven day-heading buttons; the all-day band; the time grid scroller
- The scroller is the only overflow other than `hidden`: `overflow-y: auto`, `overflow-x: hidden`, `overscroll-behavior: contain`
- Time grid is 24 hour rows of 48px plus an hour gutter
- Each timed event is absolutely positioned from its zoned start minute and duration
- On mount, set `scrollTop` once so the current hour sits one row below the top (or hour 7 if the week doesn't contain today)

---

## 07 — Filter Bar

**Feature ID**: `07-filter-bar`
**Created**: 2026-09-22
**Status**: Implemented 2026-09-22

This specification adds a filter bar. Each chip is one calendar from the events `GET /api/calendar` already returned: its label and its `calendarColor`. The chips subset those events by `calendarId`. They do not refetch and they do not add query parameters.

### Overview

**Where the chips sit**

The header is one row: clock on the left, current weather and the 3-day forecast on that same row, `LockControl` at the far right.

The chips are a single 28px row in the main column, directly under that header and directly above the current view (4-week, week, or day). The row is labeled **Filters:** and then one entry per calendar: a filled dot in `calendarColor` and the `calendarLabel`. It does not wrap, does not scroll, and does not grow past 28px.

The week time grid remains the only element that uses `overflow: auto` or `overflow: scroll`. The chip row uses `overflow: hidden`.

### Key Requirements

**Filter Model**
- `lib/calendar-filters.ts` is client-safe. It exports `calendarsFromEvents`, `isCalendarShown`, `eventsMatchingFilters`, and `toggleCalendar`
- `calendarsFromEvents` returns one `{ id, label, color }` per distinct `calendarId`, in first-seen order
- `eventsMatchingFilters` returns the input events when `activeFilters` is `[]`. Otherwise it returns events whose `calendarId` is in `activeFilters`
- `toggleCalendar` hides a shown calendar and shows a hidden one. From `[]`, hiding one calendar stores the other calendar ids

**Filter Bar**
- `components/calendar/FilterBar.tsx` is a Client Component with props `activeFilters` and `onChange`
- It reads calendars through the existing `useCalendar` hook
- The root is a group named "Filters", `h-7 shrink-0 overflow-hidden`, one row, no wrap
- Each calendar is a button with a filled dot in `calendarColor` and the `calendarLabel`. `aria-pressed` is true while that calendar is shown

**View Machine & Views**
- `CalendarViewMachine` keeps the initial state `mode: "month"`, `anchorDate: ""`, `activeFilters: []`, `lastInteractionAt: 0`
- It renders `FilterBar` above the active view. `onChange` replaces `activeFilters` only
- Navigation preserves the current `activeFilters`
- `MonthView`, `DayView`, and `WeekView` each gain a required `activeFilters: string[]` prop
- Each still calls `useCalendar` with no query string. Before overlap tests, the `events` array is replaced by `eventsMatchingFilters(events, activeFilters)`

---

## 08 — Calendar Idle Reset and Kiosk Polish

**Feature ID**: `08-idle-reset`
**Created**: 2026-09-22
**Status**: Draft — awaiting review

This specification does two things. After 90 seconds with no pointer or touch activity, Week or Day view returns to the 4-week month grid anchored on today. The session stays unlocked. A horizontal swipe changes the day or the week.

### Overview

**Idle Reset**

`idleTimeoutMs` already exists on `getDashboardConfig()` (default `90_000`). `app/page.tsx` may pass that number as a prop.

After `idleTimeoutMs` with no pointer or touch:
- **Week view or Day view**: The main region becomes the 4-week month grid anchored on today. `activeFilters` unchanged. URL stays. `dash_session` unchanged.
- **Month view already showing**: The grid stays. Filters stay. No navigation, no lock request.
- **Any view**: No `POST /api/auth/lock`. No navigation to `/unlock`. PIN pad does not appear.

Activity that restarts the wait: `pointerdown` inside the calendar machine, `wheel` inside the calendar machine.

One `setTimeout` implements the wait. It is cleared on activity, on return to month, and on unmount.

**Horizontal Swipe**

The chevrons stay, and they stay the tap controls. A swipe is a second way to call the same previous and next actions.

| View | Swipe surface | Leftward swipe | Rightward swipe |
|------|---------------|----------------|-----------------|
| Day | The event list under the toolbar | Next day | Previous day |
| Week | The day-header row and the all-day band only | Next week | Previous week |
| Month | None | No period change | No period change |

A swipe counts only when, on `pointerup`, the horizontal travel is at least 48 CSS pixels and its absolute value is greater than the absolute vertical travel.

The week time grid is not a swipe surface. A drag that begins there does not change the week.

### Key Requirements

**Idle**
- `app/page.tsx` reads `getDashboardConfig().idleTimeoutMs` and passes that number to `CalendarViewMachine`
- `CalendarViewMachine` accepts `idleTimeoutMs: number`. A prop that is not a finite number greater than 0 is replaced with `90_000`
- User-driven updates set `lastInteractionAt` to `Date.now()`
- While `mode` is `"week"` or `"day"`, the machine arms one timeout for the remaining time until `lastInteractionAt + idleTimeoutMs`
- `pointerdown` and `wheel` inside the machine root restart that wait
- When the timeout fires, if the mode is still `"week"` or `"day"`, the machine sets `mode` to `"month"` and leaves `activeFilters` unchanged
- While `mode` is `"month"`, no idle timeout is armed

**Swipe**
- Day view recognizes a horizontal swipe on the event list. At least 48 CSS pixels of horizontal travel, with absolute horizontal travel greater than absolute vertical travel, calls `onNextDay` or `onPreviousDay`
- Week view recognizes that same swipe on the day-header row and the all-day band, calling `onNextWeek` or `onPreviousWeek`
- The "Week hours" scroller is excluded
- Month view and the filter row do not change period on a horizontal drag
- Swipe uses pointer events. No new dependency and no Framer Motion
