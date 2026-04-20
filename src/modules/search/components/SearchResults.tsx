'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '../hooks/useSearch';
import { ProductCard } from '@/modules/product/components/ProductCard';
import { ProductGridSkeleton, ProductCardSkeleton } from '@/modules/product/components/ProductGridSkeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { CATEGORIES } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Search, X, SlidersHorizontal, SearchX, Loader2 } from 'lucide-react';

interface Props {
  query: string;
  category?: string;
  sort?: string;
}

const SORT_OPTIONS = [
  { value: 'relevance',   label: 'Most Relevant'       },
  { value: 'price-asc',  label: 'Price: Low to High'  },
  { value: 'price-desc', label: 'Price: High to Low'  },
  { value: 'rating',     label: 'Highest Rated'        },
];

export function SearchResults({ query: initialQuery, category: initialCategory, sort: initialSort }: Props) {
  const router = useRouter();

  // Single source of truth for the input value (controlled)
  const [inputValue, setInputValue] = useState(initialQuery);
  const [category,   setCategory]   = useState(initialCategory || 'all');
  const [sort,       setSort]       = useState(initialSort || 'relevance');

  // Re-sync when Next.js navigates (e.g. clicking header nav links)
  useEffect(() => { setInputValue(initialQuery); },         [initialQuery]);
  useEffect(() => { setCategory(initialCategory || 'all'); }, [initialCategory]);
  useEffect(() => { setSort(initialSort || 'relevance'); },   [initialSort]);

  // 300ms debounce — what actually goes to the API
  const debouncedQuery = useDebounce(inputValue, 300);

  // Sync URL when debounced value settles (shareable links)
  useEffect(() => {
    const params = new URLSearchParams({ q: debouncedQuery });
    if (category && category !== 'all') params.set('category', category);
    if (sort && sort !== 'relevance')   params.set('sort', sort);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, category, sort, router]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useSearch(debouncedQuery, category, sort);

  const allProducts = data?.pages.flatMap((p) => p.results) ?? [];
  const totalCount  = data?.pages[0]?.total ?? 0;

  // Intersection Observer for infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { rootMargin: '300px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  return (
    <div className="space-y-6">
      {/* ── Single search bar ─────────────────────────────────── */}
      <div className="max-w-2xl mx-auto space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Search Products</h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search products… (300ms debounce)"
            autoFocus
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm"
            aria-label="Search products"
          />
          {inputValue && (
            <button
              onClick={() => setInputValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 text-center">
          ⚡ 300ms debounce · React Query cache · Infinite scroll
        </p>
      </div>

      {/* ── Filters + Sort ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm font-medium text-gray-600">Category:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium capitalize transition-all',
                category === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-gray-500">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Results count ─────────────────────────────────────── */}
      {!isLoading && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {totalCount === 0
              ? 'No products found'
              : `Showing ${allProducts.length} of ${totalCount} products${inputValue ? ` for "${debouncedQuery}"` : ''}`}
          </p>
          {isFetchingNextPage && (
            <span className="text-xs text-indigo-500 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Loading more…
            </span>
          )}
        </div>
      )}

      {/* ── States ───────────────────────────────────────────── */}
      {isLoading && <ProductGridSkeleton count={12} />}

      {isError && (
        <div className="text-center py-12 text-red-500 text-sm">
          Something went wrong. Please try again.
        </div>
      )}

      {!isLoading && totalCount === 0 && (
        <div className="flex flex-col items-center py-16 text-gray-400 gap-3">
          <SearchX className="w-12 h-12" />
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm">Try a different search term or category</p>
        </div>
      )}

      {/* ── Product grid ─────────────────────────────────────── */}
      {allProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {isFetchingNextPage &&
            Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={`sk-${i}`} />)}
        </div>
      )}

      {/* Intersection sentinel */}
      <div ref={sentinelRef} className="h-4" aria-hidden="true" />

      {!isLoading && !hasNextPage && totalCount > 0 && (
        <p className="text-center text-sm text-gray-400 py-4">
          ✓ All {totalCount} products loaded
        </p>
      )}
    </div>
  );
}
