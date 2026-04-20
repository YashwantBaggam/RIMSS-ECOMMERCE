import { Suspense } from 'react';
import type { Metadata } from 'next';
import { SearchResults } from '@/modules/search/components/SearchResults';
import { ProductGridSkeleton } from '@/modules/product/components/ProductGridSkeleton';

export const metadata: Metadata = {
  title: 'Search Products',
  description: 'Search thousands of products on ShopForge.',
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; sort?: string };
}) {
  return (
    <div className="space-y-6">
      {/* SearchResults owns the single search bar + filters + grid */}
      <Suspense fallback={<ProductGridSkeleton count={12} />}>
        <SearchResults
          query={searchParams.q ?? ''}
          category={searchParams.category}
          sort={searchParams.sort}
        />
      </Suspense>
    </div>
  );
}
