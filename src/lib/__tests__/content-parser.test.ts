import { loadSortConfig, applySortOrder } from "../sort-utils";
import { parseMarkdownFile } from "../content-parser";
import { renderMarkdownToHtml } from "../markdown-renderer";
import { ParsedArticle, ErrorFrontmatter, ArtifactType } from "../schema";
import fs from "fs";
import path from "path";

jest.mock("fs");
jest.mock("../markdown-renderer");

/**
 * Mock data factory for ParsedArticle
 */
function createMockArticle(
    slug: string,
    title: string,
    type: ArtifactType,
    fileName: string
): ParsedArticle {
    return {
        title,
        date: "2024-01-01",
        status: "Live" as const,
        projectSlug: slug,
        artifactType: type,
        _filePath: `/test/content/${slug}/${type}s/${fileName}.md`,
        html: "<p>Content</p>",
        toc: [],
        domain: [],
        tech_stack: [],
        projects: [slug]
    };
}

describe("Content Parser Sorting Logic", () => {
    const mockContent: (ParsedArticle | ErrorFrontmatter)[] = [
        createMockArticle("project-b", "Alpha Doc", "doc", "alpha"),
        createMockArticle("project-a", "Zebra Doc", "doc", "zebra"),
        createMockArticle("_shared", "Agent B", "agent", "agent-b"),
        createMockArticle("_shared", "Agent A", "agent", "agent-a"),
        createMockArticle("project-a", "Beta Proto", "prototype", "beta"),
    ];

    const mockSortConfigText = `
agent_studio:
  - Agent A
  - Agent B
projects:
  - project-a
  - project-b
blueprints:
  project-a:
    - zebra
build_lab:
  - project-a
`;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("loadSortConfig should return empty object if file missing", async () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        const config = await loadSortConfig();
        expect(config).toEqual({});
    });

    test("loadSortConfig should parse YAML correctly", async () => {
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readFileSync as jest.Mock).mockReturnValue(mockSortConfigText);

        const config = await loadSortConfig();
        expect(config.agent_studio).toEqual(["Agent A", "Agent B"]);
        expect(config.projects).toEqual(["project-a", "project-b"]);
    });

    test("applySortOrder should respect agent_studio order", () => {
        const config = { agent_studio: ["agent-a", "agent-b"] };
        const agents = mockContent.filter(i => !('_error' in i) && i.artifactType === "agent") as ParsedArticle[];
        const sorted = applySortOrder(agents, config) as ParsedArticle[];

        expect(path.basename(sorted[0]._filePath, ".md")).toBe("agent-a");
        expect(path.basename(sorted[1]._filePath, ".md")).toBe("agent-b");
    });

    test("applySortOrder should fall back to alphabetical when config is empty", () => {
        const config = {};
        const docs = [
            createMockArticle("p1", "Zebra", "doc", "z"),
            createMockArticle("p1", "Alpha", "doc", "a"),
        ];
        const sorted = applySortOrder(docs, config) as ParsedArticle[];
        expect(sorted[0].title).toBe("Alpha");
        expect(sorted[1].title).toBe("Zebra");
    });
});

describe("parseMarkdownFile - Tokenization Logic", () => {
    const mockFilePath = "/test/content/project-a/docs/test.md";
    const mockProjectPath = path.join(process.cwd(), "src/content/project-a/index.md");

    beforeEach(() => {
        (renderMarkdownToHtml as jest.Mock).mockImplementation((content) => Promise.resolve(`<div class="rendered">${content}</div>`));
        (fs.existsSync as jest.Mock).mockImplementation((p) => p === mockProjectPath);
        (fs.readFileSync as jest.Mock).mockImplementation((p) => {
            if (p === mockProjectPath) {
                return "---\ntitle: \"Project Alpha\"\n---\n";
            }
            if (p === mockFilePath) {
                return `---
title: "Doc for {{PROJECT_NAME}}"
date: "2024-01-01"
status: "Live"
domain: ["{{PROJECT_NAME}} Domain"]
tech_stack: ["Tech A"]
---
Welcome to {{PROJECT_NAME}}!
`;
            }
            return "";
        });
    });

    test("should replace {{PROJECT_NAME}} in body content", async () => {
        const result = await parseMarkdownFile(
            mockFilePath,
            "project-a",
            "doc"
        ) as ParsedArticle;

        expect(result.html).toContain("Welcome to Project Alpha!");
    });

    test("should replace {{PROJECT_NAME}} in frontmatter title", async () => {
        const result = await parseMarkdownFile(
            mockFilePath,
            "project-a",
            "doc"
        ) as ParsedArticle;

        expect(result.title).toBe("Doc for Project Alpha");
    });

    test("should recursively replace {{PROJECT_NAME}} in frontmatter arrays", async () => {
        const result = await parseMarkdownFile(
            mockFilePath,
            "project-a",
            "doc"
        ) as ParsedArticle;

        expect(result.domain).toContain("Project Alpha Domain");
    });

    test("should fall back to capitalized slug if project index title is missing", async () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false); // No index.md

        const result = await parseMarkdownFile(
            mockFilePath,
            "my-cool-project",
            "doc"
        ) as ParsedArticle;

        expect(result.html).toContain("Welcome to My Cool Project!");
        expect(result.title).toBe("Doc for My Cool Project");
    });
});
