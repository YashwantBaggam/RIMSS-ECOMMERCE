'use client';

import { useState, useEffect, useRef } from 'react';
import { logPanel } from '@/lib/logger';
import type { LogEntry, LogLevel } from '@/lib/logger';
import { Terminal, X, Trash2, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Styles per level ─────────────────────────────────────────────────────────
const LEVEL_BADGE: Record<LogLevel, string> = {
  debug: 'bg-gray-100 text-gray-500',
  info:  'bg-indigo-100 text-indigo-700',
  warn:  'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
};
const LEVEL_ROW: Record<LogLevel, string> = {
  debug: 'hover:bg-gray-50',
  info:  'hover:bg-indigo-50/40',
  warn:  'hover:bg-amber-50/40',
  error: 'bg-red-50/60 hover:bg-red-50',
};

const ALL_LEVELS: LogLevel[] = ['debug', 'info', 'warn', 'error'];

/**
 * LogPanel — Production Logging Demo
 *
 * Renders a floating terminal panel that shows real structured logs as they happen.
 * Demonstrates what would appear in Datadog / CloudWatch / Vercel Log Drains in production.
 *
 * Toggle: click the terminal icon bottom-right corner.
 */
export function LogPanel() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [open, setOpen]       = useState(false);
  const [filter, setFilter]   = useState<LogLevel | 'all'>('all');
  const [view, setView]       = useState<'pretty' | 'json'>('pretty');
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => logPanel.subscribe(setEntries), []);

  // Auto-scroll to newest entry
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries, open]);

  const filtered = filter === 'all'
    ? entries
    : entries.filter((e) => e.level === filter);

  const counts = ALL_LEVELS.reduce<Record<string, number>>((acc, l) => {
    acc[l] = entries.filter((e) => e.level === l).length;
    return acc;
  }, {});

  function toggleExpand(idx: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg text-sm font-medium transition-all',
          open
            ? 'bg-gray-900 text-white'
            : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-300'
        )}
        aria-label="Toggle log panel"
        suppressHydrationWarning
      >
        <Terminal className="w-4 h-4" />
        <span className="hidden sm:inline">Logs</span>
        {/* Badges deferred until after mount — avoids server/client HTML mismatch */}
        {mounted && counts.error > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {counts.error}
          </span>
        )}
        {mounted && entries.length > 0 && counts.error === 0 && (
          <span className="bg-indigo-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            {entries.length}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-16 right-4 z-50 w-full max-w-2xl h-[480px] bg-gray-950 text-gray-100 rounded-2xl shadow-2xl flex flex-col border border-gray-800 font-mono text-xs overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800 bg-gray-900 flex-shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span className="text-gray-200 font-semibold text-sm">Live Log Drain</span>
              <span className="text-gray-500 text-xs">(production JSON → pretty view)</span>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex rounded-lg overflow-hidden border border-gray-700">
                {(['pretty', 'json'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={cn(
                      'px-2 py-1 text-xs capitalize transition-colors',
                      view === v ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
                    )}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <button
                onClick={() => { logPanel.clear(); setExpanded(new Set()); }}
                className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                aria-label="Clear logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setOpen(false)} className="p-1 text-gray-500 hover:text-gray-300">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Level filter tabs */}
          <div className="flex gap-1 px-3 py-2 border-b border-gray-800 flex-shrink-0">
            <button
              onClick={() => setFilter('all')}
              className={cn('px-2 py-0.5 rounded text-xs transition-colors',
                filter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300')}
            >
              All ({entries.length})
            </button>
            {ALL_LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setFilter(l)}
                className={cn(
                  'px-2 py-0.5 rounded text-xs capitalize transition-colors',
                  filter === l ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'
                )}
              >
                {l} ({counts[l] ?? 0})
              </button>
            ))}
          </div>

          {/* Log entries */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2">
                <Terminal className="w-8 h-8 opacity-30" />
                <p>No logs yet — interact with the app</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800/60">
                {[...filtered].reverse().map((entry, idx) => {
                  const isExpanded = expanded.has(idx);
                  const hasExtra   = entry.data || entry.error || entry.traceId;
                  return (
                    <div key={idx} className="px-3 py-1.5">
                      {view === 'json' ? (
                        <pre className="text-gray-300 whitespace-pre-wrap break-all leading-5">
                          {JSON.stringify(entry, null, 2)}
                        </pre>
                      ) : (
                        <>
                          {/* Summary row */}
                          <div
                            className={cn('flex items-start gap-2 cursor-pointer select-none', hasExtra ? 'cursor-pointer' : '')}
                            onClick={() => hasExtra && toggleExpand(idx)}
                          >
                            <span className="text-gray-600 shrink-0 w-[76px] truncate">
                              {entry.ts.slice(11, 23)}
                            </span>
                            <span className={cn('shrink-0 px-1.5 py-0 rounded text-[10px] uppercase font-bold tracking-wide', LEVEL_BADGE[entry.level])}>
                              {entry.level}
                            </span>
                            <span className="text-indigo-400 shrink-0 min-w-[100px]">{entry.module}</span>
                            <span className="text-gray-200 flex-1 truncate">{entry.message}</span>
                            {entry.durationMs !== undefined && (
                              <span className="text-gray-500 shrink-0">{entry.durationMs}ms</span>
                            )}
                            {hasExtra && (
                              <span className="text-gray-600 shrink-0">
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </span>
                            )}
                          </div>

                          {/* Expanded detail */}
                          {isExpanded && hasExtra && (
                            <div className="mt-1.5 ml-[80px] space-y-1">
                              {entry.traceId && (
                                <div className="text-gray-500">
                                  traceId: <span className="text-yellow-400">{entry.traceId}</span>
                                </div>
                              )}
                              {entry.data && (
                                <pre className="text-gray-400 bg-gray-900 rounded p-2 overflow-x-auto">
                                  {JSON.stringify(entry.data, null, 2)}
                                </pre>
                              )}
                              {entry.error && (
                                <div className="text-red-400 bg-red-950/40 rounded p-2">
                                  <div className="font-bold">{entry.error.name}: {entry.error.message}</div>
                                  {entry.error.stack && (
                                    <pre className="text-red-500/70 text-[10px] mt-1 whitespace-pre-wrap">
                                      {entry.error.stack.split('\n').slice(1, 5).join('\n')}
                                    </pre>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
