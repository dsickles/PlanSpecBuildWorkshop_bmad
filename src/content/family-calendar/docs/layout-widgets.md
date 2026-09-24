---
# 1. Core Identity
title: "Layout & Widgets"
date: "2026-09-22"
status: "WIP"
artifact_type: "doc"
description: "Base layout and ambient widgets: the kiosk shell on / with a header clock, header weather widget, and lock control. No document scroll."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
  tech_stack: []
---

# Specification: Base Layout and Ambient Widgets

**Feature ID**: `04-layout-widgets`
**Created**: 2026-09-22
**Status**: Implemented 2026-09-22

This specification covers the kiosk shell on `/`: a header clock, a header weather widget, and the existing lock control. The region under the header stays empty. Month, week, and day calendars, the filter bar, and the idle view-reset are out of scope.

## Overview

A glance from about 3 feet sees a dark full-screen dashboard. The clock and the weather sit in a header. Nothing on the page scrolls the document. In live mode the existing lock control stays bottom-left. In demo mode it stays hidden.

The header clock shows the time and the date in the dashboard timezone. The default is 12-hour with AM/PM (`TIME_FORMAT` unset or `12h`, timezone `America/New_York`). The clock updates when the displayed minute changes and does not use `setInterval`.

The weather widget reads `GET /api/weather` through SWR and paints the current condition with a Lucide icon. Day and night may swap the clear-sky icons using `current.isDay`. A short strip shows today and the next two forecast days. If the forecast is missing, the header says weather is unavailable and the clock stays up.

## Key Requirements

### Shell

- `app/page.tsx` stays a Server Component. It reads `getDashboardConfig()` / `isDemoMode()` and renders a shell plus the existing lock rule (`demo ? null : <LockControl />`)
- `components/layout/DashboardShell.tsx` lays out a header (clock start, weather end) and a flexible empty main (`min-h-0 flex-1`) that fills the rest of the fixed viewport
- At 1180×820 the header and the empty main together stay inside the viewport with zero document scroll
- The same composition at 1366×1024 and 1920×1080 stretches with the viewport and still has zero document scroll
- `LockControl` remains the component from Phase 1.5

### Display Props

The only config values passed into client components are:

- `timezone` from `getDashboardConfig().timezone`
- `timeFormat` from `getDashboardConfig().timeFormat`
- `temperatureUnit` from `getDashboardConfig().temperatureUnit`
- `locationName` from `getDashboardConfig().location.displayName`

Do not pass `latitude`, `longitude`, `idleTimeoutMs`, `cacheRevalidateSeconds`, calendar sources, or `icsUrl`.

### Clock

- `components/widgets/ClockWidget.tsx` is a Client Component. Props are `timezone` and `timeFormat`
- It displays `formatTime` from `lib/date-utils.ts` and a date line (`weekday: "long"`, `month: "long"`, `day: "numeric"`, `timeZone` = the prop, locale `en-US`)
- The clock loop is `requestAnimationFrame`. State updates only when the formatted time or formatted date changes. Cleanup cancels the frame. No `setInterval`
- Default appearance is 12-hour. The time is the largest text on the shell (at least `text-5xl`)

### Weather Widget

- `lib/hooks/useWeather.ts` exports a client hook that uses SWR against `GET /api/weather`. The fetcher sends `Accept: application/json` and returns `WeatherApiResponse`. `refreshInterval` is 1_800_000
- `components/widgets/WeatherWidget.tsx` is a Client Component. It reads that hook
- Icon resolution is local to the widget: `Sun` → `Moon` when `isDay === false`, `CloudSun` → `CloudMoon` when `isDay === false`, all other icons unchanged
- Current conditions show location name, rounded temperature with unit suffix, condition label, and one icon
- The forecast strip shows `daily.slice(0, 3)`: short weekday from the `YYYY-MM-DD` date in `timezone`, that day's icon (day icon; forecast rows have no `isDay`), rounded high and low
- Loading keeps the slot from collapsing. `weather: null` or a fetch error renders a muted "Weather unavailable" message

## Success Criteria

- At 1180×820 landscape, `/` shows a clock and a weather widget on a dark full-viewport shell with zero document scroll
- Default config shows a 12-hour clock (AM/PM) and the calendar date in `America/New_York`
- The clock updates on the minute via `requestAnimationFrame` and does not use `setInterval`
- The weather widget shows live `WeatherApiResponse` data from SWR: location name, current temperature and condition, a Lucide icon, and up to three daily rows
- `isDay === false` renders `Moon` for code 0 and `CloudMoon` for code 2
- A null or failed forecast shows "Weather unavailable" without removing the clock or scrolling the document
- Demo mode hides the lock control. Live mode still shows the existing bottom-left lock control
- Client props and bundles add no PIN, no ICS URL, and no latitude/longitude
