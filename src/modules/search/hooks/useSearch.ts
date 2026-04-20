import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/useDebounce';
import { searchService } from '../services/searchService';

const PAGE_SIZE = 12;

/**
 * Infinite-scroll search hook:
 * - Debounce (300ms): API only fires after typing stops
 * - React Query infinite cache: repeat pages = 0ms
 * - keepPreviousData: no flash when query changes
 * - enabled: fires even for empty query (browse-all mode)
 */
export function useSearch(query: string, category?: string, sort?: string) {
  const debouncedQuery = useDebounce(query, 300);

  return useInfiniteQuery({
    queryKey: ['search', debouncedQuery, category, sort],
    queryFn: ({ pageParam = 1 }) =>
      searchService.search(debouncedQuery, category, sort, pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: true,          // always enabled — empty query = browse all
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}

