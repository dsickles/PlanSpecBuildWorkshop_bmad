// Server-only module
import { extractToc, injectHeadingIds, TocEntry } from "./toc-engine";

/**
 * Renders Markdown content to sanitized HTML with Table of Contents injection.
 * 
 * Uses dynamic imports for ESM-only packages to maintain compatibility
 * with environments that might not fully support native ESM (like some Jest setups).
 */
export async function renderMarkdownToHtml(
    content: string,
    toc: TocEntry[]
): Promise<string> {
    try {
        // Dynamic imports for ESM-only unified/remark/rehype ecosystem
        const [
            { unified },
            { default: remarkParse },
            { default: remarkGfm },
            { default: remarkRehype },
            { default: rehypeSanitize },
            { default: rehypeStringify }
        ] = await Promise.all([
            import("unified"),
            import("remark-parse"),
            import("remark-gfm"),
            import("remark-rehype"),
            import("rehype-sanitize"),
            import("rehype-stringify"),
        ]);

        const vfile = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeSanitize) // default schema strips <script> and event handlers
            .use(rehypeStringify)
            .process(content);

        let html = String(vfile);

        // Inject IDs into headers for anchor linking
        html = injectHeadingIds(html, toc);

        return html;
    } catch (err) {
        throw new Error(`Markdown rendering failed: ${String(err)}`);
    }
}
