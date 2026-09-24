---
# 1. Core Identity
title: "Week & Day Views"
date: "2026-09-22"
status: "WIP"
artifact_type: "doc"
description: "Week view and day view: tap month days to open that day, tap Week to see the hour grid for that week, contained vertical scroll only in the week time grid."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
  tech_stack: []
---

# Specification: Week View and Day View

**Feature ID**: `06-week-day-views`
**Created**: 2026-09-22
**Status**: Implemented 2026-09-22

This specification adds week view and day view. From the month grid, a tap opens that day. Week view opens only from that day, and it is the only surface allowed to scroll, and only inside its time grid. Events come from the existing `GET /api/calendar` SWR hook (`CalendarApiResponse`). Week start stays Sunday when `WEEK_START_DAY=0`. The filter bar and the idle view-reset are out of scope.

## Overview

### How you move between views

The month grid has no Week control. Week view is the second step.

- Month grid → tap a day cell → Day view
- Day view → tap Week → Week view
- Day view or Week view → Month → 4-week grid
- Week view → tap a day heading (the date number) → Day view of that date

### What week view looks like

Same header as month and day: clock on the left, current weather and the 3-day forecast on that row, lock at the far right (hidden in demo mode). Under the header, the main region is a week planner:

- **Month** button
- Seven day columns (Sun–Sat when `weekStartDay` is `0`). The date number is a button. Today's column is marked
- Short band under the dates holds all-day events (title and calendar color). It does not scroll. Extra chips clip
- Hour grid is midnight through 11 PM, one row per hour, with the hour written in the gutter. Timed events sit in the column of their day at the height of their start time
- A finger or wheel moves that hour grid only. The document, the header, the day names, and the all-day band stay put. The grid uses `overscroll-behavior: contain`
- On open, the grid is already scrolled near the current hour when this week contains today, and near 7 AM otherwise

Day view is not a grid. It is the one date, a Month button, a Week button, then a vertical list of that day's events. That list does not scroll.

### Layout sizes

1180×820 is the primary design size. When the frame is at least 1180×820 on both edges, `.kiosk-stage` is `width: 100%` and `height: 100%` with no scale transform. When either edge is below the primary size, `.kiosk-stage` is a 1180×820 box scaled by `min(100cqw / 1180px, 100cqh / 820px)` and centered.

## Key Requirements

### View Machine

- `components/calendar/CalendarViewMachine.tsx` is a Client Component. Props are `timezone: string`, `weekStartDay: 0 | 1`, and `timeFormat: "12h" | "24h"`
- It holds a `CalendarViewState`. The initial value is `mode: "month"`, `anchorDate: ""`, `activeFilters: []`, `lastInteractionAt: 0`, with `selectedDay` and `selectedWeekStart` unset
- The machine renders one of `MonthView`, `DayView`, or `WeekView` for the current `mode`. Month view keeps deriving its 28 days from today
- `.kiosk-stage` follows Layout sizes. At 1180×820, 1366×1024, and 1920×1080 the stage fills the frame with no scale transform. Below 1180×820 on either edge, the stage is the 1180×820 box scaled down and centered

### Month Cells

- `MonthView` gains a required `onSelectDay: (dateKey: string) => void`. Activating a cell calls it with that cell's `YYYY-MM-DD`
- The component otherwise keeps its current data and layout behavior

### Day View

- `components/calendar/DayView.tsx` is a Client Component. It receives `timezone`, `timeFormat`, `weekStartDay`, `selectedDay`, `onShowMonth`, and `onShowWeek`
- It calls `useCalendar`
- The day toolbar is a row: a Month button (`onShowMonth`), the selected date, and a Week button (`onShowWeek`). Both buttons are at least 44×44pt
- Events that overlap the selected day: all-day events first (labeled "All day", without a clock range), then timed events with `formatTime` start and end
- Each row shows `title`, `calendarColor` as a left border, `calendarLabel`, and `location` when `location` is non-empty. `description` is omitted
- The view uses `overflow: hidden`

### Week View

- `components/calendar/WeekView.tsx` is a Client Component. It receives `timezone`, `timeFormat`, `weekStartDay`, `selectedWeekStart`, `onShowMonth`, and `onSelectDay`
- It calls `useCalendar`
- Composition, top to bottom: Month button; seven day-heading buttons; the all-day band; the time grid scroller
- The scroller is the only overflow other than `hidden`. It uses `overflow-y: auto`, `overflow-x: hidden`, and `overscroll-behavior: contain`
- Time grid is 24 hour rows of 48px (1152px of content) plus an hour gutter. Hour labels use `formatTime` and `timeFormat` at minute 00
- Each timed event is absolutely positioned from its zoned start minute and its duration, with a minimum block height of 22px, a truncated `title`, and `calendarColor`
- The week contains today: set `scrollTop` once so the current zoned hour sits one row below the top. Otherwise: set `scrollTop` once to hour 7
- A day heading activates: day view opens for that column's `YYYY-MM-DD`

## Success Criteria

- At 1180×820, tapping a month day opens day view for that dashboard date, and Month returns to the today-anchored 4-week grid. The document does not scroll
- Today's day view in demo mode lists "Standup" with a 12-hour time range and calendar color `#6366f1`
- Week view is reached only by tapping Week on a day. It shows seven days starting Sunday, an all-day band that does not scroll, and an hour grid that does
- That grid's `overscroll-behavior` is `contain`. Scrolling it leaves the document scroll position at 0
- Tapping a date number opens that day
- The header row and `LockControl` behavior are unchanged. `.kiosk-stage` fills the frame at the three defined sizes and scales down only below 1180×820
- Client props and bundles add no PIN, no ICS URL, and no latitude/longitude
