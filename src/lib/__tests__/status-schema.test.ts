import {
    PlanSchema,
    WeekNoteSchema,
    ProjectStatus,
    buildChangelog,
    formatDay,
    planProgress,
} from "../status-schema";

const week = (slug: string, title: string, weekDate: string, dates: string[]) => ({
    projectSlug: slug,
    projectTitle: title,
    title: `${title} week`,
    week: weekDate,
    html: "",
    changes: dates.map((date) => ({ date, title: `${slug} ${date}`, kind: "shipped" as const, approach: {} })),
});

describe("status schema", () => {
    it("accepts a valid plan and rejects unknown milestone states", () => {
        expect(PlanSchema.safeParse({
            updated: "2026-10-29",
            milestones: [{ name: "Safety net", state: "done" }],
        }).success).toBe(true);

        const bad = PlanSchema.safeParse({
            updated: "2026-10-29",
            milestones: [{ name: "Safety net", state: "finished" }],
        });
        expect(bad.success).toBe(false);
    });

    it("rejects week notes with malformed dates or non-URL PR links", () => {
        expect(WeekNoteSchema.safeParse({ title: "x", week: "Oct 26" }).success).toBe(false);
        expect(WeekNoteSchema.safeParse({
            title: "x",
            week: "2026-10-26",
            changes: [{ date: "2026-10-27", title: "y", kind: "shipped", approach: { pr: "#7" } }],
        }).success).toBe(false);
    });

    it("builds one changelog across projects, newest first", () => {
        const statuses: ProjectStatus[] = [
            { slug: "a", title: "Alpha", publish: "full", weeks: [week("a", "Alpha", "2026-10-26", ["2026-10-26", "2026-10-28"])] },
            { slug: "b", title: "Beta", publish: "full", weeks: [week("b", "Beta", "2026-10-19", ["2026-10-20"])] },
        ];
        const feed = buildChangelog(statuses);
        expect(feed.map((e) => e.date)).toEqual(["2026-10-28", "2026-10-26", "2026-10-20"]);
        expect(feed[2]).toMatchObject({ projectSlug: "b", projectTitle: "Beta", week: "2026-10-19" });
    });

    it("counts done milestones", () => {
        expect(planProgress(undefined)).toEqual({ done: 0, total: 0 });
        expect(planProgress({
            title: "Plan",
            updated: "2026-10-29",
            milestones: [
                { name: "a", state: "done" },
                { name: "b", state: "active" },
                { name: "c", state: "done" },
            ],
        })).toEqual({ done: 2, total: 3 });
    });

    it("formats dates without timezone drift", () => {
        expect(formatDay("2026-10-01")).toBe("Oct 1, 2026");
        expect(formatDay("2026-01-31")).toBe("Jan 31, 2026");
    });
});
