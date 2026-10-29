// Server-only module — loads content for the shareable pages.

import type { Metadata } from "next";
import { getSortedParsedContent } from "./content-parser";
import { listProjectDocumentSequence } from "./blueprint-nav";
import { articlePath, isProjectRoot, listArticlePages, siteUrl, TOOLS_SEGMENT } from "./routes";
import { ParsedArticle } from "./schema";

export const SITE_NAME = "Plan Spec Build Workshop";

export async function loadPages() {
    const content = await getSortedParsedContent();
    return { content, pages: listArticlePages(content) };
}

export async function projectParams(): Promise<{ project: string }[]> {
    const { pages } = await loadPages();
    return pages
        .filter(({ article }) => article.artifactType === "doc" && isProjectRoot(article))
        .map(({ article }) => ({ project: article.projectSlug }));
}

export async function blueprintParams(): Promise<{ project: string; doc: string }[]> {
    const { pages } = await loadPages();
    return pages
        .filter(({ article }) => article.artifactType === "doc" && !isProjectRoot(article))
        .map(({ path }) => {
            const [, project, doc] = path.split("/");
            return { project, doc };
        });
}

export async function toolParams(): Promise<{ tool: string }[]> {
    const { pages } = await loadPages();
    return pages
        .filter(({ path }) => path.startsWith(`/${TOOLS_SEGMENT}/`))
        .map(({ path }) => ({ tool: path.split("/")[2] }));
}

export async function findPage(path: string) {
    const { content, pages } = await loadPages();
    const page = pages.find((p) => p.path === path);
    return page ? { content, article: page.article } : null;
}

/** Previous and next pages in the project's blueprint order (overview first). */
export function blueprintNeighbors(content: Awaited<ReturnType<typeof loadPages>>["content"], article: ParsedArticle) {
    const sequence = listProjectDocumentSequence(content, article.projectSlug)
        .map((doc) => ({ doc, href: articlePath(doc, content) }))
        .filter((item): item is { doc: ParsedArticle; href: string } => item.href !== null);
    const index = sequence.findIndex((item) => item.doc.id === article.id);
    if (index === -1) return { prev: null, next: null };
    const link = (i: number) => (sequence[i] ? { title: sequence[i].doc.title, href: sequence[i].href } : null);
    return { prev: link(index - 1), next: link(index + 1) };
}

/** Title, description and link-preview tags for a page. */
export function articleMetadata(article: ParsedArticle, path: string, eyebrow: string): Metadata {
    const title = article.title === eyebrow ? article.title : `${article.title} · ${eyebrow}`;
    const description = article.description ?? `${article.title}, part of ${eyebrow} in the ${SITE_NAME}.`;
    const url = `${siteUrl()}${path}`;
    return {
        title: `${title} | ${SITE_NAME}`,
        description,
        alternates: { canonical: url },
        openGraph: { title, description, url, siteName: SITE_NAME, type: "article" },
        twitter: { card: "summary_large_image", title, description },
    };
}
