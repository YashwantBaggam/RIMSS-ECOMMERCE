import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/lib/query-provider';
import { Header } from '@/components/layout/Header';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { LogPanel } from '@/components/ui/LogPanel';

export const metadata: Metadata = {
  title: { template: '%s | ShopForge', default: 'ShopForge — Modern E-Commerce' },
  description: 'Discover thousands of products at the best prices.',
  openGraph: { type: 'website', siteName: 'ShopForge' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <QueryProvider>
          <ErrorBoundary moduleName="root-layout">
            <Header />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </ErrorBoundary>
          {/* Live log drain panel — shows production-equivalent JSON logs in-browser */}
          <LogPanel />
        </QueryProvider>
      </body>
    </html>
  );
}
