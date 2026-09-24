---
# 1. Core Identity
title: "Month View"
date: "2026-09-22"
status: "WIP"
artifact_type: "doc"
description: "Rolling 4-week month grid anchored on today: shows 28 consecutive days starting Sunday, draws events that overlap the visible period, no document scroll."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
  tech_stack: []
---

# Specification: Rolling 4-Week Month View

**Feature ID**: `05-month-view`
**Created**: 2026-09-22
**Status**: Implemented 2026-09-22

This specification fills the empty main under the existing header with a rolling 4-week month grid. The grid is anchored on today in the dashboard timezone. Weeks start on Sunday when `WEEK_START_DAY=0`. Events come from `GET /api/calendar` through SWR as `CalendarApiResponse`. Each drawn event shows its title and calendar color. Week view, day view, the filter bar, and the idle view-reset are out of scope.

## Overview

A glance from about 3 feet sees the same dark shell as Phase 4, plus a month grid in the space under the header. The grid is 4 rows of 7 days. With the default `WEEK_START_DAY=0`, the first column is Sunday. The week that contains today is the first row, and the next three weeks follow. Today is marked. The document does not scroll.

The grid reads `GET /api/calendar` through SWR and paints each in-range event's title and calendar color on every grid day the event overlaps. Events outside the 28 days stay off the grid even though the API window is wider (−7 / +45). A failed fetch leaves the day numbers up and says the calendar is unavailable. A stale payload still shows its events.

## Key Requirements

### Shell

- `app/page.tsx` stays a Server Component. It still reads `getDashboardConfig()` and renders `demo ? null : <LockControl />`
- It passes the existing clock and weather props unchanged. It additionally passes `timezone` and `weekStartDay` into the month view
- `components/layout/DashboardShell.tsx` keeps the header (clock start, weather end) and renders a `main` slot in the existing `min-h-0 flex-1 overflow-hidden` region
- At 1180×820 the header and the 4-week grid together stay inside the viewport with zero document scroll
- The same composition at 1366×1024 and 1920×1080 stretches with the viewport and still has zero document scroll

### Grid

- `components/calendar/MonthView.tsx` is a Client Component. Props are `timezone: string` and `weekStartDay: 0 | 1`
- It computes today with `Intl` in `timezone`. The 28 cells start at `getWeekBounds(today, weekStartDay, timezone).start` and step with `getWindowStart`
- The grid is 7 columns and 4 week rows, plus a single weekday label row derived from those seven dates (`en-US`, `weekday: "short"`)
- Each cell shows its dashboard day-of-month. The cell for today is marked (background or ring) so it is distinguishable without color alone
- The grid uses equal fractional rows (`min-h-0`) so four weeks always fit the main
- The zoned-date loop is `requestAnimationFrame`. State updates only when the `YYYY-MM-DD` in `timezone` changes. Cleanup cancels the frame. No `setInterval`

### Events

- `lib/hooks/useCalendar.ts` exports a client hook that uses SWR against `GET /api/calendar`. The fetcher sends `Accept: application/json` and returns `CalendarApiResponse`. `refreshInterval` is 600_000
- `MonthView` reads that hook. Before the existing overlap tests, the `events` array is placed using half-open overlap with `getDayBounds`
- In-cell order is `startTime` then `id`
- A chip shows `title` (single line, ellipsis) and `calendarColor` as a left border or swatch. Chip text stays on the dark surface. Chips are not interactive
- Cells use `overflow: hidden`. No day-view or week-view affordance
- Loading keeps the day grid. A fetch error with no `events` array renders a muted "Calendar unavailable" message inside the main
- `stale: true` or feed `errors` with an `events` array still render that array. `events: []` renders an empty grid

## Success Criteria

- At 1180×820 landscape, `/` shows the existing clock and weather header plus a 4-week grid anchored on today, week starting Sunday, with zero document scroll and no cell scrollbar
- Demo mode shows titles and calendar colors for events that overlap the 28 visible days
- The calendar request is SWR `GET /api/calendar` with `Accept: application/json`, refresh 600_000 ms, parsed as `CalendarApiResponse`
- A failed fetch shows "Calendar unavailable" without removing the clock, the weather widget, or the day grid's ability to stay inside the viewport
- After the zoned date changes, the window moves to the new today without `setInterval`. The animation frame is cancelled on unmount
- Demo mode hides the lock control. Live mode still shows the existing bottom-left lock control
- Client props and bundles add no PIN, no ICS URL, and no latitude/longitude. `icsUrl` is absent from the calendar JSON
