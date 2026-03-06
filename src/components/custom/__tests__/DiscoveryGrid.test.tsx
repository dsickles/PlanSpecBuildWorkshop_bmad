import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { DiscoveryGrid } from "../DiscoveryGrid";
import { useFilterState } from "../../../hooks/useFilterState";
import { ParsedArticle, ErrorFrontmatter } from "../../../lib/schema";

// Mock useFilterState
jest.mock("../../../hooks/useFilterState");

const mockContent: ParsedArticle[] = [
    {
        id: "_shared:agents:agent-a",
        title: "Agent A",
        projectSlug: "_shared",
        artifactType: "agent",
        status: "Live",
        taxonomy: { domain: ["Domain A"], tech_stack: ["Tech A"] },
        description: "Description A",
        relations: { projects: ["project-a"] },
        links: [],
        _filePath: "content/_shared/agents/agent-a.md",
        html: "<p>A</p>",
        date: "2023-01-01",
        toc: []
    } as ParsedArticle,
    {
        id: "_shared:agents:agent-b",
        title: "Agent B",
        projectSlug: "_shared",
        artifactType: "agent",
        status: "Live",
        taxonomy: { domain: ["Domain B"], tech_stack: ["Tech B"] },
        description: "Description B",
        relations: { projects: ["project-b"] },
        links: [],
        _filePath: "content/_shared/agents/agent-b.md",
        html: "<p>B</p>",
        date: "2023-01-01",
        toc: []
    } as ParsedArticle,
    {
        id: "project-a:docs:doc-c",
        title: "Doc C",
        projectSlug: "project-a",
        artifactType: "doc",
        status: "Live",
        taxonomy: { domain: ["Domain A"], tech_stack: ["Tech A"] },
        description: "Description C",
        relations: { projects: [] },
        links: [],
        _filePath: "content/project-a/docs/doc-c.md",
        html: "<p>C</p>",
        date: "2023-01-01",
        toc: []
    } as ParsedArticle,
    {
        id: "_shared:agents:agent-shared",
        title: "Agent Shared",
        projectSlug: "_shared",
        artifactType: "agent",
        status: "Live",
        taxonomy: { domain: ["Domain A"], tech_stack: ["Tech A"] },
        description: "Shared Description",
        relations: { projects: [] },
        links: [],
        _filePath: "content/_shared/agents/agent-shared.md",
        html: "<p>Shared</p>",
        date: "2023-01-01",
        toc: []
    } as ParsedArticle
];

describe("DiscoveryGrid", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
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

        expect(screen.getByText("No tools found")).toBeInTheDocument();
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
        expect(screen.getByText("No tools found")).toBeInTheDocument();
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

    it("identifies index.md as overviewDoc and passes it to BlueprintGroup", () => {
        const mockOverview: ParsedArticle[] = [
            {
                id: "project-a:index",
                _filePath: "content/project-a/index.md",
                projectSlug: "project-a",
                projectTitle: "Project A",
                title: "Project A Overview",
                artifactType: "doc",
                status: "Live",
                taxonomy: { domain: ["Logic"], tech_stack: ["React"] },
                description: "Overview content",
                html: "<h1>Overview</h1>",
                date: "2023-01-01",
                toc: [],
                relations: { projects: [] },
                links: []
            } as ParsedArticle,
            {
                id: "project-a:docs:spec",
                _filePath: "content/project-a/docs/spec.md",
                projectSlug: "project-a",
                projectTitle: "Project A",
                title: "Technical Spec",
                artifactType: "doc",
                status: "Live",
                taxonomy: { domain: ["Logic"], tech_stack: ["React"] },
                description: "Spec content",
                html: "<h1>Spec</h1>",
                date: "2023-01-01",
                toc: [],
                relations: { projects: [] },
                links: []
            } as ParsedArticle,
        ];

        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: [],
            setProject: jest.fn(),
            setDocument: jest.fn(),
        });

        render(<DiscoveryGrid allContent={mockOverview} errors={[]} />);

        // BlueprintGroup should receive the overviewDoc
        // We can check if the button with aria-label "Open Project A overview" exists
        expect(screen.getByLabelText(/Open Project A overview/i)).toBeInTheDocument();
    });

    it("renders overview icon for agent cards (opens agent doc in modal)", () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: [],
            setDocument: jest.fn()
        });

        const agentsOnly = mockContent.filter(i => i.artifactType === "agent");
        render(<DiscoveryGrid allContent={agentsOnly} errors={[]} />);

        // Agent cards receive onDocOpen from DiscoveryGrid, so they render the overview icon
        const overviewButtons = screen.getAllByLabelText(/View project overview/i);
        expect(overviewButtons.length).toBe(agentsOnly.length);
    });

    it("does not render overview icon for prototype cards", () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: []
        });

        const prototypesOnly: ParsedArticle[] = [{
            id: "project-a:prototypes:proto-1",
            _filePath: "content/project-a/prototypes/proto-1.md",
            projectSlug: "project-a",
            artifactType: "prototype",
            title: "Proto 1",
            status: "Live",
            taxonomy: { domain: [], tech_stack: [] },
            html: "",
            date: "2023-01-01",
            toc: [],
            relations: { projects: [] },
            links: []
        } as ParsedArticle];

        render(<DiscoveryGrid allContent={prototypesOnly} errors={[]} />);

        // Screen should not have any elements with the overview label for prototypes
        expect(screen.queryByLabelText(/View project overview/i)).not.toBeInTheDocument();
    });

    it("identifies docs/index.md as blueprintOverview and uses it for header, while excluding it from rows", () => {
        const mockBlueprintOverview: ParsedArticle[] = [
            {
                id: "project-a:docs:index",
                _filePath: "content/project-a/docs/index.md",
                projectSlug: "project-a",
                projectTitle: "Project A",
                title: "Blueprint Overview",
                artifactType: "doc",
                status: "Live",
                taxonomy: { domain: [], tech_stack: [] },
                html: "",
                date: "2023-01-01",
                toc: [],
                relations: { projects: [] },
                links: []
            } as ParsedArticle,
            {
                id: "project-a:docs:other",
                _filePath: "content/project-a/docs/other.md",
                projectSlug: "project-a",
                projectTitle: "Project A",
                title: "Other Doc",
                artifactType: "doc",
                status: "Live",
                taxonomy: { domain: [], tech_stack: [] },
                html: "",
                date: "2023-01-01",
                toc: [],
                relations: { projects: [] },
                links: []
            } as ParsedArticle,
        ];

        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: [],
            setProject: jest.fn(),
            setDocument: jest.fn(),
        });

        render(<DiscoveryGrid allContent={mockBlueprintOverview} errors={[]} />);

        // Header icon should exist (BlueprintGroup uses aria-label="Open Project A overview")
        expect(screen.getByLabelText(/Open Project A overview/i)).toBeInTheDocument();
        // Row for 'Other Doc' should exist
        expect(screen.getByText("Other Doc")).toBeInTheDocument();
        // 'Blueprint Overview' should NOT appear in rows
        expect(screen.queryByText("Blueprint Overview")).not.toBeInTheDocument();
    });

    it("prioritizes docs/index.md over root index.md for BlueprintGroup overview", () => {
        const mockMixedOverview: ParsedArticle[] = [
            {
                id: "project-a:index",
                _filePath: "content/project-a/index.md",
                projectSlug: "project-a",
                projectTitle: "Project A",
                title: "Project Root Overview",
                artifactType: "doc",
                status: "Live",
                taxonomy: { domain: [], tech_stack: [] },
                html: "Root",
                date: "2023-01-01",
                toc: [],
                relations: { projects: [] },
                links: []
            } as ParsedArticle,
            {
                id: "project-a:docs:index",
                _filePath: "content/project-a/docs/index.md",
                projectSlug: "project-a",
                projectTitle: "Project A",
                title: "Blueprint Doc Overview",
                artifactType: "doc",
                status: "Live",
                taxonomy: { domain: [], tech_stack: [] },
                html: "Doc",
                date: "2023-01-01",
                toc: [],
                relations: { projects: [] },
                links: []
            } as ParsedArticle,
            {
                id: "project-a:docs:other",
                _filePath: "content/project-a/docs/other.md",
                projectSlug: "project-a",
                projectTitle: "Project A",
                title: "Other Doc",
                artifactType: "doc",
                status: "Live",
                taxonomy: { domain: [], tech_stack: [] },
                html: "",
                date: "2023-01-01",
                toc: [],
                relations: { projects: [] },
                links: []
            } as ParsedArticle,
        ];

        const setDocument = jest.fn();
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: [],
            setProject: jest.fn(),
            setDocument,
        });

        render(<DiscoveryGrid allContent={mockMixedOverview} errors={[]} />);

        const headerBtn = screen.getByLabelText(/Open Project A overview/i);
        fireEvent.click(headerBtn);

        // Should have called setDocument with the ID for the docs/index.md file
        try {
            expect(setDocument).toHaveBeenCalledWith("project-a:docs:index");
        } catch (e) {
            throw new Error(`Expected ID: project-a:docs:index. Actual calls: ${JSON.stringify(setDocument.mock.calls)}`);
        }
    });
});
