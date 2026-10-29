import { z } from "zod";
import { PublishLevel } from "./schema";

// =============================================================================
// Generated Status Schema
// The contract between the bots that write status files and the site that
// renders them. Files live in src/content/<project-slug>/status/:
//   plan.md                 — milestones (frontmatter only)
//   week-YYYY-MM-DD.md      — one week note per project per week (Monday date)
// See docs/AUTHORING.md → "Generated status files".
// =============================================================================

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const isoDate = (label: string) =>
    z.string().regex(ISO_DATE, `${label} must be a YYYY-MM-DD date`);

export const MILESTONE_STATES = ["done", "active", "planned", "paused"] as const;
export type MilestoneState = (typeof MILESTONE_STATES)[number];

export const MilestoneSchema = z.object({
    name: z.string().min(1, "milestone name is required"),
    state: z.enum(MILESTONE_STATES, {
        error: `state must be one of: ${MILESTONE_STATES.join(", ")}`,
    }),
    started: isoDate("started").optional(),
    finished: isoDate("finished").optional(),
    /** One plain-language line. Hidden when the project publishes `status` only. */
    summary: z.string().optional(),
});
export type Milestone = z.infer<typeof MilestoneSchema>;

export const PlanSchema = z.object({
    title: z.string().default("Plan"),
    updated: isoDate("updated"),
    milestones: z.array(MilestoneSchema).min(1, "a plan needs at least one milestone"),
});
export type ProjectPlan = z.infer<typeof PlanSchema>;

export const CHANGE_KINDS = ["shipped", "changed", "fixed", "reverted", "cut", "started", "decided"] as const;
export type ChangeKind = (typeof CHANGE_KINDS)[number];

/** How a change was made: the trail from issue to a result someone can open. */
export const ApproachSchema = z.object({
    /** Tracker issue id, e.g. "DAS-100". Shown as text, never linked (Linear is private). */
    issue: z.string().optional(),
    /** The tool or bot that did the work, e.g. "Claude Code", "Gates". */
    tool: z.string().optional(),
    /** Public pull request URL. */
    pr: z.string().url("pr must be a URL").optional(),
    /** A result a person can open: a preview, demo or screenshot URL. */
    result: z.string().url("result must be a URL").optional(),
});
export type Approach = z.infer<typeof ApproachSchema>;

export const ChangeSchema = z.object({
    date: isoDate("date"),
    title: z.string().min(1, "change title is required"),
    kind: z.enum(CHANGE_KINDS, {
        error: `kind must be one of: ${CHANGE_KINDS.join(", ")}`,
    }),
    approach: ApproachSchema.default({}),
});
export type ChangeEntry = z.infer<typeof ChangeSchema>;

export const WeekNoteSchema = z.object({
    title: z.string().min(1, "title is required"),
    /** The Monday that starts the week. */
    week: isoDate("week"),
    /** Who wrote the note: a person or a bot. */
    author: z.string().optional(),
    changes: z.array(ChangeSchema).default([]),
});

export interface WeekNote {
    projectSlug: string;
    projectTitle: string;
    title: string;
    week: string;
    author?: string;
    /** Sanitized HTML of the note body (what moved, what got cut, what's next). */
    html: string;
    changes: ChangeEntry[];
}

/** Everything the site may show for one project, already filtered by its publish level. */
export interface ProjectStatus {
    slug: string;
    title: string;
    publish: Exclude<PublishLevel, "none">;
    plan?: ProjectPlan;
    /** Newest first. Always empty when publish is `status`. */
    weeks: WeekNote[];
}

/** A changelog row: one change with its project attached. */
export interface ChangelogEntry extends ChangeEntry {
    projectSlug: string;
    projectTitle: string;
    week: string;
}

/** Flattens week notes into one dated feed, newest first. */
export function buildChangelog(statuses: readonly ProjectStatus[]): ChangelogEntry[] {
    const entries: ChangelogEntry[] = [];
    for (const status of statuses) {
        for (const week of status.weeks) {
            for (const change of week.changes) {
                entries.push({
                    ...change,
                    projectSlug: status.slug,
                    projectTitle: status.title,
                    week: week.week,
                });
            }
        }
    }
    return entries.sort((a, b) => b.date.localeCompare(a.date) || a.projectTitle.localeCompare(b.projectTitle));
}

/** "3 of 5 milestones done" style progress for a plan. */
export function planProgress(plan: ProjectPlan | undefined): { done: number; total: number } {
    if (!plan) return { done: 0, total: 0 };
    return {
        done: plan.milestones.filter((m) => m.state === "done").length,
        total: plan.milestones.length,
    };
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Formats a YYYY-MM-DD string as "Oct 27, 2026" without timezone drift. */
export function formatDay(date: string): string {
    const [y, m, d] = date.split("-").map(Number);
    return `${MONTHS[m - 1]} ${d}, ${y}`;
}
