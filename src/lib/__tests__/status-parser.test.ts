import fs from "fs";
import os from "os";
import path from "path";

// jest.mock is hoisted above imports, so the factory derives the same path itself.
const tmpRoot = path.join(os.tmpdir(), `psb-status-${process.pid}`);

jest.mock("../content-utils", () => {
    const actualFs = jest.requireActual("fs");
    const root = jest.requireActual("path").join(jest.requireActual("os").tmpdir(), `psb-status-${process.pid}`);
    return {
        CONTENT_ROOT: root,
        getProjectSlugs: () =>
            actualFs
                .readdirSync(root, { withFileTypes: true })
                .filter((e: fs.Dirent) => e.isDirectory() && e.name !== "_shared")
                .map((e: fs.Dirent) => e.name),
    };
});
jest.mock("../markdown-renderer", () => ({
    renderMarkdownToHtml: jest.fn(async (content: string) => `<p>${content}</p>`),
}));

import { getProjectStatuses, readPublishLevel } from "../status-parser";

function write(rel: string, text: string) {
    const file = path.join(tmpRoot, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
}

const index = (title: string, publish?: string) =>
    `---\ntitle: "${title}"\ndate: "2026-10-01"\nstatus: "WIP"\n${publish ? `publish: "${publish}"\n` : ""}---\n`;

const plan = `---
updated: "2026-10-29"
milestones:
  - name: "One"
    state: "done"
    started: "2026-10-01"
    finished: "2026-10-10"
    summary: "Private detail"
  - name: "Two"
    state: "active"
---
`;

const weekNote = (weekDate: string) => `---
title: "Week ${weekDate}"
week: "${weekDate}"
changes:
  - date: "${weekDate}"
    title: "Did a thing"
    kind: "shipped"
    approach:
      issue: "DAS-1"
---
What moved.
`;

beforeAll(() => {
    write("full-project/index.md", index("Full Project", "full"));
    write("full-project/status/plan.md", plan);
    write("full-project/status/week-2026-10-19.md", weekNote("2026-10-19"));
    write("full-project/status/week-2026-10-26.md", weekNote("2026-10-26"));
    write("full-project/status/week-2026-10-12.md", weekNote("2026-10-05")); // name and date disagree
    write("full-project/status/week-2026-09-28.md", "---\ntitle: broken\nweek: nope\n---\n");

    write("status-project/index.md", index("Status Project", "status"));
    write("status-project/status/plan.md", plan);
    write("status-project/status/week-2026-10-26.md", weekNote("2026-10-26"));

    write("hidden-project/index.md", index("Hidden Project", "none"));
    write("hidden-project/status/plan.md", plan);

    write("unset-project/index.md", index("Unset Project"));
    write("unset-project/status/plan.md", plan);

    write("typo-project/index.md", index("Typo Project", "everything"));
    write("typo-project/status/plan.md", plan);
});

afterAll(() => {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
});

describe("status parser", () => {
    let warn: jest.SpyInstance;
    beforeEach(() => {
        warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    });
    afterEach(() => warn.mockRestore());

    it("defaults to none when publish is unset or invalid", () => {
        expect(readPublishLevel("unset-project")).toBe("none");
        expect(readPublishLevel("typo-project")).toBe("none");
        expect(readPublishLevel("missing-project")).toBe("none");
        expect(readPublishLevel("full-project")).toBe("full");
    });

    it("leaves out projects that publish nothing", async () => {
        const slugs = (await getProjectStatuses()).map((s) => s.slug).sort();
        expect(slugs).toEqual(["full-project", "status-project"]);
    });

    it("publishes the plan and valid week notes, newest first, for full projects", async () => {
        const full = (await getProjectStatuses()).find((s) => s.slug === "full-project")!;
        expect(full.title).toBe("Full Project");
        expect(full.plan?.milestones[0].summary).toBe("Private detail");
        expect(full.weeks.map((w) => w.week)).toEqual(["2026-10-26", "2026-10-19"]);
        expect(full.weeks[0].html).toContain("What moved.");
        expect(full.weeks[0].changes[0].approach.issue).toBe("DAS-1");
    });

    it("skips bad week files with a warning instead of failing", async () => {
        await getProjectStatuses();
        const messages = warn.mock.calls.map((c) => String(c[0])).join("\n");
        expect(messages).toContain("week-2026-10-12.md skipped");
        expect(messages).toContain("week-2026-09-28.md skipped");
    });

    it("keeps only milestone names, states and dates for status projects", async () => {
        const status = (await getProjectStatuses()).find((s) => s.slug === "status-project")!;
        expect(status.weeks).toEqual([]);
        expect(status.plan?.milestones[0]).toEqual({
            name: "One",
            state: "done",
            started: "2026-10-01",
            finished: "2026-10-10",
        });
    });
});
