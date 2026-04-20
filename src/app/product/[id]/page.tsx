import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/modules/product/components/ProductDetail';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

interface Props {
  params: { id: string };
}

// SSR: Generate metadata server-side for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = MOCK_PRODUCTS.find((p) => p.id === params.id);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image, width: 800, height: 600, alt: product.name }],
    },
    // JSON-LD structured data for search engines
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.image,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      }),
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = MOCK_PRODUCTS.find((p) => p.id === params.id);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}

// Static generation for known products (SSG)
export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
}
