import { isError, ParsedContent, ParsedArticle, SHARED_DIR } from "./schema";

export interface ProjectMetrics {
    totalProjects: number;
    totalAgents: number;
    totalDocs: number;
    totalPrototypes: number;
}

/**
 * Calculates quantitative rollups from ingested content.
 * 
 * @param content - Array of parsed articles or error states
 * @returns ProjectMetrics object containing counts
 */
export function calculateMetrics(content: (ParsedContent | ParsedArticle)[]): ProjectMetrics {
    const validArticles = content.filter((item): item is ParsedArticle =>
        !isError(item) && "projectSlug" in item
    );

    const projectSlugs = new Set(
        validArticles
            .map((item) => item.projectSlug)
            .filter((slug) => slug !== SHARED_DIR)
    );

    const metrics: ProjectMetrics = {
        totalProjects: projectSlugs.size,
        totalAgents: 0,
        totalDocs: 0,
        totalPrototypes: 0,
    };

    for (const article of validArticles) {
        switch (article.artifactType) {
            case "agent":
                metrics.totalAgents++;
                break;
            case "doc":
                // Exclude project index.md files from the blueprint count
                if (!article._filePath.endsWith("index.md")) {
                    metrics.totalDocs++;
                }
                break;
            case "prototype":
                metrics.totalPrototypes++;
                break;
        }
    }

    return metrics;
}
