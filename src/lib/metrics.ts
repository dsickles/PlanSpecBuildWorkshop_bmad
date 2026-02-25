import { ParsedArticle } from "./content-parser";
import { isError, ParsedContent } from "./schema";

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
    const validArticles = content.filter((item): item is ParsedArticle => !isError(item));

    const projectSlugs = new Set(validArticles.map((item) => item.projectSlug));

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
                metrics.totalDocs++;
                break;
            case "prototype":
                metrics.totalPrototypes++;
                break;
        }
    }

    return metrics;
}
