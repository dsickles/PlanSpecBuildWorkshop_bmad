import { ErrorFrontmatter, isError, ParsedArticle } from "./schema";

/**
 * A blueprint is a doc that lives in a project's `docs/` directory.
 * Project root index files, agents, and prototypes are not blueprints.
 */
export function isBlueprintArticle(article: ParsedArticle): boolean {
    if (article.artifactType !== "doc") return false;
    const segments = article._filePath.replace(/\\/g, "/").split("/");
    return segments[segments.length - 2] === "docs";
}

/**
 * Full blueprint list for one project, in the order of `content`.
 *
 * Callers must pass content already ordered by `applySortOrder` (sort-config).
 * This does not apply page filters — domain, tech, and project focus must not
 * shrink the Prev/Next path.
 */
export function listProjectBlueprints(
    content: readonly (ParsedArticle | ErrorFrontmatter)[],
    projectSlug: string
): ParsedArticle[] {
    return content.filter(
        (item): item is ParsedArticle =>
            !isError(item) &&
            item.projectSlug === projectSlug &&
            isBlueprintArticle(item)
    );
}

export interface BlueprintNav {
    list: ParsedArticle[];
    index: number;
    prev: ParsedArticle | null;
    next: ParsedArticle | null;
}

/**
 * Sibling navigation for a blueprint. Returns null when the open document
 * is not itself a blueprint (no sibling list — hide Prev/Next).
 */
export function getBlueprintNav(
    content: readonly (ParsedArticle | ErrorFrontmatter)[],
    current: ParsedArticle | null | undefined
): BlueprintNav | null {
    if (!current || !isBlueprintArticle(current)) return null;

    const list = listProjectBlueprints(content, current.projectSlug);
    const index = list.findIndex((item) => item.id === current.id);
    if (index === -1) return null;

    return {
        list,
        index,
        prev: index > 0 ? list[index - 1] : null,
        next: index < list.length - 1 ? list[index + 1] : null,
    };
}

/** Resolve a blueprint body from the already-loaded content set. */
export function findArticleById(
    content: readonly (ParsedArticle | ErrorFrontmatter)[],
    id: string | null
): ParsedArticle | null {
    if (!id) return null;
    return (
        content.find(
            (item): item is ParsedArticle => !isError(item) && item.id === id
        ) ?? null
    );
}
