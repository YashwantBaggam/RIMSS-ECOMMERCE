import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

jest.useFakeTimers();

describe('useDebounce', () => {
  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('does not update value before delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    );

    rerender({ value: 'world' });
    act(() => jest.advanceTimersByTime(200));
    expect(result.current).toBe('hello'); // Still old value
  });

  it('updates value after delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'hello' } }
    );

    rerender({ value: 'world' });
    act(() => jest.advanceTimersByTime(300));
    expect(result.current).toBe('world');
  });

  it('resets timer when value changes rapidly', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'ab' });
    act(() => jest.advanceTimersByTime(100));
    rerender({ value: 'abc' });
    act(() => jest.advanceTimersByTime(100));
    rerender({ value: 'abcd' });
    act(() => jest.advanceTimersByTime(299));
    expect(result.current).toBe('a'); // Not yet updated

    act(() => jest.advanceTimersByTime(1));
    expect(result.current).toBe('abcd'); // Final value after debounce
  });
});
