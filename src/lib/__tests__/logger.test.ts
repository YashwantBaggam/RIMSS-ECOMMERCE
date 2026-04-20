/**
* @jest-environment node
*/
import { logger, generateTraceId } from '../logger';

// Capture stdout writes in tests
let stdoutOutput: string[] = [];
const originalWrite = process.stdout.write.bind(process.stdout);

beforeEach(() => {
  stdoutOutput = [];
  process.stdout.write = (chunk: string | Uint8Array) => {
    if (typeof chunk === 'string') stdoutOutput.push(chunk);
    return true;
  };
});

afterEach(() => {
  process.stdout.write = originalWrite;
});

describe('logger', () => {
  it('emits structured JSON with required fields', () => {
    const log = logger('test:module');
    log.info('hello world');

    expect(stdoutOutput).toHaveLength(1);
    const entry = JSON.parse(stdoutOutput[0]);
    expect(entry.level).toBe('info');
    expect(entry.module).toBe('test:module');
    expect(entry.message).toBe('hello world');
    expect(entry.ts).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('includes data payload when provided', () => {
    const log = logger('test:module');
    log.info('with data', { count: 5, category: 'electronics' });

    const entry = JSON.parse(stdoutOutput[0]);
    expect(entry.data).toEqual({ count: 5, category: 'electronics' });
  });

  it('serialises Error objects correctly', () => {
    const log = logger('test:module');
    const err = new Error('something broke');
    log.error('an error occurred', err);

    const entry = JSON.parse(stdoutOutput[0]);
    expect(entry.level).toBe('error');
    expect(entry.error.name).toBe('Error');
    expect(entry.error.message).toBe('something broke');
    expect(entry.error.stack).toBeDefined();
  });

  it('stamps traceId when using withTrace()', () => {
    const log = logger('test:module').withTrace('abc123');
    log.info('traced message');

    const entry = JSON.parse(stdoutOutput[0]);
    expect(entry.traceId).toBe('abc123');
  });

  it('logs duration via time() helper on success', async () => {
    const log = logger('test:module');
    await log.time('fetch products', async () => ({ ok: true }));

    // Should emit debug (start) + info (ok)
    expect(stdoutOutput.length).toBeGreaterThanOrEqual(1);
    const okEntry = JSON.parse(stdoutOutput[stdoutOutput.length - 1]);
    expect(okEntry.message).toContain('ok');
    expect(okEntry.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('logs error and rethrows via time() helper on failure', async () => {
    const log = logger('test:module');
    await expect(
      log.time('failing op', async () => { throw new Error('boom'); })
    ).rejects.toThrow('boom');

    const errorEntry = JSON.parse(stdoutOutput[stdoutOutput.length - 1]);
    expect(errorEntry.level).toBe('error');
    expect(errorEntry.message).toContain('failed');
  });
});

describe('generateTraceId', () => {
  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, generateTraceId));
    expect(ids.size).toBe(100);
  });

  it('generates alphanumeric strings of reasonable length', () => {
    const id = generateTraceId();
    expect(id).toMatch(/^[a-z0-9]+$/);
    expect(id.length).toBeGreaterThanOrEqual(10);
  });
});
