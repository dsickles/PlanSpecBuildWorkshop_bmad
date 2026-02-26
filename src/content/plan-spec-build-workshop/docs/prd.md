---
title: "PRD"
date: "2026-02-22"
status: "Live"
artifact_type: "doc"
domain:
  - "Developer Tooling"
  - "Portfolio"
  - "Product Management"
tech_stack:
  - "Next.js"
  - "TypeScript"
  - "Tailwind CSS"
description: "Full PRD for the Plan Spec Build Workshop — user journeys, functional requirements, NFRs, and phased roadmap."
parent_project: "plan-spec-build-workshop"
---

# Product Requirements Document - "Plan. Spec. Build." Agentic Builder's Workshop

**Author:** Dan
**Date:** 2026-02-22

## Executive Summary

The "Plan. Spec. Build." Agentic Builder's Workshop is a zero-fluff, highly practical portfolio web application designed to document and showcase an Enterprise PM's agentic development journey. Unlike typical AI showcases that highlight "magical" one-click generation, this product intentionally exposes the rigorous "messy middle" of software development. It targets Hiring Managers seeking evidence of strategic oversight and Peer PMs looking for a proven blueprint to adopt agentic workflows. By prioritizing demonstrable product management discipline—such as constraints management and architectural trade-offs—the platform establishes the author as a pragmatic orchestrator of AI tools, building trust through verifiable, human-edited documentation.

### What Makes This Special

The core differentiator is the platform's **interlocking 3-column architecture** (Agent Studio, Blueprints, Build Lab), which visually and functionally connects the tools used (how), the rigorous documentation produced (why), and the final deployed prototypes (what). Crucially, the platform employs a "Meta-Blueprint" strategy: the portfolio itself serves as the foundational Project #1. This recursive structure immediately validates the methodology by demonstrating that the author uses their own framework. Additionally, explicit "Decision Matrices" within the Blueprints document instances where AI output required human intervention, proving editorial rigor and rejecting generic "AI slop."

## Project Classification

- **Type:** Web Application (SPA/Static Site)
- **Domain:** General (Professional Portfolio / Educational Showcase)
- **Complexity:** Low (Standard requirements focused heavily on UX, content structure, and document linking)
- **Context:** Greenfield

## Success Criteria

### User Success (The Hiring Manager & Peer PM)
- **The "Aha!" Moment:** When a Hiring Manager navigates from a prototype back to its accompanying "Decision Matrix" and realizes the PM didn't just generate code, but actively managed constraints.
- **Completion Scenario:** A Peer PM successfully forks the "Meta-Blueprint" repository and is able to launch their own blank Builder's Workshop within 30 minutes.

### Business/Personal Success
- **Immediate (0-3 months):** The V1 portfolio is live with the Meta-Blueprint and at least 2 other functional projects fully documented.
- **Metric:** The portfolio functions entirely standalone; it can be evaluated by a non-technical recruiter without requiring a GitHub account, IDE setup, or technical explanation.

### Technical Success
- **Performance:** Navigation between the 3 columns must feel instantaneous to maintain the "Command Center" feel (see NFR1-NFR3 for formal benchmarks).
- **Maintainability:** Adding a new project simply requires dropping a markdown file into a folder, without needing to touch the core routing or UI code.


## User Journeys

### Journey 1: The Skeptical Hiring Manager (Primary Evaluator)
- **Opening Scene:** A Hiring Manager clicks the portfolio link, groaning internally. They've seen dozens of "I built an app with AI" portfolios this week, mostly generic, single-prompt outputs with no depth. They expect more "AI Slop."
- **Rising Action:** They land on the "Plan. Spec. Build." dashboard. It doesn't look like a basic tech demo; it looks like a professional workshop. They select a project and the UI dynamically sorts into the 3-column view. They scan the thoughtfully designed UI cards for the Blueprints and notice the PRD sounds distinctly human-authored. They spot a document titled "Decision Matrix."
- **Climax:** They open the Decision Matrix and read a specific entry detailing how the AI failed at a complex architectural constraint, and how the PM (you) explicitly intervened to course-correct the schema. 
- **Resolution:** The skepticism vanishes. The Hiring Manager realizes this candidate is a rigorous product manager who *commands* AI tools, not someone who just gets lucky with prompts. They click the "Build Lab" link to view the working prototype, already convinced of your strategic value.

### Journey 2: The Inspired Peer PM (The Forker)
- **Opening Scene:** A Peer PM lands on your portfolio via LinkedIn. They want to start using agentic tools but are overwhelmed by the technical jargon and don't know how to organize their workflow.
- **Rising Action:** They explore the portfolio, noticing that all project cards, regardless of complexity, share the same clean, egalitarian design. Intrigued by the underlying framework that powers this consistent presentation, they notice a prominent "About this Project" link in the top global navigation header.
- **Climax:** They click "About this Project" and read a dedicated page that clearly explains the Tri-Pillar philosophy (Tools -> Docs -> Software). At the bottom of this explanation, they discover the clear call-to-action: a "Fork a Workshop" link leading to a clean, empty repository template.
- **Resolution:** They fork the repo. Within 30 minutes, they drop in their first brainstorming markdown file. They have transformed from a confused observer into an active agentic builder, grateful for the top-level template.

### Journey 3: The Author / Admin (The Content Creator)
- **Opening Scene:** You have just finished a grueling two-week sprint building a new side project. The code is pushed, and you have a folder full of rich BMAD markdown output files. You want to update your portfolio but are dreading formatting HTML.
- **Rising Action:** Instead of opening a CMS or writing UI code, you simply copy the markdown files into a new `/_projects/project-x` directory in your portfolio repo. If this project used an AI agent already tracked in the shared `_shared/agents/` folder, you add the project slug to that agent's `projects` frontmatter array. If it's a brand-new agent, you drop a new `.md` file into `_shared/agents/`. You update `sort-config.yaml` to set the display order of the new project's documents.
- **Climax:** You commit and push the folder. You don't write a single line of React or CSS.
- **Resolution:** Your CI/CD pipeline runs. Within 2 minutes, the live portfolio site automatically parses the new markdown, assigns the correct UI cards based on your thoughtful UX design, and updates the Tri-Modal filtering system. The project is live effortlessly.

### Journey Requirements Summary
- **For the Hiring Manager:** Clean, highly scannable UI cards; clear visual distinction between artifacts; extremely fast, interlocking navigation to maintain the "Command Center" feel.
- **For the Peer PM:** Prominent placement of the "Meta-Blueprint" (Project #1); clear educational copy; a seamless link out to a well-documented GitHub template repository in the "About this Project" page.
- **For the Author:** A file-system-based CMS driven entirely by Markdown and Frontmatter/YAML configuration; robust markdown parsing with support for tables/code blocks; automated CI/CD deployment. Shared Agent Studio items managed in a central folder with project association via frontmatter, and a central sort manifest for controlling display order.

## Domain-Specific Requirements

### Compliance & Accessibility
- **WCAG 2.1 AA Compliance:** Inclusive design is a core requirement to demonstrate professional standards to hiring managers. Formal conformance targets are defined in NFR4-NFR5.

### Technical Constraints (Portfolio Domain)
- **Responsive Design:** The MVP (Phase 1) targets desktop only (≥1024px). The 3-column "Command Center" layout is designed for desktop monitors. Mobile/tablet responsive design — including the column-switching tab bar pattern — is deferred to v2. Cross-browser compatibility on desktop remains required.
- **Cross-Browser Compatibility:** Must function flawlessly across modern versions of Chrome, Safari, Firefox, and Edge.
- **SEO Optimization:** Basic technical SEO (meta tags, descriptive URLs, structured data where appropriate) must be implemented to ensure the portfolio is discoverable if the user chooses to index it.

### Risk Mitigations & Future Enhancements
- **Fluid Grid Transitions (Growth Feature):** Upgrade the core Phase 1 0ms instant filter transition to a 200ms fluid, spatial CSS animation. This will require a custom React component wrapper (Grid Transition Controller) utilizing `useEffect` to delay unmounting, allowing for smooth CSS `transform` and `opacity` animations without heavy external libraries.
- **Full-Text Search (Growth Feature):** Implementing robust full-text search across the parsed markdown (utilizing a lightweight client-side index like FlexSearch if the artifact count grows substantially).
- **Link Rot Mitigation (Growth Feature):** Future versions will require a fallback strategy (e.g., archived screenshots or read-only states) for "Build Lab" prototype links that may go offline or break due to external API changes.
- **Offline Mode (Future Vision):** Future consideration for PWA (Progressive Web App) capabilities to allow the portfolio to be presented natively in unreliable network conditions (e.g., during live interviews).

## Innovation & Novel Patterns

### Detected Innovation Areas
- **Recursive "Meta-Blueprint" Architecture:** The framework itself serves as the first proven case study, instantly demonstrating the PM's ability to architect and ship agent-built software. It transcends a static resume by offering a deployable B2B micro-product ("Fork a Workshop") for peer PMs.
- **"Proof of Work" Documentation Framework:** While "exposing the messy middle" is the core differentiator, the *innovation* is the structural mechanism used to achieve it. The interlocking 3-column architecture—specifically the introduction of the "Decision Matrix" artifact—creates a standardized, repeatable format for auditing AI output and proving human strategic intervention. 

### Market Context & Competitive Landscape
- **Standard Portfolios:** Typically rely on generic case study formats (Problem, Solution, Result) with static screenshots. 
- **This Approach:** Offers a live, interlocking ecosystem demonstrating *how* the sausage is made (Tools -> Docs -> Prototype), explicitly designed to build trust by exposing the "messy middle" of agentic development.

### Validation Approach
- **Success Metric:** The primary validation of this innovation occurs when a peer PM successfully forks the repository and deploys their own instance, proving the architecture is robust and the documentation is clear.

## Web App Specific Requirements

### Project-Type Overview
As a Professional Portfolio and Builder's Workshop, the application functions primarily as a content-delivery SPA (Single Page Application) or statically generated site. It prioritizes fast, seamless navigation between complex text documents and external links over heavy transactional data processing.

### Technical Architecture Considerations
- **Architecture Pattern:** Jamstack or Static Site Generation (SSG) is highly recommended (e.g., Next.js, Astro, or Nuxt) to ensure the Markdown documents are pre-rendered for maximum speed and SEO discoverability, while maintaining SPA-like instant navigation between the 3 columns.
- **State Management:** Minimal global state is required (primarily just the active filtering states: Project, Domain, Tech Stack). 
- **Content Parsing:** The architecture must include a robust Markdown parser (capable of handling tables, code blocks, GitHub-flavored markdown, and frontmatter YAML) to convert the raw BMad output files into the polished Blueprint UI cards.

### Browser & Performance Targets
- **Performance:** Formal performance benchmarks are defined in NFR1-NFR3. The architecture must be optimized to meet these targets.
- **Browser Matrix:** Support for the latest 2 versions of major browsers (Chrome, Safari, Firefox, Edge).

### Implementation Considerations
- **CMS Approach:** A "Git-based CMS" approach is required. New projects are added by committing markdown folders, triggering a CI/CD rebuild, rather than relying on a separate database or external CMS platform.
- **Hosting:** Must be deployable to standard edge/static hosting providers (e.g., Vercel, Netlify, GitHub Pages) for zero-maintenance uptime.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy
- **MVP Approach:** *Experience MVP*. The primary technical risk is not data processing, but UI/UX execution. The MVP must perfectly execute the 3-column "Command Center" navigation and flawlessly parse BMad markdown output to prove the organizational concept.
- **Resource Requirements:** Solo Developer / PM acting as both Content Creator and Frontend Engineer.

### MVP Feature Set (Phase 1)
**Core User Journeys Supported:**
- Journey 1: The Skeptical Hiring Manager (Evaluating the PM)
- Journey 2: The Inspired Peer PM (Forking the Meta-Blueprint template)

**Must-Have Capabilities:**
- Desktop-only 3-column UI layout (Agent Studio, Blueprints, Build Lab) — mobile/tablet responsive design deferred to v2
- Tri-modal filtering system (Project, Domain, Tech Stack)
- The complete "Meta-Blueprint" content (The portfolio documentation itself)
- Global navigation header with "About this Project" and "Fork a Workshop" links
- Dark/Light mode toggle
- **Card UX & Navigation:** Individual cards within the columns must be thoughtfully optimized for scannability, featuring contextually appropriate "at a glance" information for personas. The cards must support explicit intra-linking (e.g., clicking directly from a prototype card to its specific PRD or Decision Matrix). Note: Phase 1 prioritizes a 0ms instant transition when filtering to guarantee core layout stability and Markdown parsing capabilities.
- **Tri-modal filtering:** Domain and Tech Stack filters apply across ALL three columns (Agent Studio, Blueprints, Build Lab). Any card in any column that lacks the selected tag is hidden from view. This cross-column filtering behavior is consistent in both Browse Mode and Focus Mode.

### Post-MVP Features
**Phase 2 (Growth):**
- **Deployment & Go-Live:** Connect the GitHub repository to Vercel (or equivalent edge host) and trigger a production build. The CI/CD pipeline must correctly execute `npm run build` without failing on Zod or TypeScript errors, deploying the application to a public domain with SSG routing and Markdown parsing working identically to the local environment. (NFR6, NFR7)
- **Fluid Grid Transitions:** Upgrade the core Phase 1 0ms instant filter transition to a 200ms fluid, spatial CSS animation (The "Command Center Collapse") to elevate the "premium studio" feel.
- Integration of live, embedded iframes for prototypes (instead of external links)
- Mobile/tablet responsive layout — the 3-column Command Center must adapt to smaller screens while preserving the mental model of three distinct content lanes (e.g., sticky tab bar for column switching)
- An interactive graph or visualization showing connections between tools and artifacts
- A "How to build your own Agent" tutorial section
- Support for Journey 3 (The Author) via more advanced automated deployment pipelines — *Note: Journey 3 is partially supported in Phase 1 via FR1-FR3 (basic markdown publishing). Phase 2 adds advanced CI/CD automation.*
- Basic usage telemetry (e.g., Vercel Analytics) to validate the "Evaluator" user journey (tracking document views vs. prototype launches)

**Phase 3 (Expansion):**
- Multi-tenant hosting (allowing other PMs to deploy their instances to a centralized domain) — *Note: This represents a non-trivial architectural pivot from a single static site and should not influence MVP architecture decisions.*
- Offline support (PWA integration)
- Link rot mitigation (archived screenshots for dead prototypes)

### Risk Mitigation Strategy
- **Technical Risks:** *Markdown Parsing Complexity.* Mitigation: Build Phase 1 using established SSG tools (like Astro or Next.js) that have robust out-of-the-box markdown handling rather than rolling a custom parser.
- **Market Risks:** *Lack of interest from Hiring Managers.* Mitigation: The MVP is inherently valuable as a personal historical record even if no one else looks at it, ensuring the build effort is never wasted.
- **Resource Risks:** *UI build takes too long.* Mitigation: Start with a minimalist, brutalist "no-fluff" CSS framework to guarantee the routing and markdown parsing works before adding visual polish.
- **UX Risks:** *Mobile Adaptation of 3-Column Layout.* The product's identity is the interlocking 3-column "Command Center." Mitigation: Mobile responsive design is deferred to v2 to keep the MVP focused on the desktop experience where hiring managers primarily evaluate portfolios. The v2 UX design phase will define a mobile navigation pattern (e.g., tab-based column switcher) that preserves the sense of column interconnection.

## Functional Requirements 

### Content Management & Publishing
- **FR1:** The Author can publish new projects by adding markdown folders to the project repository.
- **FR2:** The Author can update project metadata (e.g., Domain, Tech Stack) via frontmatter configuration.
- **FR3:** The Author can publish distinct artifact types (PRD, Test Plan, Decision Matrix) for a single project.
- **FR4:** The System can parse standard markdown elements (headers, lists, bold/italics), specifically GitHub-flavored markdown (tables, code blocks).

### Navigation & Layout (The "Command Center")
- **FR5:** The System must display projects and their artifacts in a 3-column layout (Agent Studio, Blueprints, Build Lab).
- **FR6:** The User can navigate between a project's tools, documents, and prototypes instantly (0ms UI re-render) without triggering a full page reload.
- **FR7:** ~~The System must adapt the 3-column layout to a stacked, usable layout on mobile devices.~~ *Deferred to v2.* The MVP targets desktop only (≥1024px). Mobile/tablet responsive layout will be designed and implemented in Phase 2.
- **FR8:** The User can toggle between Light and Dark interface modes.

### Discovery & Filtering
- **FR9:** The User can filter the portfolio view by "Project".
- **FR10:** The User can filter the portfolio view by "Functional Domain" (e.g., Internal Tools, B2B SaaS).
- **FR11:** The User can filter the portfolio view by "Tech Stack" (e.g., Python, React).
- **FR12:** The User can view "at a glance" summary metadata on all project and artifact cards prior to clicking them.

### Cross-Linking & The Meta-Blueprint
- **FR13:** The User can navigate directly from a specific prototype back to its accompanying documentation (e.g., its specific Decision Matrix) via explicit intra-linking.
- **FR14:** The User can access an "About this Project" educational page from the global navigation.
- **FR15:** The User can access a "Fork a Workshop" link to copy the underlying repository template.
- **FR16:** The System must present the portfolio itself ("Plan. Spec. Build.") as the first selectable project (The Meta-Blueprint).
- **FR17:** The User can view all portfolio content (projects, blueprints, prototypes) without requiring authentication or an account on any external platform.
- **FR18:** (Deferred to v2) The System will support basic usage telemetry (e.g., Vercel Analytics) to validate the "Evaluator" user journey (tracking document views vs. prototype launches).

### Shared Content & Display Ordering
- **FR19:** The System must support shared Agent Studio items that can be associated with zero or more projects via a `projects` frontmatter array, without requiring file duplication across project folders. Agents without a `projects` field (or with an empty array) are displayed only in Browse Mode and hidden when a project filter is active. Agents with a `projects` array are displayed when any of their listed projects match the active project filter.
- **FR20:** The Author can define the display order of Agent Studio cards, Blueprint documents (per project), Build Lab cards, and project filter pills via a central `sort-config.yaml` manifest file. Items not listed in the manifest appear after listed items, sorted alphabetically by title.

## Non-Functional Requirements

### Performance
- **NFR1:** First Contentful Paint (FCP) must occur within 1.0 second on a standard 4G connection.
- **NFR2:** Client-side routing between the three main columns (Studio, Blueprints, Lab) must complete in under 100 milliseconds.
- **NFR3:** The application must achieve a Google Lighthouse Performance score of 90+.

### Accessibility
- **NFR4:** The application must strictly adhere to WCAG 2.1 Level AA conformance.
- **NFR5:** The application must achieve a Google Lighthouse Accessibility score of 95+ (verifying contrast ratios, ARIA labels, and keyboard navigability).

### Reliability & Maintainability
- **NFR6:** The system must support automated deployments triggered directly from `git push` events without manual server configuration.
- **NFR7:** System uptime will rely entirely on the chosen edge hosting provider's SLA (e.g., Vercel or Netlify's 99.99% edge network uptime), requiring no dedicated backend container management.

### SEO
- **NFR8:** The application must achieve a Google Lighthouse SEO score of 90+.

### Build Performance
- **NFR9:** Full site rebuild (SSG) must complete in under 60 seconds with up to 20 projects.
