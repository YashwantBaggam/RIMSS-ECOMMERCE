import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { logger } from '@/lib/logger';
import type { Product } from '@/lib/mock-data';

const log = logger('client:cart');

export interface CartItem extends Product { qty: number; }

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem:   (product: Product) => void;
  removeItem:(id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  openCart:  () => void;
  closeCart: () => void;
  totalItems:() => number;
  totalPrice:() => number;
}

export const useCartStore = create<CartStore>()(
  // devtools wraps the store → visible in Redux DevTools browser extension
  devtools(
    persist(
      (set, get) => ({
        items:  [],
        isOpen: false,

        addItem: (product) => {
          set(
            (state) => {
              const existing = state.items.find((i) => i.id === product.id);
              if (existing) {
                return {
                  items:  state.items.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i),
                  isOpen: true,
                };
              }
              return { items: [...state.items, { ...product, qty: 1 }], isOpen: true };
            },
            false,                  // don't replace — merge
            'cart/addItem'          // action name shown in Redux DevTools
          );

          log.info('Item added to cart (optimistic)', { productId: product.id, name: product.name });

          // Background server sync — fire-and-forget, UI already updated
          fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id, qty: 1 }),
          })
            .then((res) => {
              if (!res.ok) log.warn('Cart sync non-OK', { status: res.status, productId: product.id });
              else         log.debug('Cart synced to server', { productId: product.id });
            })
            .catch((err) => log.error('Cart server sync failed — UI preserved', err, { productId: product.id }));
        },

        removeItem: (id) => {
          set(
            (state) => ({ items: state.items.filter((i) => i.id !== id) }),
            false,
            'cart/removeItem'
          );
          log.info('Item removed from cart', { productId: id });
        },

        updateQty: (id, qty) => {
          if (qty <= 0) { get().removeItem(id); return; }
          set(
            (state) => ({ items: state.items.map((i) => i.id === id ? { ...i, qty } : i) }),
            false,
            'cart/updateQty'
          );
          log.debug('Cart qty updated', { productId: id, qty });
        },

        clearCart:  () => { set({ items: [] }, false, 'cart/clear'); log.info('Cart cleared'); },
        openCart:   () => set({ isOpen: true  }, false, 'cart/open'),
        closeCart:  () => set({ isOpen: false }, false, 'cart/close'),
        totalItems: () => get().items.reduce((s, i) => s + i.qty, 0),
        totalPrice: () => get().items.reduce((s, i) => s + i.price * i.qty, 0),
      }),
      {
        name:       'shopforge-cart',
        partialize: (state) => ({ items: state.items }),
      }
    ),
    {
      name:    'ShopForge/Cart',   // label shown in Redux DevTools
      enabled: process.env.NODE_ENV !== 'production',
    }
  )
);
