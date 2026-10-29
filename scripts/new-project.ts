#!/usr/bin/env node
/**
 * new-project.ts — New Project Scaffold (Roadmap 2.0, item 15 / DAS-13)
 *
 * PURPOSE:
 *   Creates everything a new project needs so it shows up in all three
 *   columns without touching React or CSS:
 *     src/content/<slug>/index.md                 project overview
 *     src/content/<slug>/docs/coming-soon.md      first Blueprint row
 *     src/content/<slug>/prototypes/index.md      Build Lab card
 *   and adds the slug to the blueprints, build_lab and projects lists in
 *   sort-config.yaml, keeping the file's comments and order.
 *
 *   The project starts as a Concept with `publish: "none"`, so nothing about
 *   its plan or progress is public until the author opts in.
 *
 * USAGE:
 *   npm run new-project -- <slug> [--title "Display Title"]
 */

import fs from "fs";
import path from "path";
import { RESERVED_SEGMENTS } from "../src/lib/routes";

export const CONTENT_ROOT = path.join(process.cwd(), "src", "content");
const SORT_CONFIG = "sort-config.yaml";
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface NewProjectOptions {
    slug: string;
    title?: string;
    /** Defaults to today, as YYYY-MM-DD. */
    date?: string;
    contentRoot?: string;
}

/** "family-calendar" → "Family Calendar" */
export function titleFromSlug(slug: string): string {
    return slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/** Returns why a slug can't be used, or null when it can. */
export function validateSlug(slug: string, contentRoot = CONTENT_ROOT): string | null {
    if (!SLUG_PATTERN.test(slug)) return `"${slug}" must be lowercase words joined by hyphens, like "family-calendar".`;
    if (RESERVED_SEGMENTS.has(slug)) return `"${slug}" is reserved by the site.`;
    if (fs.existsSync(path.join(contentRoot, slug))) return `src/content/${slug} already exists.`;
    return null;
}

function quote(value: string): string {
    return JSON.stringify(value);
}

export function overviewFile(title: string, date: string): string {
    return `---
# 1. Core Identity
title: ${quote(title)}
date: ${quote(date)}
status: "Concept"
description: "One sentence on what {{PROJECT_NAME}} is and who it's for."
publish: "none"

# 2. Taxonomy
taxonomy:
  domain: []
  tech_stack: []
---

What {{PROJECT_NAME}} is, why it exists, and where it stands.
`;
}

export function comingSoonFile(date: string): string {
    return `---
# 1. Core Identity
title: "Blueprints: Coming Soon"
date: ${quote(date)}
status: "Concept"
artifact_type: "doc"
description: "Planning docs for {{PROJECT_NAME}} will land here."

# 2. Taxonomy
taxonomy:
  domain: []
  tech_stack: []
---

Blueprints for **{{PROJECT_NAME}}** are not published yet.
`;
}

export function prototypeFile(title: string, date: string): string {
    return `---
# 1. Core Identity
title: ${quote(title)}
date: ${quote(date)}
status: "Concept"
artifact_type: "prototype"
description: "What the prototype does, in one sentence."

# 2. Taxonomy
taxonomy:
  domain: []
  tech_stack: []

# 3. Relations & Connectivity
relations:
  projects: []
links: []
---

What someone will see when they open the prototype.
`;
}

/**
 * Appends entries to sort-config.yaml as text, so comments and ordering stay
 * exactly as the author wrote them. `blueprints` gets a nested list.
 */
export function addToSortConfig(yaml: string, slug: string): string {
    const lines = yaml.replace(/\n+$/, "").split("\n");

    const sectionEnd = (key: string): number => {
        const header = new RegExp(`^${key}:\\s*(#.*)?$`);
        const start = lines.findIndex((line) => header.test(line));
        if (start === -1) return -1;
        let end = start;
        for (let i = start + 1; i < lines.length; i++) {
            if (/^\S/.test(lines[i])) break;
            if (lines[i].trim()) end = i;
        }
        return end;
    };

    const insert = (key: string, entry: string[]) => {
        const end = sectionEnd(key);
        if (end === -1) {
            lines.push("", `${key}:`, ...entry);
        } else {
            lines.splice(end + 1, 0, ...entry);
        }
    };

    insert("blueprints", [`  ${slug}:`, "    - coming-soon"]);
    insert("build_lab", [`  - ${slug}`]);
    insert("projects", [`  - ${slug}`]);
    return lines.join("\n") + "\n";
}

/** Creates the project. Returns the files written, relative to the content root. */
export function createProject({ slug, title, date, contentRoot = CONTENT_ROOT }: NewProjectOptions): string[] {
    const problem = validateSlug(slug, contentRoot);
    if (problem) throw new Error(problem);

    const name = title?.trim() || titleFromSlug(slug);
    const day = date ?? new Date().toISOString().split("T")[0];
    const files: [string, string][] = [
        [path.join(slug, "index.md"), overviewFile(name, day)],
        [path.join(slug, "docs", "coming-soon.md"), comingSoonFile(day)],
        [path.join(slug, "prototypes", "index.md"), prototypeFile(name, day)],
    ];

    const configPath = path.join(contentRoot, SORT_CONFIG);
    const config = fs.existsSync(configPath) ? fs.readFileSync(configPath, "utf-8") : "";
    const nextConfig = addToSortConfig(config, slug);

    // Write everything or nothing, so a failed run never leaves a folder
    // behind that makes the next run refuse the slug.
    try {
        for (const [rel, body] of files) {
            const full = path.join(contentRoot, rel);
            fs.mkdirSync(path.dirname(full), { recursive: true });
            fs.writeFileSync(full, body);
        }
        fs.writeFileSync(configPath, nextConfig);
    } catch (err) {
        fs.rmSync(path.join(contentRoot, slug), { recursive: true, force: true });
        if (fs.existsSync(configPath)) fs.writeFileSync(configPath, config);
        throw err;
    }

    return [...files.map(([rel]) => rel), SORT_CONFIG];
}

export function parseArgs(argv: string[]): { slug?: string; title?: string } {
    const titleIndex = argv.indexOf("--title");
    const next = titleIndex >= 0 ? argv[titleIndex + 1] : undefined;
    const title = next !== undefined && !next.startsWith("--") ? next : undefined;
    const titleValueIndex = title !== undefined ? titleIndex + 1 : -1;
    const slug = argv.find((arg, i) => !arg.startsWith("--") && i !== titleValueIndex);
    return { slug, title };
}

if (require.main === module) {
    const { slug, title } = parseArgs(process.argv.slice(2));
    if (!slug) {
        console.error('Usage: npm run new-project -- <slug> [--title "Display Title"]');
        process.exit(1);
    }
    try {
        const written = createProject({ slug, title });
        console.log(`Created ${slug}:`);
        for (const file of written) console.log(`  src/content/${file}`);
        console.log(`\nNext: fill in the description and taxonomy, then run npm run dev. See docs/AUTHORING.md.`);
    } catch (err) {
        console.error(err instanceof Error ? err.message : String(err));
        process.exit(1);
    }
}
