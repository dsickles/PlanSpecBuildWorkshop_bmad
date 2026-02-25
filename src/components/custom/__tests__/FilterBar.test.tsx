import { render, screen, fireEvent } from "@testing-library/react";
import { FilterBar } from "../FilterBar";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Mock Next.js hooks
jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
    usePathname: jest.fn()
}));

describe("FilterBar", () => {
    const mockPush = jest.fn();
    const mockProjects = ["Project A", "Project B"];
    const mockDomains = ["Domain X", "Domain Y"];
    const mockTechStacks = ["Tech 1", "Tech 2"];

    beforeEach(() => {
        jest.clearAllMocks();
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (usePathname as jest.Mock).mockReturnValue("/");
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue(null), // By default, no params
            toString: jest.fn().mockReturnValue("")
        });
    });

    it("renders all buttons correctly from props", () => {
        render(
            <FilterBar
                projects={mockProjects}
                domains={mockDomains}
                techStacks={mockTechStacks}
            />
        );

        // Project check
        expect(screen.getByText("All")).toBeInTheDocument();
        expect(screen.getByText("Project A")).toBeInTheDocument();
        expect(screen.getByText("Project B")).toBeInTheDocument();

        // Domain check
        expect(screen.getByText("Domain X")).toBeInTheDocument();
        expect(screen.getByText("Domain Y")).toBeInTheDocument();

        // Tech stack check
        expect(screen.getByText("Tech 1")).toBeInTheDocument();
        expect(screen.getByText("Tech 2")).toBeInTheDocument();

        // Clear Filter button should NOT be rendered by default
        expect(screen.queryByTitle("Clear Filter")).not.toBeInTheDocument();
    });

    it("adds project to URL params when clicked", () => {
        render(
            <FilterBar
                projects={mockProjects}
                domains={[]}
                techStacks={[]}
            />
        );

        fireEvent.click(screen.getByText("Project A"));
        expect(mockPush).toHaveBeenCalledWith("/?project=Project+A", { scroll: false });
    });

    it("adds and removes domain to URL params when clicked", () => {
        const mockSearchParams = {
            get: jest.fn((key) => {
                if (key === "domain") return "Domain X";
                return null; // Return Domain X as active
            }),
            toString: jest.fn().mockReturnValue("domain=Domain+X")
        };
        (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

        render(
            <FilterBar
                projects={[]}
                domains={mockDomains}
                techStacks={[]}
            />
        );

        // Click it again to toggle it OFF
        fireEvent.click(screen.getByText("Domain X"));
        expect(mockPush).toHaveBeenCalledWith("/?", { scroll: false }); // Param deleted entirely
    });

    it("renders 'Clear Filter' button only when a project is selected", () => {
        const mockSearchParams = {
            get: jest.fn((key) => {
                if (key === "project") return "Project A"; // Simulate active project
                return null;
            }),
            toString: jest.fn().mockReturnValue("project=Project+A")
        };
        (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

        render(
            <FilterBar
                projects={mockProjects}
                domains={[]}
                techStacks={[]}
            />
        );

        const clearBtn = screen.getByTitle("Clear Filter");
        expect(clearBtn).toBeInTheDocument();

        fireEvent.click(clearBtn);
        expect(mockPush).toHaveBeenCalledWith("/", { scroll: false });
    });

    it("reflects ARIA pressed states accurately based on search params", () => {
        const mockSearchParams = {
            get: jest.fn((key) => {
                if (key === "project") return "Project A";
                if (key === "tech") return "Tech 1";
                return null;
            }),
            toString: jest.fn().mockReturnValue("project=Project+A&tech=Tech+1")
        };
        (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);

        render(
            <FilterBar
                projects={mockProjects}
                domains={mockDomains}
                techStacks={mockTechStacks}
            />
        );

        // Project A is active, 'All' is inactive, Project B is inactive
        expect(screen.getByText("Project A")).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByText("All")).toHaveAttribute("aria-pressed", "false");
        expect(screen.getByText("Project B")).toHaveAttribute("aria-pressed", "false");

        // Tech 1 is active, Tech 2 is inactive
        expect(screen.getByText("Tech 1")).toHaveAttribute("aria-pressed", "true");
        expect(screen.getByText("Tech 2")).toHaveAttribute("aria-pressed", "false");
    });
});
