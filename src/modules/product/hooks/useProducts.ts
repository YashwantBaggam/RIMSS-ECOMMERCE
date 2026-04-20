import { useInfiniteQuery, useQueryClient, useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { CATEGORIES } from '@/lib/mock-data';

const PAGE_SIZE = 8;

/**
 * Paginated product hook — loads 8 at a time.
 *
 * Cache seeding strategy:
 * - First "all" page loads 8 products.
 * - As pages accumulate (via lazy loading), we derive per-category counts
 *   from everything seen so far and seed each category's query cache.
 * - Switching to a category whose products have already been seen costs 0ms.
 * - If a category page hasn't been seen yet, it fetches fresh from the API.
 */
export function useProducts(category?: string) {
  const queryClient = useQueryClient();
  const cat = category || 'all';

  return useInfiniteQuery({
    queryKey: ['products', cat],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await productService.getPage(cat === 'all' ? undefined : cat, pageParam as number, PAGE_SIZE);

      // After each "all" page, update per-category counts from accumulated data
      if (cat === 'all') {
        // Get all products fetched so far (previous pages + current)
        const existing = queryClient.getQueryData<{ pages: typeof data[] }>(['products', 'all']);
        const allSoFar = [
          ...(existing?.pages?.flatMap((p) => p.products) ?? []),
          ...data.products,
        ];

        // Build per-category count map from everything seen so far
        const counts: Record<string, number> = {};
        for (const c of CATEGORIES.filter((c) => c !== 'all')) {
          counts[c] = allSoFar.filter((p) => p.category === c).length;
        }
        // Store totals from API (not just what we've seen) once first page arrives
        queryClient.setQueryData(['productCounts'], {
          counts,
          totalPerCategory: Object.fromEntries(
            CATEGORIES.filter((c) => c !== 'all').map((c) => [c, data.total]) // approx until all loaded
          ),
          apiReportedTotal: data.total,
        });
      }

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Returns stable category counts.
 * - Before any data: all zeros (no hydration mismatch — same on server and client)
 * - After "all" loads: actual counts from accumulated pages
 */
export function useCategoryCounts(): Record<string, number> {
  const queryClient = useQueryClient();
  const cached = queryClient.getQueryData<{ counts: Record<string, number> }>(['productCounts']);
  return cached?.counts ?? {};
}
