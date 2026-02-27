import { render, screen, fireEvent } from "@testing-library/react";
import { MarkdownDocumentModal } from "../MarkdownDocumentModal";
import { useFilterState } from "../../../hooks/useFilterState";
import { ParsedArticle } from "../../../lib/schema";

// Mock useFilterState
jest.mock("../../../hooks/useFilterState");

const mockContent: ParsedArticle[] = [
    {
        title: "Test Document",
        projectSlug: "test-project",
        artifactType: "doc",
        status: "Live",
        domain: ["Domain A"],
        tech_stack: ["Tech A"],
        description: "Test Description",
        date: "2023-01-01",
        html: "<p>Test Content</p>",
        projects: [],
        _filePath: "content/test-project/docs/test-doc.md"
    }
];

describe("MarkdownDocumentModal", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders with max-w-5xl and centered content width", () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeDocument: "test-doc",
            setDocument: jest.fn()
        });

        render(<MarkdownDocumentModal allContent={mockContent} />);

        // Find the elements in the Portal (JSDOM usually renders them in document.body)
        const dialogContent = document.querySelector('[data-slot="dialog-content"]');
        const dialogOverlay = document.querySelector('[data-slot="dialog-overlay"]');

        expect(dialogContent).toBeInTheDocument();
        expect(dialogContent).toHaveClass("max-w-7xl");

        expect(dialogOverlay).toBeInTheDocument();
        expect(dialogOverlay).toHaveClass("backdrop-blur-md");
        expect(dialogOverlay).toHaveClass("bg-zinc-950/50");

        // Check for 70ch constraint on the article container
        const article = screen.getByRole("article");
        const articleContainer = article.parentElement;
        expect(articleContainer).toHaveClass("max-w-[70ch]");
        expect(articleContainer).toHaveClass("mx-auto");
    });

    it("displays themed error state when document is not found", () => {
        const setDocument = jest.fn();
        (useFilterState as jest.Mock).mockReturnValue({
            activeDocument: "non-existent-doc",
            setDocument: setDocument
        });

        render(<MarkdownDocumentModal allContent={mockContent} />);

        const errorFallback = screen.getByTestId("document-error-fallback");
        expect(errorFallback).toBeInTheDocument();
        expect(errorFallback).toHaveAttribute("aria-label", "document not found");
        expect(errorFallback).toHaveClass("border-dashed");

        expect(screen.getByText("Document Not Found")).toBeInTheDocument();

        const returnButton = screen.getByRole("button", { name: /return to command center/i });
        expect(returnButton).toBeInTheDocument();

        fireEvent.click(returnButton);
        expect(setDocument).toHaveBeenCalledWith(null);
    });

    it("displays error state when document slug is invalid (Zod failure)", () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeDocument: "invalid--slug!!",
            setDocument: jest.fn()
        });

        render(<MarkdownDocumentModal allContent={mockContent} />);

        expect(screen.getByTestId("document-error-fallback")).toBeInTheDocument();
        expect(screen.getByText("Document Not Found")).toBeInTheDocument();
    });
});
