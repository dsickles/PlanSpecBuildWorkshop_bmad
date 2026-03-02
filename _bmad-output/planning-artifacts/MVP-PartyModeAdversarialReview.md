# Plan Spec Build Workshop - MVP Party Mode Adversarial Review

**Date:** 2026-03-01
**Context:** Multi-agent adversarial review of the PRD, architecture, and current implementation plan to identify critical risks before they become production blockers.

## 📊 The Analyst

"Looking at the business requirements and data flow, I have some serious concerns about what we're deferring and how we're structuring the core proposition. Here are my top priority issues:"

1. **The Telemetry Deferral (FR18) is a Strategic Failure:** By deferring usage telemetry to v2, we are flying completely blind for the MVP launch. The entire point of a portfolio is the "Evaluator" journey. If we can't track document views vs. prototype launches, we have no idea if the Tri-Modal layout is actually effective or if users are just bouncing.
2. **Hardcoded "Meta-Blueprint" Rigidity (FR16):** Mandating that the "Plan Spec Build Workshop" must be hardcoded or prioritized as the first project creates immediate friction for anyone using the "Fork a Workshop" feature (FR15). They will have to untangle our hardcoded presentation logic just to make their own portfolio work. 
3. **No Non-Technical CMS:** We rely entirely on Git pushes for content ingestion. While great for devs, it entirely alienates PMs, Designers, or Analysts who might want to use this workshop format but aren't comfortable managing markdown frontmatter and resolving merge conflicts.

## 📅 The PM

"I'm looking at the delivery schedule, epic breakdowns, and scope management. We are getting bogged down in the wrong areas. Here's my adversarial take:"

1. **Scope Creep in the Polish Epics (Epic 10 & 11):** We are prioritizing things like "Muted grayscale Clear Filter buttons" (Story 10.3) and "Expand Button placement" (Story 11.1) over actual table-stakes features like Mobile Responsiveness (FR7), which we pushed to v2. This is a classic case of polishing the brass on the Titanic while mobile users can't even read our site.
2. **Single Point of Failure in `sort-config.yaml` (Epic 6):** Moving from per-file ordering to a centralized YAML manifest means every time multiple contributors add docs, they have to touch the exact same manifest file. We are guaranteeing merge conflicts for the sake of 'centralized control'.
3. **Custom Modal Overkill (Epic 7):** Building a completely bespoke glassmorphism modal with a floating, scroll-synced Table of Contents just to read markdown documents is a massive scope risk. It's complex, prone to bugs, and delays shipping. We should have just routed to a standard Next.js reading page.

## 📐 The Architect

"From a system design and maintainability perspective, there are architectural decisions here that will absolutely fail at scale. Here are my top issues:"

1. **O(N) Client-Side Payload Explosion (Epic 3.3):** You're relying entirely on client-side React `useMemo` against the *full initial data payload* to achieve your 'sub-100ms' filtering. Once this portfolio grows beyond 30-40 projects with 100+ heavy documents, the initial HTML payload and hydration phase will completely tank the Lighthouse scores (NFR3) and FCP (NFR1).
2. **Remote Pointer Vulnerability (Story 9.1):** Linking to files outside the `/content/` directory like `/_bmad-output/planning-artifacts/prd.md` breaks the Next.js static build context. Next.js does not trace dependencies outside the project root easily for deployment to Vercel. Those files will likely 404 in production because they weren't included in the edge deployment bundle.
3. **Zod Strictness Cascading Failures:** It's great that we have Zod mapping parsing failures to `[Error]` UI states (Story 1.3). But if a shared agent (`_shared/index.md`) or the master `sort-config.yaml` fails validation, does the whole grid fail, or do we gracefully degrade? The architecture doesn't define the blast radius of a root-level parsing error.

## 🎨 The UX Designer

"I'm reviewing the user flows and interaction design, and frankly, some of these decisions are actively hostile to the user. My top issues:"

1. **No Mobile Layout (Epic 2, FR7):** I have to echo the PM and Analyst here. A modern portfolio without a mobile layout is unusable. Evaluators (recruiters, clients, leads) will open this link on their phones via LinkedIn or email. A broken desktop grid on a 400px screen is an instant rejection of your portfolio.
2. **The "Modal for Reading" Anti-Pattern (Epic 7.2 & 7.3):** You want users to read a 350+ line technical document inside a modal, and if they misclick the backdrop, it triggers a "smooth dismissal animation" (Story 7.3) that immediately loses their place in the 350-line document. Modal backdrops should **not** close long-form reading contexts on click. That is terrible UX.
3. **Contrast & "Tinted Neutrality" Risks:** "Linear Purist" aesthetics with heavily muted grays (`zinc-950` backgrounds, muted text) look great on a perfectly calibrated $3000 monitor. They routinely fail WCAG Level AA contrast ratios (NFR4) on standard laptop screens. If you don't bake contrast checking into your CI, this design will fail accessibility audits.

## 💻 The Dev

"Looking at the implementation details, tech stack, and React/Next.js edge cases, I see several footguns we are marching right into:"

1. **App Router Shallow Routing Bugs (Epic 3.2):** Relying heavily on `window.history.replaceState` and URL Search Params for instant client-side filtering in Next.js 15 App Router is notoriously tricky. If not handled perfectly, Next.js aggressive client-side cache will serve stale layout states when users hit the browser "Back" button after deep-linking.
2. **Security & XSS in Markdown (Story 1.3):** The specs say "safely parses GitHub-flavored markdown... without allowing the execution of raw script tags". But we aren't explicitly speccing a strict sanitizer like DOMPurify or `rehype-sanitize`. If an author includes an `<iframe>` or an SVG with an `onload` attribute in their markdown, we are wide open to XSS.
3. **Flaky Radix Focus Restoration (Story 7.8):** Relying on declarative `onCloseAutoFocus` to return a user to the exact grid card after closing the modal sounds nice. But because our grid is dynamically filtered via `useMemo`, if the state changed or the DOM re-flowed while the modal was open, Radix will throw an error trying to focus a detached DOM node.

## 🧪 The QA

"From a testing, stability, and edge-case perspective, the current specs have massive holes that will cause CI failures and user bugs:"

1. **URL Parameter Pollution (Epic 3 & 7):** What happens when the URL has `?project=alpha&project=beta` (an array instead of a string) or `?document=../../../etc/passwd`? The spec assumes happy-path navigation via UI clicks, but URLs are user input. If Zod isn't validating the shape of the Next.js `searchParams` arrays strictly, the app will crash with a 500.
2. **Filter Combinatorial Black Holes:** With Project, Domain, and Tech Stack all able to be toggled, a user will inevitably select a combination that yields 0 results. If the fallback UI (Story 11.1) kicks in, is the "Clear Filter" button explicitly tested in this empty state to ensure they can escape? Often, fallback states accidentally hide the very controls needed to reset them.
3. **End-to-End Test Brittleness (Epic 6):** Story 6.1 mentions resolving Epic 5's test collisions by adding `data-testid`s. If simply moving files to a `_shared` folder broke the E2E tests, it means our Playwright/Cypress tests were relying on localized DOM structures or exact text matches. We need absolute decoupling of the test selectors from the CSS framework and layout grid, or Epic 11's UI polish will just break the entire test suite again.

## 📝 Consensus

While the UI polish is nice, we have massive blind spots around **Mobile Accessibility**, **Initial Payload Performance**, **Modal UX Friction**, and **Next.js Routing Edge Cases**.
