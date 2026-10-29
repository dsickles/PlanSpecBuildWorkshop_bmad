import { render, screen, fireEvent, within } from "@testing-library/react";
import { ChangelogModal } from "../ChangelogModal";
import { useFilterState } from "@/hooks/useFilterState";
import { ProjectStatus } from "@/lib/status-schema";

jest.mock("@/hooks/useFilterState");

const mockedUseFilterState = useFilterState as jest.Mock;

const statuses: ProjectStatus[] = [
    {
        slug: "alpha",
        title: "Alpha",
        publish: "full",
        plan: { title: "Plan", updated: "2026-10-29", milestones: [{ name: "One", state: "done" }, { name: "Two", state: "planned" }] },
        weeks: [
            {
                projectSlug: "alpha",
                projectTitle: "Alpha",
                title: "Alpha ships",
                week: "2026-10-26",
                author: "Gates",
                html: "<p>What moved.</p>",
                changes: [
                    { date: "2026-10-26", title: "Older change", kind: "shipped", approach: {} },
                    {
                        date: "2026-10-28",
                        title: "Newer change",
                        kind: "reverted",
                        approach: { issue: "DAS-9", tool: "Claude Code", pr: "https://github.com/o/r/pull/42", result: "https://demo.example.com" },
                    },
                ],
            },
        ],
    },
    {
        slug: "beta",
        title: "Beta",
        publish: "full",
        weeks: [{ projectSlug: "beta", projectTitle: "Beta", title: "Beta starts", week: "2026-10-19", html: "", changes: [] }],
    },
];

function setup(state: Partial<ReturnType<typeof useFilterState>> = {}) {
    const setChangelog = jest.fn();
    const setProject = jest.fn();
    mockedUseFilterState.mockReturnValue({ activeChangelog: true, activeProject: null, setChangelog, setProject, ...state });
    return { setChangelog, setProject };
}

describe("ChangelogModal", () => {
    it("stays closed unless the URL asks for it", () => {
        setup({ activeChangelog: false });
        render(<ChangelogModal statuses={statuses} />);
        expect(screen.queryByText("Changelog")).not.toBeInTheDocument();
    });

    it("groups notes by week, newest first, with the approach trail", () => {
        setup();
        render(<ChangelogModal statuses={statuses} />);

        const weeks = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
        expect(weeks).toEqual(["Changelog", "Progress", "Week of Oct 26, 2026", "Week of Oct 19, 2026"]);
        expect(screen.getByText("Written by Gates")).toBeInTheDocument();
        expect(screen.getByText("1 of 2 milestones done")).toBeInTheDocument();

        const entries = screen.getAllByTestId("changelog-entry");
        expect(entries[0]).toHaveTextContent("Newer change");
        expect(entries[1]).toHaveTextContent("Older change");

        const trail = within(entries[0]).getByTestId("approach-trail");
        expect(trail).toHaveTextContent("DAS-9");
        expect(trail).toHaveTextContent("via Claude Code");
        expect(within(trail).getByRole("link", { name: "PR #42" })).toHaveAttribute("href", "https://github.com/o/r/pull/42");
        expect(within(trail).getByRole("link", { name: "Open result" })).toHaveAttribute("href", "https://demo.example.com");
    });

    it("shows only the focused project and can widen back out", () => {
        const { setProject } = setup({ activeProject: "beta" });
        render(<ChangelogModal statuses={statuses} />);
        expect(screen.getByText("Beta starts")).toBeInTheDocument();
        expect(screen.queryByText("Alpha ships")).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Show all projects" }));
        expect(setProject).toHaveBeenCalledWith(null);
    });

    it("shows an empty state when nothing is published", () => {
        setup();
        render(<ChangelogModal statuses={[]} />);
        expect(screen.getByTestId("changelog-empty")).toHaveTextContent("No published updates yet");
    });

    it("closes through Back", () => {
        const { setChangelog } = setup();
        render(<ChangelogModal statuses={statuses} />);
        fireEvent.click(screen.getByRole("button", { name: "Back" }));
        expect(setChangelog).toHaveBeenCalledWith(false);
    });
});
