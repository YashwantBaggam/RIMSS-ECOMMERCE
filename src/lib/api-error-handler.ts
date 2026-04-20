import { NextResponse } from 'next/server';
import { logger, generateTraceId } from '@/lib/logger';

const log = logger('api:error-handler');

export interface ApiErrorResponse {
  error: string;
  code: string;
  traceId: string;
  timestamp: string;
}

/**
 * Wraps an API route handler with:
 *  - Automatic error catching
 *  - Structured error logging (with traceId for correlation)
 *  - Consistent JSON error shape returned to client
 *  - Duration logging for every request
 *
 * Usage:
 *   export const GET = withApiLogger('products:list', async (req) => { ... });
 */
export function withApiLogger(
  routeName: string,
  handler: (req: Request) => Promise<NextResponse>
) {
  return async function (req: Request): Promise<NextResponse> {
    const traceId  = generateTraceId();
    const routeLog = logger(routeName, traceId);
    const start    = Date.now();
    const url      = new URL(req.url);

    routeLog.info('Request received', {
      method:  req.method,
      path:    url.pathname,
      query:   Object.fromEntries(url.searchParams.entries()),
    });

    try {
      const response = await handler(req);
      const durationMs = Date.now() - start;

      routeLog.info('Request completed', {
        status:     response.status,
        durationMs,
      });

      // Stamp every successful response with the traceId header
      response.headers.set('X-Trace-Id', traceId);
      return response;

    } catch (err) {
      const durationMs = Date.now() - start;

      routeLog.error('Request failed', err, {
        method:     req.method,
        path:       url.pathname,
        durationMs,
      });

      // Determine status code
      const status = err instanceof ApiHttpError ? err.status : 500;
      const code   = err instanceof ApiHttpError ? err.code   : 'INTERNAL_ERROR';

      const body: ApiErrorResponse = {
        error:     err instanceof Error ? err.message : 'Internal server error',
        code,
        traceId,
        timestamp: new Date().toISOString(),
      };

      return NextResponse.json(body, {
        status,
        headers: { 'X-Trace-Id': traceId },
      });
    }
  };
}

// ── Typed HTTP errors ─────────────────────────────────────────────────────────
export class ApiHttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiHttpError';
  }
}

export const Errors = {
  notFound:    (msg = 'Resource not found')   => new ApiHttpError(404, 'NOT_FOUND',           msg),
  badRequest:  (msg = 'Bad request')          => new ApiHttpError(400, 'BAD_REQUEST',          msg),
  serverError: (msg = 'Internal server error')=> new ApiHttpError(500, 'INTERNAL_ERROR',       msg),
};
