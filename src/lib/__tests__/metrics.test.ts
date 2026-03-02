import { calculateMetrics, ProjectMetrics } from "../metrics";
import { ParsedArticle, ParsedContent } from "../schema";

describe("calculateMetrics", () => {
    const mockContent: Partial<ParsedArticle>[] = [
        { projectSlug: "p1", artifactType: "agent", _filePath: "content/p1/agents/agent-a.md" },
        { projectSlug: "p1", artifactType: "doc", _filePath: "content/p1/docs/doc-a.md" },
        { projectSlug: "p2", artifactType: "agent", _filePath: "content/p2/agents/agent-b.md" },
        { projectSlug: "p2", artifactType: "prototype", _filePath: "content/p2/prototypes/proto-a.md" },
        { projectSlug: "p2", artifactType: "doc", _filePath: "content/p2/docs/doc-b.md" },
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
