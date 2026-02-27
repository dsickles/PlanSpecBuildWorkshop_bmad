import { extractToc, generateSlug, injectHeadingIds } from "../toc-engine";

describe("toc-engine", () => {
    describe("generateSlug", () => {
        it("converts to lowercase and replaces spaces with hyphens", () => {
            expect(generateSlug("Hello World")).toBe("hello-world");
        });

        it("removes special characters", () => {
            expect(generateSlug("Step 1: Introduction!")).toBe("step-1-introduction");
        });

        it("handles multiple spaces and dashes", () => {
            expect(generateSlug("Multiple   Spaces --- Dashes")).toBe("multiple-spaces-dashes");
        });

        it("trims whitespace", () => {
            expect(generateSlug("  Trim Me  ")).toBe("trim-me");
        });
    });

    describe("extractToc", () => {
        it("extracts H2 and H3 headers with correct levels and slugs", () => {
            const markdown = `
# Title (Ignored)
## Section One
Some text.
### Subsection A
More text.
## Section Two
### Subsection B
            `;

            const toc = extractToc(markdown);

            expect(toc).toHaveLength(4);
            expect(toc[0]).toEqual({ level: 2, text: "Section One", slug: "section-one" });
            expect(toc[1]).toEqual({ level: 3, text: "Subsection A", slug: "subsection-a" });
            expect(toc[2]).toEqual({ level: 2, text: "Section Two", slug: "section-two" });
            expect(toc[3]).toEqual({ level: 3, text: "Subsection B", slug: "subsection-b" });
        });

        it("ignores H1 and H4+ headers", () => {
            const markdown = `
# H1
## H2
### H3
#### H4
##### H5
            `;

            const toc = extractToc(markdown);

            expect(toc).toHaveLength(2);
            expect(toc[0].level).toBe(2);
            expect(toc[1].level).toBe(3);
        });

        it("returns empty array for markdown with no H2 or H3 headers", () => {
            const markdown = "# Only H1\nNo headers here.";
            expect(extractToc(markdown)).toHaveLength(0);
        });

        it("trims header text", () => {
            const markdown = "##   Spaced Header   ";
            const toc = extractToc(markdown);
            expect(toc[0].text).toBe("Spaced Header");
            expect(toc[0].slug).toBe("spaced-header");
        });

        it("handles duplicate headers with unique slugs", () => {
            const markdown = `
## Overview
## Overview
## Overview
            `;
            const toc = extractToc(markdown);
            expect(toc).toHaveLength(3);
            expect(toc[0].slug).toBe("overview");
            expect(toc[1].slug).toBe("overview-1");
            expect(toc[2].slug).toBe("overview-2");
        });

        it("ignores headers inside code blocks", () => {
            const markdown = `
## Real Header
\`\`\`
## Fake Header
\`\`\`
            `;
            const toc = extractToc(markdown);
            expect(toc).toHaveLength(1);
            expect(toc[0].text).toBe("Real Header");
        });
    });

    describe("injectHeadingIds", () => {
        it("injects unique IDs into HTML headers using spans", () => {
            const html = "<h2>Section One</h2><p>Text</p><h3>Subsection A</h3>";
            const toc = [
                { level: 2, text: "Section One", slug: "section-one" },
                { level: 3, text: "Subsection A", slug: "subsection-a" },
            ];

            const result = injectHeadingIds(html, toc);

            expect(result).toContain('<h2 id="section-one">Section One</h2>');
            expect(result).toContain('<h3 id="subsection-a">Subsection A</h3>');
            expect(result).toContain("<p>Text</p>");
        });

        it("handles sequential identical headers for ID injection", () => {
            const html = "<h2>Overview</h2><p>Part 1</p><h2>Overview</h2><p>Part 2</p>";
            const toc = [
                { level: 2, text: "Overview", slug: "overview" },
                { level: 2, text: "Overview", slug: "overview-1" },
            ];

            const result = injectHeadingIds(html, toc);

            expect(result).toContain('<h2 id="overview">Overview</h2>');
            expect(result).toContain('<h2 id="overview-1">Overview</h2>');
        });

        it("handles headers with special characters", () => {
            const html = "<h2>Step 1: Introduction!</h2>";
            const toc = [{ level: 2, text: "Step 1: Introduction!", slug: "step-1-introduction" }];

            const result = injectHeadingIds(html, toc);

            expect(result).toContain('<h2 id="step-1-introduction">Step 1: Introduction!</h2>');
        });

        it("handles headers with internal HTML tags", () => {
            const html = "<h2><strong>Bold</strong> Header</h2>";
            const toc = [{ level: 2, text: "Bold Header", slug: "bold-header" }];

            const result = injectHeadingIds(html, toc);

            expect(result).toContain('<h2 id="bold-header"><strong>Bold</strong> Header</h2>');
        });

        it("leaves HTML unchanged if ToC is empty", () => {
            const html = "<h2>No ToC Match</h2>";
            expect(injectHeadingIds(html, [])).toBe(html);
        });
    });
});
