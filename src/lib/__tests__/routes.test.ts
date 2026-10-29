import { articlePath, blueprintSegment, findArticleByPath, listArticlePages, siteUrl, workshopHref } from "../routes";
import { ArtifactType, ParsedArticle } from "../schema";

function article(projectSlug: string, rel: string, type: ArtifactType = "doc"): ParsedArticle {
    return {
        id: `${projectSlug}:${rel}`.replace(/\//g, ":").replace(/\.md$/, ""),
        title: rel,
        date: "2026-10-01",
        status: "Live",
        projectSlug,
        artifactType: type,
        _filePath: `/repo/src/content/${projectSlug}/${rel}`,
        html: "",
        toc: [],
        links: [],
        taxonomy: { domain: [], tech_stack: [] },
        relations: { projects: [] },
    };
}

const root = article("family-calendar", "index.md");
const specs = article("family-calendar", "docs/specifications.md");
const docsIndex = article("plan-spec-build-workshop", "docs/index.md");
const proto = article("family-calendar", "prototypes/index.md", "prototype");
const agent = article("_shared", "agents/ClaudeCode.md", "agent");
const reserved = article("about", "index.md");

const content = [root, specs, docsIndex, proto, agent, reserved];

describe("routes", () => {
    it("maps projects, blueprints and tools to paths", () => {
        expect(articlePath(root, content)).toBe("/family-calendar");
        expect(articlePath(specs, content)).toBe("/family-calendar/specifications");
        expect(articlePath(agent, content)).toBe("/tools/ClaudeCode");
    });

    it("gives prototypes and reserved project names no page", () => {
        expect(articlePath(proto, content)).toBeNull();
        expect(articlePath(reserved, content)).toBeNull();
    });

    it("names docs/index.md 'overview' unless an overview.md already exists", () => {
        expect(blueprintSegment(docsIndex, content)).toBe("overview");
        const clash = article("plan-spec-build-workshop", "docs/overview.md");
        expect(blueprintSegment(docsIndex, [...content, clash])).toBe("index");
    });

    it("lists every page and finds articles by path", () => {
        expect(listArticlePages(content).map((p) => p.path)).toEqual([
            "/family-calendar",
            "/family-calendar/specifications",
            "/plan-spec-build-workshop/overview",
            "/tools/ClaudeCode",
        ]);
        expect(findArticleByPath(content, "/family-calendar/specifications")).toBe(specs);
        expect(findArticleByPath(content, "/nope")).toBeNull();
    });

    it("links back into the workshop grid", () => {
        expect(workshopHref(specs)).toBe("/?project=family-calendar&document=family-calendar%3Adocs%3Aspecifications");
        expect(workshopHref(agent)).toBe("/?document=_shared%3Aagents%3AClaudeCode");
    });

    it("uses the configured site URL without a trailing slash", () => {
        const before = process.env.NEXT_PUBLIC_SITE_URL;
        process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/";
        expect(siteUrl()).toBe("https://example.com");
        delete process.env.NEXT_PUBLIC_SITE_URL;
        expect(siteUrl()).toBe("https://plan-spec-build-workshop.vercel.app");
        if (before !== undefined) process.env.NEXT_PUBLIC_SITE_URL = before;
    });
});
