import { applySortOrder } from "../sort-utils";
import {
    getBlueprintNav,
    isBlueprintArticle,
    listProjectBlueprints,
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

describe("blueprint navigation list", () => {
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
        blueprints: { p: ["prd", "architecture", "epics"] },
    };
    // applySortOrder is the source of blueprint order. Sort the docs, then
    // append non-blueprints the way the modal receives an already-sorted catalog.
    const sorted = [
        ...applySortOrder([epics, architecture, rootIndex, otherProject, prd], sortConfig),
        agent,
        error,
    ];

    test("follows applySortOrder and ignores non-blueprints", () => {
        expect(listProjectBlueprints(sorted, "p").map((doc) => doc.id)).toEqual([
            "p:docs:prd",
            "p:docs:architecture",
            "p:docs:epics",
        ]);
    });

    test("keeps docs a page filter would hide", () => {
        const list = listProjectBlueprints(sorted, "p");
        expect(list.map((doc) => doc.title)).toContain("Epics");
        expect(list.map((doc) => doc.title)).toContain("Architecture");
    });

    test("treats docs directory files as blueprints on either slash style", () => {
        expect(isBlueprintArticle(prd)).toBe(true);
        expect(
            isBlueprintArticle(
                article({
                    id: "p:docs:prd-win",
                    title: "PRD",
                    projectSlug: "p",
                    artifactType: "doc",
                    _filePath: "C:\\content\\p\\docs\\prd.md",
                })
            )
        ).toBe(true);
    });

    test("hides navigation when the open doc is not a blueprint", () => {
        expect(isBlueprintArticle(agent)).toBe(false);
        expect(isBlueprintArticle(rootIndex)).toBe(false);
        expect(getBlueprintNav(sorted, agent)).toBeNull();
        expect(getBlueprintNav(sorted, rootIndex)).toBeNull();
    });

    test("disables both ends when the project has one blueprint", () => {
        const only = article({
            id: "solo:docs:only",
            title: "Only",
            projectSlug: "solo",
            artifactType: "doc",
            _filePath: "/content/solo/docs/only.md",
        });
        const nav = getBlueprintNav([only], only);
        expect(nav).not.toBeNull();
        expect(nav?.prev).toBeNull();
        expect(nav?.next).toBeNull();
        expect(nav?.index).toBe(0);
    });

    test("prev and next stay inside the same project", () => {
        const nav = getBlueprintNav(sorted, architecture);
        expect(nav?.prev?.id).toBe("p:docs:prd");
        expect(nav?.next?.id).toBe("p:docs:epics");
        expect(nav?.list.some((doc) => doc.projectSlug !== "p")).toBe(false);
    });
});
