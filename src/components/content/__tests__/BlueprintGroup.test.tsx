import { render, screen, fireEvent } from "@testing-library/react";
import { BlueprintGroup, BlueprintErrorRow } from "../blueprint-group";
import { ParsedArticle } from "@/lib/schema";

const mockDocs: ParsedArticle[] = [
    {
        id: "doc-1",
        title: "Doc 1",
        projectSlug: "project-a",
        artifactType: "doc",
        status: "Live",
        domain: ["Domain A"],
        tech_stack: ["Tech A"],
        description: "Description 1",
        date: "2023-01-01",
        html: "<p>1</p>",
        toc: [],
        projects: [],
        _filePath: "content/project-a/docs/doc-1.md"
    },
    {
        id: "doc-2",
        title: "Doc 2",
        projectSlug: "project-a",
        artifactType: "doc",
        status: "Live",
        domain: ["Domain B"],
        tech_stack: ["Tech B"],
        description: "Description 2",
        date: "2023-01-02",
        html: "<p>2</p>",
        toc: [],
        projects: [],
        _filePath: "content/project-a/docs/doc-2.md"
    }
];

describe("BlueprintGroup", () => {
    it("renders document titles", () => {
        render(<BlueprintGroup projectSlug="project-a" docs={mockDocs} />);
        expect(screen.getByText("Doc 1")).toBeInTheDocument();
        expect(screen.getByText("Doc 2")).toBeInTheDocument();
    });

    it("expands single document on click", () => {
        render(<BlueprintGroup projectSlug="project-a" docs={mockDocs} />);

        // Initially descriptions are not visible (need to verify how RTL handles this, 
        // usually it's in the DOM but hidden if using certain patterns, 
        // but here it's conditionally rendered)
        expect(screen.queryByText("Description 1")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Doc 1"));
        expect(screen.getByText("Description 1")).toBeInTheDocument();
    });

    it("auto-expands all documents when isFocused is true", () => {
        const { rerender } = render(<BlueprintGroup projectSlug="project-a" docs={mockDocs} isFocused={false} />);

        expect(screen.queryByText("Description 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Description 2")).not.toBeInTheDocument();

        rerender(<BlueprintGroup projectSlug="project-a" docs={mockDocs} isFocused={true} />);

        expect(screen.getByText("Description 1")).toBeInTheDocument();
        expect(screen.getByText("Description 2")).toBeInTheDocument();
    });

    it("allows manual collapse even when isFocused is true", () => {
        render(<BlueprintGroup projectSlug="project-a" docs={mockDocs} isFocused={true} />);

        // Should be expanded initially due to isFocused
        expect(screen.getByText("Description 1")).toBeInTheDocument();

        // Click to collapse Doc 1
        fireEvent.click(screen.getByText("Doc 1"));

        // Doc 1 should be collapsed, but Doc 2 stays expanded
        expect(screen.queryByText("Description 1")).not.toBeInTheDocument();
        expect(screen.getByText("Description 2")).toBeInTheDocument();
    });

    it("Collapse All button works when isFocused is true", () => {
        render(<BlueprintGroup projectSlug="project-a" docs={mockDocs} isFocused={true} />);

        expect(screen.getByText("Description 1")).toBeInTheDocument();
        expect(screen.getByText("Description 2")).toBeInTheDocument();

        const collapseAllBtn = screen.getByTestId("expand-collapse-all-button");
        fireEvent.click(collapseAllBtn);

        expect(screen.queryByText("Description 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Description 2")).not.toBeInTheDocument();
        expect(screen.getByTestId("expand-collapse-all-button")).toHaveTextContent("Expand All");
    });

    it("calls onLayersClick when Layers icon is clicked", () => {
        const onLayersClick = jest.fn();
        render(<BlueprintGroup projectSlug="project-a" docs={mockDocs} onLayersClick={onLayersClick} />);

        const layersBtn = screen.getByLabelText("Focus on this project");
        fireEvent.click(layersBtn);

        expect(onLayersClick).toHaveBeenCalled();
    });
});

describe("BlueprintErrorRow", () => {
    it("does not render a status pill", () => {
        render(<BlueprintErrorRow filePath="agents/invalid.md" />);
        expect(screen.queryByText("Concept")).not.toBeInTheDocument();
    });
});
