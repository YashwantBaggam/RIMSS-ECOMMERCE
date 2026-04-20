import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { searchService } from '../services/searchService';

const PAGE_SIZE = 12;

/**
 * Infinite-scroll search hook:
 * - NO debounce here — query arrives pre-debounced from SearchBar (500ms)
 *   Having a second debounce (600ms) was causing 800ms total delay and
 *   a double re-render cycle that dropped characters from the input.
 * - React Query infinite cache: repeat pages = 0ms
 * - keepPreviousData: no flash when query changes
 * - enabled: fires even for empty query (browse-all mode)
 */
export function useSearch(query: string, category?: string, sort?: string) {
  return useInfiniteQuery({
    queryKey: ['search', query, category, sort],
    queryFn: ({ pageParam = 1 }) =>
      searchService.search(query, category, sort, pageParam as number, PAGE_SIZE),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: true,          // always enabled — empty query = browse all
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}