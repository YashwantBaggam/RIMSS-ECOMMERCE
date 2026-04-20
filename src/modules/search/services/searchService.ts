import { apiClient } from '@/services/api-client';
import type { Product } from '@/lib/mock-data';

export interface SearchResponse {
  results: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
  query: string;
  took_ms: number;
}

export const searchService = {
  search: (query: string, category?: string, sort?: string, page = 1, pageSize = 12) => {
    const params = new URLSearchParams({ q: query, page: String(page), pageSize: String(pageSize) });
    if (category && category !== 'all') params.set('category', category);
    if (sort && sort !== 'relevance') params.set('sort', sort);
    return apiClient.get<SearchResponse>(`/search?${params.toString()}`);
  },
};
