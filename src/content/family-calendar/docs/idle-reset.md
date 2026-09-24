---
# 1. Core Identity
title: "Idle Reset"
date: "2026-09-22"
status: "WIP"
artifact_type: "doc"
description: "Calendar idle reset and kiosk polish: after 90 seconds with no pointer/touch activity, Week or Day returns to the today-anchored month view. Horizontal swipe changes day or week."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
  tech_stack: []
---

# Specification: Calendar Idle Reset and Kiosk Polish

**Feature ID**: `08-idle-reset`
**Created**: 2026-09-22
**Status**: Draft — awaiting review

This specification does two things. After 90 seconds with no pointer or touch activity, Week or Day view returns to the 4-week month grid anchored on today. The session stays unlocked. A horizontal swipe changes the day or the week. The chevrons stay. The swipe must not fight the week time grid, which remains the only scroller.

## Overview

### Idle Reset

`idleTimeoutMs` already exists on `getDashboardConfig()` (default `90_000` from `IDLE_TIMEOUT_MS`). `app/page.tsx` may pass that number as a prop.

`lastInteractionAt` is already on `CalendarViewState` and is forced to `0` on every update. This phase writes the client timestamp (`Date.now()`) when the operator touches the calendar.

| After `idleTimeoutMs` with no pointer or touch | What happens | What stays |
|-----------------------------------------------|--------------|------------|
| Week view or Day view | The main region becomes the 4-week month grid anchored on today | `activeFilters` unchanged. URL stays. `dash_session` unchanged. |
| Month view already showing | The grid stays. Filters stay. Selected dates in state are not rewritten. | No navigation, no lock request. |
| Any view | | No `POST /api/auth/lock`. No navigation to `/unlock`. PIN pad does not appear. |

Activity that restarts the wait:

- `pointerdown` inside the calendar machine (chips, chevrons, day cells, week headers, the week time grid, the day list)
- `wheel` inside the calendar machine (scrolling the week time grid with a wheel)

One `setTimeout` implements the wait. It is cleared on activity, on return to month, and on unmount.

### Horizontal Swipe

The chevrons stay, and they stay the tap controls. A swipe is a second way to call the same previous and next actions.

| View | Swipe surface | Leftward swipe | Rightward swipe |
|------|---------------|----------------|-----------------|
| Day | The event list under the toolbar | Next day (`stepDay(1)`) | Previous day (`stepDay(-1)`) |
| Week | The day-header row and the all-day band only | Next week (`stepWeek(1)`) | Previous week (`stepWeek(-1)`) |
| Month | None | No period change | No period change |

A swipe counts only when, on `pointerup`, the horizontal travel is at least 48 CSS pixels and its absolute value is greater than the absolute vertical travel.

The week time grid is not a swipe surface. A drag that begins there does not change the week. Vertical scrolling of that grid stays intact.

## Key Requirements

### Idle

- `app/page.tsx` stays a Server Component. It reads `getDashboardConfig().idleTimeoutMs` and passes that number to `CalendarViewMachine`
- `CalendarViewMachine` accepts `idleTimeoutMs: number`. A prop that is not a finite number greater than 0 is replaced with `90_000`
- User-driven updates set `lastInteractionAt` to `Date.now()`. They keep the current `activeFilters` on navigation
- While `mode` is `"week"` or `"day"`, the machine arms one timeout for the remaining time until `lastInteractionAt + idleTimeoutMs`
- `pointerdown` and `wheel` inside the machine root restart that wait and set `lastInteractionAt` to `Date.now()`
- When the timeout fires, if the mode is still `"week"` or `"day"`, the machine sets `mode` to `"month"` and `lastInteractionAt` to `Date.now()`, and leaves `activeFilters`, `selectedDay`, and `selectedWeekStart` as they were
- The fire path does not fetch, does not call `POST /api/auth/lock`, and does not route to `/unlock`
- While `mode` is `"month"`, no idle timeout is armed. Unmount clears the pending timeout

### Swipe

- Day view recognizes a horizontal swipe on the event list under `ViewToolbar`. At least 48 CSS pixels of horizontal travel, with absolute horizontal travel greater than absolute vertical travel, on `pointerup`, calls the existing `onNextDay` or `onPreviousDay`
- Week view recognizes that same swipe on the day-header row and the all-day band, calling `onNextWeek` or `onPreviousWeek`
- The "Week hours" scroller is excluded. A gesture that begins in that scroller does not change `selectedWeekStart`
- Month view and the filter row do not change period on a horizontal drag
- A qualifying swipe suppresses the click on the element that received `pointerdown`
- Swipe uses pointer events. No new dependency and no Framer Motion

## Success Criteria

- On week view and on day view, 90 seconds without a pointer press or a wheel returns the 4-week grid anchored on today. A hidden calendar is still hidden
- On month view, the same 90 seconds leaves the grid, the filters, and the URL in place
- Across all three, the network shows no `POST /api/auth/lock` and the page does not become `/unlock`
- A qualifying horizontal swipe on the day list steps one day. The same swipe on the week day headers or the all-day band steps one week
- A drag that begins in the week time grid does not step the week, and that grid still scrolls vertically with `overscroll-behavior: contain`
- Client bundles gain the numeric timeout only. They still contain no PIN, no ICS URL, and no latitude or longitude
- The pending timeout is cleared on unmount
