'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '@/modules/cart/store/cartStore';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import type { Product } from '@/lib/mock-data';

const BADGE_STYLES: Record<string, string> = {
  new: 'bg-emerald-500 text-white',
  sale: 'bg-red-500 text-white',
  hot: 'bg-orange-500 text-white',
  limited: 'bg-purple-500 text-white',
};

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault(); // Don't navigate to product page
    addItem(product);   // Optimistic: instant UI update, no API wait
  }

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200">
        {/* Image container with fixed aspect ratio — prevents CLS */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {product.badge && (
            <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}>
              {product.badge}
            </span>
          )}
          {product.originalPrice && (
            <span className="absolute top-2 right-2 bg-white text-red-600 text-xs font-bold px-2 py-1 rounded-full shadow">
              -{calculateDiscount(product.originalPrice, product.price)}%
            </span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{product.category}</p>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.reviewCount.toLocaleString()})</span>
          </div>

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-medium px-3 py-2 rounded-lg hover:bg-indigo-700 active:scale-95 transition-all duration-150"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
