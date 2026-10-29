import { render, screen, fireEvent } from "@testing-library/react";
import { PlanPanel } from "../plan-panel";
import { ProjectStatus } from "@/lib/status-schema";

const status: ProjectStatus = {
    slug: "psb",
    title: "Plan Spec Build Workshop",
    publish: "full",
    plan: {
        title: "Plan",
        updated: "2026-10-29",
        milestones: [
            { name: "Safety net", state: "done", started: "2026-10-18", finished: "2026-10-26", summary: "CI on every PR." },
            { name: "Living blueprints", state: "active", started: "2026-10-29" },
            { name: "Make it copyable", state: "planned" },
        ],
    },
    weeks: [{
        projectSlug: "psb",
        projectTitle: "Plan Spec Build Workshop",
        title: "A safety net",
        week: "2026-10-26",
        html: "",
        changes: [],
    }],
};

describe("PlanPanel", () => {
    it("shows progress collapsed and milestones when expanded", () => {
        render(<PlanPanel status={status} />);
        expect(screen.getByText("1 of 3 milestones done")).toBeInTheDocument();
        expect(screen.queryByTestId("plan-milestones")).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole("button", { name: "Expand plan" }));

        expect(screen.getByTestId("plan-milestones")).toBeInTheDocument();
        expect(screen.getByText("Safety net")).toBeInTheDocument();
        expect(screen.getByText("Oct 18, 2026 to Oct 26, 2026")).toBeInTheDocument();
        expect(screen.getByText("Started Oct 29, 2026")).toBeInTheDocument();
        expect(screen.getByText("CI on every PR.")).toBeInTheDocument();
        expect(screen.getAllByTestId("milestone-pill").map((p) => p.textContent)).toEqual(["Done", "In progress", "Planned"]);
    });

    it("opens the changelog from the icon and the latest week note", () => {
        const onChangelogOpen = jest.fn();
        render(<PlanPanel status={status} onChangelogOpen={onChangelogOpen} />);
        fireEvent.click(screen.getByRole("button", { name: "Open Plan Spec Build Workshop changelog" }));
        fireEvent.click(screen.getByText("A safety net"));
        expect(onChangelogOpen).toHaveBeenCalledTimes(2);
    });

    it("hides changelog links when there are no week notes", () => {
        render(<PlanPanel status={{ ...status, publish: "status", weeks: [] }} onChangelogOpen={jest.fn()} />);
        expect(screen.queryByRole("button", { name: /changelog/ })).not.toBeInTheDocument();
        expect(screen.queryByText(/Latest week note/)).not.toBeInTheDocument();
    });
});
