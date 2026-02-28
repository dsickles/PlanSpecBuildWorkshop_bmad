import { parseMarkdownFile } from "../content-parser";
import { renderMarkdownToHtml } from "../markdown-renderer";
import { ParsedArticle } from "../schema";
import fs from "fs";

jest.mock("fs");
jest.mock("../markdown-renderer");

describe("Frontmatter Schema - External Links", () => {
    const mockFilePath = "/test/content/_shared/agents/lovable.md";

    beforeEach(() => {
        jest.clearAllMocks();
        (renderMarkdownToHtml as jest.Mock).mockImplementation((content) => Promise.resolve(`<div class="rendered">${content}</div>`));
        (fs.existsSync as jest.Mock).mockReturnValue(true);
    });

    test("should parse external_links from frontmatter", async () => {
        (fs.readFileSync as jest.Mock).mockReturnValue(`---
title: "Lovable"
date: "2024-01-01"
status: "Live"
external_links:
  - label: "GitHub"
    url: "https://github.com/lovable-dev/lovable"
  - label: "Website"
    url: "https://lovable.dev"
---
Content`);

        const result = await parseMarkdownFile(
            mockFilePath,
            "_shared",
            "agent"
        );

        if ('_error' in result) {
            throw new Error(`Parse failed: ${result._message}`);
        }

        const article = result as ParsedArticle & { external_links?: { label: string; url: string }[] };
        expect(article.external_links).toBeDefined();
        expect(article.external_links).toHaveLength(2);
        expect(article.external_links?.[0].label).toBe("GitHub");
        expect(article.external_links?.[0].url).toBe("https://github.com/lovable-dev/lovable");
    });

    test("should fail validation if external_links url is invalid", async () => {
        (fs.readFileSync as jest.Mock).mockReturnValue(`---
title: "Lovable"
date: "2024-01-01"
status: "Live"
external_links:
  - label: "GitHub"
    url: "not-a-url"
---
Content`);

        const result = await parseMarkdownFile(
            mockFilePath,
            "_shared",
            "agent"
        );

        expect('_error' in result).toBe(true);
        if ('_error' in result) {
            expect(result._message).toContain("External link must be a valid URL");
        }
    });
});
