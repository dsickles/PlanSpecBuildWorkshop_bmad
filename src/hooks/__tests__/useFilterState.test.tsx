import { renderHook, act } from '@testing-library/react';
import { useFilterState } from '../useFilterState';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { DOCUMENT_PARAM } from '@/lib/constants';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

function createMockSearchParams(params: Record<string, string | null>) {
  const urlParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== null) urlParams.set(key, value);
  }
  return {
    get: (key: string) => urlParams.get(key),
    toString: () => urlParams.toString(),
  };
}

describe('useFilterState', () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });
    (usePathname as jest.Mock).mockReturnValue('/');
    jest.clearAllMocks();
  });

  it('initializes with default values when URL params are empty', () => {
    (useSearchParams as jest.Mock).mockReturnValue(createMockSearchParams({}));
    const { result } = renderHook(() => useFilterState());

    expect(result.current.activeProject).toBe(null);
    expect(result.current.activeDomains).toEqual([]);
    expect(result.current.activeTech).toEqual([]);
    expect(result.current.activeDocument).toBe(null);
  });

  it('reads project param from URL', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({ project: 'my-project' })
    );
    const { result } = renderHook(() => useFilterState());

    expect(result.current.activeProject).toBe('my-project');
  });

  it('reads array params from URL', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({ domain: 'Frontend,Design', tech: 'React,Tailwind' })
    );
    const { result } = renderHook(() => useFilterState());

    expect(result.current.activeDomains).toEqual(['Frontend', 'Design']);
    expect(result.current.activeTech).toEqual(['React', 'Tailwind']);
  });

  it('updates project param using router.push with scroll: false', () => {
    (useSearchParams as jest.Mock).mockReturnValue(createMockSearchParams({}));
    const { result } = renderHook(() => useFilterState());

    act(() => {
      result.current.setProject('new-project');
    });

    expect(mockPush).toHaveBeenCalledWith('/?project=new-project', { scroll: false });
  });

  it('toggles array params using router.push with scroll: false', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({ domain: 'Frontend' })
    );
    const { result } = renderHook(() => useFilterState());

    act(() => {
      result.current.toggleDomain('Design');
    });

    expect(mockPush).toHaveBeenCalledWith('/?domain=Frontend%2CDesign', { scroll: false });
  });

  it('removes item from array param when toggled off', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({ domain: 'Frontend,Design' })
    );
    const { result } = renderHook(() => useFilterState());

    act(() => {
      result.current.toggleDomain('Frontend');
    });

    expect(mockPush).toHaveBeenCalledWith('/?domain=Design', { scroll: false });
  });

  it('clears all filters when clearAllFilters is called', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({ project: 'some-project' })
    );
    const { result } = renderHook(() => useFilterState());

    act(() => {
      result.current.clearAllFilters();
    });

    expect(mockPush).toHaveBeenCalledWith('/', { scroll: false });
  });

  it('reads document param from URL', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({ [DOCUMENT_PARAM]: 'my-doc' })
    );
    const { result } = renderHook(() => useFilterState());

    expect(result.current.activeDocument).toBe('my-doc');
  });

  it('updates document param using router.push', () => {
    (useSearchParams as jest.Mock).mockReturnValue(createMockSearchParams({}));
    const { result } = renderHook(() => useFilterState());

    act(() => {
      result.current.setDocument('new-doc');
    });

    expect(mockPush).toHaveBeenCalledWith(`/?${DOCUMENT_PARAM}=new-doc`, { scroll: false });
  });

  it('clears document param using setDocument(null)', () => {
    (useSearchParams as jest.Mock).mockReturnValue(
      createMockSearchParams({ [DOCUMENT_PARAM]: 'some-doc', project: 'my-project' })
    );
    const { result } = renderHook(() => useFilterState());

    act(() => {
      result.current.setDocument(null);
    });

    expect(mockPush).toHaveBeenCalledWith('/?project=my-project', { scroll: false });
  });
});
