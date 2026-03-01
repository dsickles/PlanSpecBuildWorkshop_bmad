import { loadSortConfig, applySortOrder } from "../sort-utils";
import { parseMarkdownFile, resetTitleCache } from "../content-parser";
import { renderMarkdownToHtml } from "../markdown-renderer";
import { ParsedArticle, ErrorFrontmatter, ArtifactType } from "../schema";
import fs from "fs";
import path from "path";

jest.mock("fs", () => ({
    ...jest.requireActual("fs"),
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
    promises: {
        readFile: jest.fn(),
    },
}));
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
        id: `${slug}:${type}s:${fileName}`,
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
        resetTitleCache();
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
        jest.clearAllMocks();
        resetTitleCache();
        (renderMarkdownToHtml as jest.Mock).mockImplementation((content) => Promise.resolve(`<div class="rendered">${content}</div>`));
        (fs.existsSync as jest.Mock).mockImplementation((p) => p === mockProjectPath);
        (fs.promises.readFile as jest.Mock).mockImplementation((p) => {
            if (p === mockProjectPath) {
                return Promise.resolve("---\ntitle: \"Project Alpha\"\n---\n");
            }
            if (p === mockFilePath) {
                return Promise.resolve(`---
title: "Doc for {{PROJECT_NAME}}"
date: "2024-01-01"
status: "Live"
domain: ["{{PROJECT_NAME}} Domain"]
tech_stack: ["Tech A"]
---
Welcome to {{PROJECT_NAME}}!
`);
            }
            return Promise.resolve("");
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

    test("should load content from source_path if provided", async () => {
        const remotePath = path.join(process.cwd(), "remote-doc.md");
        (fs.existsSync as jest.Mock).mockImplementation((p) => p === mockProjectPath || p === mockFilePath || p === remotePath);
        (fs.promises.readFile as jest.Mock).mockImplementation((p) => {
            if (p === mockProjectPath) return Promise.resolve("---\ntitle: \"Project Alpha\"\n---\n");
            if (p === mockFilePath) {
                return Promise.resolve(`---
title: "Pointer Doc"
date: "2024-01-01"
status: "Live"
source_path: "remote-doc.md"
---
Pointer content`);
            }
            if (p === remotePath) {
                return Promise.resolve(`---
title: "Remote Title"
---
Remote content for Project Alpha`);
            }
            return Promise.resolve("");
        });

        const result = await parseMarkdownFile(
            mockFilePath,
            "project-a",
            "doc"
        ) as ParsedArticle;

        expect(result.html).toContain("Remote content for Project Alpha");
        expect(result.html).not.toContain("Pointer content");
        expect(result.title).toBe("Pointer Doc"); // pointer metadata wins
    });

    test("should reject source_path with path traversal (..)", async () => {
        (fs.promises.readFile as jest.Mock).mockResolvedValue(`---
title: "Pointer"
date: "2024-01-01"
status: "Live"
source_path: "../../../etc/passwd"
---
Pointer Body`);

        const result = await parseMarkdownFile(
            mockFilePath,
            "project-a",
            "doc"
        ) as ParsedArticle;

        expect(result.html).toContain("Pointer Body"); // Fallback to local
    });

    test("should reject absolute source_path", async () => {
        (fs.promises.readFile as jest.Mock).mockResolvedValue(`---
title: "Pointer"
date: "2024-01-01"
status: "Live"
source_path: "/etc/passwd"
---
Pointer Body`);

        const result = await parseMarkdownFile(
            mockFilePath,
            "project-a",
            "doc"
        ) as ParsedArticle;

        expect(result.html).toContain("Pointer Body"); // Fallback to local
    });

    test("should resolve associatedProjects slugs to titles for agents", async () => {
        const agentFilePath = "/test/content/_shared/agents/spec-kit.md";
        const projectAPath = path.join(process.cwd(), "src/content/project-a/index.md");
        const projectBPath = path.join(process.cwd(), "src/content/project-b/index.md");

        (fs.existsSync as jest.Mock).mockImplementation((p) =>
            p === projectAPath || p === projectBPath || p === agentFilePath
        );

        (fs.promises.readFile as jest.Mock).mockImplementation((p) => {
            if (p === projectAPath) return Promise.resolve("---\ntitle: \"Alpha Project\"\n---\n");
            if (p === projectBPath) return Promise.resolve("---\ntitle: \"Beta Project\"\n---\n");
            if (p === agentFilePath) {
                return Promise.resolve(`---
title: "Spec Kit"
date: "2024-01-01"
status: "Live"
artifact_type: "agent"
projects: ["project-a", "project-b"]
---
Agent body`);
            }
            return Promise.resolve("");
        });

        const result = await parseMarkdownFile(
            agentFilePath,
            "_shared",
            "agent"
        ) as ParsedArticle;

        expect(result.associatedProjects).toHaveLength(2);
        expect(result.associatedProjects).toContainEqual({ slug: "project-a", title: "Alpha Project" });
        expect(result.associatedProjects).toContainEqual({ slug: "project-b", title: "Beta Project" });
    });
});
