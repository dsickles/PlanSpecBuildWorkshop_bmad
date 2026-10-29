/**
 * Guards the frontmatter conventions in CLAUDE.md across the real content
 * folder (DAS-12), so drift shows up in CI instead of in review.
 */
import fs from "fs";
import path from "path";

const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

function markdownFiles(dir: string): string[] {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return entry.name === "status" ? [] : markdownFiles(full);
        return entry.name.endsWith(".md") ? [full] : [];
    });
}

function frontmatterLines(file: string): string[] {
    const text = fs.readFileSync(file, "utf-8");
    const end = text.indexOf("\n---", 4);
    return text.slice(4, end).split("\n");
}

const CORE_ORDER = ["title", "date", "status", "artifact_type", "description", "source_path", "publish"];
const GROUPS = ["# 1. Core Identity", "# 2. Taxonomy", "# 3. Relations & Connectivity"];

const files = markdownFiles(CONTENT_ROOT);
const rel = (file: string) => path.relative(CONTENT_ROOT, file);

describe("content frontmatter conventions", () => {
    it("finds the content folder", () => {
        expect(files.length).toBeGreaterThan(10);
    });

    it.each(files.map((f) => [rel(f), f]))("%s starts with Core Identity and keeps the groups in order", (_name, file) => {
        const lines = frontmatterLines(file);
        expect(lines[0]).toBe(GROUPS[0]);
        const groupOrder = lines.filter((l) => GROUPS.includes(l)).map((l) => GROUPS.indexOf(l));
        expect(groupOrder).toEqual([...groupOrder].sort());
    });

    it.each(files.map((f) => [rel(f), f]))("%s lists core keys in the standard order", (_name, file) => {
        const keys = frontmatterLines(file)
            .map((l) => /^([a-z_]+):/.exec(l)?.[1])
            .filter((k): k is string => !!k && CORE_ORDER.includes(k));
        expect(keys).toEqual([...keys].sort((a, b) => CORE_ORDER.indexOf(a) - CORE_ORDER.indexOf(b)));
        expect(keys.slice(0, 3)).toEqual(["title", "date", "status"]);
    });

    it.each(files.map((f) => [rel(f), f]))("%s has no blank line before the closing ---", (_name, file) => {
        const lines = frontmatterLines(file);
        expect(lines.at(-1)?.trim()).not.toBe("");
    });

    it("sets publish only on project root index.md files", () => {
        const offenders = files.filter((file) => {
            const isProjectRoot = path.dirname(path.dirname(file)) === CONTENT_ROOT && path.basename(file) === "index.md";
            return !isProjectRoot && frontmatterLines(file).some((l) => l.startsWith("publish:"));
        });
        expect(offenders.map(rel)).toEqual([]);
    });
});
