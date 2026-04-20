import type { Product } from '@/lib/mock-data';
import { useCartStore } from '../store/cartStore';

// Reset store between tests
beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false });
});

const mockProduct: Product = {
  id: 'test-1',
  name: 'Test Product',
  description: 'A test product',
  price: 29.99,
  image: '/test.jpg',
  images: [],
  category: 'electronics',
  tags: ['test'],
  rating: 4.5,
  reviewCount: 100,
  stock: 10,
};

const mockProduct2: Product = {
  ...mockProduct,
  id: 'test-2',
  name: 'Another Product',
  price: 49.99,
};

describe('Cart Store', () => {
  it('starts with an empty cart', () => {
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it('adds a new item to the cart', () => {
    useCartStore.getState().addItem(mockProduct);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('test-1');
    expect(items[0].qty).toBe(1);
  });

  it('increments quantity when adding duplicate item', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().addItem(mockProduct);
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(2);
  });

  it('removes item from cart', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().removeItem('test-1');
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('calculates total price correctly', () => {
    useCartStore.getState().addItem(mockProduct);   // 29.99
    useCartStore.getState().addItem(mockProduct);   // 29.99 * 2
    useCartStore.getState().addItem(mockProduct2);  // 49.99
    const total = useCartStore.getState().totalPrice();
    expect(total).toBeCloseTo(29.99 * 2 + 49.99, 2);
  });

  it('calculates total items count correctly', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().addItem(mockProduct2);
    expect(useCartStore.getState().totalItems()).toBe(3);
  });

  it('clears the cart', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().addItem(mockProduct2);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('updates item quantity', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().updateQty('test-1', 5);
    expect(useCartStore.getState().items[0].qty).toBe(5);
  });

  it('removes item when quantity updated to 0', () => {
    useCartStore.getState().addItem(mockProduct);
    useCartStore.getState().updateQty('test-1', 0);
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
