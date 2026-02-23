# Decision Matrix - "Plan. Spec. Build." Agentic Builder's Workshop

**Author:** Dan
**Date:** 2026-02-22

---

This document outlines key decisions made during the planning and specification phases of the "Plan. Spec. Build." portfolio project. It serves to expose the "messy middle" of agentic development, demonstrating where human strategic oversight, constraint management, and user-centric design choices superseded or refined raw AI output.

## 1. Product & Strategic Decisions

### 1.1 Core Portfolio Architecture: The "Meta-Blueprint" Strategy
*   **The Problem:** How to demonstrate agentic capabilities without building a generic, easily-dismissed "AI toy app" that fails to impress hiring managers.
*   **Options Considered:**
    *   *Option A:* Build a complex SaaS product with user accounts and a database to prove technical chops.
    *   *Option B:* Build a portfolio site using the *exact framework* being pitched, making the portfolio itself "Project #1".
*   **The Decision:** We selected **Option B (The Meta-Blueprint Strategy)**.
*   **Rationale & Trade-offs:** Building a complex SaaS (Option A) introduces significant technical risk (auth, database management) that distracts from the core PM skills being evaluated (strategic oversight, documentation rigor). By turning the portfolio into the first case study, we immediately validate the "Tri-Pillar" (Tools -> Docs -> Software) framework. The trade-off is that the initial product appears technically simpler, requiring the documentation UI to do the heavy lifting to prove competence.

### 1.2 Minimizing "AI Slop" via the 3-Column Command Center
*   **The Problem:** Hiring managers are fatigued by generic AI-generated content. If they only see a final prototype, they assume the AI did 100% of the work.
*   **Options Considered:**
    *   *Option A:* Standard case study layout (Problem statement -> Final screenshot).
    *   *Option B:* The 3-Column "Command Center" explicitly linking Agent Tools -> Planning Docs -> Final Prototype.
*   **The Decision:** We selected **Option B (The 3-Column Layout)**.
*   **Rationale & Trade-offs:** Option A is industry standard but fails to differentiate the author in the AI era. Option B explicitly forces the user to acknowledge the intermediate steps (the PRD, this Decision Matrix). The trade-off is a significantly more complex UI challenge, requiring advanced responsive design to ensure the columns don't break on smaller screens. 

---

## 2. Design & UX Decisions

### 2.1 UI Animation Strategy: Brutal Cuts vs. Fluid Transitions (Phase 1 MVP)
*   **The Problem:** The core interaction is filtering the 3 columns (Browse Mode -> Focus Mode). The original UX vision called for fluid, spatial animations to make the transition feel "premium."
*   **Options Considered:**
    *   *Option A:* Implement complex CSS/JS spatial layout animations (e.g., Framer Motion) for the MVP.
    *   *Option B:* Implement brutal, instant 0ms DOM re-renders (state swapping) for the MVP, deferring animations to Phase 2.
*   **The Decision:** We selected **Option B (0ms Brutal Cuts)** for the MVP.
*   **Rationale & Trade-offs:** Adding animation libraries introduces significant rendering complexity and potential layout bugs when dealing with heavily populated CSS Grids. By descoping the fluid animations from the MVP, we drastically de-risk the initial build phase, ensuring core data rendering works flawlessly. The trade-off is a slightly less "magical" initial feel, but speed and reliability were prioritized over flair for V1.

### 2.2 Visual Identity: "Linear Purist" Dark Mode vs. Light Themes
*   **The Problem:** Defining the primary aesthetic tone to evoke "Effortless Authority" for hiring managers.
*   **Options Considered:**
    *   *Option A:* Notion Minimalist (Bright white, content-first).
    *   *Option B:* Apple Cinematic (White background, floating shadow cards).
    *   *Option C:* Linear Purist (Strict dark mode, subtle borders, high density).
*   **The Decision:** We selected **Option C (Linear Purist Dark Mode)**.
*   **Rationale & Trade-offs:** Options A and B failed to visually organize the high density of metadata tags required across the 3 columns, often feeling cluttered. The "Linear Purist" dark mode, utilizing our "Tinted Neutrality" grayscale system, allows status pills and the primary "Launch Prototype" CTA to pop without making the dashboard look chaotic. The trade-off is that dark mode can sometimes feel overly technical, so we mitigated this by using softer Notion-style layouts when opening the actual text documents in modals.

---

## 3. Technical & Architectural Decisions

### 3.1 Content Management: Git-Based SSG vs. Traditional CMS
*   **The Problem:** How should the Author efficiently add new portfolio projects (which consist of multiple markdown files each) without writing React code every time, while also establishing an educational path for Peer PMs?
*   **Options Considered:**
    *   *Option A:* Use a headless CMS (like Sanity or Contentful) to manage project data.
    *   *Option B:* Use a Git-based headless approach, utilizing static site generation (SSG) to parse markdown files directly from the repository.
*   **The Decision:** We selected **Option B (Git-based SSG parsing Markdown)**.
*   **Rationale & Trade-offs:** Setting up a traditional CMS (Option A) introduces unnecessary infrastructure overhead for a solo developer/PM. Since the *input* from the AI agents is already cleanly formatted Markdown, it is far more efficient to treat the GitHub repository itself as the database. Furthermore, this decision intentionally forces the Peer PM persona (the "Forker") to become comfortable and familiar with using Git, a critical threshold skill for modern technical product management. The trade-off is that updating the site requires a `git push` rather than a user-friendly CMS dashboard, but this aligns perfectly with both the Author's workflow and the educational goals of the Meta-Blueprint.
