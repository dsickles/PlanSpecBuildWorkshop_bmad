/**
 * @jest-environment node
 *
 * Tests for scripts/new-project.ts — New Project Scaffold (Roadmap 2.0, item 15)
 */

import fs from "fs";
import os from "os";
import path from "path";
import matter from "gray-matter";
import { FrontmatterSchema } from "../../src/lib/schema";
import { addToSortConfig, createProject, parseArgs, titleFromSlug, validateSlug } from "../new-project";

let root: string;

/** Parses YAML with the same parser the site uses for frontmatter. */
const parseYaml = (text: string) => matter(`---\n${text}---\n`).data as Record<string, unknown>;

const CONFIG = `# Display order
agent_studio:
  - Cursor

blueprints:
  existing:
    - prd

build_lab:
  - existing

projects:
  - existing
`;

beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), "psb-new-"));
    fs.writeFileSync(path.join(root, "sort-config.yaml"), CONFIG);
});

afterEach(() => {
    fs.rmSync(root, { recursive: true, force: true });
});

describe("titleFromSlug", () => {
    it("capitalises each word", () => {
        expect(titleFromSlug("family-calendar")).toBe("Family Calendar");
    });
});

describe("validateSlug", () => {
    it.each(["Family", "family_calendar", "-x", "x-", "a b"])("rejects %s", (slug) => {
        expect(validateSlug(slug, root)).toMatch(/lowercase/);
    });

    it.each(["tools", "about", "changelog", "_shared"])("rejects reserved %s", (slug) => {
        expect(validateSlug(slug, root)).not.toBeNull();
    });

    it("rejects a project that already exists", () => {
        fs.mkdirSync(path.join(root, "taken"));
        expect(validateSlug("taken", root)).toMatch(/already exists/);
    });

    it("accepts a new kebab-case slug", () => {
        expect(validateSlug("new-thing-2", root)).toBeNull();
    });
});

describe("addToSortConfig", () => {
    it("adds the slug to each list and keeps comments", () => {
        const out = addToSortConfig(CONFIG, "new-thing");
        expect(out.startsWith("# Display order")).toBe(true);
        const parsed = parseYaml(out);
        expect(parsed.blueprints).toEqual({ existing: ["prd"], "new-thing": ["coming-soon"] });
        expect(parsed.build_lab).toEqual(["existing", "new-thing"]);
        expect(parsed.projects).toEqual(["existing", "new-thing"]);
        expect(parsed.agent_studio).toEqual(["Cursor"]);
    });

    it("finds section headers with trailing spaces or comments", () => {
        const parsed = parseYaml(addToSortConfig("projects:  # order\n  - a\n", "b"));
        expect(parsed.projects).toEqual(["a", "b"]);
    });

    it("adds missing sections", () => {
        const parsed = parseYaml(addToSortConfig("agent_studio:\n  - Cursor\n", "x"));
        expect(parsed).toMatchObject({ blueprints: { x: ["coming-soon"] }, build_lab: ["x"], projects: ["x"] });
    });
});

describe("createProject", () => {
    it("writes three valid content files and updates the sort config", () => {
        const written = createProject({ slug: "new-thing", date: "2026-10-29", contentRoot: root });
        expect(written).toEqual([
            path.join("new-thing", "index.md"),
            path.join("new-thing", "docs", "coming-soon.md"),
            path.join("new-thing", "prototypes", "index.md"),
            "sort-config.yaml",
        ]);

        for (const rel of written.slice(0, 3)) {
            const { data } = matter(fs.readFileSync(path.join(root, rel), "utf-8"));
            expect(FrontmatterSchema.safeParse(data).success).toBe(true);
        }

        const overview = matter(fs.readFileSync(path.join(root, "new-thing", "index.md"), "utf-8")).data;
        expect(overview).toMatchObject({ title: "New Thing", status: "Concept", publish: "none", date: "2026-10-29" });

        const config = parseYaml(fs.readFileSync(path.join(root, "sort-config.yaml"), "utf-8")) as { projects: string[] };
        expect(config.projects).toContain("new-thing");
    });

    it("uses the given title, escaping quotes", () => {
        createProject({ slug: "q", title: 'The "Quoted" One', contentRoot: root });
        const { data } = matter(fs.readFileSync(path.join(root, "q", "index.md"), "utf-8"));
        expect(data.title).toBe('The "Quoted" One');
    });

    it("leaves nothing behind when a write fails", () => {
        const configPath = path.join(root, "sort-config.yaml");
        const realWrite = fs.writeFileSync;
        const spy = jest.spyOn(fs, "writeFileSync").mockImplementation((file, ...rest) => {
            if (file === configPath && String(rest[0]).includes("new-thing")) throw new Error("disk full");
            return realWrite(file, ...(rest as [string]));
        });
        try {
            expect(() => createProject({ slug: "new-thing", contentRoot: root })).toThrow("disk full");
        } finally {
            spy.mockRestore();
        }
        expect(fs.existsSync(path.join(root, "new-thing"))).toBe(false);
        expect(fs.readFileSync(configPath, "utf-8")).toBe(CONFIG);
    });

    it("refuses an invalid slug without writing anything", () => {
        expect(() => createProject({ slug: "Bad Slug", contentRoot: root })).toThrow();
        expect(fs.readFileSync(path.join(root, "sort-config.yaml"), "utf-8")).toBe(CONFIG);
    });
});

describe("parseArgs", () => {
    it("reads the slug and an optional title in any order", () => {
        expect(parseArgs(["x", "--title", "Ex"])).toEqual({ slug: "x", title: "Ex" });
        expect(parseArgs(["--title", "Ex", "x"])).toEqual({ slug: "x", title: "Ex" });
        expect(parseArgs([])).toEqual({ slug: undefined, title: undefined });
    });

    it("reads the slug when --title is left out", () => {
        expect(parseArgs(["x"])).toEqual({ slug: "x", title: undefined });
    });

    it("ignores --title with no value", () => {
        expect(parseArgs(["x", "--title"])).toEqual({ slug: "x", title: undefined });
    });
});
