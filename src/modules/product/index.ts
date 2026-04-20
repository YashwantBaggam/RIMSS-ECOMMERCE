// Public API of the product module
// Other modules/pages import ONLY from here — never from internal paths
export { ProductCard } from './components/ProductCard';
export { ProductDetail } from './components/ProductDetail';
export { ProductShowcase } from './components/ProductShowcase';
export { ProductGridSkeleton, ProductCardSkeleton } from './components/ProductGridSkeleton';
export { useProducts } from './hooks/useProducts';
export { productService } from './services/productService';
export type { Product, ProductFilter, ProductsResponse } from './types';
