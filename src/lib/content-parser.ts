// Server-only module — uses Node.js `fs`. Never import from a client component.

import fs from "fs";
import path from "path";
import { z } from "zod";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import {
    ErrorFrontmatter,
    ArtifactType,
    ParsedArticle,
    FrontmatterSchema,
} from "./schema";
import { getContentFilePaths, CONTENT_ROOT } from "./content-utils";
import { loadSortConfig, applySortOrder } from "./sort-utils";
import { extractToc, injectHeadingIds } from "./toc-engine";

// =============================================================================
// Content Parser — Metadata Ingestion Engine
// Server-only ("use server"): reads files and transforms Markdown → HTML.
// See: Story 1.3 — Markdown Content and Metadata Ingestion Engine
// =============================================================================

// =============================================================================

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
    // Step 0: Resolve project title from index.md if possible
    let projectTitle: string | undefined;
    try {
        const projectDir = path.join(CONTENT_ROOT, projectSlug);
        const projectIndexPath = path.join(projectDir, "index.md");
        if (fs.existsSync(projectIndexPath)) {
            const projectRaw = fs.readFileSync(projectIndexPath, "utf-8");
            const projectMatter = matter(projectRaw);
            projectTitle = projectMatter.data.title;
        }
    } catch (err) {
        // Fallback to slug if title lookup fails
        console.error(`Failed to resolve project title for ${projectSlug}:`, err);
    }

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
            .map((issue: z.ZodIssue) =>
                `${issue.path.map(String).join(".") || "root"}: ${issue.message}`
            )
            .join("; ");
        return buildError(filePath, message);
    }

    // Step 6: Convert Markdown body → XSS-safe HTML
    let html: string;
    const toc = extractToc(content);

    try {
        const vfile = await unified()
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype)
            .use(rehypeSanitize) // default schema strips <script> and event handlers
            .use(rehypeStringify)
            .process(content);
        html = String(vfile);

        // Step 7: Inject IDs into headers for anchor linking
        html = injectHeadingIds(html, toc);
    } catch (err) {
        return buildError(filePath, `Markdown rendering failed: ${String(err)}`);
    }

    return {
        ...result.data,
        html,
        toc,
        projectSlug,
        artifactType,
        projectTitle,
        _filePath: filePath,
    } as ParsedArticle;
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
 * Returns all parsed content pre-sorted according to the sort-config.yaml manifest.
 *
 * @returns Sorted array of ParsedArticle | ErrorFrontmatter.
 */
export async function getSortedParsedContent(): Promise<(ParsedArticle | ErrorFrontmatter)[]> {
    const all = await getAllParsedContent();
    const config = await loadSortConfig();
    return applySortOrder(all, config);
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
