import { render, screen } from "@testing-library/react";
import { ProjectCard, FallbackCard } from "../project-card";
import React from "react";

// Mock lucide-react icons to test their presence
jest.mock("lucide-react", () => ({
    Rocket: () => <div data-testid="rocket-icon" />,
    Layers: () => <div data-testid="layers-icon" />,
    Github: () => <div data-testid="github-icon" />,
    FileText: () => <div data-testid="filetext-icon" />,
    Globe: () => <div data-testid="globe-icon" />,
}));

describe("ProjectCard - Agent External Links", () => {
    const defaultProps = {
        title: "Test Agent",
        status: "Live",
        description: "Test Description",
        artifactType: "agent" as const,
        context: "agent" as const,
    };

    test("should render external link icons and optional layers icon for agents", () => {
        const externalLinks = [
            { label: "GitHub", url: "https://github.com" },
            { label: "Demo", url: "https://demo.com" },
        ];
        const onLayersClick = jest.fn();

        render(<ProjectCard {...defaultProps} links={externalLinks} onLayersClick={onLayersClick} />);

        // Verify icons are rendered
        expect(screen.getByTestId("github-icon")).toBeInTheDocument();
        expect(screen.getByTestId("globe-icon")).toBeInTheDocument();
        expect(screen.getByTestId("layers-icon")).toBeInTheDocument();

        // Verify accessibility labels
        expect(screen.getByLabelText("View GitHub repository")).toBeInTheDocument();
        expect(screen.getByLabelText("Visit Demo website")).toBeInTheDocument();
        expect(screen.getByLabelText("Focus on this project")).toBeInTheDocument();

        // Verify links have correct hrefs
        const links = screen.getAllByRole("link");
        expect(links).toHaveLength(2);
        expect(links[0]).toHaveAttribute("href", "https://github.com");
        expect(links[1]).toHaveAttribute("href", "https://demo.com");
    });

    test("should not render icons when links is empty or undefined", () => {
        const { rerender } = render(<ProjectCard {...defaultProps} />);
        expect(screen.queryByRole("link")).not.toBeInTheDocument();

        rerender(<ProjectCard {...defaultProps} links={[]} />);
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});

describe("FallbackCard", () => {
    test("should not render a status pill in the header", () => {
        render(<FallbackCard title="No results" description="Nothing found" />);
        // StatusPill renders the status text inside a span. 
        // FallbackCard currently passes status="Concept" to ProjectCardHeader.
        expect(screen.queryByText("Concept")).not.toBeInTheDocument();
    });
});
