#!/usr/bin/env node
/**
 * check-demos.ts — Demo Link Check (Roadmap 2.0, item 10)
 *
 * PURPOSE:
 *   Build Lab marks a prototype "Live" by hand. This check opens every link on
 *   every Live prototype and fails when one doesn't answer, so a dead demo is
 *   caught by the nightly workflow instead of by a visitor.
 *
 *   It reports only. It does not change a prototype's status; Dan decides
 *   whether a broken demo becomes WIP or gets fixed.
 *
 * USAGE:
 *   npm run check-demos
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

export const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

const PROTOTYPES_DIR = "prototypes";
const TIMEOUT_MS = 15_000;

export interface DemoLink {
    project: string;
    file: string;
    label: string;
    url: string;
}

export interface DemoResult extends DemoLink {
    ok: boolean;
    status?: number;
    error?: string;
}

/** Every link on every prototype whose status is Live. */
export function findLiveDemoLinks(contentRoot = CONTENT_ROOT): DemoLink[] {
    const links: DemoLink[] = [];
    for (const project of fs.readdirSync(contentRoot, { withFileTypes: true })) {
        if (!project.isDirectory()) continue;
        const dir = path.join(contentRoot, project.name, PROTOTYPES_DIR);
        if (!fs.existsSync(dir)) continue;
        for (const name of fs.readdirSync(dir).filter((n) => n.endsWith(".md"))) {
            const file = path.join(project.name, PROTOTYPES_DIR, name);
            let data: Record<string, unknown>;
            try {
                data = matter(fs.readFileSync(path.join(contentRoot, file), "utf-8")).data;
            } catch {
                continue; // invalid frontmatter is the content parser's problem, not this check's
            }
            if (data.status !== "Live" || !Array.isArray(data.links)) continue;
            for (const link of data.links as { label?: unknown; url?: unknown }[]) {
                if (typeof link?.url === "string") {
                    links.push({ project: project.name, file, label: String(link.label ?? link.url), url: link.url });
                }
            }
        }
    }
    return links;
}

/** Opens one link. Any 2xx or 3xx after redirects counts as up. */
export async function checkLink(link: DemoLink, fetchImpl: typeof fetch = fetch): Promise<DemoResult> {
    try {
        const response = await fetchImpl(link.url, {
            method: "GET",
            redirect: "follow",
            signal: AbortSignal.timeout(TIMEOUT_MS),
            headers: { "user-agent": "plan-spec-build-demo-check" },
        });
        return { ...link, ok: response.status < 400, status: response.status };
    } catch (err) {
        return { ...link, ok: false, error: err instanceof Error ? err.message : String(err) };
    }
}

export async function checkDemos(contentRoot = CONTENT_ROOT, fetchImpl: typeof fetch = fetch): Promise<DemoResult[]> {
    return Promise.all(findLiveDemoLinks(contentRoot).map((link) => checkLink(link, fetchImpl)));
}

if (require.main === module) {
    checkDemos().then((results) => {
        for (const r of results) {
            const outcome = r.ok ? `✓ ${r.status}` : `✗ ${r.status ?? r.error}`;
            console.log(`${outcome}  ${r.project}  ${r.label}  ${r.url}`);
        }
        const broken = results.filter((r) => !r.ok);
        if (broken.length > 0) {
            console.error(`\n${broken.length} of ${results.length} Live prototype link(s) did not answer.`);
            process.exit(1);
        }
        console.log(`\nAll ${results.length} Live prototype links answered.`);
    });
}
