import { render, screen, fireEvent } from "@testing-library/react";
import { BlueprintGroup } from "../blueprint-group";
import { ParsedArticle } from "@/lib/content-parser";

const mockDocs: ParsedArticle[] = [
    {
        title: "Doc 1",
        projectSlug: "project-a",
        artifactType: "doc",
        status: "Live",
        domain: ["Domain A"],
        tech_stack: ["Tech A"],
        description: "Description 1",
        date: "2023-01-01",
        html: "<p>1</p>"
    },
    {
        title: "Doc 2",
        projectSlug: "project-a",
        artifactType: "doc",
        status: "Live",
        domain: ["Domain B"],
        tech_stack: ["Tech B"],
        description: "Description 2",
        date: "2023-01-02",
        html: "<p>2</p>"
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

        const collapseAllBtn = screen.getByText("[Collapse All]");
        fireEvent.click(collapseAllBtn);

        expect(screen.queryByText("Description 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Description 2")).not.toBeInTheDocument();
        expect(screen.getByText("[Expand All]")).toBeInTheDocument();
    });
});
