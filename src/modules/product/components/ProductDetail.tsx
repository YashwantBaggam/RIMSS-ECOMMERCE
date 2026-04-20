'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Star, Shield, Truck, RefreshCw, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/modules/cart/store/cartStore';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import type { Product } from '@/lib/mock-data';

interface Props {
  product: Product;
}

export function ProductDetail({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Product image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          priority // LCP element — load immediately
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {product.badge && (
          <span className="absolute top-4 left-4 bg-indigo-600 text-white text-sm font-bold px-3 py-1.5 rounded-full uppercase">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide mb-2">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight">{product.name}</h1>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          <span className="text-sm text-gray-500">({product.reviewCount.toLocaleString()} reviews)</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <>
              <span className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
              <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-0.5 rounded">
                Save {calculateDiscount(product.originalPrice, product.price)}%
              </span>
            </>
          )}
        </div>

        <p className="text-gray-600 leading-relaxed">{product.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Qty + Add to Cart */}
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="px-3 py-2 hover:bg-gray-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center">
              {qty}
            </span>
            <button
              onClick={() => setQty(Math.min(product.stock, qty + 1))}
              className="px-3 py-2 hover:bg-gray-50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>

        {/* Stock */}
        <p className="text-sm text-gray-500">
          {product.stock > 10
            ? <span className="text-emerald-600 font-medium">In Stock</span>
            : <span className="text-orange-600 font-medium">Only {product.stock} left</span>}
        </p>

        {/* Trust signals */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          {[
            { icon: Truck, label: 'Free Shipping', sub: 'Orders over $50' },
            { icon: RefreshCw, label: 'Free Returns', sub: '30-day policy' },
            { icon: Shield, label: 'Secure Payment', sub: 'SSL encrypted' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1.5">
              <Icon className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-medium text-gray-800">{label}</span>
              <span className="text-xs text-gray-400">{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
