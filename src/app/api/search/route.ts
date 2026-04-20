import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { withApiLogger, Errors } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

const log = logger('api:search');

function simulateLatency(): Promise<void> {
  const ms = parseInt(process.env.NEXT_PUBLIC_LATENCY_MS || '400');
  return new Promise((resolve) => setTimeout(resolve, Math.random() * ms + 150));
}

export const GET = withApiLogger('api:search', async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const query    = searchParams.get('q')?.toLowerCase() ?? '';
  const category = searchParams.get('category');
  const sort     = searchParams.get('sort') || 'relevance';
  const page     = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '12');

  if (page < 1)       throw Errors.badRequest('page must be >= 1');
  if (pageSize > 50)  throw Errors.badRequest('pageSize cannot exceed 50');

  log.debug('Search params parsed', { query, category, sort, page, pageSize });

  await simulateLatency();

  // Empty query = browse all
  let results = query.length === 0
    ? [...MOCK_PRODUCTS]
    : MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );

  if (category && category !== 'all') {
    results = results.filter((p) => p.category === category);
  }

  if (sort === 'price-asc')  results.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') results.sort((a, b) => b.price - a.price);
  else if (sort === 'rating')     results.sort((a, b) => b.rating - a.rating);

  const total      = results.length;
  const totalPages = Math.ceil(total / pageSize);
  const start      = (page - 1) * pageSize;
  const paginated  = results.slice(start, start + pageSize);
  const took_ms    = Math.floor(Math.random() * 50 + 10);

  log.info('Search completed', {
    query,
    category: category ?? 'all',
    sort,
    page,
    total,
    returned: paginated.length,
    took_ms,
  });

  return NextResponse.json({
    results: paginated,
    total,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
    query,
    took_ms,
  });
});
