---
# 1. Core Identity
title: "PRD"
date: "2026-05-24"
status: "WIP"
artifact_type: "doc"
description: "Product Requirements Document for Focus Blocks — a calm daily planning workspace built around intentional focus."

# 2. Taxonomy
taxonomy:
  domain:
    - "Productivity"
    - "Daily Planning"
    - "Personal Workflow"
  tech_stack:
    - "React"
    - "TypeScript"
    - "Tailwind CSS"
    - "Vite"
---

# Focus Blocks — Product Requirements Document

## Product Overview

Focus Blocks is a calm daily planning workspace designed around intentional focus rather than productivity optimization.

The product helps users answer two simple questions:

- What matters today?
- When will you make time for it?

Users define up to three meaningful priorities for the day, then reserve focused time for those priorities using a structured daily timeline.

The experience should feel calm, spacious, reflective, and lightweight. The product intentionally avoids the complexity, permanence, and guilt-inducing mechanics commonly found in modern productivity software.

This is not a task management system, project tracker, or productivity dashboard.

It is a temporary daily workspace for intentional planning.

## Core Product Philosophy

- Attention is finite.
- Priorities become commitments when time is reserved for them.
- Every day should begin fresh.
- The product should feel calm, not urgent.
- Simplicity is a feature, not a limitation.
- Reflection matters more than optimization.
- The interface should reduce cognitive load, not increase it.

## Core Constraints

These constraints are intentional product decisions and should be preserved.

### The app should NOT include

- Authentication
- User accounts
- Backend / database
- Cloud sync
- AI integrations
- Notifications
- Gamification
- Streaks
- Analytics dashboards
- Collaboration / team functionality
- Recurring tasks
- Project management features
- Multi-day planning
- Calendar integrations

## Technical Requirements

- Frontend-only application
- Built with React
- Responsive design
- Local storage only
- Data persists only for the current day
- Automatically resets at midnight local time
- Smooth drag-and-drop interactions
- Dark mode default
- Light mode optional

## Core User Experience

### Initial Experience

When opening the app, the user sees a calm workspace divided into two areas:

#### Left Side — Priorities

Reflective and intentional.

#### Right Side — Timeline

Structured and action-oriented.

The layout should feel balanced, spacious, and quiet.

### Main Layout

#### Top Navigation

Very minimal navigation bar.

- **Left:** App name — "Focus Blocks"
- **Right:** Current date, theme toggle (dark / light)

No additional navigation.

## Left Panel — Priorities

### Section Header

- **Heading:** "What matters today?"
- **Supporting Text:** "Choose up to three priorities worth making space for."

### Priority List

Users can create up to 3 priorities.

Each priority card contains:

- Title
- Optional description
- Optional estimated duration
- Scheduling status
- Completion toggle

Cards should feel tactile, calm, and paper-like.

### Priority Card States

#### Unscheduled

Should feel unresolved but not negative.

Visual treatment:

- Slightly muted appearance
- Subtle dashed or low-opacity border
- Small label: "Needs time reserved"

#### Scheduled

Should feel grounded and committed.

Visual treatment:

- Slightly stronger contrast
- Solid border or subtle tonal fill
- Connected visually to timeline blocks

#### Completed

Should feel calm and resolved.

Visual treatment:

- Reduced emphasis
- Soft fade or muted state
- No celebratory animations
- Copy: "Done for today."

### Create Priority Flow

#### Add Priority Button

Simple CTA beneath priority list: "Add Priority"

#### Priority Creation Modal

Centered modal with soft elevation and minimal visual noise.

##### Fields

**Required**

- Title

**Optional**

- Description
- Estimated duration
- Initial time block

##### Initial Time Block Fields

Optional scheduling during creation:

- Start time
- End time

If provided:

- Automatically create corresponding timeline block

## Timeline Panel

### Section Header

- **Heading:** "When will you make time for it?"
- **Supporting Text:** "Reserve focused time intentionally."

### Timeline Design

The timeline should visually resemble a softened and more spacious version of a single-day Outlook calendar view.

#### Requirements

- Vertical day timeline
- Default visible hours: 6am–10pm
- Scrollable beyond default range
- Subtle hour dividers
- Minimal visual clutter
- Spacious layout
- Current time indicator line
- 15-minute snapping increments

### Drag and Drop Interaction

Users can drag priorities from the left panel directly into the timeline.

#### During Drag

- Timeline subtly highlights
- Valid placement areas become visible
- Priority card becomes semi-transparent
- Preview block appears before drop

Interactions should feel soft and fluid, not playful or exaggerated.

Avoid:

- Heavy bounce animations
- Flashy transitions
- Trello-style motion

### Timeline Blocks

Each scheduled block represents reserved focus time for a priority.

#### Block Contents

- Priority title
- Time range
- Optional interruption counter
- Optional completion state

### Timeline Block Behaviors

#### Resizable

Users can drag top / bottom edges to resize blocks.

#### Editable

Clicking a block opens lightweight edit state. Users can modify:

- Start / end time
- Associated priority
- Notes

#### Multiple Blocks Per Priority

A single priority may have multiple scheduled blocks.

Example:

- 9:00–10:00 AM
- 2:00–3:00 PM

Blocks associated with the same priority should share subtle visual identity.

### Timeline Rules

#### No Overlapping Blocks

The interface should prevent overlapping scheduled blocks. Attention is treated as finite.

#### Non-Priority Blocks

Users may optionally create blocks not associated with a priority.

Examples:

- Lunch
- Walk
- Errands

These blocks should appear visually secondary to priority-linked blocks.

### Interruptions Tracking

Timeline blocks include a subtle interaction: "Interrupted?"

Tapping increments a small interruption counter.

This feature should feel lightweight and observational rather than analytical.

## Reflection Section

Located beneath timeline or collapsible near bottom. Minimal and low-pressure.

- **Prompt 1:** "What shaped your attention today?"
- **Prompt 2:** "What pulled your attention away?"

Optional short text responses only. No journaling complexity.

## Daily Reset Behavior

The app automatically resets at midnight local time.

### Reset Rules

- Priorities clear
- Timeline clears
- Focus blocks clear

Optional:

- Reflection may persist for previous day viewing

The reset should feel intentional and calm, not destructive.

Possible subtle copy: "Tomorrow deserves fresh intention."

## Visual Design Direction

### Overall Aesthetic

The visual tone should feel:

- Calm
- Spacious
- Grounded
- Minimal
- Warm
- Editorial
- Intentional

Avoid:

- Corporate SaaS aesthetics
- Hyper-productivity visuals
- Gamification
- Loud colors
- Dense dashboards

### Design Inspiration

The aesthetic should loosely draw inspiration from:

- Linear
- Notion Calendar
- Raycast
- MUJI
- Minimal paper planners
- Quiet editorial layouts

The interface should subtly evoke intentionality and presence without appropriating Buddhist or spiritual symbolism.

Avoid:

- Lotus imagery
- Spiritual iconography
- Sanskrit typography
- Meditation-app clichés

### Color Palette

#### Dark Mode (Default)

- Warm charcoal backgrounds
- Soft stone text
- Muted slate and sage accents
- Low-contrast layering

#### Light Mode

- Warm off-white backgrounds
- Soft paper card surfaces
- Charcoal text
- Muted neutral accents

Avoid:

- Pure black
- Neon colors
- High-saturation blues

### Typography

Typography should feel editorial and breathable.

#### Recommended Direction

- Inter
- Geist
- Instrument Sans

Use:

- Generous line-height
- Restrained font weights
- Spacious hierarchy
- Minimal typography scale variation

### Spacing & Layout

The interface should prioritize:

- Generous whitespace
- Calm separation
- Minimal borders
- Soft layering
- Reduced visual density

Whitespace is part of the experience.

### Motion Guidelines

Animations should feel:

- Soft
- Slow
- Intentional
- Calm

Recommended:

- Gentle fades
- Smooth drag transitions
- Soft hover states

Avoid:

- Bounce effects
- Aggressive spring animations
- Flashy motion
- Celebration effects

## Empty State Copy

- **Empty Priorities:** "Start with what actually matters today."
- **Empty Timeline:** "Time is still unspoken for."

## Tone of Voice

The product voice should feel:

- Calm
- Grounded
- Respectful
- Thoughtful
- Non-performative

Avoid:

- Hustle culture language
- Productivity-maxxing terminology
- Excessive motivation copy
- Forced mindfulness language

Preferred tone: "Make space for what matters." not "Optimize your output."

## Responsive Behavior

### Desktop

Primary experience. Two-column layout:

- Priorities left
- Timeline right

### Mobile

Responsive stacked layout:

- Priorities
- Timeline
- Reflection

Maintain calm spacing and touch-friendly interactions.

## Success Criteria

The finished product should feel:

- Calm and intentional
- Immediately understandable
- Lightweight but thoughtful
- Emotionally differentiated from traditional productivity apps
- Highly polished despite constrained scope

The app should demonstrate:

- Strong product judgment
- UX intentionality
- Scope discipline
- Emotional design awareness
- High-quality interaction thinking
