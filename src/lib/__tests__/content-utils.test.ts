import fs from "fs";
import path from "path";
import { getProjectSlugs, getContentFilePaths, CONTENT_ROOT } from "../content-utils";
import { SHARED_DIR } from "../schema";

// Mock fs
jest.mock("fs");

describe("content-utils", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Helper to create mock Dirent objects
    const createMockDir = (name: string) => ({ name, isDirectory: () => true, isFile: () => false });
    const createMockFile = (name: string) => ({ name, isDirectory: () => false, isFile: () => true });

    describe("getProjectSlugs", () => {
        it("should return directories under CONTENT_ROOT excluding SHARED_DIR", () => {
            (fs.readdirSync as jest.Mock).mockReturnValue([
                createMockDir("project-a"),
                createMockDir("project-b"),
                createMockDir(SHARED_DIR),
                createMockFile("random-file.txt"),
            ]);

            const slugs = getProjectSlugs();

            expect(slugs).toEqual(["project-a", "project-b"]);
            expect(slugs).not.toContain(SHARED_DIR);
        });

        it("should return empty array on error", () => {
            (fs.readdirSync as jest.Mock).mockImplementation(() => {
                throw new Error("FS Error");
            });

            expect(getProjectSlugs()).toEqual([]);
        });
    });

    describe("getContentFilePaths", () => {
        it("should discover all .md files in projects and shared directory", () => {
            (fs.readdirSync as jest.Mock).mockImplementation((dirPath: string) => {
                if (dirPath === CONTENT_ROOT) {
                    return [createMockDir("project-a"), createMockDir(SHARED_DIR)];
                }
                if (dirPath.endsWith("project-a")) {
                    return [createMockDir("docs")];
                }
                if (dirPath.endsWith(path.join("project-a", "docs"))) {
                    return [createMockFile("prd.md")];
                }
                if (dirPath.endsWith(SHARED_DIR)) {
                    return [createMockDir("agents")];
                }
                if (dirPath.endsWith(path.join(SHARED_DIR, "agents"))) {
                    return [createMockFile("agent-a.md")];
                }
                return [];
            });

            const paths = getContentFilePaths();

            expect(paths).toContainEqual({
                filePath: expect.stringContaining(path.join("project-a", "docs", "prd.md")),
                projectSlug: "project-a",
                artifactType: "doc"
            });

            expect(paths).toContainEqual({
                filePath: expect.stringContaining(path.join(SHARED_DIR, "agents", "agent-a.md")),
                projectSlug: SHARED_DIR,
                artifactType: "agent"
            });
        });

        it("should discover index.md in project root", () => {
            (fs.readdirSync as jest.Mock).mockImplementation((dirPath: string) => {
                if (dirPath === CONTENT_ROOT) {
                    return [createMockDir("project-a")];
                }
                if (dirPath.endsWith("project-a")) {
                    return [createMockFile("index.md"), createMockDir("docs")];
                }
                if (dirPath.endsWith(path.join("project-a", "docs"))) {
                    return [createMockFile("prd.md")];
                }
                return [];
            });

            const paths = getContentFilePaths();

            expect(paths).toContainEqual({
                filePath: expect.stringContaining(path.join("project-a", "index.md")),
                projectSlug: "project-a",
                artifactType: "doc"
            });
        });
    });
});
