import { NextResponse } from 'next/server';
import { withApiLogger, Errors } from '@/lib/api-error-handler';
import { logger } from '@/lib/logger';

const log = logger('api:cart');

export const POST = withApiLogger('api:cart:add', async (req: Request) => {
  const body = await req.json().catch(() => {
    throw Errors.badRequest('Invalid JSON body');
  });

  if (!body.productId) {
    throw Errors.badRequest('productId is required');
  }

  log.debug('Cart add requested', { productId: body.productId, qty: body.qty ?? 1 });

  await new Promise((resolve) => setTimeout(resolve, 100));

  log.info('Item added to cart', { productId: body.productId, qty: body.qty ?? 1 });

  return NextResponse.json({
    success: true,
    item:    body,
    message: 'Item added to cart',
  });
});

export const DELETE = withApiLogger('api:cart:remove', async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get('id');

  if (!itemId) {
    throw Errors.badRequest('id query param is required');
  }

  log.debug('Cart remove requested', { itemId });

  await new Promise((resolve) => setTimeout(resolve, 80));

  log.info('Item removed from cart', { itemId });

  return NextResponse.json({ success: true, removedId: itemId });
});
