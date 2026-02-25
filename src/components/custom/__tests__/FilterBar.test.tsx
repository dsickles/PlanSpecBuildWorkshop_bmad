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
        projects: ['Project A'],
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
            activeProject: 'Project A',
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
            activeProject: 'Project A',
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
});
