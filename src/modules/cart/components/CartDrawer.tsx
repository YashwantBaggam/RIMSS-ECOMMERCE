'use client';

import { X, ShoppingBag, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalItems, totalPrice } = useCartStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-gray-900">Cart</h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {totalItems()}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4">
              <ShoppingCart className="w-16 h-16 opacity-20" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <button onClick={closeCart} className="text-sm text-indigo-600 hover:underline">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-gray-50 rounded-xl p-3">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.id}`}
                    onClick={closeCart}
                    className="text-sm font-semibold text-gray-900 hover:text-indigo-600 line-clamp-2 block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm font-bold text-indigo-600 mt-1">
                    {formatPrice(item.price)}
                  </p>

                  {/* Qty controls + remove */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="px-2 py-1 hover:bg-gray-50 transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="px-2 py-1 hover:bg-gray-50 transition-colors"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal ({totalItems()} items)</span>
              <span className="text-xl font-bold text-gray-900">{formatPrice(totalPrice())}</span>
            </div>
            <p className="text-xs text-gray-400 text-center">
              Shipping & taxes calculated at checkout
            </p>
            <button className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all">
              Checkout — {formatPrice(totalPrice())}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
