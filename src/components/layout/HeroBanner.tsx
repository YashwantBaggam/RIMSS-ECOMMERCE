import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 rounded-2xl overflow-hidden text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-16 translate-y-16" />
      </div>

      <div className="relative px-8 py-12 sm:px-12 sm:py-16">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            Enterprise-Grade E-Commerce Architecture Demo
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
            Modern Shopping,
            <br />
            <span className="text-yellow-300">Built to Scale</span>
          </h1>

          <p className="text-indigo-100 text-sm sm:text-base mb-8 max-w-xl leading-relaxed">
            Next.js 14 · Plugin Architecture · SSR for SEO · &lt;100ms UI · React Query Caching · Optimistic Updates
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/search?q="
              className="flex items-center justify-center gap-2 bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm"
            >
              Browse All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/product/p1"
              className="flex items-center justify-center gap-2 bg-white/15 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 backdrop-blur-sm transition-colors text-sm border border-white/20"
            >
              View Demo Product
            </Link>
          </div>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/20">
          {[
            { icon: Truck, text: 'Free shipping over $50' },
            { icon: Shield, text: 'Secure checkout' },
            { icon: Zap, text: '<100ms UI response' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-indigo-100 text-xs">
              <Icon className="w-4 h-4 text-yellow-300" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
