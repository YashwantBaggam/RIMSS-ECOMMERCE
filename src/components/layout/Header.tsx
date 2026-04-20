'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, Zap } from 'lucide-react';
import { useCartStore } from '@/modules/cart/store/cartStore';
import { CartDrawer } from '@/modules/cart/components/CartDrawer';

export function Header() {
  const { totalItems, openCart } = useCartStore();

  // Defer cart count until after hydration — Zustand persist rehydrates from
  // localStorage on the client, which is unavailable during SSR. Rendering
  // the badge conditionally before mount causes a server/client HTML mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = mounted ? totalItems() : 0;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-900 hover:text-indigo-600 transition-colors">
              <Zap className="w-6 h-6 text-indigo-600 fill-indigo-600" />
              ShopForge
            </Link>

            <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
              <Link href="/search?q=" className="hover:text-indigo-600 transition-colors">All Products</Link>
              <Link href="/search?q=&category=electronics" className="hover:text-indigo-600 transition-colors">Electronics</Link>
              <Link href="/search?q=&category=clothing" className="hover:text-indigo-600 transition-colors">Clothing</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/search?q="
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Search…</span>
              </Link>

              <button
                onClick={openCart}
                className="relative p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 transition-all"
                aria-label={`Cart, ${count} items`}
              >
                <ShoppingCart className="w-5 h-5" />
                {/* Only render badge after mount — localStorage not available during SSR */}
                {mounted && count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center leading-none animate-bounce">
                    {count > 99 ? '99+' : count}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  );
}
