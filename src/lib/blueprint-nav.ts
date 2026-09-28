import { ErrorFrontmatter, isError, ParsedArticle } from "./schema";

function pathSegments(article: ParsedArticle): string[] {
    return article._filePath.replace(/\\/g, "/").split("/");
}

function isProjectDoc(article: ParsedArticle, projectSlug: string): boolean {
    return article.artifactType === "doc" && article.projectSlug === projectSlug;
}

/** `project/docs/index.md` — preferred project-header Overview. */
function isDocsIndex(article: ParsedArticle): boolean {
    const segments = pathSegments(article);
    const fileName = segments[segments.length - 1];
    const parent = segments[segments.length - 2];
    const grandParent = segments[segments.length - 3];
    return fileName === "index.md" && parent === "docs" && grandParent === article.projectSlug;
}

/** `project/index.md` — header Overview when the project has no docs/index.md. */
function isRootIndex(article: ParsedArticle): boolean {
    const segments = pathSegments(article);
    const fileName = segments[segments.length - 1];
    const parent = segments[segments.length - 2];
    return fileName === "index.md" && parent === article.projectSlug;
}

/** A blueprint row on the project card (docs/*.md other than docs/index.md). */
function isCardBlueprint(article: ParsedArticle): boolean {
    const segments = pathSegments(article);
    const fileName = segments[segments.length - 1];
    const parent = segments[segments.length - 2];
    return parent === "docs" && fileName.endsWith(".md") && fileName !== "index.md";
}

interface ProjectDocs {
    overview?: ParsedArticle;
    /** Listed blueprints in catalog order — the unfiltered card order. */
    rows: ParsedArticle[];
}

function classifyProjectDocs(
    content: readonly (ParsedArticle | ErrorFrontmatter)[],
    projectSlug: string
): ProjectDocs {
    let docsIndex: ParsedArticle | undefined;
    let rootIndex: ParsedArticle | undefined;
    const rows: ParsedArticle[] = [];

    for (const item of content) {
        if (isError(item) || !isProjectDoc(item, projectSlug)) continue;
        if (isDocsIndex(item)) {
            docsIndex ??= item;
        } else if (isRootIndex(item)) {
            rootIndex ??= item;
        } else if (isCardBlueprint(item)) {
            rows.push(item);
        }
    }

    return { overview: docsIndex ?? rootIndex, rows };
}

/**
 * The document the project-card header icon opens.
 * Prefers `docs/index.md`, then the project root `index.md`.
 * Resolved from the full catalog so page filters cannot retarget it.
 */
export function projectHeaderDocument(
    content: readonly (ParsedArticle | ErrorFrontmatter)[],
    projectSlug: string
): ParsedArticle | undefined {
    return classifyProjectDocs(content, projectSlug).overview;
}

/**
 * Prev/Next sequence for one project: Overview/index first, then listed
 * blueprints in card order (relative order in `content`, which is the
 * applySortOrder / sort-config order). Does not wrap. Does not apply
 * page filters — callers must pass the full unfiltered catalog.
 */
export function listProjectDocumentSequence(
    content: readonly (ParsedArticle | ErrorFrontmatter)[],
    projectSlug: string
): ParsedArticle[] {
    const { overview, rows } = classifyProjectDocs(content, projectSlug);
    return overview ? [overview, ...rows] : rows;
}

export interface BlueprintNav {
    list: ParsedArticle[];
    index: number;
    prev: ParsedArticle | null;
    next: ParsedArticle | null;
}

/**
 * Sibling navigation for a project document. Returns null when the open
 * document is not in that project's sequence (agents, prototypes, and other
 * docs) so Prev/Next stay hidden.
 */
export function getBlueprintNav(
    content: readonly (ParsedArticle | ErrorFrontmatter)[],
    current: ParsedArticle | null | undefined
): BlueprintNav | null {
    if (!current || current.artifactType !== "doc") return null;

    const list = listProjectDocumentSequence(content, current.projectSlug);
    const index = list.findIndex((item) => item.id === current.id);
    if (index === -1) return null;

    return {
        list,
        index,
        prev: index > 0 ? list[index - 1] : null,
        next: index < list.length - 1 ? list[index + 1] : null,
    };
}

/** Resolve a document body from the already-loaded content set. */
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
