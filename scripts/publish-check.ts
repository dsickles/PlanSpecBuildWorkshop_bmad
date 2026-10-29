#!/usr/bin/env node
/**
 * publish-check.ts — Publish Check (Roadmap 2.0, item 7)
 *
 * PURPOSE:
 *   The repository is public, so anything committed under src/content/ is
 *   published, whatever the site renders. This check fails CI when content:
 *     1. contains something private: email addresses, API keys or tokens,
 *        calendar feed links, secret-bearing URLs, or PIN codes;
 *     2. breaks a project's publish setting: status files in a project set to
 *        `none`, or week notes in a project set to `status`;
 *     3. adds status files that don't match the schema the site expects.
 *
 *   It does not depend on a bot remembering the rules: Gates's weekly PRs,
 *   hand edits and Claude's PRs all pass through the same gate.
 *
 * ALLOWING A FALSE POSITIVE:
 *   Add the exact matched text, one per line, to scripts/publish-check.allow.
 *
 * USAGE:
 *   npm run publish-check
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PlanSchema, WeekNoteSchema } from "../src/lib/status-schema";

export const CONTENT_ROOT = path.join(process.cwd(), "src", "content");
export const ALLOW_FILE = path.join(process.cwd(), "scripts", "publish-check.allow");

const SHARED_DIR = "_shared";
const STATUS_DIR = "status";
const WEEK_FILE = /^week-(\d{4}-\d{2}-\d{2})\.md$/;
const PUBLISH_LEVELS = ["full", "status", "none"];

export interface Finding {
    file: string;
    line?: number;
    rule: string;
    detail: string;
}

// ─── Private-data patterns ────────────────────────────────────────────────────

interface Pattern {
    rule: string;
    regex: RegExp;
}

export const PRIVATE_PATTERNS: Pattern[] = [
    { rule: "email address", regex: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
    { rule: "API key", regex: /\b(?:sk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|AIza[0-9A-Za-z_-]{35}|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|xox[abprs]-[A-Za-z0-9-]{10,}|lin_api_[A-Za-z0-9]{20,})\b/g },
    { rule: "private key", regex: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
    { rule: "credential assignment", regex: /\b(?:api[_-]?key|secret|password|passwd|token)\s*[:=]\s*["']?[A-Za-z0-9_\-/+=]{12,}/gi },
    { rule: "calendar feed link", regex: /\b(?:webcal:\/\/\S+|https?:\/\/\S+\.ics\b\S*|https?:\/\/calendar\.google\.com\/calendar\/ical\/\S+)/gi },
    { rule: "secret in a URL", regex: /https?:\/\/\S+[?&](?:token|key|secret|sig|signature|access_token|auth)=[^&\s)"']+/gi },
    { rule: "PIN code", regex: /\bPIN\s*(?:code)?\s*(?:is|[:=])\s*\d{4,8}\b/gi },
];

/** Matches that are always fine: placeholders and no-reply addresses. */
const BUILT_IN_ALLOW = [
    /@example\.(?:com|org|net)$/i,
    /^noreply@/i,
    /@users\.noreply\.github\.com$/i,
    /@anthropic\.com$/i, // commit co-author trailers quoted in docs
];

export function loadAllowList(file = ALLOW_FILE): string[] {
    if (!fs.existsSync(file)) return [];
    return fs
        .readFileSync(file, "utf-8")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"));
}

/** Scans text for private data. Line numbers are 1-based. */
export function scanText(text: string, file: string, allow: string[] = []): Finding[] {
    const findings: Finding[] = [];
    const lines = text.split("\n");
    lines.forEach((lineText, index) => {
        for (const { rule, regex } of PRIVATE_PATTERNS) {
            for (const match of lineText.matchAll(regex)) {
                const value = match[0];
                if (allow.includes(value)) continue;
                if (rule === "email address" && BUILT_IN_ALLOW.some((re) => re.test(value))) continue;
                findings.push({ file, line: index + 1, rule, detail: value });
            }
        }
    });
    return findings;
}

// ─── Publish settings and status files ────────────────────────────────────────

function readPublish(projectDir: string): string {
    const indexPath = path.join(projectDir, "index.md");
    if (!fs.existsSync(indexPath)) return "none";
    const value = matter(fs.readFileSync(indexPath, "utf-8")).data.publish;
    return value === undefined ? "none" : String(value);
}

function zodMessage(issues: { path: PropertyKey[]; message: string }[]): string {
    return issues.map((i) => `${i.path.map(String).join(".") || "root"}: ${i.message}`).join("; ");
}

/** Checks one project's publish setting against the status files it carries. */
export function checkProject(contentRoot: string, slug: string): Finding[] {
    const findings: Finding[] = [];
    const projectDir = path.join(contentRoot, slug);
    const publish = readPublish(projectDir);
    const rel = (name: string) => path.join(slug, STATUS_DIR, name);

    if (!PUBLISH_LEVELS.includes(publish)) {
        findings.push({ file: path.join(slug, "index.md"), rule: "publish setting", detail: `"${publish}" is not one of ${PUBLISH_LEVELS.join(", ")}` });
    }

    const statusDir = path.join(projectDir, STATUS_DIR);
    if (!fs.existsSync(statusDir)) return findings;

    for (const name of fs.readdirSync(statusDir)) {
        const file = rel(name);
        if (publish === "none") {
            findings.push({ file, rule: "publish setting", detail: `${slug} publishes nothing (publish: none), so it must not carry status files. The repo is public.` });
            continue;
        }

        const full = path.join(statusDir, name);
        if (name === "plan.md") {
            const result = PlanSchema.safeParse(normalizeDates(matter(fs.readFileSync(full, "utf-8")).data));
            if (!result.success) findings.push({ file, rule: "status schema", detail: zodMessage(result.error.issues) });
            continue;
        }

        const week = WEEK_FILE.exec(name);
        if (!week) {
            findings.push({ file, rule: "status file name", detail: "status/ holds only plan.md and week-YYYY-MM-DD.md" });
            continue;
        }
        if (publish === "status") {
            findings.push({ file, rule: "publish setting", detail: `${slug} publishes milestones only (publish: status), so week notes stay out of the repo.` });
            continue;
        }
        const result = WeekNoteSchema.safeParse(normalizeDates(matter(fs.readFileSync(full, "utf-8")).data));
        if (!result.success) {
            findings.push({ file, rule: "status schema", detail: zodMessage(result.error.issues) });
        } else if (result.data.week !== week[1]) {
            findings.push({ file, rule: "status schema", detail: `week "${result.data.week}" does not match the file name` });
        }
    }

    return findings;
}

function normalizeDates(value: unknown): unknown {
    if (value instanceof Date) return value.toISOString().split("T")[0];
    if (Array.isArray(value)) return value.map(normalizeDates);
    if (value !== null && typeof value === "object") {
        return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, normalizeDates(v)]));
    }
    return value;
}

// ─── Runner ───────────────────────────────────────────────────────────────────

function contentFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return contentFiles(full);
        return /\.(md|ya?ml|json)$/.test(entry.name) ? [full] : [];
    });
}

export function runPublishCheck(contentRoot = CONTENT_ROOT, allow = loadAllowList()): Finding[] {
    const findings: Finding[] = [];

    for (const file of contentFiles(contentRoot)) {
        findings.push(...scanText(fs.readFileSync(file, "utf-8"), path.relative(contentRoot, file), allow));
    }

    const projects = fs
        .readdirSync(contentRoot, { withFileTypes: true })
        .filter((e) => e.isDirectory() && e.name !== SHARED_DIR)
        .map((e) => e.name);
    for (const slug of projects) findings.push(...checkProject(contentRoot, slug));

    return findings;
}

if (require.main === module) {
    const findings = runPublishCheck();
    if (findings.length === 0) {
        console.log("✓ Publish check passed: no private data, and every project's status files match its publish setting.");
    } else {
        console.error(`✗ Publish check found ${findings.length} problem(s) in src/content:\n`);
        for (const f of findings) {
            console.error(`  ${f.file}${f.line ? `:${f.line}` : ""}  [${f.rule}]  ${f.detail}`);
        }
        console.error("\nRemove the private data, or if a match is a false positive, add the exact text to scripts/publish-check.allow.");
        process.exit(1);
    }
}
