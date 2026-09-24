---
# 1. Core Identity
title: "Weather Engine"
date: "2026-09-21"
status: "WIP"
artifact_type: "doc"
description: "Server-side weather pipeline: 30-minute in-memory cache, Open-Meteo forecast fetch with no API key, WMO code lookup, and weather data API."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
  tech_stack: []
---

# Specification: Weather Data Engine (Server-Side)

**Feature ID**: `03-weather-engine`
**Created**: 2026-09-21
**Status**: Implemented 2026-09-21

This specification covers only the server-side weather pipeline: a 30-minute in-memory cache, an Open-Meteo forecast fetch with no API key, a WMO code lookup, and `GET /api/weather` returning `WeatherData`. Layout, weather widgets, and SWR hooks are out of scope.

## Overview

An operator or a demo-mode clone requests `GET /api/weather`. The server calls Open-Meteo with the configured latitude and longitude (defaults: Scarsdale, NY `40.9892`, `-73.7944`), transforms the forecast into `WeatherData`, and returns current conditions plus a daily forecast. No weather API key exists.

The forecast host times out, returns a non-OK status, or returns a body that cannot be mapped. The appliance returns the last successful `WeatherData` even if the 30-minute TTL has expired. With no prior success, it still returns HTTP 200 and an empty weather slot plus an error reason.

## Key Requirements

### Cache

- `lib/weather-cache.ts` follows the `lib/calendar-cache.ts` pattern: one process `Map`, TTL `get` / `set` / `invalidate`, fresh `get` returning `null` when missing or expired, and a stale read that returns last-known data after expiry
- Stored value is `WeatherData`. Default TTL is **1800** seconds
- `buildWeatherCacheKey` hashes latitude, longitude, timezone, temperature unit, wind-speed unit, and forecast day count

### WMO Codes

- `lib/wmo-codes.ts` exports `describeWeatherCode(code: number): { label: string; icon: string }` with labels and Lucide icon names
- Unknown codes use `Unknown` / `Cloud`
- Clear sky → Sun, Partly cloudy → CloudSun, Rain → CloudRain, Snow → CloudSnow, Thunderstorm → CloudLightning, etc.

### Engine

- `lib/weather-engine.ts` exports a server-only function that fetches Open-Meteo and returns either `{ weather: WeatherData }` or `{ weather: null, reason }`
- Uses an 8-second timeout
- Query parameters: `latitude`, `longitude`, `current` (temperature_2m, apparent_temperature, weather_code, wind_speed_10m, relative_humidity_2m, is_day), `daily` (weather_code, temperature_2m_max, temperature_2m_min, precipitation_probability_max), `temperature_unit` (fahrenheit or celsius), `wind_speed_unit` (mph if Fahrenheit, otherwise kmh), `timezone`, `forecast_days: 7`
- No API key parameter
- Mapping produces the existing `WeatherData` interface unchanged

### API Route

- `app/api/weather/route.ts` `GET`: build the cache key from config → fresh hit returns cached `WeatherData` → miss calls the engine → success sets the cache → total failure serves stale last-known or `weather: null`
- Demo and live use the same fetch path. Demo does not require a cookie (existing middleware)
- Envelope: `{ weather: WeatherData | null, stale: boolean, cache: "hit" | "miss" | "stale", errors: Array<{ reason }> }`
- HTTP status is 200 for success, stale, and total failure
- Both HTML and JSON responses send `Cache-Control: s-maxage=1800, stale-while-revalidate=600`
- Content negotiation: prefer HTML only when `Accept` includes `text/html` and `text/html` appears before `application/json`
- HTML shows location display name, current temperature and condition label, and at least three daily rows
- JSON clients receive `WeatherApiResponse`

## Success Criteria

- `GET /api/weather` returns current conditions and at least a 3-day daily forecast in `weather` (JSON), from Open-Meteo, with no API key
- Demo mode (no `CAL_*_URL`) returns that payload without a session cookie
- A second request within 30 minutes is served from memory (`cache: "hit"`) and does not call Open-Meteo again
- After a successful fetch, a failed Open-Meteo call still returns the previous `WeatherData` with `stale: true`
- A browser GET shows current conditions and at least three forecast days in dark text on a light background
- Known WMO codes map to the correct labels and Lucide names
- The JSON payload and client bundles contain no PIN and no ICS URL
