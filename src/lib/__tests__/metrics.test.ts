import { calculateMetrics, ProjectMetrics } from "../metrics";
import { ParsedArticle } from "../content-parser";
import { ParsedContent } from "../schema";

describe("calculateMetrics", () => {
    const mockContent: Partial<ParsedArticle>[] = [
        { projectSlug: "p1", artifactType: "agent" },
        { projectSlug: "p1", artifactType: "doc" },
        { projectSlug: "p2", artifactType: "agent" },
        { projectSlug: "p2", artifactType: "prototype" },
        { projectSlug: "p2", artifactType: "doc" },
    ];

    it("should correctly count projects, agents, docs, and prototypes", () => {
        const metrics = calculateMetrics(mockContent as ParsedArticle[]);

        const expected: ProjectMetrics = {
            totalProjects: 2,
            totalAgents: 2,
            totalDocs: 2,
            totalPrototypes: 1,
        };

        expect(metrics).toEqual(expected);
    });

    it("should handle empty content", () => {
        const metrics = calculateMetrics([]);
        expect(metrics.totalProjects).toBe(0);
        expect(metrics.totalDocs).toBe(0);
    });

    it("should ignore error objects", () => {
        const contentWithErrors = [
            ...mockContent,
            { _error: true, _message: "Test error" },
        ];
        const metrics = calculateMetrics(contentWithErrors as (ParsedContent | ParsedArticle)[]);
        expect(metrics.totalProjects).toBe(2);
    });
});
