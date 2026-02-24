import { z } from "zod";

// =============================================================================
// Frontmatter Schema
// Single source of truth for all Markdown content shape across the application.
// See: Story 1.1 — Design Zod Frontmatter Schema
// =============================================================================

/**
 * The canonical status values for all artifacts.
 * These MUST match the CSS token names from globals.css (Story 0.2):
 *   bg-status-live-bg, bg-status-wip-bg, bg-status-concept-bg, bg-status-archived-bg
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
 * - `domain` and `tech_stack` require at least one value to support filtering (FR10, FR11).
 * - `parent_project` and `related_docs` enable deep linking across artifacts (FR4).
 */
export const FrontmatterSchema = z.object({
    title: z.string().min(1, "title is required"),
    date: z.string().min(1, "date is required"),
    status: z.enum(STATUS_VALUES, {
        error: `status must be one of: ${STATUS_VALUES.join(", ")}`,
    }),
    domain: z.array(z.string()).min(1, "At least one domain tag is required"),
    tech_stack: z
        .array(z.string())
        .min(1, "At least one tech_stack tag is required"),
    description: z.string().optional(),
    parent_project: z.string().optional(),
    related_docs: z.array(z.string()).optional(),
    artifact_type: z.enum(ARTIFACT_TYPES).optional(),
    external_url: z.string().url("external_url must be a valid URL").optional(),
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
