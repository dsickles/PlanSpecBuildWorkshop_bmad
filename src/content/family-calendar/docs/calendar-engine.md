---
# 1. Core Identity
title: "Calendar Engine"
date: "2026-09-21"
status: "WIP"
artifact_type: "doc"
description: "Server-side calendar data pipeline: in-memory cache, ICS fetch/parse, RRULE expansion, timezone normalization, and unified event API."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
  tech_stack: []
---

# Specification: Calendar Data Engine (Server-Side)

**Feature ID**: `02-calendar-engine`
**Created**: 2026-09-21
**Status**: Implemented 2026-09-21

This specification covers only the server-side calendar pipeline: in-memory cache, date-window helpers, ICS fetch/parse, RRULE expansion, timezone normalization, a committed mock fixture, and `GET /api/calendar` returning unified events. Weather, SWR hooks, and month/week/day UI are out of scope.

## Overview

A portfolio visitor or developer runs the app with no `CAL_*_URL` values. `GET /api/calendar` succeeds without a PIN and returns the existing demo generator output (`generateDemoEvents()`), not a live ICS fetch.

An operator has set at least one `CAL_*_URL` (and the existing PIN-gate). The server fetches each enabled feed, parses it with `node-ical`, expands recurrences inside a sliding window, normalizes timestamps to the dashboard timezone, and returns `UnifiedEvent[]` for the wall to consume later.

Feeds time out, 404, or contain malformed ICS. The appliance must still return events from healthy feeds, and if every fetch fails it must return the last successful payload even when the cache TTL has expired.

## Key Requirements

### Cache

- `lib/calendar-cache.ts` implements an in-memory `Map<string, { data: UnifiedEvent[]; expiresAt: number }>` with TTL `get` / `set` / `invalidate`
- Default TTL is 600 seconds from `cacheRevalidateSeconds`
- Cache keys MUST be a hash of enabled feed identity plus the date-window bounds
- `get` returns `null` on miss, returns data on fresh hit, and exposes a way for the route to read expired last-known data when every feed fails (stale serve)
- Expired keys are pruned on write and on fresh-hit reads

### Date Window & Helpers

- `lib/date-utils.ts` exports: `getWindowStart(today, offsetDays)`, `getWindowEnd(today, offsetDays)`, `getWeekBounds(date, weekStartDay)`, `getDayBounds(date)`, `formatTime(date, format)`, `isSameDay(a, b)`, `getWeeksInRange(start, end)`
- Window helpers used by the engine interpret "today" in the dashboard timezone
- The calendar engine's fetch window is **−7 days** through **+45 days** from dashboard-local today
- Custom window query parameters are out of scope (unbounded cache keys)

### Engine

- `lib/calendar-engine.ts` exports `fetchAndParseCalendars(sources: CalendarSource[], windowStart: Date, windowEnd: Date): Promise<UnifiedEvent[]>`
- HTTP(S) feeds are fetched with `fetch` and an 8-second `AbortController` timeout
- ICS text is parsed with `node-ical` async `parseICS`
- For each VEVENT with an rrule, the engine expands with `rrule.between(windowStart, windowEnd)`, then applies EXDATE filtering and RECURRENCE-ID overrides
- All occurrence timestamps are normalized to the dashboard timezone before building `UnifiedEvent.startTime` / `endTime` (ISO 8601)
- Output is sorted by `startTime` ascending
- Deterministic `UnifiedEvent.id` is `` `${calendarId}::${uid}::${occurrenceDate.toISOString()}` ``
- `icsUrl` MUST NOT appear on `UnifiedEvent` or the HTTP envelope
- `fixture:<basename>` URLs resolve only to files inside `lib/__fixtures__/`

### API Route

- `app/api/calendar/route.ts` `GET`: check cache → on miss call the engine → cache successful combined results → return JSON
- Demo mode short-circuits to `generateDemoEvents()` without the ICS engine
- JSON envelope: `{ events: UnifiedEvent[], fetchedAt: string, stale: boolean, cache: "hit" | "miss" | "stale", errors: Array<{ calendarId, calendarLabel, reason }> }`
- HTTP status is 200 for empty, partial, stale, and full success
- Response includes `Cache-Control: s-maxage=<cacheRevalidateSeconds>, stale-while-revalidate=300`
- The route stays behind the existing PIN-gate

### Fixture

- `lib/__fixtures__/mock.ics` contains 10–15 events mixing timed singles, all-day, recurring daily, and recurring weekly with at least one EXDATE
- It is the only committed ICS and MUST NOT include live family feed hosts

## Success Criteria

- In demo mode, `GET /api/calendar` returns demo events without a session cookie and without contacting external calendar hosts
- In live mode, the same route returns expanded `UnifiedEvent` objects for the −7 / +45 window, including recurring occurrences, with no `icsUrl` in the payload
- A second request within 10 minutes is served from memory (no duplicate ICS fetch)
- One timed-out or malformed feed still yields events from healthy feeds within the per-feed 8-second budget
- When all feeds fail after a successful fetch, the previous event list is still returned (`stale: true`)
- Client-destined types and the calendar JSON contain no PIN and no ICS URLs
