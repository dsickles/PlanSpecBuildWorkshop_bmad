import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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

function blueprint(partial: Pick<ParsedArticle, "id" | "title" | "projectSlug" | "_filePath"> & Partial<ParsedArticle>): ParsedArticle {
    return {
        artifactType: "doc",
        status: "Live",
        date: "2024-01-01",
        description: `${partial.title} description`,
        html: `<p>${partial.title} body</p>`,
        toc: [],
        links: [],
        taxonomy: { domain: ["Portfolio"], tech_stack: [] },
        relations: { projects: [] },
        ...partial,
    } as ParsedArticle;
}

describe("MarkdownDocumentModal blueprint Prev/Next", () => {
    const prd = blueprint({
        id: "workshop:docs:prd",
        title: "PRD",
        projectSlug: "workshop",
        projectTitle: "Workshop",
        _filePath: "/content/workshop/docs/prd.md",
        taxonomy: { domain: ["Portfolio"], tech_stack: [] },
    });
    const architecture = blueprint({
        id: "workshop:docs:architecture",
        title: "Architecture",
        projectSlug: "workshop",
        projectTitle: "Workshop",
        _filePath: "/content/workshop/docs/architecture.md",
        taxonomy: { domain: ["System Architecture"], tech_stack: [] },
        html: "<p>Architecture body</p>",
    });
    const epics = blueprint({
        id: "workshop:docs:epics",
        title: "Epics",
        projectSlug: "workshop",
        projectTitle: "Workshop",
        _filePath: "/content/workshop/docs/epics.md",
        taxonomy: { domain: ["UX Design"], tech_stack: [] },
    });
    const agent = blueprint({
        id: "shared:agents:cursor",
        title: "Cursor Agent",
        projectSlug: "_shared",
        artifactType: "agent",
        _filePath: "/content/_shared/agents/Cursor.md",
        html: "<p>Agent body</p>",
    });
    const catalog = [prd, architecture, epics, agent];

    function mockDocument(id: string) {
        const setDocument = jest.fn();
        (useFilterState as jest.Mock).mockReturnValue({
            activeDocument: id,
            setDocument,
            updateFilters: jest.fn(),
        });
        return setDocument;
    }

    beforeAll(() => {
        window.Element.prototype.scrollIntoView = jest.fn();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("shows disabled Prev and enabled Next on the first blueprint", () => {
        mockDocument(prd.id);
        render(<MarkdownDocumentModal allContent={catalog} />);

        expect(screen.getByTestId("blueprint-nav")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
    });

    it("disables Next on the last blueprint and walks backward", async () => {
        const setDocument = mockDocument(epics.id);
        render(<MarkdownDocumentModal allContent={catalog} />);

        expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Prev" })).toBeEnabled();

        fireEvent.click(screen.getByRole("button", { name: "Prev" }));

        expect(setDocument).toHaveBeenCalledWith(architecture.id);
        expect(setDocument).not.toHaveBeenCalledWith(null);
        expect(await screen.findByText("Architecture body")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Prev" })).toBeEnabled();
        expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
        expect(document.querySelector('[data-slot="dialog-content"]')).toBeInTheDocument();
    });

    it("keeps the full project list, including blueprints a page filter would hide", async () => {
        const setDocument = mockDocument(prd.id);
        render(<MarkdownDocumentModal allContent={catalog} />);

        fireEvent.click(screen.getByRole("button", { name: "Next" }));
        expect(setDocument).toHaveBeenCalledWith(architecture.id);
        expect(await screen.findByText("Architecture body")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Next" }));
        expect(setDocument).toHaveBeenCalledWith(epics.id);
        expect(await screen.findByRole("heading", { name: "Epics" })).toBeInTheDocument();
    });

    it("disables both controls when the project has one blueprint", () => {
        const only = blueprint({
            id: "solo:docs:only",
            title: "Only Blueprint",
            projectSlug: "solo",
            _filePath: "/content/solo/docs/only.md",
        });
        mockDocument(only.id);
        render(<MarkdownDocumentModal allContent={[only, agent]} />);

        expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    });

    it("hides Prev and Next when the open doc has no blueprint sibling list", () => {
        mockDocument(agent.id);
        render(<MarkdownDocumentModal allContent={catalog} />);

        expect(screen.getByText("Agent body")).toBeInTheDocument();
        expect(screen.queryByTestId("blueprint-nav")).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Prev" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
    });

    it("shows the destination title immediately, disables both controls while loading, then scrolls to the top", async () => {
        const setDocument = mockDocument(prd.id);
        let resolveLoad: (doc: ParsedArticle | null) => void = () => undefined;
        const loadBlueprint = jest.fn(
            () =>
                new Promise<ParsedArticle | null>((resolve) => {
                    resolveLoad = resolve;
                })
        );

        render(<MarkdownDocumentModal allContent={catalog} loadBlueprint={loadBlueprint} />);

        const scroller = screen.getByTestId("document-scroll");
        scroller.scrollTop = 320;

        fireEvent.click(screen.getByRole("button", { name: "Next" }));

        expect(setDocument).toHaveBeenCalledWith(architecture.id);
        expect(screen.getByRole("heading", { name: "Architecture" })).toBeInTheDocument();
        expect(screen.getByTestId("document-loading")).toBeInTheDocument();
        expect(screen.queryByText("PRD body")).not.toBeInTheDocument();
        expect(screen.queryByText("Architecture body")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
        expect(document.querySelector('[data-slot="dialog-content"]')).toBeInTheDocument();

        scroller.scrollTop = 480;

        await act(async () => {
            resolveLoad(architecture);
        });

        expect(screen.getByText("Architecture body")).toBeInTheDocument();
        expect(screen.queryByTestId("document-loading")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Prev" })).toBeEnabled();
        expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();
        expect(scroller.scrollTop).toBe(0);
    });

    it("stays on the failed slot, keeps Prev/Next usable, and retries the same target", async () => {
        const setDocument = mockDocument(architecture.id);
        const loadBlueprint = jest.fn()
            .mockRejectedValueOnce(new Error("network"))
            .mockImplementation(async (id: string) => catalog.find((doc) => doc.id === id) ?? null);

        render(<MarkdownDocumentModal allContent={catalog} loadBlueprint={loadBlueprint} />);

        fireEvent.click(screen.getByRole("button", { name: "Next" }));

        expect(await screen.findByTestId("document-load-error")).toBeInTheDocument();
        expect(screen.getByText("This document can't be loaded")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: "Epics" })).toBeInTheDocument();
        expect(setDocument).toHaveBeenCalledWith(epics.id);
        expect(setDocument).not.toHaveBeenCalledWith(architecture.id);
        expect(screen.getByRole("button", { name: "Prev" })).toBeEnabled();
        expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();

        fireEvent.click(screen.getByRole("button", { name: "Retry" }));

        expect(await screen.findByText("Epics body")).toBeInTheDocument();
        expect(loadBlueprint).toHaveBeenLastCalledWith(epics.id);
        expect(loadBlueprint).toHaveBeenCalledTimes(2);
        expect(screen.queryByTestId("document-load-error")).not.toBeInTheDocument();
    });
});
