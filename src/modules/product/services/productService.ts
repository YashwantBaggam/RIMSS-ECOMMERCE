import { apiClient } from '@/services/api-client';

export interface ProductsResponse {
  products: import('@/lib/mock-data').Product[];
  total:    number;
  page:     number;
  pageSize: number;
  totalPages: number;
  hasMore:  boolean;
  latency_simulated?: boolean;
}

export const productService = {
  getPage: (category?: string, page = 1, pageSize = 8) => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (category && category !== 'all') params.set('category', category);
    return apiClient.get<ProductsResponse>(`/products?${params.toString()}`);
  },
};
