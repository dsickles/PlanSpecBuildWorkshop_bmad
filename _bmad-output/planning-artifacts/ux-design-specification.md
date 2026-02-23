
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

### Platform Strategy
- **Primary:** Desktop web application (SPA/SSG). Hiring Managers typically review portfolios on desktop monitors during work hours.
- **Secondary:** Mobile web. The mobile experience must preserve the 3-column mental model through a customized interaction pattern (e.g., swipeable views or horizontal tab navigation) rather than degrading to a generic vertical stack.

### Effortless Interactions
- **Instantaneous Context Switching:** Clicking a project, domain, or tech stack filter must update the entire UI instantly (<100ms) without page reloads.
- **Explicit Filtering Behavior:** Non-matching projects are completely hidden when a Project filter is applied. When Domain/Tech Stack filters are applied, non-matching projects are collapsed but their headers remain visible to preserve spatial awareness without clutter.
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
  - `[In Progress]`: Muted Amber / Yellow
  - `[Concept]`: Muted Violet or Slate
- **The "Pop" (CTAs):** A single, strong primary color (e.g., a deep indigo or premium blue) is reserved *exclusively* for primary actions like the "Launch Prototype" icon.

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

### Custom Components
**1. The Universal Compound Card**
- **Purpose:** A unified, single architectural card pattern that handles vastly different datasets depending on the column it resides in. Instead of different components for Tools, Documents, and Prototypes, all columns use this identical base to guarantee perfect visual alignment across the grid without becoming a tangled mess of React conditionally-rendered logic.
- **Anatomy (`Compound Component Pattern`):** 
  - `<ProjectCard.Root>` handles outermost border processing and interaction mapping.
  - `<ProjectCard.Header>` renders Date, Title, and status pills.
  - `<ProjectCard.Metadata>` renders the Auto-Expanding Context (What/Why/Tags). E.g., This is heavily utilized by Blueprints, but completely omitted when rendering an Agent Studio tool card.
  - `<ProjectCard.Body>` renders raw paragraph descriptions.
- **Interaction:** Automatically toggles `isExpanded` prop on the `Root` based on the global UI Filter state.

**2. The Markdown Document Modal**
- **Purpose:** Provide a calm, "Notion-like" reading experience for highly technical markdown artifacts (like PRDs) within an overlay inside the Command Center.
- **Anatomy:** Sub-classes the shadcn `Dialog`. Wraps a raw Markdown rendering library (`react-markdown`). 
- **Requirements:** Requires a strict global typography CSS module ensuring that HTML tags generated by the BMAD output (`<h1>`, `<blockquote>`, `<table>`) immediately inherit the "Apple/Linear" premium scale and colors without requiring the user to hand-write JSX.

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
    *   `[Live]`: Muted Emerald / Green (The prototype is deployed).
    *   `[In Progress]`: Muted Amber / Yellow (Actively being built).
    *   `[Concept]`: Muted Slate / Blue-Gray (PRD exists, no code yet).
    *   `[Archived]`: Muted Red / Rose (Project abandoned or deprecated).

### 3. Interactive Feedback (Focus & Hover States)
*   **Mouse Hover Rule:** Because the application relies on the "Linear Purist" strict grid, we **do not use drop-shadows on hover**. Interactive cards simply lighten their background color slightly (e.g., from `bg-zinc-950` to `bg-zinc-900`) and brighten their borders.
*   **Keyboard Focus Rule (WCAG):** To ensure accessibility without muddying the mouse-hover state, keyboard navigation must trigger an explicit high-contrast ring (e.g., Tailwind's `focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2`).

### 4. The Empty State Pattern
When the Author publishes a PRD but hasn't built the Prototype yet, the UI must maintain the column integrity.
*   **Visual:** The "Build Lab" card still renders, but uses a dashed border (`border-dashed border-zinc-700/50`) instead of a solid border. It must enforce a minimum height so grid rows do not collapse unevenly.
*   **Communication:** No italicized text is used. Instead, the card simply lacks the Primary CTA button and utilizes a specific Status Pill (e.g., `[Concept]`) in the header. The dashed border and status pill combined communicate the missing state without cluttering the UI with explicit apologies or explanation text.

## Responsive Design & Accessibility

The "Command Center" identity relies on the interplay of three distinct columns. Preserving this spatial relationship across screen sizes is the primary responsive challenge.

### Responsive Breakpoint Strategy

**Desktop (1024px and above)**
*   **Layout:** The full 3-column grid (`grid-cols-3`), constrained to a `max-w-7xl` container.
*   **Interaction:** Full hover states enabled. Global filters and search are persistent in the header.

**Tablet (768px - 1023px)**
*   **Layout:** 2-column grid (`grid-cols-2`). The "Agent Studio" (tooling context) is moved into a collapsible, horizontal accordion at the top of the page, dedicating the primary visual space to the "Blueprints" and "Build Lab" side-by-side.
*   **Interaction:** Hover states are disabled (touch targets only). Actionable areas must maintain a minimum 44x44px touch target area.

**Mobile (320px - 767px)**
*   **Layout (The "Sticky Top Tab Bar"):** Stacking 3 high-density columns vertically results in unacceptable scroll fatigue. Therefore, the mobile layout displays *only one column at a time* taking up the full viewport width.
*   **Interaction:** A sticky Tab Bar is fixed to the **top** of the screen (just under the global header) with three distinct tabs: `[Studio] | [Blueprints] | [Lab]`. Tapping a tab instantly swaps the visible content container. This preserves the user's mental model of "switching categories" rather than endlessly scrolling a list.

### Accessibility (A11y) Strategy
The portfolio targets WCAG 2.1 Level AA compliance, ensuring a professional and inclusive experience.

*   **Keyboard Navigation & Focus Management:**
    *   As established in Step 12, keyboard navigation must trigger explicit, high-contrast `focus-visible` outline rings.
    *   Opening a Markdown Document Modal must trap keyboard focus inside the modal until dismissed (handled natively by shadcn/Dialog).
*   **Contrast Ratios:**
    *   The "Tinted Neutrality" dark mode palette must be rigorously tested. The gray text (`text-zinc-500`) used for metadata must pass the 4.5:1 contrast requirement against the `bg-zinc-950` background.
    *   Ghost buttons must utilize high-contrast borders (`border-zinc-400` or higher) to remain visible against dark backgrounds.
*   **Semantic HTML:** The Tri-Column container must utilize proper semantic tags (`<section>`, `<article>`, `<nav>`) and ARIA landmarks to ensure screen readers can logically parse the dashboard architecture.3. **Effortless Authority:** Achieving a premium studio feel through clean typography, generous whitespace, and confident layout rather than overly dense technical UI.
