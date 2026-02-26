
# UX Design Specification - "Plan. Spec. Build." Agentic Builder's Workshop

**Author:** Dan
**Date:** 2026-02-22

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

A professional, effortless, and authoritative "Command Center" portfolio that interlocks the tools used, the rigorous documentation produced, and the final deployed prototypes. It exposes the "messy middle" of software development to build trust through verifiable, human-edited documentation, proving strategic oversight of AI tools.

### Target Users

- **Hiring Manager:** Time-pressured, scanning quickly. Evaluates the portfolio in seconds. Needs clear visual hierarchy, fast navigation, and immediate evidence of rigor.
- **Peer PM:** Curious but overwhelmed by jargon. Needs intuitive onboarding ("Meta-Blueprint" as Project #1) and clear CTAs ("Fork a Workshop").
- **Author (Admin):** Manages content via markdown files in Git without touching UI code.

### Key Design Challenges

1. **Mobile Adaptation:** The product's identity is the interlocking 3-column "Command Center." Degrading this to a single stack risks losing the visual metaphor.
2. **Card Design & Density:** Balancing "at a glance" scannability with rich metadata across different object types. The design must accommodate compact states and expandable detail rows.
3. **Dark Mode Integration:** The target audience expects a native-feeling dark mode, requiring a dual-mode color system from the start.

### Design Opportunities

1. **"Aha!" Navigation Moments:** Explicit intra-linking (e.g., clicking a Build Lab card to filter the Blueprints column) creates a visceral "these are connected" experience.
2. **Browse vs. Focus Modes:** Default unfiltered view uses collapsible project groupings for scanning, while filtering fully hides non-matching projects to create a distraction-free "Focus" mode for a single project.
## Core User Experience

### Defining Experience
The core interaction is the transition from **Browse Mode** (unfiltered scanning of all projects) to **Focus Mode** (filtering by a specific project). The defining action is the user clicking a Document Title to open the "Messy Middle" documentation in a focused overlay, validating the PM's strategic rigor.

> **Visual Reference:** See [`ux-full-page-mockup.html`](./ux-full-page-mockup.html) for the approved, implementation-ready mockup showing both Browse Mode and Focus Mode states.

### Platform Strategy
- **Primary:** Desktop web application (SPA/SSG). Hiring Managers typically review portfolios on desktop monitors during work hours.
- **Secondary:** Mobile web is deferred to v2. The MVP targets desktop only (≥1024px). Mobile/tablet responsive design will be addressed in a future phase.

### Effortless Interactions
- **Instantaneous Context Switching:** Clicking a project, domain, or tech stack filter must update the entire UI instantly (<100ms) without page reloads.
- **Explicit Filtering Behavior:**
  - **Project filter (Browse Mode):** Selecting a specific project pill hides all non-matching project rows across all three columns. A "✕ Clear Filter" button appears inline in the filter bar to return to Browse Mode. Selecting "All" is equivalent to no filter.
  - **Domain/Tech filters (Browse Mode):** Cross-project, cross-column filtering. Cards in ALL three columns (Agent Studio, Blueprints, Build Lab) that do not contain the selected tag are hidden. Any card lacking the selected tag is removed from view. Multiple tags are OR-filtered (cards matching any selected tag remain visible).
  - **Domain/Tech filters (Focus Mode):** When a project is already selected, Domain/Tech filters narrow results within that project only — hiding cards or document rows across all three columns that lack the selected tag.
  - **Focus Mode entry:** Can be triggered either by clicking a project pill in the filter bar or by clicking the Layers icon on any Blueprint or Build Lab card. Both methods produce identical state.
- **Barrier-Free Exploration:** Zero authentication required. All content, including external prototype links, must be accessible in one click.
- **Metadata Expansion (Documents Only):** For Blueprint documents, clicking a card's chevron (or expanding the whole project group) reveals the "What/Why/Tags" instantly without leaving the Command Center context. Agent Studio and Build Lab cards remain fully visible at all times.

### Critical Success Moments
- **The "Aha!" Connection:** The moment a user recognizes the explicit connection between a specific AI tool, the document it helped generate, and the final prototype it influenced.
- **Discovering Rigor:** When a Hiring Manager opens a document viewer (e.g., for a Decision Matrix) and sees verified, human-authored strategic trade-offs rather than generic AI output.

### Experience Principles
1. **Effortless Authority:** The design must feel premium, authoritative, and trustworthy through clean typography, generous whitespace, and subtlety—avoiding overly dense or "try-hard" technical UI.
2. **Connections over Silos:** The UI must visually reinforce that tools, documentation, and code are an interlocking ecosystem, not isolated artifacts.
3. **Speed is Trust:** Navigation and filtering performance must be imperceptible to maintain the "Command Center" illusion.

## Desired Emotional Response

### Primary Emotional Goals
- **Effortless Authority:** The user should feel they are in the hands of a rigorous, competent professional who has tamed the chaos of software development into an elegant, ordered system.
- **Trust & Reliability:** "I like how this person thinks. They presented this complex flow simply. I'd trust them to manage development chaos."

### Emotional Journey Mapping
1. **Initial Impression:** The first 5 seconds must evoke a "premium studio" energy—clean, curated, and highly intentional (between strict utilitarian and overly creative).
2. **Interaction (Filtering):** Clicking filters or projects must feel instantly responsive. The Phase 1 MVP focuses on brutal execution speed (0ms instant UI swapping) to guarantee core data integrity, with a roadmap to evolve into *fluid and spatial* animations in Phase 2 to further elevate the "premium studio" feel.
3. **Deep Dive (Reading Docs):** When opening a document viewer, the emotional tone shifts to calm focus. The container (typography, whitespace, modal design) must absorb the complexity of the technical content, reinforcing the feeling of "ordered rigor."

### Micro-Emotions
- Confidence vs. Overwhelm (solved via collapsible project groups)
- Spatial Awareness vs. Lost Context (solved via fluid animations and modal viewers)
- Trust vs. Skepticism (solved via exposing the "messy middle" of decision matrices rather than just shiny final prototypes)

### Design Implications
- **Typography & Whitespace:** Must do the heavy lifting for the "premium" feel. Use a modern, highly legible sans-serif with generous line heights and margins. 
- **Animation Strategy:** Phase 1 completely avoids complex UI transitions in favor of brutal, instant execution speed to maintain the "Command Center" illusion. Transition logic (easing curves) is explicitly deferred to Phase 2 to de-risk the MVP build.
- **Modal Design:** The document reading experience must feel like a dedicated "focus mode" without breaking the metaphor that the user is still inside the Command Center.

### Emotional Design Principles
- **Absorb Complexity:** The UI container must be calmer and more ordered than the complex technical content it holds.
- **Fluid, Not Jarring:** State changes must be continuous and spatial.
- **Show the Work, Beautifully:** The "messy" artifacts of development (Brainstorms, PRDs) must be presented with the same editorial care as the final marketing site.

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis
- **Apple:** Masterclass in "Product-as-hero" framing. Uses massive whitespace, cinematic typography, and minimal navigation noise. It feels effortless and highly curated.
- **Linear:** The gold standard for "Dark UI authority." Achieves high-density without feeling cluttered due to extreme grid discipline, subtle motion, and sharp, modern typography.
- **Notion:** Exemplifies "Content-first layout." Uses a calm white background, soft spacing, and minimal but friendly typography to make dense documentation feel approachable.

### Transferable UX Patterns
We can synthesize these three distinct styles to solve the portfolio's specific challenges:
- **The "Linear" Container & Grid (For the 3-Column Layout):** The outer shell and card interactions should borrow from Linear's grid discipline and subtle motion. The dark mode version should feel deeply authoritative.
- **The "Notion" Document Viewer (For the Blueprints):** When opening a markdown document, the modal should borrow from Notion's calm, content-first layout. Even in dark mode, the document reading experience should feel soft and readable, not overly technical.
- **The "Apple" Hierarchy (For Scannability):** Despite potential column height/density, we must use Apple-style generous whitespace between project groups to prevent visual exhaustion. 

### Anti-Patterns to Avoid
- **The "Wall of Text" Card:** Avoid turning the document cards into dense technical readouts. Use the compact-row pattern defined in Step 3 to maintain scanability.
- **Overly Technical Typography:** Avoid terminal/monospace fonts for primary body copy or headings. It leans too far into "intimidating engineer" and away from "effortlessly authoritative."
- **Aggressive Borders/Shadows:** Linear and Notion both use incredibly subtle borders and spatial separation rather than heavy drop shadows.

### Design Inspiration Strategy
**What to Adopt:**
- Linear's approach to high-density grid alignment and hover states.
- Notion's typographic scale for markdown document rendering.
- Apple's use of whitespace as a structural element to group related content.

**What to Adapt:**
- We must adapt the "cinematic" feel of Apple into a data-dense layout. This means the *projects* are the heroes, and whitespace must be used aggressively *between* project groupings even if the cards themselves are dense.

## Design System Foundation

### Design System Choice
**shadcn/ui + Tailwind CSS** (built on React and Radix UI primitives).

### Rationale for Selection
- **AI Toolchain Alignment:** AI builders (like Lovable/v0) natively output Tailwind CSS and shadcn/ui components, making this the most efficient choice for AI-assisted development.
- **Bespoke Control without the Boilerplate:** Provides unstyled, highly accessible primitives (Radix) that can be easily customized with Tailwind to achieve the required "Linear/Apple" premium aesthetic without looking like a generic template (which happens with MUI or Bootstrap).
- **Component Ownership:** Unlike NPM-installed component libraries, shadcn/ui components live directly in the codebase, giving full architectural control over micro-interactions and layout behaviors critical to the 3-column "Command Center."

### Implementation Approach
1. **Container & Layout:** Use CSS Grid via Tailwind (`grid-cols-3` for desktop, specialized breakdown for mobile) to build the core interlocking column architecture.
2. **Card Components:** Leverage shadcn's base `Card` component but heavily customize the internal flex layouts to support the "compact vs. expanded" row behavior defined in Step 3.
3. **Interactive Overlays:** Use shadcn's `Dialog` (modal) and `Sheet` (slide-out) components for the document viewing experience, ensuring they maintain context without feeling disconnected from the dashboard.

### Customization Strategy
- **Tokens via Tailwind Config:** The brand's visual identity will be strictly controlled via `tailwind.config.ts`, establishing a semantic color palette that perfectly balances the dark/light mode "authoritative" feel.
- **Typography Scale:** Implement a strict, modular typographic scale in global CSS to ensure the "Apple-style" cinematic headings contrast appropriately with "Linear-style" dense metadata tags.

## Core Experience Mechanics

### The Defining Interaction: "The Command Center Collapse"
The signature interaction of the portfolio is the seamless, spatial transition from **Browse Mode** (scanning all projects) to **Focus Mode** (deep-diving into a single project pipeline). 

### Experience Mechanics

**1. Initiation (The Trigger)**
- **Primary Method:** The user selects a specific project from the top filter bar.
- **Serendipitous Method:** The user clicks the "Layers/Stack" icon located in the top-right corner of any project document or prototype card. This acts as an intuitive, in-card shortcut that says "filter the entire dashboard to show me the full context for this specific item."

**2. Interaction & Feedback (The Transition)**
- Phase 1 MVP relies on **instantaneous, 0ms hard cuts**. When a filter state changes, the DOM immediately re-renders, dropping all unrelated array objects. This ensures blazing fast performance and perfectly predictable React states, proving out the architectural model before introducing complex visual flair. (Note: Phase 2 will introduce the `Grid Transition Controller` to create the fluid 200ms spatial sliding originally designed).

**3. Completion (The Climax)**
- **The Loudest CTA:** The visual hierarchy must emphasize the **"Launch Prototype" (Rocket/External) action** in the Build Lab column. The user must understand they are exactly 1-click away from interacting with working software. The proof is in the prototype.
- **The Rigor Reveal:** To balance the prototype CTA and prove strategic oversight, triggering Focus Mode **auto-expands** the Blueprint document cards for that project. The "What/Why/Tags" metadata is instantly exposed without requiring extra clicks. 
- **The Emotional Flow:** "Wow, a working prototype (CTA) → Oh wait, look at all the detailed documentation that went into planning it (Auto-expanded cards) → Let me click the title to read the PRD."

## Visual Design Foundation

### Color System: "Tinted Neutrality"
To achieve the "premium studio" aesthetic without becoming a confusing rainbow of data, the color strategy relies heavily on grayscale with highly deliberate, muted accents.
- **Structural UI (90%):** Backgrounds, borders, and typography borrow strictly from a Slate or Zinc grayscale palette.
- **Informational Accents (Statuses/Tags):** Status pills and filter tags use "tints" rather than solid colors (e.g., 10% opacity background with 80% opacity text). This provides visual distinction without breaking the premium feel.
  - `[Live]`: Muted Emerald / Mint
  - `[WIP]`: Muted Amber / Yellow (label is "WIP" not "In Progress" — concise by design)
  - `[Concept]`: Muted Zinc / Gray (PRD exists, no code yet — no color)
- **The "Pop" (CTAs):** A single, strong primary color (`bg-blue-600`) is reserved *exclusively* for primary actions like the "Launch Prototype" rocket button. Blue must not appear on any status pills or informational elements.

### Typography System
**Primary Typeface: Inter**
- Inter represents the authoritative "Tech Studio" aesthetic perfectly. It is highly legible, scales beautifully for both massive cinematic headings and dense metadata tags, and is native to the shadcn/ui ecosystem.
- The typographic scale must enforce the hierarchy: massive, confident project groupings vs. dense, small, highly readable card contents.

### Spacing & Layout Foundation
- **Contained Layout (Max-Width):** The three-column "Command Center" will sit within a fixed max-width container (e.g., `max-w-7xl` or `1280px`) centered on the viewport. On huge desktop monitors, this leaves generous "Apple-style" whitespace margins on the left and right, framing the data and enhancing the premium studio feel.
- **Internal Spacing:** Use standard Tailwind 4px/8px multiples, but bias toward wider padding and larger margins between project groupings to prevent visual exhaustion.

### Accessibility Considerations
- **Contrast Ratios:** The "Tinted Neutrality" system must ensure that text within low-opacity status pills maintains WCAG AA compliance against both light and dark mode backgrounds.
- **Dual-Mode System:** The strict grayscale token system ensures that the switch between Light and Dark mode feels native and effortless, as structural colors will invert seamlessly while tinted accents remain consistent.

## Design Direction Decision

### Design Directions Explored
An interactive HTML prototype (`ux-design-directions.html`) was generated to evaluate 4 distinct visual directions for the Command Center layout:
1. **Linear Purist (Dark Mode)**: Pure dark UI, strict grid discipline, subtle borders, high information density.
2. **Notion Minimalist (Light Mode)**: Soft shadows, bright white backgrounds, content-first typography.
3. **Apple Cinematic (Light Mode)**: Floating cards, heavy drop shadows, generous whitespace.
4. **Developer High Contrast (Dark Mode)**: True black, sharp borders, neon structural accents.

### Chosen Direction
**Direction 1: "Linear Purist" (Dark Mode)**

### Design Rationale
- The "Linear Purist" aesthetic perfectly aligns with the core emotional goal of **"Effortless Authority."** 
- In a 3-column, high-density dashboard, dark mode combined with strict, subtle borders (`#27272a` against a `#09090b` background) prevents visual exhaustion much better than bright white layouts or heavy drop shadows.
- It leverages the "Tinted Neutrality" color system perfectly, allowing the status pills and "Launch Prototype" CTAs to pop without feeling like a chaotic, colorful dashboard.
- This direction communicates technical rigor and systematic thinking while remaining deeply elegant.

### Implementation Approach
- **Global Backgrounds:** `bg-zinc-950` with `text-zinc-50`.
- **Card Containers:** `bg-zinc-900` with subtle `border-zinc-800`.
- **Hover States:** Instead of aggressive elevation (shadows), hover states will rely on subtle background color shifts (e.g., `bg-zinc-900` to `bg-zinc-800/80`) to maintain the "flat" precision of the grid.
- **Tokens:** Shadcn/ui theme configuration will be tightly locked to the "Zinc" preset, customized to ensure maximum contrast for typography while keeping structural borders almost invisible.

## User Journey Flows

### 1. The Evaluator (Hiring Manager)
**Goal:** Assess strategic rigor and technical competence efficiently.
**The Flow Matrix:**
1. **Entry:** Lands on default "Browse Mode" (scannable view of all projects).
2. **Interaction (Trigger):** Clicks a Project pill in the global filter OR clicks the "Layers" icon on any card to isolate a specific project.
3. **Feedback (Focus Mode):** The UI instantly re-renders (0ms); non-matching projects disappear without confusing transitions. Crucially, the remaining Blueprint documents *auto-expand* to reveal their metadata (What/Why/Tags).
4. **Deep Dive:** Clicks the title of the "Decision Matrix" document. 
5. **Modal Review:** Reads the document in a focused modal overlay that absorbs the complexity (Notion-style layout). 
6. **Recovery/Continue:** Closes the modal. **The UI must remain in "Focus Mode"** for that project until the user manually clears the filter, allowing them to explicitly continue their investigation.
7. **Climax (CTA):** Clicks the "Launch Prototype" rocket icon in the Build Lab column to verify the working software.

### 2. The Forker (Peer PM)
**Goal:** Understand the Tri-Pillar framework and adopt it.
**The Flow Matrix:**
1. **Entry:** Lands on the dashboard, notices the structural repetition.
2. **Interaction:** Clicks "About this Project" in the global navigation header.
3. **Feedback (The Dashboard Modal):** Instead of a full-page redirect, a large modal overlay opens to preserve the Command Center context.
4. **Content Consumption:** 
    *   Reads the structural philosophy (Tools → Docs → Software).
    *   Views a dynamic **Metrics Dashboard** showing the portfolio's scale (Count of Projects, Count of Document Types, Status distributions). This acts as social proof of the framework's viability.
5. **Climax (CTA):** Clicks the "Fork a Workshop" button.
6. **Resolution:** Redirected to the GitHub template repository.

### 3. The Content Creator (Author)
**Goal:** Publish updates without touching UI code.
**The Flow Matrix:**
1. **Entry:** Author has completed a new BMAD workflow locally.
2. **Interaction:** Commits the generated markdown output to a new `/_projects/project-name` directory and updates the frontmatter YAML.
3. **Feedback (CI/CD):** Vercel/Netlify auto-builds the static site.
4. **Empty State Handling:** If the Author has written a PRD but hasn't coded the prototype yet, the "Build Lab" column **must still render a card** for that project to maintain the 3-column structural integrity. 
5. **Status Application:** Instead of "Live", the prototype card is tagged with a "Concept" status pill, clearly communicating to users that the project exists in the planning phase but lacks deployed code.

### Journey Patterns & Optimizations
- **Persistent Context:** Both the Document Viewer and the "About this Project" pages open as large modals/overlays rather than new routes, ensuring the user never feels they have completely left the Command Center.
- **Auto-Expansion:** Tying the "Focus Mode" filter directly to the "Expand Card Metadata" state reduces clicks for the Evaluator persona and instantly surfaces the rigorous "messy middle" when they express interest in a specific project.

## Component Strategy

While shadcn/ui provides the foundational atoms (Dialogs, Buttons, Badges, ScrollAreas), the execution of the "Command Center" requires specific custom molecules and organisms to handle the high density of varied architectural data.

### Design System Components (shadcn/ui + Tailwind)
- `Dialog`: Base for the Markdown Document Viewer and "About" dashboard.
- `Badge`: Base for the Tinted Neutrality Status Pills and tech tags.
- `Button`: Primary CTAs (e.g., "Launch Prototype") and icon buttons.
- `Tabs`: Potential layout tool for mobile-responsive breakpoint handling.

### Global Header
The global header sits above the filter bar and is **identical in Browse and Focus Mode** (it does not change when a project is selected).

- **Left side:** Page title (H2, `text-3xl font-semibold text-white`) + one-line subtitle (`text-base text-zinc-400`)
- **Right side (icon group, top-aligned):**
  - **Moon icon** — Light/Dark mode toggle (`text-zinc-500`, brightens to `text-white` on hover with `bg-zinc-800` background)
  - **Info icon** — Opens the "About" modal overlay (`text-zinc-500`, same hover behavior). Links to the project's About page / GitHub template; replaces a direct GitHub link in the header.
- **Alignment:** Icon group uses `items-start` (top-aligned with the title line, not baseline-aligned to the subtitle).
- **Spacing:** `max-w-7xl mx-auto`, `mb-6` below header before filter bar.

### Three-Row Filter Bar
The filter bar is organized into three distinct horizontal rows with consistent left-side labels.

- **Row 1 — Projects:** Full-pill buttons (`.filter-pill`, rounded-full). One pill per project + "All" pill. Active project uses blue fill (`bg-blue-600`). When a project is active, a `✕ Clear Filter` button appears at the end of the row.
- **Row 2 — Domain:** Chip toggles (`.chip-toggle`, rounded-md, smaller than project pills). Tags represent functional domain categories (e.g., Requirements, Design, Architecture, Planning, Facilitation). Active chip uses `bg-zinc-800` fill.
- **Row 3 — Tech:** Chip toggles, same style as Domain row. Tags represent technology stack entries (e.g., Next.js, React, Tailwind, Vercel, Supabase).
- **Row labels:** 10px uppercase, `text-zinc-600`, fixed width (`w-16`) to align all filter rows. Labels: "Projects", "Domain", "Tech".
- **Gap:** `gap-3` between rows; `mb-10` below filter bar before the 3-column grid.

### Custom Components


**1. The Universal Compound Card (Base Architecture)**
- **Purpose:** All data in the 3 columns utilizes a single underlying compound component architecture. Instead of building three rigid components (`AgentCard`, `BlueprintCard`, `PrototypeCard`), all columns must use this identical structural base to guarantee perfect visual alignment across the grid.
- **Anatomy (`Compound Component Pattern`):** 
  - `<ProjectCard.Root>` handles outermost border processing, hover states, and padding.
  - `<ProjectCard.Header>` renders Top Bar elements (Date, Status Pills) and the H2 Title.
  - `<ProjectCard.Metadata>` renders the Auto-Expanding Context (Functional/Tech Tags).
  - `<ProjectCard.Body>` renders paragraph descriptions or complex nested arrays (like the Blueprint document list).
- **Empty State Handing:** 
  - *Blueprints & Prototypes:* Handled via the `[Concept]` pill and dashed borders.
  - *Agents:* There is **no empty state** for Agent cards. Every project in the portfolio is inherently driven by an AI Agent. If a project exists, it will have an Agent card.

These building blocks are conditionally populated to create the three distinct card layouts based on column context:

**A. The Agent Card (Agent Studio Column)**
- **Header (inline):** Agent name (H3, `text-lg font-semibold text-white`) + Status Pill inline to the right
- **Body:** 2-sentence executive summary (`text-sm text-zinc-400`)
- **Functional Tags:** Domain tag row (`tag-fn` — solid `bg-zinc-800` background)
- **Tech Stack Tags:** Technology tag row (`tag-tc` — transparent with `border-zinc-800`)
- **Actions:** None. No Layers icon. Agent cards are purely informational; project-level filtering is handled by the Project filter pills in the filter bar.
- **Project association:** Agent Studio items are shared across projects (stored in `_shared/agents/`). Each agent has an optional `projects` frontmatter array. In Browse Mode (no project filter), all agents display. In Focus Mode (project filter active), only agents whose `projects` array includes the active project are shown — agents with no project association are hidden. This prevents the Agent Studio column from displaying unrelated tools when a user is focused on a specific project.

**B. The Prototype Card (Build Lab Column)**
- **Card Header row:** Left side: Project Title (H3, `text-lg font-semibold text-white`) + Status Pill inline. Right side: Layers icon (filter shortcut), GitHub icon, Rocket CTA button.
- **Body:** One-sentence description of the prototype (`text-sm text-zinc-400`)
- **Functional Tags:** Domain tag row (`tag-fn`)
- **Tech Stack Tags:** Technology tag row (`tag-tc`)
- **Actions:**
  - **Rocket button** (`bg-blue-600`) — Primary CTA. Launches the live prototype. Maximum one per project.
  - **GitHub icon** — Secondary action (`text-zinc-500`, brightens on hover). Links to source repo.
  - **Layers icon** — Quaternary shortcut. Clicking filters the entire dashboard to show only this project (Focus Mode). Restores the user to Focus Mode if they arrived via Browse.
- **Concept state:** When no prototype exists yet, render with `border-dashed`, no Rocket CTA, and `[Concept]` pill. GitHub icon also hidden.

**C. The Blueprint Card (Blueprints Column)**
This card uses a compound layout: a project-level header card wrapping a 1-to-many document list.

- **Project Header** (sticky top of card):
  - *Left:* Project Name (H3, `text-lg`) + document count (`text-xs text-zinc-500`) + `[Expand All]` / `[Collapse All]` text toggle (per-card scope — only affects documents within this specific Blueprint card, not other project cards)
  - *Right:* Layers icon (Focus Mode shortcut). Clicking filters the entire dashboard to show only this project.
- **Document Row (Collapsed):**
  - *Left:* Document Title (text link — underline on hover to open Markdown modal) + Status Pill inline to the right
  - *Right:* File icon (opens Markdown modal) + Chevron icon (expands/collapses this row only)
  - **Click targets:** Both the Document Title text and the FileText icon open the Markdown Document Modal by updating the URL to `?project=x&document=y`. The Chevron icon exclusively toggles expand/collapse of the row's metadata — it does NOT open the modal.
  - Title text is `text-zinc-300` when collapsed, `text-white` when expanded
- **Document Row (Expanded — via click or Focus Mode auto-expand):**
  - Same header as above, chevron rotated 180°
  - *Body:* 1-2 sentence description (`text-sm text-zinc-400`)
  - *Functional Tags:* `tag-fn` row
  - *Tech Stack Tags:* `tag-tc` row
- **Auto-expand behavior:** Entering Focus Mode (via project pill or Layers icon) automatically expands all document rows in that project's Blueprint card.
- **Concept/Empty state:** If a project has no documents yet, render the project header only (no document rows) with a `border-dashed` card style.

**2. The Markdown Document Modal**
- **Purpose:** Provide a calm, "Notion-like" reading experience for highly technical markdown artifacts (like PRDs) within an overlay inside the Command Center.
- **Anatomy:** Sub-classes the shadcn `Dialog`. Wraps a raw Markdown rendering library (`react-markdown`). 
- **Requirements:** Requires a strict global typography CSS module ensuring that HTML tags generated by the BMAD output (`<h1>`, `<blockquote>`, `<table>`) immediately inherit the "Apple/Linear" premium scale and colors without requiring the user to hand-write JSX.
- **Open triggers:** Clicking a Blueprint document title text link OR the FileText icon button in a document row. Both update the URL to `?project=x&document=y` where `y` is the filename stem.
- **Close behavior:** The modal can be closed via the X button, Escape key, clicking the overlay backdrop, or pressing the browser back button. All close methods remove only the `?document=` parameter from the URL — all other filter state (`?project=`, `?domain=`, `?tech=`) is preserved. After closing, the user remains in exactly the same filter/focus state they were in before opening the document.

**3. Display Ordering**
- The display order of cards within all three columns (Agent Studio, Blueprints, Build Lab), as well as the order of project pills in the Filter Bar, is controlled by a central `sort-config.yaml` manifest rather than being implicit or per-file. This ensures the Author has a single, predictable location to manage presentation ordering across the entire portfolio.

### Component Implementation Strategy (Phased Approach)
- **Phase 1 MVP:** Focuses entirely on structural components that manage state and render data. The **Tri-Column Layout Container** is strictly built utilizing standard CSS Grid (`grid-cols-3`); transitions are hard 0ms cuts to guarantee routing predictability.
- **Phase 2 Expansion:** Upgrades the Tri-Column Layout Container by introducing the custom `Grid Transition Controller`—a complex layout wrapper using React hooks (`useEffect`) and custom CSS to delay the unmounting of filtered components. This provides the "fluid, spatial" sliding animations required by the original UX vision without loading heavy external libraries like Framer Motion.

## UX Consistency Patterns

The following patterns establish the "Linear Purist" visual discipline across the entire portfolio, regardless of the project being displayed.

### 1. The "Call to Action" (CTA) Hierarchy
*   **Primary (The Rocket/Live Link):** Only used for "Launch Prototype" in the Build Lab. It is the only element allowed to use a vibrant color (e.g., `bg-blue-600` or a bright neon accent) to draw the eye across the 3 columns. *Rule: Maximum one Primary CTA per project.*
*   **Secondary (Ghost Buttons):** Used for important but secondary actions (e.g., "Download GitHub Repo" or a secondary backend deployment link). These use a transparent background with a solid structural border (`border-zinc-700`) that brightens on hover.
*   **Tertiary (View Document):** The title of the PRDs/Decision Matrices. These are *never* buttons; they are text links that reveal an underline on hover, keeping the Blueprint column feeling like a library.
*   **Quaternary (Collapse/Expand):** Small, muted icon buttons (like the Layers icon) that use `text-zinc-500` and only brighten to `text-zinc-50` on hover.

### 2. The Tagging System ("Tinted Neutrality")
With the complex data generated by BMAD, tags must be strictly controlled to prevent the UI from becoming chaotic.
*   **Tech Stack Tags (e.g., React, Supabase):** Always strict grayscale (`bg-zinc-800/50` with contrasting text).
*   **Status Pills:** The *only* tags allowed to use color, utilizing a 10-20% opacity background with a matching solid border or text. To prevent a "rainbow UI," these are strictly locked to 4 values:
    *   `[Live]`: Muted Emerald / Green — `rgba(16,185,129,.10)` bg, `#047857` text, `rgba(16,185,129,.22)` border. The prototype is deployed.
    *   `[WIP]`: Muted Amber / Yellow — `rgba(217,119,6,.10)` bg, `#92400e` text, `rgba(217,119,6,.22)` border. Actively being built. Label is "WIP" (not "In Progress") for brevity.
    *   `[Concept]`: Muted Zinc / Gray — `rgba(113,113,122,.08)` bg, `#52525b` text, `rgba(113,113,122,.22)` border. PRD exists, no prototype code yet. Intentionally colorless to signal early stage.
    *   `[Archived]`: Muted Red / Rose — `rgba(225,29,72,.08)` bg, `#9f1239` text, `rgba(225,29,72,.20)` border. Reserved for projects abandoned or deprecated.

### 3. Interactive Feedback (Focus & Hover States)
*   **Mouse Hover Rule:** Because the application relies on the "Linear Purist" strict grid, we **do not use drop-shadows on hover**. Interactive cards simply lighten their background color slightly (e.g., from `bg-zinc-950` to `bg-zinc-900`) and brighten their borders.
*   **Keyboard Focus Rule (WCAG):** To ensure accessibility without muddying the mouse-hover state, keyboard navigation must trigger an explicit high-contrast ring (e.g., Tailwind's `focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2`).

### 4. The Empty State Pattern
When a project exists in planning phase only (no prototype code yet), the UI must maintain column structural integrity across all three columns.
*   **Blueprint column:** If a project has zero documents, render only the project-level card header (name + "0 Documents") with a dashed border. No document rows.
*   **Build Lab column:** Render the card with a dashed border (`border-dashed`), the `[Concept]` pill, and no Rocket CTA or GitHub icon. The Layers icon is still present.
*   **Agent column:** In Browse Mode, the Agent Studio always renders cards (no empty state). In Focus Mode, if no agents are associated with the selected project, the column renders the standard empty state pattern (dashed border, `[Concept]` pill).
*   **Communication rule:** Never use italicized placeholder text. The `[Concept]` pill + dashed border is the complete signal — no additional explanation needed.
*   **Error/Fallback state:** If a content file has malformed frontmatter or cannot be parsed, the affected card renders with a dashed border and an `[Error]` pill (same visual pattern as `[Concept]` but using muted Red/Rose tints). Text reads "Content unavailable." All other cards render normally — the site never crashes entirely due to one bad content file.

### 5. The "Clear Filter" Pattern
When any project is selected (Focus Mode), a "✕ Clear Filter" button must appear inline in the Projects filter row, positioned after the last project pill.
*   **Visual:** Small, muted-red ghost button — `border-red-500/30`, `text-red-400`, `bg-red-500/5`. Subtle but clearly dismissive.
*   **Behavior:** Clicking returns to Browse Mode ("All" pill active, all cards visible, blueprint docs return to their prior collapsed/expanded state).
*   **Absence:** Button is NOT shown when "All" is selected or no project filter is active.

## Responsive Design & Accessibility

> **Mobile/tablet responsive design is deferred to v2.** The MVP targets desktop only (≥1024px). The 3-column Command Center grid is designed for desktop monitors; mobile adaptation will be addressed in a future phase. All responsive breakpoint strategy decisions (tab bars, column switching, etc.) are out of scope for Phase 1.

### Desktop Layout (MVP — Phase 1)
*   **Layout:** The full 3-column grid (`grid-cols-3`), constrained to a `max-w-7xl` container.
*   **Interaction:** Full hover states enabled. Global filters and search are persistent in the header.
*   **Minimum viewport:** 1024px. No tablet/mobile breakpoints in Phase 1.

### Accessibility (A11y) Strategy
The portfolio targets WCAG 2.1 Level AA compliance, ensuring a professional and inclusive experience.

*   **Keyboard Navigation & Focus Management:**
    *   As established in Step 12, keyboard navigation must trigger explicit, high-contrast `focus-visible` outline rings.
    *   Opening a Markdown Document Modal must trap keyboard focus inside the modal until dismissed (handled natively by shadcn/Dialog).
*   **Contrast Ratios:**
    *   The "Tinted Neutrality" dark mode palette must be rigorously tested. The gray text (`text-zinc-500`) used for metadata must pass the 4.5:1 contrast requirement against the `bg-zinc-950` background.
    *   Ghost buttons must utilize high-contrast borders (`border-zinc-400` or higher) to remain visible against dark backgrounds.
*   **Semantic HTML:** The Tri-Column container must utilize proper semantic tags (`<section>`, `<article>`, `<nav>`) and ARIA landmarks to ensure screen readers can logically parse the dashboard architecture.3. **Effortless Authority:** Achieving a premium studio feel through clean typography, generous whitespace, and confident layout rather than overly dense technical UI.
