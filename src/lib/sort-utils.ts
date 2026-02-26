import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { ErrorFrontmatter, isError, ParsedArticle } from "./schema";
import { CONTENT_ROOT } from "./content-utils";

/**
 * Centrally defines the display priority for artifacts in each column.
 * Loaded from src/content/sort-config.yaml.
 */
export type SortConfig = {
    agent_studio?: string[];
    blueprints?: Record<string, string[]>;
    build_lab?: string[];
    projects?: string[];
};

/**
 * Loads the sort configuration manifest from the content directory.
 * Returns an empty object if the file is missing or invalid.
 */
export async function loadSortConfig(): Promise<SortConfig> {
    const configPath = path.join(CONTENT_ROOT, "sort-config.yaml");
    if (!fs.existsSync(configPath)) return {};

    try {
        const raw = fs.readFileSync(configPath, "utf-8");
        // Ensure gray-matter treats the plain YAML as frontmatter
        const delimited = raw.trim().startsWith("---") ? raw : `---\n${raw}\n---`;
        const parsed = matter(delimited);
        return parsed.data as SortConfig;
    } catch (err) {
        console.error("Failed to load sort-config.yaml:", err);
        return {};
    }
}

/**
 * Applies hierarchical sorting to a flat array of parsed content based on a SortConfig.
 *
 * Sorting Rules (Hierarchical):
 * 1. Categorize by ArtifactType (handled by UI columns, but kept stable here).
 * 2. Sort within category:
 *    - Agents: By config.agent_studio list (matches title), then alphabetical.
 *    - Prototypes: By config.build_lab list (matches projectSlug), then alphabetical.
 *    - Docs: Grouped by project, projects sorted by config.projects list.
 *            Inside groups, sorted by config.blueprints[projectSlug] list (matches filename stems).
 */
export function applySortOrder(
    items: (ParsedArticle | ErrorFrontmatter)[],
    config: SortConfig
): (ParsedArticle | ErrorFrontmatter)[] {
    const result = [...items];

    return result.sort((a, b) => {
        // Always push errors to the end
        const aErr = isError(a);
        const bErr = isError(b);
        if (aErr && !bErr) return 1;
        if (!aErr && bErr) return -1;
        if (aErr && bErr) return 0;

        const artA = a as ParsedArticle;
        const artB = b as ParsedArticle;

        // If types differ, maintain original relative order (columns handled by UI)
        if (artA.artifactType !== artB.artifactType) return 0;

        // Sort within same type
        if (artA.artifactType === "agent") {
            const nameA = path.basename(artA._filePath, ".md");
            const nameB = path.basename(artB._filePath, ".md");
            return sortByList(nameA, nameB, config.agent_studio);
        }

        if (artA.artifactType === "prototype") {
            return sortByList(artA.projectSlug, artB.projectSlug, config.build_lab);
        }

        if (artA.artifactType === "doc") {
            // Docs are grouped by project in UI, so here we sort by project first, then by internal priority
            const projOrder = sortByList(artA.projectSlug, artB.projectSlug, config.projects);
            if (projOrder !== 0) return projOrder;

            // Same project, use blueprint specific order if available
            const blueprintList = config.blueprints?.[artA.projectSlug];
            const nameA = path.basename(artA._filePath, ".md");
            const nameB = path.basename(artB._filePath, ".md");
            return sortByList(nameA, nameB, blueprintList);
        }

        return 0;
    });
}

/**
 * Generic list-based sort with alphabetical fallback.
 * Exported for use in server components (e.g., project filters).
 */
export function sortByList(a: string, b: string, list?: string[]): number {
    if (list) {
        const idxA = list.indexOf(a);
        const idxB = list.indexOf(b);

        // Both in list
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        // Only A in list
        if (idxA !== -1) return -1;
        // Only B in list
        if (idxB !== -1) return 1;
    }

    // Fallback: Alphabetical by title/value
    return a.localeCompare(b);
}
