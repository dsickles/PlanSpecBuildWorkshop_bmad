import { render, screen, fireEvent } from "@testing-library/react";
import { DiscoveryGrid } from "../DiscoveryGrid";
import { useFilterState } from "../../../hooks/useFilterState";
import { ParsedArticle, ErrorFrontmatter } from "../../../lib/schema";

// Mock useFilterState
jest.mock("../../../hooks/useFilterState");

const mockContent: ParsedArticle[] = [
    {
        title: "Agent A",
        projectSlug: "_shared",
        artifactType: "agent",
        status: "Live",
        domain: ["Domain A"],
        tech_stack: ["Tech A"],
        description: "Description A",
        date: "2023-01-01",
        html: "<p>A</p>",
        projects: ["project-a"],
        _filePath: "content/_shared/agents/agent-a.md"
    },
    {
        title: "Agent B",
        projectSlug: "_shared",
        artifactType: "agent",
        status: "Live",
        domain: ["Domain B"],
        tech_stack: ["Tech B"],
        description: "Description B",
        date: "2023-01-01",
        html: "<p>B</p>",
        projects: ["project-b"],
        _filePath: "content/_shared/agents/agent-b.md"
    },
    {
        title: "Doc C",
        projectSlug: "project-a",
        artifactType: "doc",
        status: "Live",
        domain: ["Domain A"],
        tech_stack: ["Tech A"],
        description: "Description C",
        date: "2023-01-01",
        html: "<p>C</p>",
        projects: [],
        _filePath: "content/project-a/docs/doc-c.md"
    },
    {
        title: "Agent Shared",
        projectSlug: "_shared",
        artifactType: "agent",
        status: "Live",
        domain: ["Domain A"],
        tech_stack: ["Tech A"],
        description: "Shared Description",
        date: "2023-01-01",
        html: "<p>Shared</p>",
        projects: [],
        _filePath: "content/_shared/agents/agent-shared.md"
    }
];

describe("DiscoveryGrid", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("filters agents by projects array when activeProject is set", () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: "project-a",
            activeDomains: [],
            activeTech: []
        });

        render(<DiscoveryGrid allContent={mockContent} errors={[]} />);

        expect(screen.getByText("Agent A")).toBeInTheDocument();
        expect(screen.queryByText("Agent B")).not.toBeInTheDocument();
        expect(screen.getByText("Doc C")).toBeInTheDocument();
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

    it("calls setProject when Layers icon is clicked on a prototype", () => {
        const setProject = jest.fn();
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: [],
            setProject
        });

        const prototypeContent: ParsedArticle[] = [{
            ...mockContent[2], // Use Doc C as base (has project-a)
            artifactType: "prototype",
            title: "Proto 1"
        }];

        render(<DiscoveryGrid allContent={prototypeContent} errors={[]} />);

        const layersBtn = screen.getByLabelText("Focus on this project");
        fireEvent.click(layersBtn);

        expect(setProject).toHaveBeenCalledWith("project-a");
    });

    it("does not render Layers icon for agent cards", () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: []
        });

        const agentsOnly = mockContent.filter(i => i.artifactType === "agent");
        render(<DiscoveryGrid allContent={agentsOnly} errors={[]} />);

        // Screen should not have any elements with the Focus label for agents
        expect(screen.queryByLabelText("Focus on this project")).not.toBeInTheDocument();
    });

    it("shows truly shared agents in Browse Mode but hides them in Focus Mode", () => {
        // Browse Mode
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: []
        });

        const { rerender } = render(<DiscoveryGrid allContent={mockContent} errors={[]} />);
        expect(screen.getByText("Agent Shared")).toBeInTheDocument();

        // Focus Mode
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: "project-a",
            activeDomains: [],
            activeTech: []
        });

        rerender(<DiscoveryGrid allContent={mockContent} errors={[]} />);
        expect(screen.queryByText("Agent Shared")).not.toBeInTheDocument();
    });

    it("requires agents to match BOTH project AND domain/tech when both filters are active", () => {
        // Scenario: Active Project is 'project-a', Active Domain is 'Domain B'
        // Agent A matches project-a but NOT Domain B -> Should be hidden
        // Agent B matches Domain B but NOT project-a -> Should be hidden
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: "project-a",
            activeDomains: ["Domain B"],
            activeTech: []
        });

        render(<DiscoveryGrid allContent={mockContent} errors={[]} />);

        expect(screen.queryByText("Agent A")).not.toBeInTheDocument();
        expect(screen.queryByText("Agent B")).not.toBeInTheDocument();
        expect(screen.getByText("No agents found")).toBeInTheDocument();
    });

    it("shows agents matching both active project and active domain", () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: "project-a",
            activeDomains: ["Domain A"],
            activeTech: []
        });

        render(<DiscoveryGrid allContent={mockContent} errors={[]} />);

        expect(screen.getByText("Agent A")).toBeInTheDocument();
        expect(screen.queryByText("Agent B")).not.toBeInTheDocument();
    });

    it("renders errors in the correct columns based on file path", () => {
        const mockErrors: ErrorFrontmatter[] = [
            { _error: true, _filePath: "content/_shared/agents/error.md", _message: "Error A" },
            { _error: true, _filePath: "content/project-a/docs/error.md", _message: "Error B" },
            { _error: true, _filePath: "content/project-a/prototypes/error.md", _message: "Error C" }
        ];

        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: []
        });
        render(<DiscoveryGrid allContent={[]} errors={mockErrors} />);

        // Verify that BlueprintErrorRow renders the directory name (parent of filePath)
        expect(screen.getByText("docs")).toBeInTheDocument();
    });
});
