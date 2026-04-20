/**
 * Single HTTP client — all modules call this, never fetch() directly.
 * Benefits:
 *  - Swap backend URL in one place
 *  - Centralised structured logging for every request
 *  - Consistent error shape via ApiError
 *  - Automatic traceId extraction from response headers
 */
import { logger } from '@/lib/logger';

const log = logger('client:api');

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public traceId?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const fullUrl = `${baseUrl}/api${url}`;
  const start   = Date.now();

  log.debug('API request', { url: fullUrl, method: options?.method ?? 'GET' });

  let res: Response;
  try {
    res = await fetch(fullUrl, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (networkErr) {
    const durationMs = Date.now() - start;
    log.error('Network error — request never reached server', networkErr, {
      url: fullUrl,
      durationMs,
    });
    throw new ApiError(0, 'Network error — check your connection');
  }

  const durationMs  = Date.now() - start;
  const traceId     = res.headers.get('X-Trace-Id') ?? undefined;

  if (!res.ok) {
    let errorBody: { error?: string; code?: string } = {};
    try { errorBody = await res.json(); } catch { /* ignore parse errors */ }

    log.error('API response error', undefined, {
      url:       fullUrl,
      status:    res.status,
      code:      errorBody.code,
      message:   errorBody.error,
      traceId,
      durationMs,
    });

    throw new ApiError(
      res.status,
      errorBody.error ?? `Request failed with status ${res.status}`,
      traceId
    );
  }

  log.debug('API response ok', { url: fullUrl, status: res.status, durationMs, traceId });

  return res.json();
}

export const apiClient = {
  get:    <T>(url: string)               => request<T>(url),
  post:   <T>(url: string, body: unknown)=> request<T>(url, { method: 'POST',   body: JSON.stringify(body) }),
  delete: <T>(url: string)               => request<T>(url, { method: 'DELETE' }),
};
