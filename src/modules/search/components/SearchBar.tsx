'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface Props {
  defaultValue?: string;
  placeholder?: string;
}

export function SearchBar({ defaultValue = '', placeholder = 'Search products...' }: Props) {
  const [query, setQuery] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();
  const debouncedQuery = useDebounce(query, 1000);
  const router = useRouter();
  const routerRef = useRef(router);
  useEffect(() => { routerRef.current = router; }, [router]);

  // Sync debounced query to URL (for shareable search links + SSR)
  useEffect(() => {
    startTransition(() => {
      if (debouncedQuery.trim()) {
        routerRef.current.replace(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
      }
    });
  }, [debouncedQuery]); // routerRef is stable — intentionally omitted

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-sm"
        aria-label="Search products"
        autoFocus
      />
      {isPending && (
        <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500 animate-spin" />
      )}
      {query && (
        <button
          onClick={() => {
            setQuery('');
            routerRef.current.replace('/search');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}