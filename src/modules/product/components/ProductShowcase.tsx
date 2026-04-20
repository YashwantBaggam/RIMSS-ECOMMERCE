'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useProducts, useCategoryCounts } from '../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton, ProductCardSkeleton } from './ProductGridSkeleton';
import { CATEGORIES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { AlertCircle, Zap, Loader2 } from 'lucide-react';

export function ProductShowcase() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Hydration fix: counts come from React Query which is client-only.
  // We defer rendering badges until after mount to avoid server/client mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProducts(activeCategory);

  const counts = useCategoryCounts();

  // All products across loaded pages
  const allProducts = data?.pages.flatMap((p) => p.products) ?? [];
  const totalCount  = data?.pages[0]?.total ?? 0;

  // Intersection Observer — lazy-load next page when sentinel scrolls into view
  const sentinelRef = useRef<HTMLDivElement>(null);
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(handleIntersect, { rootMargin: '300px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [handleIntersect]);

  return (
    <section aria-label="Product showcase">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        {!isLoading && totalCount > 0 && (
          <span className="text-sm text-gray-500">
            {allProducts.length} of {totalCount} loaded
          </span>
        )}
        {isFetchingNextPage && (
          <span className="text-xs text-indigo-400 flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" /> Loading more…
          </span>
        )}
      </div>

      {/* Category tabs — count badges only after mount (avoids hydration mismatch) */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => {
          // Only read client-side cache counts after mount
          const count = mounted ? counts[cat] : undefined;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-150',
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'
              )}
            >
              {cat}
              {/* Badge: only rendered after mount AND count is known */}
              {mounted && count !== undefined && count > 0 && (
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full font-semibold leading-none',
                    activeCategory === cat
                      ? 'bg-white/25 text-white'
                      : 'bg-gray-100 text-gray-500'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Initial skeleton — 8 cards matching first page size */}
      {isLoading && <ProductGridSkeleton count={8} />}

      {isError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Failed to load products. Please try again.</p>
        </div>
      )}

      {/* Product grid — first 8 + more as lazy-loaded */}
      {allProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Skeleton cards while loading next page */}
          {isFetchingNextPage &&
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ProductCardSkeleton key={`sk-${i}`} />
            ))}
        </div>
      )}

      {/* Invisible sentinel — IntersectionObserver watches this to trigger next page */}
      <div ref={sentinelRef} className="h-4" aria-hidden="true" />

      {/* End of list */}
      {!isLoading && !hasNextPage && totalCount > 0 && (
        <p className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
          <Zap className="w-3 h-3 text-indigo-400" />
          All {totalCount} products loaded · scroll up to see categories update live
        </p>
      )}
    </section>
  );
}

// PAGE_SIZE constant — keeps skeleton count consistent with API page size
const PAGE_SIZE = 8;
