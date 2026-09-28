import { applySortOrder } from "../sort-utils";
import {
    getBlueprintNav,
    listProjectDocumentSequence,
    projectHeaderDocument,
} from "../blueprint-nav";
import { ErrorFrontmatter, ParsedArticle } from "../schema";

function article(
    partial: Partial<ParsedArticle> & Pick<ParsedArticle, "id" | "title" | "projectSlug" | "artifactType" | "_filePath">
): ParsedArticle {
    return {
        date: "2024-01-01",
        status: "Live",
        html: `<p>${partial.title}</p>`,
        toc: [],
        links: [],
        taxonomy: { domain: partial.taxonomy?.domain ?? ["Kept"], tech_stack: [] },
        relations: { projects: [] },
        ...partial,
    };
}

describe("project document sequence", () => {
    const prd = article({
        id: "p:docs:prd",
        title: "PRD",
        projectSlug: "p",
        artifactType: "doc",
        _filePath: "/content/p/docs/prd.md",
        taxonomy: { domain: ["Portfolio"], tech_stack: [] },
    });
    const architecture = article({
        id: "p:docs:architecture",
        title: "Architecture",
        projectSlug: "p",
        artifactType: "doc",
        _filePath: "/content/p/docs/architecture.md",
        taxonomy: { domain: ["System Architecture"], tech_stack: [] },
    });
    const epics = article({
        id: "p:docs:epics",
        title: "Epics",
        projectSlug: "p",
        artifactType: "doc",
        _filePath: "/content/p/docs/epics.md",
        taxonomy: { domain: ["UX Design"], tech_stack: [] },
    });
    const docsIndex = article({
        id: "p:docs:index",
        title: "Overview",
        projectSlug: "p",
        artifactType: "doc",
        _filePath: "/content/p/docs/index.md",
        taxonomy: { domain: ["Portfolio"], tech_stack: [] },
    });
    const rootIndex = article({
        id: "p:index",
        title: "Project overview",
        projectSlug: "p",
        artifactType: "doc",
        _filePath: "/content/p/index.md",
    });
    const otherProject = article({
        id: "q:docs:prd",
        title: "Other PRD",
        projectSlug: "q",
        artifactType: "doc",
        _filePath: "/content/q/docs/prd.md",
    });
    const otherRoot = article({
        id: "q:index",
        title: "Other overview",
        projectSlug: "q",
        artifactType: "doc",
        _filePath: "/content/q/index.md",
    });
    const agent = article({
        id: "shared:agents:cursor",
        title: "Cursor",
        projectSlug: "_shared",
        artifactType: "agent",
        _filePath: "/content/_shared/agents/Cursor.md",
    });
    const error: ErrorFrontmatter = {
        _error: true,
        _filePath: "/content/p/docs/broken.md",
        _message: "bad",
    };

    const sortConfig = {
        projects: ["p", "q"],
        blueprints: { p: ["prd", "architecture", "epics", "index"] },
    };
    // sort-config lists index last. The header sequence still starts with Overview.
    const sorted = [
        ...applySortOrder(
            [epics, architecture, docsIndex, rootIndex, otherProject, otherRoot, prd],
            sortConfig
        ),
        agent,
        error,
    ];

    test("puts Overview first, then listed blueprints in card order", () => {
        expect(projectHeaderDocument(sorted, "p")?.id).toBe("p:docs:index");
        expect(listProjectDocumentSequence(sorted, "p").map((doc) => doc.id)).toEqual([
            "p:docs:index",
            "p:docs:prd",
            "p:docs:architecture",
            "p:docs:epics",
        ]);
    });

    test("uses the project root index when there is no docs/index.md", () => {
        const familyRoot = article({
            id: "family:index",
            title: "Family Calendar",
            projectSlug: "family",
            artifactType: "doc",
            _filePath: "/content/family/index.md",
        });
        const constitution = article({
            id: "family:docs:constitution",
            title: "Constitution",
            projectSlug: "family",
            artifactType: "doc",
            _filePath: "/content/family/docs/constitution.md",
        });
        const tasks = article({
            id: "family:docs:tasks",
            title: "Tasks",
            projectSlug: "family",
            artifactType: "doc",
            _filePath: "/content/family/docs/tasks.md",
        });
        const ordered = applySortOrder([tasks, familyRoot, constitution], {
            blueprints: { family: ["constitution", "tasks"] },
        });

        expect(projectHeaderDocument(ordered, "family")?.id).toBe("family:index");
        expect(listProjectDocumentSequence(ordered, "family").map((doc) => doc.id)).toEqual([
            "family:index",
            "family:docs:constitution",
            "family:docs:tasks",
        ]);
    });

    test("keeps docs a page filter would hide, and does not wrap", () => {
        const list = listProjectDocumentSequence(sorted, "p");
        expect(list.map((doc) => doc.title)).toEqual([
            "Overview",
            "PRD",
            "Architecture",
            "Epics",
        ]);

        const first = getBlueprintNav(sorted, docsIndex);
        const last = getBlueprintNav(sorted, epics);
        expect(first?.prev).toBeNull();
        expect(first?.next?.id).toBe("p:docs:prd");
        expect(last?.next).toBeNull();
        expect(last?.prev?.id).toBe("p:docs:architecture");
        expect(last?.next).not.toBe(first?.list[0]);
    });

    test("disables both ends when the only document is Overview", () => {
        const onlyDocs = article({
            id: "solo:docs:index",
            title: "Overview",
            projectSlug: "solo",
            artifactType: "doc",
            _filePath: "/content/solo/docs/index.md",
        });
        const onlyRoot = article({
            id: "bare:index",
            title: "Bare",
            projectSlug: "bare",
            artifactType: "doc",
            _filePath: "/content/bare/index.md",
        });

        for (const only of [onlyDocs, onlyRoot]) {
            const nav = getBlueprintNav([only], only);
            expect(nav?.list).toHaveLength(1);
            expect(nav?.prev).toBeNull();
            expect(nav?.next).toBeNull();
        }
    });

    test("hides navigation for agents and for the root index when docs/index is the header doc", () => {
        expect(getBlueprintNav(sorted, agent)).toBeNull();
        expect(getBlueprintNav(sorted, rootIndex)).toBeNull();
    });

    test("prev and next stay inside the same project", () => {
        const nav = getBlueprintNav(sorted, architecture);
        expect(nav?.prev?.id).toBe("p:docs:prd");
        expect(nav?.next?.id).toBe("p:docs:epics");
        expect(nav?.list.some((doc) => doc.projectSlug !== "p")).toBe(false);
        expect(projectHeaderDocument(sorted, "q")?.id).toBe("q:index");
        expect(listProjectDocumentSequence(sorted, "q").map((doc) => doc.id)).toEqual([
            "q:index",
            "q:docs:prd",
        ]);
    });

    test("recognizes a docs index written with backslashes", () => {
        const win = article({
            id: "p:docs:index-win",
            title: "Overview",
            projectSlug: "p",
            artifactType: "doc",
            _filePath: "C:\\content\\p\\docs\\index.md",
        });
        expect(projectHeaderDocument([win, prd], "p")?.id).toBe("p:docs:index-win");
        expect(listProjectDocumentSequence([win, prd], "p").map((doc) => doc.id)).toEqual([
            "p:docs:index-win",
            "p:docs:prd",
        ]);
    });
});
