/**
 * @jest-environment node
 *
 * Tests for scripts/check-demos.ts — Demo Link Check (Roadmap 2.0, item 10)
 */

import fs from "fs";
import os from "os";
import path from "path";
import { checkDemos, checkLink, findLiveDemoLinks } from "../check-demos";

let root: string;

function write(rel: string, body: string) {
    const full = path.join(root, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, body);
}

const prototype = (status: string, urls: string[]) =>
    `---\ntitle: "P"\ndate: "2026-10-01"\nstatus: "${status}"\nlinks:\n${urls.map((u) => `  - label: "Demo"\n    url: "${u}"`).join("\n")}\n---\n`;

const respond = (status: number) => jest.fn(async () => ({ status }) as Response) as unknown as typeof fetch;

beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "psb-demos-"));
});

afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
});

describe("findLiveDemoLinks", () => {
    it("returns links from Live prototypes only", () => {
        write("a/prototypes/index.md", prototype("Live", ["https://a.example.org", "https://github.com/x/a"]));
        write("b/prototypes/index.md", prototype("WIP", ["https://b.example.org"]));
        write("c/docs/index.md", prototype("Live", ["https://c.example.org"]));
        expect(findLiveDemoLinks(root).map((l) => l.url)).toEqual(["https://a.example.org", "https://github.com/x/a"]);
    });

    it("skips files whose frontmatter does not parse", () => {
        write("a/prototypes/index.md", "---\ntitle: [unclosed\n---\n");
        expect(findLiveDemoLinks(root)).toEqual([]);
    });
});

describe("checkLink", () => {
    const link = { project: "a", file: "a/prototypes/index.md", label: "Demo", url: "https://a.example.org" };

    it.each([
        [200, true],
        [301, true],
        [404, false],
        [503, false],
    ])("treats HTTP %i as ok=%s", async (status, ok) => {
        expect(await checkLink(link, respond(status))).toMatchObject({ ok, status });
    });

    it("reports network errors", async () => {
        const failing = jest.fn(async () => {
            throw new Error("getaddrinfo ENOTFOUND");
        }) as unknown as typeof fetch;
        expect(await checkLink(link, failing)).toMatchObject({ ok: false, error: "getaddrinfo ENOTFOUND" });
    });
});

describe("checkDemos", () => {
    it("checks every Live link", async () => {
        write("a/prototypes/index.md", prototype("Live", ["https://a.example.org", "https://b.example.org"]));
        const fetchImpl = respond(200);
        const results = await checkDemos(root, fetchImpl);
        expect(results).toHaveLength(2);
        expect(fetchImpl).toHaveBeenCalledTimes(2);
    });
});
