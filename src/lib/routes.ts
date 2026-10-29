import { ErrorFrontmatter, isError, ParsedArticle, SHARED_DIR } from "./schema";

// =============================================================================
// Shareable Routes
// Every project, blueprint and Agent Studio tool gets a static page with its
// own title and link preview. The home grid and modals stay the main reading
// experience; these pages exist so a link shared on its own makes sense.
//   /<project>             project overview (root index.md)
//   /<project>/<blueprint> a docs/*.md file; docs/index.md becomes "overview"
//   /tools/<tool>          an Agent Studio entry
// Prototypes link out to their demos and get no page of their own.
// =============================================================================

export const TOOLS_SEGMENT = "tools";

/** Top-level names already taken by app routes; projects using them get no page. */
export const RESERVED_SEGMENTS = new Set([TOOLS_SEGMENT, "about", "changelog", "sitemap.xml", "robots.txt", SHARED_DIR]);

export const DEFAULT_SITE_URL = "https://plan-spec-build-workshop.vercel.app";

/** Public base URL, overridable for forks and preview deploys. */
export function siteUrl(): string {
    return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

function segments(article: ParsedArticle): string[] {
    return article._filePath.replace(/\\/g, "/").split("/");
}

function stem(article: ParsedArticle): string {
    return (segments(article).at(-1) ?? "").replace(/\.md$/, "");
}

export function isProjectRoot(article: ParsedArticle): boolean {
    const parts = segments(article);
    return article.artifactType === "doc" && parts.at(-1) === "index.md" && parts.at(-2) === article.projectSlug;
}

function isBlueprint(article: ParsedArticle): boolean {
    const parts = segments(article);
    return article.artifactType === "doc" && parts.at(-2) === "docs" && parts.at(-3) === article.projectSlug;
}

/**
 * The URL segment for a blueprint. docs/index.md reads better as "overview",
 * unless the project also has a docs/overview.md.
 */
export function blueprintSegment(
    article: ParsedArticle,
    content: readonly (ParsedArticle | ErrorFrontmatter)[]
): string {
    const name = stem(article);
    if (name !== "index") return name;
    const hasOverviewFile = content.some(
        (item) => !isError(item) && item.projectSlug === article.projectSlug && isBlueprint(item) && stem(item) === "overview"
    );
    return hasOverviewFile ? "index" : "overview";
}

/** The shareable path for an article, or null when it has no page. */
export function articlePath(
    article: ParsedArticle,
    content: readonly (ParsedArticle | ErrorFrontmatter)[]
): string | null {
    if (article.artifactType === "agent") return `/${TOOLS_SEGMENT}/${stem(article)}`;
    if (RESERVED_SEGMENTS.has(article.projectSlug)) return null;
    if (isProjectRoot(article)) return `/${article.projectSlug}`;
    if (isBlueprint(article)) return `/${article.projectSlug}/${blueprintSegment(article, content)}`;
    return null;
}

/** Every article that has a page, with its path. */
export function listArticlePages(
    content: readonly (ParsedArticle | ErrorFrontmatter)[]
): { article: ParsedArticle; path: string }[] {
    const pages: { article: ParsedArticle; path: string }[] = [];
    for (const item of content) {
        if (isError(item)) continue;
        const path = articlePath(item, content);
        if (path) pages.push({ article: item, path });
    }
    return pages;
}

/** Finds the article behind a path, e.g. "/family-calendar/specifications". */
export function findArticleByPath(
    content: readonly (ParsedArticle | ErrorFrontmatter)[],
    path: string
): ParsedArticle | null {
    return listArticlePages(content).find((page) => page.path === path)?.article ?? null;
}

/** Deep link that opens the same article inside the workshop grid. */
export function workshopHref(article: ParsedArticle): string {
    const params = new URLSearchParams();
    if (article.artifactType !== "agent") params.set("project", article.projectSlug);
    params.set("document", article.id);
    return `/?${params.toString()}`;
}
