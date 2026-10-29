// Server-only module — uses Node.js `fs`. Never import from a client component.

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { CONTENT_ROOT, getProjectSlugs } from "./content-utils";
import { renderMarkdownToHtml } from "./markdown-renderer";
import { DEFAULT_PUBLISH_LEVEL, PUBLISH_LEVELS, PublishLevel } from "./schema";
import {
    PlanSchema,
    ProjectPlan,
    ProjectStatus,
    WeekNote,
    WeekNoteSchema,
} from "./status-schema";

// =============================================================================
// Status Parser
// Reads generated status files and applies each project's publish level.
// Like the content parser, one bad file never breaks the build: it is skipped
// with a warning and everything else still renders.
// =============================================================================

export const STATUS_DIR = "status";
export const PLAN_FILE = "plan.md";
export const WEEK_FILE = /^week-(\d{4}-\d{2}-\d{2})\.md$/;

/**
 * Reads a project's publish level from its root index.md.
 * Missing, unreadable or invalid values fall back to the default ("none").
 */
export function readPublishLevel(projectSlug: string): PublishLevel {
    const indexPath = path.join(CONTENT_ROOT, projectSlug, "index.md");
    try {
        const { data } = matter(fs.readFileSync(indexPath, "utf-8"));
        const value = data.publish;
        if (value === undefined) return DEFAULT_PUBLISH_LEVEL;
        if ((PUBLISH_LEVELS as readonly string[]).includes(value)) return value as PublishLevel;
        console.warn(`[status] ${projectSlug}: invalid publish level "${String(value)}", treating as "${DEFAULT_PUBLISH_LEVEL}".`);
    } catch {
        // No index.md: nothing is published for this folder.
    }
    return DEFAULT_PUBLISH_LEVEL;
}

function readProjectTitle(projectSlug: string): string {
    try {
        const { data } = matter(fs.readFileSync(path.join(CONTENT_ROOT, projectSlug, "index.md"), "utf-8"));
        if (typeof data.title === "string" && data.title) return data.title;
    } catch {
        // fall through
    }
    return projectSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** gray-matter turns unquoted YAML dates into Date objects; the schema wants strings. */
function normalizeDates(value: unknown): unknown {
    if (value instanceof Date) return value.toISOString().split("T")[0];
    if (Array.isArray(value)) return value.map(normalizeDates);
    if (value !== null && typeof value === "object") {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, normalizeDates(v)])
        );
    }
    return value;
}

function describeIssues(error: z.ZodError): string {
    return error.issues
        .map((issue) => `${issue.path.map(String).join(".") || "root"}: ${issue.message}`)
        .join("; ");
}

function readPlan(statusDir: string, projectSlug: string): ProjectPlan | undefined {
    const planPath = path.join(statusDir, PLAN_FILE);
    if (!fs.existsSync(planPath)) return undefined;
    try {
        const { data } = matter(fs.readFileSync(planPath, "utf-8"));
        const result = PlanSchema.safeParse(normalizeDates(data));
        if (result.success) return result.data;
        console.warn(`[status] ${projectSlug}/${STATUS_DIR}/${PLAN_FILE} skipped: ${describeIssues(result.error)}`);
    } catch (err) {
        console.warn(`[status] ${projectSlug}/${STATUS_DIR}/${PLAN_FILE} skipped: ${String(err)}`);
    }
    return undefined;
}

async function readWeeks(statusDir: string, projectSlug: string, projectTitle: string): Promise<WeekNote[]> {
    const files = fs.readdirSync(statusDir).filter((name) => WEEK_FILE.test(name));
    const weeks: WeekNote[] = [];

    for (const file of files) {
        const rel = `${projectSlug}/${STATUS_DIR}/${file}`;
        try {
            const { data, content } = matter(fs.readFileSync(path.join(statusDir, file), "utf-8"));
            const result = WeekNoteSchema.safeParse(normalizeDates(data));
            if (!result.success) {
                console.warn(`[status] ${rel} skipped: ${describeIssues(result.error)}`);
                continue;
            }
            const fileWeek = WEEK_FILE.exec(file)?.[1];
            if (fileWeek !== result.data.week) {
                console.warn(`[status] ${rel} skipped: week "${result.data.week}" does not match the file name.`);
                continue;
            }
            weeks.push({
                ...result.data,
                projectSlug,
                projectTitle,
                html: await renderMarkdownToHtml(content.trim(), []),
            });
        } catch (err) {
            console.warn(`[status] ${rel} skipped: ${String(err)}`);
        }
    }

    return weeks.sort((a, b) => b.week.localeCompare(a.week));
}

/** Applies a publish level: `status` keeps milestone names, states and dates only. */
export function applyPublishLevel(status: ProjectStatus): ProjectStatus {
    if (status.publish === "full") return status;
    return {
        ...status,
        plan: status.plan && {
            ...status.plan,
            milestones: status.plan.milestones.map(({ name, state, started, finished }) => ({
                name,
                state,
                ...(started ? { started } : {}),
                ...(finished ? { finished } : {}),
            })),
        },
        weeks: [],
    };
}

/**
 * Loads the published status of every project, in no particular order.
 * Projects set to `none` (or unset) are left out entirely, and their status
 * files are never read.
 */
export async function getProjectStatuses(): Promise<ProjectStatus[]> {
    const statuses: ProjectStatus[] = [];

    for (const slug of getProjectSlugs()) {
        const publish = readPublishLevel(slug);
        if (publish === "none") continue;

        const statusDir = path.join(CONTENT_ROOT, slug, STATUS_DIR);
        if (!fs.existsSync(statusDir)) continue;

        const title = readProjectTitle(slug);
        const plan = readPlan(statusDir, slug);
        const weeks = publish === "full" ? await readWeeks(statusDir, slug, title) : [];
        if (!plan && weeks.length === 0) continue;

        statuses.push(applyPublishLevel({ slug, title, publish, plan, weeks }));
    }

    return statuses;
}
