import { NextResponse } from 'next/server';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import { withApiLogger, Errors } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

const log = logger('api:products');

function simulateLatency(): Promise<void> {
  const enabled = process.env.NEXT_PUBLIC_SIMULATE_LATENCY !== 'false';
  if (!enabled) return Promise.resolve();
  const ms = parseInt(process.env.NEXT_PUBLIC_LATENCY_MS || '500');
  const jitter = Math.random() * ms + 200;
  return new Promise((resolve) => setTimeout(resolve, jitter));
}

export const GET = withApiLogger('api:products', async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const page     = parseInt(searchParams.get('page')     || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '8');

  if (pageSize > 50) throw Errors.badRequest('pageSize cannot exceed 50');
  if (page < 1)      throw Errors.badRequest('page must be >= 1');

  log.debug('Applying filters', { category, page, pageSize });

  await simulateLatency();

  let products = MOCK_PRODUCTS;
  if (category && category !== 'all') {
    products = products.filter((p) => p.category === category);
    log.debug('Category filter applied', { category, resultCount: products.length });
  }

  const total      = products.length;
  const totalPages = Math.ceil(total / pageSize);
  const start      = (page - 1) * pageSize;
  const paginated  = products.slice(start, start + pageSize);

  log.info('Products fetched', {
    category: category ?? 'all',
    page,
    returned: paginated.length,
    total,
  });

  return NextResponse.json({
    products:          paginated,
    total,
    page,
    pageSize,
    totalPages,
    hasMore:           page < totalPages,
    latency_simulated: true,
  });
});
