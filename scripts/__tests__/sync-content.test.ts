/**
 * Tests for scripts/sync-content.ts — Pre-Build Sync Automation
 * Story 12.1: Pre-Build Sync Automation
 *
 * Tests the core exported functions: isSourcePathSafe, extractSourcePaths.
 */

import path from "path";
import fs from "fs";

// ─── Mocks ───────────────────────────────────────────────────────────────────

jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    existsSync: jest.fn(),
    readdirSync: jest.fn(),
    readFileSync: jest.fn(),
}));

jest.mock("gray-matter", () =>
    jest.fn((_raw: unknown) => ({ data: {}, content: "" }))
);

// ─── Import under test ────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-require-imports
const syncModule = require("../sync-content") as typeof import("../sync-content");

// ─── isSourcePathSafe ─────────────────────────────────────────────────────────

describe("isSourcePathSafe", () => {
    it("returns true for a simple relative path", () => {
        expect(syncModule.isSourcePathSafe("_bmad-output/planning-artifacts/architecture.md")).toBe(true);
    });

    it("returns true for nested relative path without traversal", () => {
        expect(syncModule.isSourcePathSafe("docs/some/deep/file.md")).toBe(true);
    });

    it("returns false for a path starting with '..'", () => {
        expect(syncModule.isSourcePathSafe("../../../etc/passwd")).toBe(false);
    });

    it("returns false for an absolute POSIX path", () => {
        expect(syncModule.isSourcePathSafe("/etc/passwd")).toBe(false);
    });

    it("returns false for an absolute Windows path", () => {
        expect(syncModule.isSourcePathSafe("C:\\Windows\\System32\\secret")).toBe(false);
    });

    it("returns false for a path that normalizes to a traversal", () => {
        // path.normalize("foo/../../../etc/passwd") = "../../etc/passwd"
        expect(syncModule.isSourcePathSafe("foo/../../../etc/passwd")).toBe(false);
    });
});

// ─── extractSourcePaths ───────────────────────────────────────────────────────

describe("extractSourcePaths", () => {
    const fsMock = fs as jest.Mocked<typeof fs>;
    const matter = require("gray-matter") as jest.MockedFunction<(s: unknown) => { data: Record<string, unknown>; content: string }>;
    const CONTENT_ROOT = path.join(process.cwd(), "src", "content");

    beforeEach(() => jest.clearAllMocks());

    it("returns empty array when no content files have source_path", () => {
        fsMock.readdirSync.mockReturnValue([] as unknown as ReturnType<typeof fs.readdirSync>);
        const { entries } = syncModule.extractSourcePaths(CONTENT_ROOT);
        expect(entries).toHaveLength(0);
    });

    it("extracts valid source_path entries from content files", () => {
        // Single flat directory with two .md files that have source_path
        fsMock.readdirSync.mockImplementation((dir) => {
            if (String(dir) === CONTENT_ROOT) {
                return [
                    { name: "architecture.md", isDirectory: () => false },
                    { name: "prd.md", isDirectory: () => false },
                ] as unknown as ReturnType<typeof fs.readdirSync>;
            }
            return [] as unknown as ReturnType<typeof fs.readdirSync>;
        });

        fsMock.readFileSync.mockReturnValue("---\n---\n" as unknown as ReturnType<typeof fs.readFileSync>);

        matter
            .mockReturnValueOnce({ data: { source_path: "_bmad-output/planning-artifacts/architecture.md" }, content: "" })
            .mockReturnValueOnce({ data: { source_path: "_bmad-output/planning-artifacts/prd.md" }, content: "" });

        const { entries } = syncModule.extractSourcePaths(CONTENT_ROOT);
        expect(entries).toHaveLength(2);
        expect(entries[0].sourcePath).toBe("_bmad-output/planning-artifacts/architecture.md");
        expect(entries[1].sourcePath).toBe("_bmad-output/planning-artifacts/prd.md");
    });

    it("skips entries with unsafe source_path values (traversal)", () => {
        fsMock.readdirSync.mockReturnValue([
            { name: "bad.md", isDirectory: () => false },
        ] as unknown as ReturnType<typeof fs.readdirSync>);

        fsMock.readFileSync.mockReturnValue("raw" as unknown as ReturnType<typeof fs.readFileSync>);
        matter.mockReturnValue({ data: { source_path: "../../etc/passwd" }, content: "" });

        const { entries, rejectedCount } = syncModule.extractSourcePaths(CONTENT_ROOT);
        expect(entries).toHaveLength(0);
        expect(rejectedCount).toBe(1);
    });

    it("skips entries with absolute source_path values", () => {
        fsMock.readdirSync.mockReturnValue([
            { name: "abs.md", isDirectory: () => false },
        ] as unknown as ReturnType<typeof fs.readdirSync>);

        fsMock.readFileSync.mockReturnValue("raw" as unknown as ReturnType<typeof fs.readFileSync>);
        matter.mockReturnValue({ data: { source_path: "/etc/passwd" }, content: "" });

        const { entries } = syncModule.extractSourcePaths(CONTENT_ROOT);
        expect(entries).toHaveLength(0);
    });

    it("skips files with no source_path frontmatter", () => {
        fsMock.readdirSync.mockReturnValue([
            { name: "normal.md", isDirectory: () => false },
        ] as unknown as ReturnType<typeof fs.readdirSync>);

        fsMock.readFileSync.mockReturnValue("raw" as unknown as ReturnType<typeof fs.readFileSync>);
        matter.mockReturnValue({ data: { title: "No source path here" }, content: "" });

        const { entries } = syncModule.extractSourcePaths(CONTENT_ROOT);
        expect(entries).toHaveLength(0);
    });

    it("recursively discovers files in subdirectories", () => {
        fsMock.readdirSync.mockImplementation((dir) => {
            if (String(dir) === CONTENT_ROOT) {
                return [{ name: "project-a", isDirectory: () => true }] as unknown as ReturnType<typeof fs.readdirSync>;
            }
            if (String(dir).endsWith("project-a")) {
                return [{ name: "doc.md", isDirectory: () => false }] as unknown as ReturnType<typeof fs.readdirSync>;
            }
            return [] as unknown as ReturnType<typeof fs.readdirSync>;
        });

        fsMock.readFileSync.mockReturnValue("raw" as unknown as ReturnType<typeof fs.readFileSync>);
        matter.mockReturnValue({ data: { source_path: "_bmad-output/planning-artifacts/prd.md" }, content: "" });

        const { entries } = syncModule.extractSourcePaths(CONTENT_ROOT);
        expect(entries).toHaveLength(1);
        expect(entries[0].sourcePath).toBe("_bmad-output/planning-artifacts/prd.md");
    });
});

// ─── runSync ──────────────────────────────────────────────────────────────────

describe("runSync", () => {
    const fsMock = fs as jest.Mocked<typeof fs>;
    const matter = require("gray-matter") as jest.MockedFunction<(s: unknown) => { data: Record<string, unknown>; content: string }>;

    beforeEach(() => jest.clearAllMocks());

    it("returns found=0, missing=0 when no source_path entries exist", () => {
        fsMock.readdirSync.mockReturnValue([] as unknown as ReturnType<typeof fs.readdirSync>);
        const result = syncModule.runSync("/fake/content");
        expect(result.found).toBe(0);
        expect(result.missing).toBe(0);
    });

    it("counts found when target file exists", () => {
        fsMock.readdirSync.mockReturnValue([
            { name: "doc.md", isDirectory: () => false },
        ] as unknown as ReturnType<typeof fs.readdirSync>);
        fsMock.readFileSync.mockReturnValue("raw" as unknown as ReturnType<typeof fs.readFileSync>);
        matter.mockReturnValue({ data: { source_path: "_bmad-output/planning-artifacts/prd.md" }, content: "" });
        fsMock.existsSync.mockReturnValue(true);

        const result = syncModule.runSync("/fake/content");
        expect(result.found).toBe(1);
        expect(result.missing).toBe(0);
    });

    it("counts missing when target file does not exist", () => {
        fsMock.readdirSync.mockReturnValue([
            { name: "doc.md", isDirectory: () => false },
        ] as unknown as ReturnType<typeof fs.readdirSync>);
        fsMock.readFileSync.mockReturnValue("raw" as unknown as ReturnType<typeof fs.readFileSync>);
        matter.mockReturnValue({ data: { source_path: "_bmad-output/planning-artifacts/prd.md" }, content: "" });
        fsMock.existsSync.mockReturnValue(false);

        const result = syncModule.runSync("/fake/content");
        expect(result.found).toBe(0);
        expect(result.missing).toBe(1);
        // rejected should reflect security-rejected paths only (0 here — bad path was valid, just missing)
        expect(result.rejected).toBe(0);
    });

    it("logs SYNC_MODE=copy warning when file is missing and copy mode is active", () => {
        const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
        process.env.SYNC_MODE = "copy";

        fsMock.readdirSync.mockReturnValue([
            { name: "doc.md", isDirectory: () => false },
        ] as unknown as ReturnType<typeof fs.readdirSync>);
        fsMock.readFileSync.mockReturnValue("raw" as unknown as ReturnType<typeof fs.readFileSync>);
        matter.mockReturnValue({ data: { source_path: "_bmad-output/planning-artifacts/prd.md" }, content: "" });
        fsMock.existsSync.mockReturnValue(false);

        const result = syncModule.runSync("/fake/content");
        expect(result.missing).toBe(1);
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("SYNC_MODE=copy set but no copy source configured"));

        delete process.env.SYNC_MODE;
        warnSpy.mockRestore();
    });
});
