---
# 1. Core Identity
title: "Filter Bar"
date: "2026-09-22"
status: "WIP"
artifact_type: "doc"
description: "Calendar filter chips: one per calendar source, subset already-fetched events by calendarId, 28px row under the header, no refetch."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
  tech_stack: []
---

# Specification: Filter Bar

**Feature ID**: `07-filter-bar`
**Created**: 2026-09-22
**Status**: Implemented 2026-09-22

This specification adds a filter bar. Each chip is one calendar from the events `GET /api/calendar` already returned: its label and its `calendarColor`. The chips subset those events by `calendarId`. They do not refetch and they do not add query parameters. `activeFilters` starts as `[]` (every calendar visible). Toggling a chip hides or shows that calendar. The idle view-reset is out of scope.

## Overview

### Where the chips sit

The header is one row: clock on the left, current weather and the 3-day forecast on that same row, `LockControl` at the far right (omitted in demo mode).

The chips are a single 28px row in the main column, directly under that header and directly above the current view (4-week, week, or day). The row is labeled **Filters:** and then one entry per calendar: a filled dot in `calendarColor` and the `calendarLabel`. It does not wrap, does not scroll, and does not grow past 28px. The view under it keeps `min-h-0 flex-1 overflow-hidden` and absorbs that 28px.

The week time grid remains the only element that uses `overflow: auto` or `overflow: scroll`. The chip row uses `overflow: hidden`.

## Key Requirements

### Filter Model

- `lib/calendar-filters.ts` is client-safe. It may import the `UnifiedEvent` type only. It MUST NOT import `lib/config.ts`, `lib/calendar-engine.ts`, `lib/calendar-cache.ts`, or any weather module
- It exports `calendarsFromEvents`, `isCalendarShown`, `eventsMatchingFilters`, and `toggleCalendar`
- `calendarsFromEvents` returns one `{ id, label, color }` per distinct `calendarId`, in first-seen order
- `eventsMatchingFilters` returns the input events when `activeFilters` is `[]`. Otherwise it returns events whose `calendarId` is in `activeFilters`
- `toggleCalendar` hides a shown calendar and shows a hidden one. From `[]`, hiding one calendar stores the other calendar ids. Showing the last hidden calendar returns `[]`

### Filter Bar

- `components/calendar/FilterBar.tsx` is a Client Component. Props are `activeFilters: string[]` and `onChange: (activeFilters: string[]) => void`
- It reads calendars through the existing `useCalendar` hook (same `/api/calendar` key, no query string)
- The root is a group named "Filters", `h-7 shrink-0 overflow-hidden`, one row, no wrap. The visible label is `Filters:`
- Each calendar is a button with a filled dot in `calendarColor` and the `calendarLabel`. `aria-pressed` is true while that calendar is shown
- A hidden calendar is dimmed
- The row MUST NOT set `overflow` to `auto` or `scroll`

### View Machine & Views

- `CalendarViewMachine` keeps the initial state `mode: "month"`, `anchorDate: ""`, `activeFilters: []`, `lastInteractionAt: 0`
- It renders `FilterBar` above the active view. `onChange` replaces `activeFilters` only. `lastInteractionAt` stays `0`
- Navigation preserves the current `activeFilters`
- `MonthView`, `DayView`, and `WeekView` each gain a required `activeFilters: string[]` prop
- Each still calls `useCalendar` with no query string. Before the existing overlap tests, the `events` array is replaced by `eventsMatchingFilters(events, activeFilters)`

## Success Criteria

- At 1180×820 the filter row is one 28px line under the unchanged header on the 4-week, week, and day views, labeled "Filters:" with one colored calendar per loaded calendar
- Turning off Alex on today's demo data hides "Standup" and "Deep work block" and keeps "Client call" (`#ec4899`), "Family dinner" (`#10b981`), and "School pickup" (`#8b5cf6`)
- Alex's dot uses `#6366f1`, the same hex as the Standup chip border. The calendar request stays `GET /api/calendar` with no query string
- `activeFilters` survives opening a day, opening a week, and returning to 4 weeks. Turning the hidden calendar back on restores its events
- `lastInteractionAt` stays `0`. Demo mode still hides the lock control
- The week time grid is still the only scroller
- Client props and bundles add no PIN, no ICS URL, and no latitude/longitude
