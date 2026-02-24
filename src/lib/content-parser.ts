// Server-only module — uses Node.js `fs`. Never import from a client component.

import fs from "fs";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import {
    FrontmatterSchema,
    FrontmatterData,
    ErrorFrontmatter,
    ArtifactType,
    isError,
} from "./schema";
import { getContentFilePaths } from "./content-utils";

// =============================================================================
// Content Parser — Metadata Ingestion Engine
// Server-only ("use server"): reads files and transforms Markdown → HTML.
// See: Story 1.3 — Markdown Content and Metadata Ingestion Engine
// =============================================================================

/**
 * The fully resolved shape for a successfully parsed artifact.
 * Combines validated frontmatter with rendered HTML content and
 * structural metadata derived from the directory tree.
 */
export type ParsedArticle = FrontmatterData & {
    /** XSS-sanitized HTML string generated from the Markdown body. */
    html: string;
    /** Project slug derived from the directory structure. */
    projectSlug: string;
    /** Artifact type derived from the directory structure. */
    artifactType: ArtifactType;
};

/**
 * Parses a single Markdown file into structured content.
 *
 * Steps:
 * 1. Read file with `fs.readFileSync`
 * 2. Extract frontmatter with `gray-matter`
 * 3. Normalize gray-matter's Date objects → strings before Zod validation
 * 4. Validate frontmatter with `FrontmatterSchema.safeParse`
 * 5. Convert Markdown body → XSS-safe HTML via remark/rehype pipeline
 * 6. Return `ParsedArticle` on success, `ErrorFrontmatter` on failure
 *
 * @param filePath - Absolute path to the index.md file
 * @param projectSlug - Parent project slug (from directory structure)
 * @param artifactType - Artifact type (from directory structure)
 */
export async function parseMarkdownFile(
    filePath: string,
    projectSlug: string,
    artifactType: ArtifactType
): Promise<ParsedArticle | ErrorFrontmatter> {
    // Step 1: Read the file
    let raw: string;
    try {
        raw = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
        return buildError(filePath, `Could not read file: ${String(err)}`);
    }

    // Step 2: Extract frontmatter with gray-matter
    let data: Record<string, unknown>;
    let content: string;
    try {
        const parsed = matter(raw);
        data = parsed.data as Record<string, unknown>;
        content = parsed.content;
    } catch (err) {
        return buildError(filePath, `Failed to parse frontmatter YAML: ${String(err)}`);
    }

    // Step 3: Normalize gray-matter Date objects → ISO strings
    // gray-matter parses YAML date values as JS Date objects. The Zod schema
    // uses z.string() for date to avoid this inconsistency.
    const normalizedData = normalizeDates(data);

    // Step 4: Inject artifact_type from directory structure if not set in frontmatter
    if (!normalizedData.artifact_type) {
        normalizedData.artifact_type = artifactType;
    }

    // Step 5: Validate with Zod (safeParse never throws)
    const result = FrontmatterSchema.safeParse(normalizedData);
    if (!result.success) {
        const message = result.error.issues
            .map((issue) =>
                `${issue.path.map(String).join(".") || "root"}: ${issue.message}`
            )
            .join("; ");
        return buildError(filePath, message);
    }

    // Step 6: Convert Markdown body → XSS-safe HTML
    let html: string;
    try {
        const vfile = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeSanitize) // default schema strips <script> and event handlers
            .use(rehypeStringify)
            .process(content);
        html = String(vfile);
    } catch (err) {
        return buildError(filePath, `Markdown rendering failed: ${String(err)}`);
    }

    return {
        ...result.data,
        html,
        projectSlug,
        artifactType,
    } satisfies ParsedArticle;
}

/**
 * Parses all discovered `index.md` files in the content directory.
 *
 * @returns Array of `ParsedContent` — mix of `ParsedArticle` and `ErrorFrontmatter`.
 *          Use `isError()` from schema.ts to differentiate.
 */
export async function getAllParsedContent(): Promise<(ParsedArticle | ErrorFrontmatter)[]> {
    const paths = getContentFilePaths();
    return Promise.all(
        paths.map(({ filePath, projectSlug, artifactType }) =>
            parseMarkdownFile(filePath, projectSlug, artifactType)
        )
    );
}

/**
 * The project slug that must always appear first in the portfolio view.
 * This implements FR16: "Plan. Spec. Build." is always the first selectable item.
 */
export const PINNED_PROJECT_SLUG = "plan-spec-build-workshop";

/**
 * Returns all parsed content with the pinned project sorted to the front.
 * Sort is stable — all non-pinned items maintain their original relative order.
 *
 * @returns Sorted array of ParsedArticle | ErrorFrontmatter.
 */
export async function getSortedParsedContent(): Promise<(ParsedArticle | ErrorFrontmatter)[]> {
    const all = await getAllParsedContent();
    return [...all].sort((a, b) => {
        const aIsPinned = !isError(a) && a.projectSlug === PINNED_PROJECT_SLUG;
        const bIsPinned = !isError(b) && b.projectSlug === PINNED_PROJECT_SLUG;
        if (aIsPinned && !bIsPinned) return -1;
        if (!aIsPinned && bIsPinned) return 1;
        return 0;
    });
}

// =============================================================================
// Helpers
// =============================================================================

function buildError(filePath: string, message: string): ErrorFrontmatter {
    return { _error: true, _filePath: filePath, _message: message };
}

/**
 * Recursively converts JS Date objects to ISO date strings.
 * gray-matter parses YAML date fields as Date objects; Zod expects strings.
 */
function normalizeDates(
    obj: Record<string, unknown>
): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value instanceof Date) {
            result[key] = value.toISOString().split("T")[0]; // "YYYY-MM-DD"
        } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            result[key] = normalizeDates(value as Record<string, unknown>);
        } else {
            result[key] = value;
        }
    }
    return result;
}
