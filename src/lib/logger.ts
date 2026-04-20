/**
 * Structured Logger — Production-Ready
 *
 * Dev:  Pretty colour-coded console output
 * Prod: JSON to stdout → forwarded to log aggregator (Datadog / CloudWatch / Vercel Log Drains)
 *
 * Demo panel: import { LogPanel } from '@/components/ui/LogPanel' — visible in-browser log drain
 *
 * Log shape (one JSON line per entry):
 * {
 *   "ts":        "2025-01-15T10:23:45.123Z",
 *   "level":     "error",
 *   "module":    "api:search",
 *   "message":   "Search failed",
 *   "data":      { "query": "nike", "durationMs": 823 },
 *   "error":     { "name": "ApiHttpError", "message": "...", "stack": "..." },
 *   "traceId":   "a1b2c3d4e5f6",
 *   "env":       "production"
 * }
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  ts: string;
  level: LogLevel;
  module: string;
  message: string;
  env: string;
  data?: Record<string, unknown>;
  error?: { name: string; message: string; stack?: string };
  traceId?: string;
  durationMs?: number;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

const ENV = process.env.NODE_ENV ?? 'development';
const IS_PROD = ENV === 'production';

const MIN_LEVEL: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ?? (IS_PROD ? 'info' : 'debug');

// ── In-browser demo log drain ─────────────────────────────────────────────────
// Client-side ring buffer — LogPanel component reads this to display live logs
const MAX_PANEL_ENTRIES = 80;

interface PanelStore {
  entries: LogEntry[];
  listeners: Array<(entries: LogEntry[]) => void>;
}

const _panelStore: PanelStore = { entries: [], listeners: [] };

export const logPanel = {
  push(entry: LogEntry) {
    _panelStore.entries = [entry, ..._panelStore.entries].slice(0, MAX_PANEL_ENTRIES);
    _panelStore.listeners.forEach((fn) => fn(_panelStore.entries));
  },
  subscribe(fn: (entries: LogEntry[]) => void): () => void {
    _panelStore.listeners.push(fn);
    fn(_panelStore.entries);
    return () => { _panelStore.listeners = _panelStore.listeners.filter((l) => l !== fn); };
  },
  getAll() { return _panelStore.entries; },
  clear()  { _panelStore.entries = []; _panelStore.listeners.forEach((fn) => fn([])); },
};

// ── Formatters ────────────────────────────────────────────────────────────────
const CLIENT_STYLES: Record<LogLevel, string> = {
  debug: 'color:#9ca3af',
  info:  'color:#6366f1;font-weight:600',
  warn:  'color:#f59e0b;font-weight:600',
  error: 'color:#ef4444;font-weight:600',
};

function emit(entry: LogEntry): void {
  if (LEVEL_PRIORITY[entry.level] < LEVEL_PRIORITY[MIN_LEVEL]) return;

  if (typeof window === 'undefined') {
    // ── SERVER (API routes) ──────────────────────────────────────────────────
    // JSON to stdout — Vercel, Datadog, CloudWatch all consume this natively
    // In production each entry is one parseable line (no pretty-print)
    process.stdout.write(
      IS_PROD ? JSON.stringify(entry) + '\n' : JSON.stringify(entry, null, 2) + '\n'
    );
  } else {
    // ── CLIENT (browser) ────────────────────────────────────────────────────
    // Always push to demo panel (LogPanel component shows live logs in-browser)
    logPanel.push(entry);

    // In dev also print to DevTools console
    if (!IS_PROD) {
      const style = CLIENT_STYLES[entry.level];
      const prefix = `%c[${entry.level.toUpperCase()}][${entry.module}]`;
      if (entry.level === 'error') {
        console.error(prefix, style, entry.message, entry.data ?? '', entry.error ?? '');
      } else if (entry.level === 'warn') {
        console.warn(prefix, style, entry.message, entry.data ?? '');
      } else {
        console.info(prefix, style, entry.message, entry.data ?? '');
      }
    }
  }
}

// ── Logger factory ────────────────────────────────────────────────────────────
export interface Logger {
  debug: (message: string, data?: Record<string, unknown>) => void;
  info:  (message: string, data?: Record<string, unknown>) => void;
  warn:  (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, error?: unknown, data?: Record<string, unknown>) => void;
  withTrace: (traceId: string) => Logger;
  time: <T>(label: string, fn: () => Promise<T>, data?: Record<string, unknown>) => Promise<T>;
}

export function logger(module: string, traceId?: string): Logger {
  function base(level: LogLevel, message: string, data?: Record<string, unknown>, error?: unknown) {
    emit({
      ts:      new Date().toISOString(),
      level,
      module,
      message,
      env:     ENV,
      ...(data    ? { data }    : {}),
      ...(traceId ? { traceId } : {}),
      ...(error instanceof Error
        ? { error: { name: error.name, message: error.message, stack: error.stack } }
        : error != null
          ? { error: { name: 'UnknownError', message: String(error) } }
          : {}),
    });
  }

  return {
    debug: (msg, data)      => base('debug', msg, data),
    info:  (msg, data)      => base('info',  msg, data),
    warn:  (msg, data)      => base('warn',  msg, data),
    error: (msg, err, data) => base('error', msg, data, err),
    withTrace: (id) => logger(module, id),
    time: async <T>(label: string, fn: () => Promise<T>, data?: Record<string, unknown>): Promise<T> => {
      const start = Date.now();
      base('debug', `${label} — start`, data);
      try {
        const result = await fn();
        const durationMs = Date.now() - start;
        emit({ ts: new Date().toISOString(), level: 'info', module, message: `${label} — ok`, env: ENV, durationMs, ...(traceId ? { traceId } : {}), ...(data ? { data } : {}) });
        return result;
      } catch (err) {
        base('error', `${label} — failed`, { ...data, durationMs: Date.now() - start }, err);
        throw err;
      }
    },
  };
}

export function generateTraceId(): string {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
}
