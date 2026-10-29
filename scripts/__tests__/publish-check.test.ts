/**
 * @jest-environment node
 *
 * Tests for scripts/publish-check.ts — Publish Check (Roadmap 2.0, item 7)
 * Uses real temp directories so the checks run against files on disk.
 */

import fs from "fs";
import os from "os";
import path from "path";
import { checkProject, loadAllowList, runPublishCheck, scanText } from "../publish-check";

let root: string;

function write(rel: string, body: string) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, body);
}

const PLAN = `---
title: "Plan"
updated: "2026-10-26"
milestones:
  - name: "Ship it"
    state: "active"
---
`;

const WEEK = (week: string) => `---
title: "A week"
week: "${week}"
changes:
  - date: "${week}"
    kind: "shipped"
    title: "Something"
---
Body.
`;

const project = (publish?: string) =>
    `---\ntitle: "P"\ndate: "2026-10-01"\nstatus: "WIP"\n${publish ? `publish: "${publish}"\n` : ""}---\n`;

beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "psb-publish-"));
});

afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
});

describe("scanText", () => {
    it.each([
        ["email address", "Reach me at dan.someone@gmail.com today"],
        ["API key", "key sk-ant-abcdefghijklmnopqrstuvwxyz123"],
        ["API key", "AKIAABCDEFGHIJKLMNOP"],
        ["private key", "-----BEGIN RSA PRIVATE KEY-----"],
        ["credential assignment", 'api_key: "abcdef1234567890"'],
        ["calendar feed link", "subscribe at webcal://example.org/family"],
        ["calendar feed link", "https://calendar.google.com/calendar/ical/abc/basic"],
        ["secret in a URL", "https://api.example.org/feed?token=abc123"],
        ["PIN code", "The PIN is 4821"],
    ])("flags a %s", (rule, text) => {
        expect(scanText(text, "f.md").map((f) => f.rule)).toContain(rule);
    });

    it("reports the 1-based line number", () => {
        expect(scanText("ok\nme@gmail.com", "f.md")[0]).toMatchObject({ line: 2, file: "f.md" });
    });

    it("ignores placeholder and no-reply addresses", () => {
        expect(scanText("demo@example.com noreply@github.com 1+dan@users.noreply.github.com", "f.md")).toEqual([]);
    });

    it("ignores general mentions of PINs and calendar files", () => {
        expect(scanText("Kids unlock with a 4-digit PIN. Events export as .ics files.", "f.md")).toEqual([]);
    });

    it("skips exact matches on the allow list", () => {
        expect(scanText("hello@psb.dev", "f.md", ["hello@psb.dev"])).toEqual([]);
    });
});

describe("loadAllowList", () => {
    it("drops comments and blank lines", () => {
        write("allow", "# header\n\nhello@psb.dev\n  \n");
        expect(loadAllowList(path.join(root, "allow"))).toEqual(["hello@psb.dev"]);
    });

    it("returns an empty list when the file is missing", () => {
        expect(loadAllowList(path.join(root, "nope"))).toEqual([]);
    });
});

describe("checkProject", () => {
    it("passes a full project with a valid plan and week note", () => {
        write("p/index.md", project("full"));
        write("p/status/plan.md", PLAN);
        write("p/status/week-2026-10-26.md", WEEK("2026-10-26"));
        expect(checkProject(root, "p")).toEqual([]);
    });

    it("fails status files in a project that publishes nothing", () => {
        write("p/index.md", project("none"));
        write("p/status/plan.md", PLAN);
        expect(checkProject(root, "p")).toEqual([expect.objectContaining({ rule: "publish setting" })]);
    });

    it("treats a missing publish setting as none", () => {
        write("p/index.md", project());
        write("p/status/plan.md", PLAN);
        expect(checkProject(root, "p")[0].rule).toBe("publish setting");
    });

    it("allows a plan but not week notes at publish: status", () => {
        write("p/index.md", project("status"));
        write("p/status/plan.md", PLAN);
        write("p/status/week-2026-10-26.md", WEEK("2026-10-26"));
        const findings = checkProject(root, "p");
        expect(findings).toHaveLength(1);
        expect(findings[0].file).toBe(path.join("p", "status", "week-2026-10-26.md"));
    });

    it("rejects an unknown publish value", () => {
        write("p/index.md", project("everything"));
        expect(checkProject(root, "p")[0].detail).toContain("everything");
    });

    it("rejects files that are not a plan or week note", () => {
        write("p/index.md", project("full"));
        write("p/status/notes.md", "hi");
        expect(checkProject(root, "p")[0].rule).toBe("status file name");
    });

    it("rejects a week note whose date does not match its file name", () => {
        write("p/index.md", project("full"));
        write("p/status/week-2026-10-26.md", WEEK("2026-10-19"));
        expect(checkProject(root, "p")[0].detail).toContain("does not match");
    });

    it("rejects a plan that fails the schema", () => {
        write("p/index.md", project("full"));
        write("p/status/plan.md", `---\ntitle: "Plan"\nupdated: "2026-10-26"\nmilestones: []\n---\n`);
        expect(checkProject(root, "p")[0].rule).toBe("status schema");
    });

    it("accepts unquoted YAML dates", () => {
        write("p/index.md", project("full"));
        write("p/status/plan.md", PLAN.replace('"2026-10-26"', "2026-10-26"));
        expect(checkProject(root, "p")).toEqual([]);
    });
});

describe("runPublishCheck", () => {
    it("scans every content file and skips _shared as a project", () => {
        write("_shared/agents/a.md", "contact: someone@gmail.com");
        write("p/index.md", project("full"));
        write("p/docs/spec.md", "nothing private");
        write("sort-config.yaml", "agents: []");
        const findings = runPublishCheck(root, []);
        expect(findings).toEqual([expect.objectContaining({ rule: "email address", file: path.join("_shared", "agents", "a.md") })]);
    });

    it("passes the real content in this repo", () => {
        expect(runPublishCheck()).toEqual([]);
    });
});
