export type { Product } from '@/lib/mock-data';

export interface ProductFilter {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'rating';
}

export interface ProductsResponse {
  products: import('@/lib/mock-data').Product[];
  total: number;
  latency_simulated?: boolean;
}
