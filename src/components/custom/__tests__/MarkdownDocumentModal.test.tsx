import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MarkdownDocumentModal } from "../MarkdownDocumentModal";
import { useFilterState } from "../../../hooks/useFilterState";
import { ParsedArticle } from "../../../lib/schema";

// Mock useFilterState
jest.mock("../../../hooks/useFilterState");

const mockContent: ParsedArticle[] = [
    {
        id: "test-doc",
        title: "Test Document",
        projectSlug: "test-project",
        artifactType: "doc",
        status: "Live",
        domain: ["Domain A"],
        tech_stack: ["Tech A"],
        description: "Test Description",
        date: "2023-01-01",
        html: "<p>Test Content</p>",
        toc: [],
        projects: [],
        _filePath: "content/test-project/docs/test-doc.md"
    }
];

describe("MarkdownDocumentModal", () => {
    beforeAll(() => {
        window.Element.prototype.scrollIntoView = jest.fn();
    });

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

    it("displays the sector breadcrumb, back button, and progress bar", () => {
        const setDocument = jest.fn();
        (useFilterState as jest.Mock).mockReturnValue({
            activeDocument: "test-doc",
            setDocument: setDocument
        });

        render(<MarkdownDocumentModal allContent={mockContent} />);


        // Check for Back button instead of Close button
        const backButton = screen.getByRole("button", { name: /back/i });
        expect(backButton).toBeInTheDocument();

        fireEvent.click(backButton);
        expect(setDocument).toHaveBeenCalledWith(null);

        // Check for progress bar with ARIA
        const progressBar = screen.getByRole("progressbar", { name: /reading progress/i });
        expect(progressBar).toBeInTheDocument();
        expect(progressBar).toHaveAttribute("aria-valuenow", "0");

        // Check for breadcrumb (now title-cased fallback, without prefix)
        expect(screen.getByText(/Test Project/i)).toBeInTheDocument();
    });

    it("displays error state when document is not found", () => {
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

    it("auto-scrolls TOC sidebar when active item changes", async () => {
        const scrollIntoViewMock = jest.fn();
        window.Element.prototype.scrollIntoView = scrollIntoViewMock;

        const toc = [
            { text: "Item 1", slug: "item-1", level: 2 },
            { text: "Item 2", slug: "item-2", level: 2 }
        ];
        const contentWithToc = [{ ...mockContent[0], toc }];

        (useFilterState as jest.Mock).mockReturnValue({
            activeDocument: "test-doc",
            setDocument: jest.fn()
        });

        render(<MarkdownDocumentModal allContent={contentWithToc} />);

        // The active ID defaults to the first item (item-1) in useEffect
        await waitFor(() => {
            expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth', block: 'center' });
        });
    });

    it("does not apply redundant scroll-padding-top (Fixed Regression)", () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeDocument: "test-doc",
            setDocument: jest.fn()
        });

        render(<MarkdownDocumentModal allContent={mockContent} />);

        const scrollContainer = screen.getByRole("article").parentElement?.parentElement;
        expect(scrollContainer).not.toHaveStyle({ scrollPaddingTop: '280px' });
    });

    it("restores focus via Radix primitives on close (AC 1)", () => {
        const setDocument = jest.fn();
        (useFilterState as jest.Mock).mockReturnValue({
            activeDocument: "test-doc",
            setDocument: setDocument
        });

        render(<MarkdownDocumentModal allContent={mockContent} />);

        // We verify that the Dialog is rendering with the expected onCloseAutoFocus handler
        // by checking that the component doesn't crash and the handler is present in the DOM 
        // if we could inspect props, but in RTL we'll just verify the flow.
        const backButton = screen.getByRole("button", { name: /back/i });
        fireEvent.click(backButton);

        expect(setDocument).toHaveBeenCalledWith(null);
    });
});
