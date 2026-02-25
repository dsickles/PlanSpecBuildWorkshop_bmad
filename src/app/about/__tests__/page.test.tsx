import { render, screen } from "@testing-library/react";
import AboutPage from "../page";
import * as contentParser from "../../../lib/content-parser";
import React from "react";

// Mock the content parser
jest.mock("../../../lib/content-parser", () => ({
    getSortedParsedContent: jest.fn(),
}));

// Mock next/link
jest.mock("next/link", () => {
    const MockLink = ({ children, href }: { children: React.ReactNode, href: string }) => (
        <a href={href}>{children}</a>
    );
    MockLink.displayName = "MockLink";
    return MockLink;
});

describe("AboutPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders back button and philosophy", async () => {
        (contentParser.getSortedParsedContent as jest.Mock).mockResolvedValue([]);
        const pageElement = await AboutPage();
        render(pageElement);

        expect(screen.getByText(/About this page/i)).toBeInTheDocument();
    });

    it("renders 'How to use' section with Icon Key", async () => {
        (contentParser.getSortedParsedContent as jest.Mock).mockResolvedValue([]);
        const pageElement = await AboutPage();
        render(pageElement);

        expect(screen.getByText(/How to use this page\?/i)).toBeInTheDocument();
        expect(screen.getByText(/Browse Mode/i)).toBeInTheDocument();
        expect(screen.getByText(/Focus Mode/i)).toBeInTheDocument();
        expect(screen.getByText(/Click any project filter/i)).toBeInTheDocument();
        expect(screen.getByText(/Click any domain or tech filter/i)).toBeInTheDocument();

        // Verify Structure section
        expect(screen.getByText(/Structure of the page/i)).toBeInTheDocument();
        expect(screen.getByText(/Agent Studio/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Blueprints/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/Build Lab/i)).toBeInTheDocument();

        // Verify Icon Key
        expect(screen.getByText(/Icon Key/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Project State/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/Source Code/i)).toBeInTheDocument();
        expect(screen.getByText(/Documentation/i)).toBeInTheDocument();
        expect(screen.getByText(/Live Prototype/i)).toBeInTheDocument();
    });

    it("renders metrics section with dynamic content", async () => {
        (contentParser.getSortedParsedContent as jest.Mock).mockResolvedValue([
            { projectSlug: "p1", artifactType: "agent" },
            { projectSlug: "p1", artifactType: "doc" },
            { projectSlug: "p2", artifactType: "prototype" }
        ]);

        const pageElement = await AboutPage();
        render(pageElement);

        const metricsSection = screen.getByText(/At a Glance/i).closest("section");
        expect(metricsSection).toBeInTheDocument();

        // Projects count - use exact string and check within metrics section
        expect(screen.getByText("2")).toBeInTheDocument();
        const projectsMetric = screen.getByText("Projects").closest("div");
        expect(projectsMetric).toHaveTextContent("2");

        // Artifact counts
        const ones = screen.getAllByText("1");
        expect(ones.length).toBeGreaterThanOrEqual(3);

        const agentsMetric = screen.getByText("Agent Sets").closest("div");
        expect(agentsMetric).toHaveTextContent("1");

        const docsMetric = screen.getByText("Blueprints", { selector: ".text-sm" }).closest("div");
        expect(docsMetric).toHaveTextContent("1");

        const prototypesMetric = screen.getByText("Prototypes").closest("div");
        expect(prototypesMetric).toHaveTextContent("1");
    });

    it("renders simplified open source CTA", async () => {
        (contentParser.getSortedParsedContent as jest.Mock).mockResolvedValue([]);
        const pageElement = await AboutPage();
        render(pageElement);

        expect(screen.getByText(/Fork a Workshop/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Use Template on GitHub/i })).toBeInTheDocument();
    });
});
