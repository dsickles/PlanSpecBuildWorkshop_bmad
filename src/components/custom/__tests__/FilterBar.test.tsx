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
});
