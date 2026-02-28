// Server-only module — uses Node.js `fs`. Never import from a client component.

import fs from "fs";
import path from "path";
import { z } from "zod";
import matter from "gray-matter";
import { renderMarkdownToHtml } from "./markdown-renderer";
import {
    ErrorFrontmatter,
    ArtifactType,
    ParsedArticle,
    FrontmatterSchema,
} from "./schema";
import { getContentFilePaths, CONTENT_ROOT } from "./content-utils";
import { loadSortConfig, applySortOrder } from "./sort-utils";
import { extractToc } from "./toc-engine";
import { pathToId } from "./utils";

// =============================================================================
// Content Parser — Metadata Ingestion Engine
// Server-only ("use server"): reads files and transforms Markdown → HTML.
// See: Story 1.3 — Markdown Content and Metadata Ingestion Engine
// =============================================================================

// Internal constant for branding tokenization
const PROJECT_NAME_TOKEN = /{{PROJECT_NAME}}/g;

/**
 * Recursively replaces the branding token in any string value within an object or array.
 */
function tokenizeMetadata(data: any, title: string): any {
    if (typeof data === "string") {
        return data.replace(PROJECT_NAME_TOKEN, title);
    }
    if (Array.isArray(data)) {
        return data.map((item) => tokenizeMetadata(item, title));
    }
    if (data !== null && typeof data === "object") {
        const result: Record<string, any> = {};
        for (const key in data) {
            result[key] = tokenizeMetadata(data[key], title);
        }
        return result;
    }
    return data;
}

/**
 * Parses a single Markdown file into structured content.
 *
 * Steps:
 * 1. Read file with `fs.readFileSync`
 * 2. Extract frontmatter with `gray-matter`
 * 3. Normalize gray-matter's Date objects → strings before Zod validation
 * 4. Validate frontmatter with `FrontmatterSchema.safeParse`
 * 5. Convert Markdown body → XSS-safe HTML via decoupled renderer
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
    const normalizedData = normalizeDates(data);

    // Step 4: Inject artifact_type from directory structure if not set in frontmatter
    if (!normalizedData.artifact_type) {
        normalizedData.artifact_type = artifactType;
    }

    // Step 5: Validate with Zod
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
    // Inject token replacement logic before Markdown-to-HTML conversion
    const titleToUse = projectTitle || projectSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const processedContent = content.replace(PROJECT_NAME_TOKEN, titleToUse);

    const toc = extractToc(processedContent);

    let html: string;
    try {
        // Delegate rendering to a decoupled utility to ensure testability
        html = await renderMarkdownToHtml(processedContent, toc);
    } catch (err) {
        return buildError(filePath, String(err));
    }

    // Step 7: Return the parsed article with tokenized metadata
    const tokenizedData = tokenizeMetadata(result.data, titleToUse);

    const relativePath = path.relative(CONTENT_ROOT, filePath);
    const id = pathToId(relativePath);

    return {
        ...tokenizedData,
        id,
        html,
        toc,
        projectSlug,
        artifactType,
        projectTitle: titleToUse,
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
