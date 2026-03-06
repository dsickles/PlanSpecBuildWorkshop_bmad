import { z } from "zod";

/**
 * The fully resolved shape for a successfully parsed artifact.
 * Combines validated frontmatter with rendered HTML content and
 * structural metadata derived from the directory tree.
 */
export type ParsedArticle = FrontmatterData & {
    /** Unique identifier derived from the relative file path. */
    id: string;
    /** XSS-sanitized HTML string generated from the Markdown body. */
    html: string;
    /** Table of Contents extracted from the document headings. */
    toc: { level: number; text: string; slug: string }[];
    /** Associated projects, if this artifact is part of multiple projects. */
    associatedProjects?: { slug: string; title: string }[];
    /** Project slug derived from the directory structure. */
    projectSlug: string;
    /** Artifact type derived from the directory structure. */
    artifactType: ArtifactType;
    /** Human-readable project title from the project's index.md. */
    projectTitle?: string;
    /** The original file path, used for unique React keys. */
    _filePath: string;
};

/** Reserved directory for shared agents and cross-project items. */
export const SHARED_DIR = "_shared";

// =============================================================================
// Frontmatter Schema
// Single source of truth for all Markdown content shape across the application.
// See: Story 1.1 — Design Zod Frontmatter Schema
// =============================================================================

/**
 * The canonical status values for all artifacts.
 * These are linked to CSS theme variables in globals.css (Story 0.2):
 *   --color-status-live-bg, --color-status-wip-bg, etc.
 */
export const STATUS_VALUES = ["Live", "WIP", "Concept", "Archived"] as const;
export type Status = (typeof STATUS_VALUES)[number];

/**
 * The canonical artifact type values.
 * Derived from directory structure by the file system parser (Story 1.2),
 * but can also be explicitly set in a file's frontmatter.
 */
export const ARTIFACT_TYPES = ["agent", "doc", "prototype"] as const;
export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

/**
 * Primary Zod schema for all Markdown frontmatter in the /content directory.
 *
 * Design notes:
 * - `date` is kept as a string (not z.date()) because gray-matter parses YAML
 *   dates as JS Date objects in some environments. Normalizing to string here
 *   avoids downstream inconsistencies. Convert to Date only in presentation utils.
 * - `taxonomy` groups `domain` and `tech_stack` arrays for filtering (FR10, FR11).
 *   Empty arrays are permitted if a document does not apply to a specific domain/tech.
 * - `relations` groups associations between artifacts.
 * - `links` groups external and repository links.
 */
export const FrontmatterSchema = z.object({
    title: z.string().min(1, "title is required"),
    date: z.string().min(1, "date is required"),
    status: z.enum(STATUS_VALUES, {
        error: `status must be one of: ${STATUS_VALUES.join(", ")}`,
    }),
    description: z.string().optional(),
    artifact_type: z.enum(ARTIFACT_TYPES).optional(),
    source_path: z.string().optional(),

    // Grouped Metadata
    taxonomy: z.object({
        domain: z.array(z.string()).nullish().transform(v => v ?? []),
        tech_stack: z.array(z.string()).nullish().transform(v => v ?? []),
    }).default({ domain: [], tech_stack: [] }),

    relations: z.object({
        projects: z.array(z.string()).nullish().transform(v => v ?? []),
    }).default({ projects: [] }),

    links: z.array(z.object({
        label: z.string(),
        url: z.string().url("Link must be a valid URL"),
    })).nullish().transform(v => v ?? []),
});

/** Inferred TypeScript type for valid frontmatter data. */
export type FrontmatterData = z.infer<typeof FrontmatterSchema>;

// =============================================================================
// Error Fallback — Discriminated Union
// Used when frontmatter validation fails. The site NEVER crashes; it degrades
// gracefully by rendering an [Error] card for the affected artifact only.
// =============================================================================

/**
 * Represents a failed parse attempt.
 * The `_error: true` discriminant allows TypeScript to narrow the union type
 * with the `isError()` type guard below.
 */
export interface ErrorFrontmatter {
    _error: true;
    /** The file path that failed to parse, for Author debugging. */
    _filePath: string;
    /** The human-readable Zod validation error message to surface to the Author. */
    _message: string;
}

/**
 * Union type representing the output of any content parsing operation.
 * Always use `isError()` to discriminate before accessing fields.
 */
export type ParsedContent = FrontmatterData | ErrorFrontmatter;

/**
 * Type guard — narrows a `ParsedContent` to `ErrorFrontmatter`.
 *
 * @example
 * if (isError(content)) {
 *   console.error(content._message);
 * } else {
 *   // content is FrontmatterData here
 * }
 */
export function isError(content: ParsedContent): content is ErrorFrontmatter {
    return (content as ErrorFrontmatter)._error === true;
}
