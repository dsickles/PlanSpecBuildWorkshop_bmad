import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '../FilterBar';
import { useFilterState } from '../../../hooks/useFilterState';

jest.mock('../../../hooks/useFilterState');

describe('FilterBar - Clear Filter Visibility', () => {
    const mockSetProject = jest.fn();
    const mockToggleDomain = jest.fn();
    const mockToggleTech = jest.fn();
    const mockClearAllFilters = jest.fn();

    const defaultProps = {
        projects: [{ slug: 'project-a', title: 'Project A' }],
        domains: ['Domain A'],
        techStacks: ['Tech A'],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('hides "Clear Filter" button when no filters are active', () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: [],
            setProject: mockSetProject,
            toggleDomain: mockToggleDomain,
            toggleTech: mockToggleTech,
            clearAllFilters: mockClearAllFilters,
        });

        render(<FilterBar {...defaultProps} />);
        expect(screen.queryByText('Clear Filter')).not.toBeInTheDocument();
    });

    it('shows "Clear Filter" button when project filter is active', () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: 'project-a',
            activeDomains: [],
            activeTech: [],
            setProject: mockSetProject,
            toggleDomain: mockToggleDomain,
            toggleTech: mockToggleTech,
            clearAllFilters: mockClearAllFilters,
        });

        render(<FilterBar {...defaultProps} />);
        expect(screen.getByText('Clear Filter')).toBeInTheDocument();
    });

    it('shows "Clear Filter" button when domain filter is active', () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: ['Domain A'],
            activeTech: [],
            setProject: mockSetProject,
            toggleDomain: mockToggleDomain,
            toggleTech: mockToggleTech,
            clearAllFilters: mockClearAllFilters,
        });

        render(<FilterBar {...defaultProps} />);
        expect(screen.getByText('Clear Filter')).toBeInTheDocument();
    });

    it('shows "Clear Filter" button when tech filter is active', () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: ['Tech A'],
            setProject: mockSetProject,
            toggleDomain: mockToggleDomain,
            toggleTech: mockToggleTech,
            clearAllFilters: mockClearAllFilters,
        });

        render(<FilterBar {...defaultProps} />);
        expect(screen.getByText('Clear Filter')).toBeInTheDocument();
    });

    it('calls clearFilters when clicked', () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: 'project-a',
            activeDomains: [],
            activeTech: [],
            setProject: mockSetProject,
            toggleDomain: mockToggleDomain,
            toggleTech: mockToggleTech,
            clearAllFilters: mockClearAllFilters,
        });

        render(<FilterBar {...defaultProps} />);
        fireEvent.click(screen.getByText('Clear Filter'));
        expect(mockClearAllFilters).toHaveBeenCalledTimes(1);
    });

    it('displays the project title but calls setProject with the slug', () => {
        (useFilterState as jest.Mock).mockReturnValue({
            activeProject: null,
            activeDomains: [],
            activeTech: [],
            setProject: mockSetProject,
            toggleDomain: mockToggleDomain,
            toggleTech: mockToggleTech,
            clearAllFilters: mockClearAllFilters,
        });

        const customProps = {
            projects: [{ slug: 'p1-slug', title: 'P1 Title' }],
            domains: [],
            techStacks: [],
        };

        render(<FilterBar {...customProps} />);

        const button = screen.getByText('P1 Title');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        expect(mockSetProject).toHaveBeenCalledWith('p1-slug');
    });

    describe('Layout & Accessibility', () => {
        beforeEach(() => {
            (useFilterState as jest.Mock).mockReturnValue({
                activeProject: 'project-a',
                activeDomains: [],
                activeTech: [],
                setProject: mockSetProject,
                toggleDomain: mockToggleDomain,
                toggleTech: mockToggleTech,
                clearAllFilters: mockClearAllFilters,
            });
        });

        it('has correct architectural positioning classes', () => {
            render(<FilterBar {...defaultProps} />);
            const container = screen.getByText('Clear Filter').closest('div');
            const mainContainer = container?.parentElement;

            // Critical collision management via design tokens
            expect(mainContainer).toHaveClass('mt-filter-collision', 'md:mt-filter-collision-md', 'pt-v-rhythm', 'mb-v-rhythm');

            // Critical centering and stabilization architecture
            expect(container).toHaveClass('absolute', 'top-0', 'h-v-rhythm', 'flex', 'items-center', 'z-10');

            // Critical horizontal alignment (aligned with content via design token)
            expect(container).toHaveClass('left-filter-offset');
        });

        it('has correct accessibility attributes', () => {
            render(<FilterBar {...defaultProps} />);
            const button = screen.getByLabelText('Clear all filters');

            expect(button).toHaveAttribute('aria-controls', 'discovery-grid');

            // Verify focus styles are present in the constant or applied
            expect(button).toHaveClass('focus-visible:ring-2');
        });
    });
});
