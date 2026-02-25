import { render, screen } from "@testing-library/react";
import { DiscoveryGrid } from "../DiscoveryGrid";
import { useFilterState } from "../../../hooks/useFilterState";
import { ParsedArticle } from "../../../lib/content-parser";

// Mock useFilterState
jest.mock("../../../hooks/useFilterState");

const mockContent: ParsedArticle[] = [
    {
        title: "Agent A",
        projectSlug: "project-a",
        artifactType: "agent",
        status: "Live",
        domain: ["Domain A"],
        tech_stack: ["Tech A"],
        description: "Description A",
        date: "2023-01-01",
        html: "<p>A</p>"
    },
    {
        title: "Agent B",
        projectSlug: "project-b",
        artifactType: "agent",
        status: "Live",
        domain: ["Domain B"],
        tech_stack: ["Tech B"],
        description: "Description B",
        date: "2023-01-01",
        html: "<p>B</p>"
    }
];

describe("DiscoveryGrid", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("filters items by projectSlug when activeProject is set", () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: "project-a",
            activeDomains: [],
            activeTech: []
        });

        render(<DiscoveryGrid allContent={mockContent} errors={[]} />);

        expect(screen.getByText("Agent A")).toBeInTheDocument();
        expect(screen.queryByText("Agent B")).not.toBeInTheDocument();
    });

    it("renders fallback cards when no items match filters", () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: "non-existent",
            activeDomains: [],
            activeTech: []
        });

        render(<DiscoveryGrid allContent={mockContent} errors={[]} />);

        expect(screen.getByText("No agents found")).toBeInTheDocument();
        expect(screen.getByText("No blueprints found")).toBeInTheDocument();
        expect(screen.getByText("No prototypes found")).toBeInTheDocument();
    });

    it("filters items using combined Domain and Tech filters (OR logic)", () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: ["Domain A"],
            activeTech: ["Tech B"]
        });

        render(<DiscoveryGrid allContent={mockContent} errors={[]} />);

        // Agent A matches Domain A, Agent B matches Tech B
        expect(screen.getByText("Agent A")).toBeInTheDocument();
        expect(screen.getByText("Agent B")).toBeInTheDocument();
    });
});
