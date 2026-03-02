import { render, screen } from "@testing-library/react";
import AboutPage from "../page";
import React from "react";

// Mock next/navigation
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        replace: mockReplace,
    }),
}));

describe("AboutPage", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders the redirect loading state", () => {
        render(<AboutPage />);
        expect(screen.getByText(/Redirecting to Workshop Context/i)).toBeInTheDocument();
    });

    it("calls router.replace with the about parameter on mount", () => {
        render(<AboutPage />);
        expect(mockReplace).toHaveBeenCalledWith(expect.stringContaining("about=true"));
    });
});
