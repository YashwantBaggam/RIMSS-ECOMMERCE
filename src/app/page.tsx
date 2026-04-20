import type { Metadata } from 'next';
import { ProductShowcase } from '@/modules/product/components/ProductShowcase';
import { HeroBanner } from '@/components/layout/HeroBanner';

export const metadata: Metadata = {
  title: 'ShopForge — Modern E-Commerce',
  description: 'Discover thousands of products at the best prices.',
};

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroBanner />
      <ProductShowcase />
    </div>
  );
}
