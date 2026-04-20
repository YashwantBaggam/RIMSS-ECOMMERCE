# Solution Architecture Document
## ShopForge — Enterprise E-Commerce Frontend Platform

**Version:** 1.0  
**Date:** 2025  
**Author:** Frontend Architecture Team

---

## 1. Technical Architecture Diagram

```
╔══════════════════════════════════════════════════════════════════╗
║                        END USER (Browser)                        ║
║  Chrome / Safari / Firefox / Mobile WebView                      ║
╚══════════════════════════╦═══════════════════════════════════════╝
                           ║ HTTPS
                           ▼
╔══════════════════════════════════════════════════════════════════╗
║                    CDN / Edge Network                            ║
║  Vercel Edge  │  Static assets  │  Image CDN  │  Edge Cache      ║
║  • JS/CSS/fonts served from nearest PoP (< 10ms latency)        ║
║  • next/image: WebP conversion, resizing, lazy load             ║
╚══════════════════════════╦═══════════════════════════════════════╝
                           ║
                           ▼
╔══════════════════════════════════════════════════════════════════╗
║               Next.js Application (App Router)                   ║
║                                                                  ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   ║
║  │  / (Home)    │  │ /search      │  │ /product/[id]        │   ║
║  │  SSG + ISR   │  │  CSR         │  │  SSR + generateMeta  │   ║
║  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   ║
║         │                 │                      │               ║
║  ┌──────▼─────────────────▼──────────────────────▼───────────┐   ║
║  │              Plugin Module Layer                          │   ║
║  │  ┌────────────┐  ┌────────────┐  ┌───────────────────┐   │   ║
║  │  │  Product   │  │   Search   │  │       Cart        │   │   ║
║  │  │  Module    │  │   Module   │  │      Module       │   │   ║
║  │  │            │  │            │  │                   │   │   ║
║  │  │ ProductCard│  │ SearchBar  │  │ CartDrawer        │   │   ║
║  │  │ ProductGrid│  │ useSearch  │  │ useCartStore      │   │   ║
║  │  │ useProducts│  │ debounce   │  │ (Zustand+persist) │   │   ║
║  │  └─────┬──────┘  └─────┬──────┘  └─────────┬─────────┘   │   ║
║  └────────┼───────────────┼──────────────────┬─┼─────────────┘   ║
║           │               │                  │ │                  ║
║  ┌────────▼───────────────▼──────────────────▼─▼─────────────┐   ║
║  │                  Shared Infrastructure                     │   ║
║  │  React Query Cache  │  Zustand Store  │  API Client        │   ║
║  └────────────────────────────┬───────────────────────────────┘   ║
╚═══════════════════════════════╬══════════════════════════════════╝
                                ║ REST/JSON
                                ▼
╔══════════════════════════════════════════════════════════════════╗
║                    Next.js API Routes (BFF Layer)                ║
║  GET /api/products   GET /api/search   POST /api/cart            ║
║  [Simulates 300–800ms latency in demo mode]                      ║
╚══════════════════════════════╦═══════════════════════════════════╝
                               ║ (Production: replace with real services)
                               ▼
╔══════════════════════════════════════════════════════════════════╗
║                  Backend Microservices (Abstracted)              ║
║  Product Service │ Search Service │ Cart Service │ Auth Service  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 2. Technology Decisions

### Why Next.js 14 (App Router)?

| Concern | Without Next.js | With Next.js |
|---------|----------------|--------------|
| SEO | React SPA = blank HTML on crawl | Full SSR HTML = crawlable |
| TTFB | JS must execute first | Server renders, sends HTML |
| Image optimization | Manual WebP conversion | Built-in via `next/image` |
| Code splitting | Manual webpack config | Automatic per-route |
| API layer | Separate Express server | API routes in same repo |

### Rendering Strategy Per Page

| Page | Strategy | Reason |
|------|----------|--------|
| Home (`/`) | SSG + ISR | Fast, re-validates product list every 60s |
| Search (`/search`) | CSR | Fully dynamic, no SEO needed |
| Product detail (`/product/[id]`) | SSR | SEO critical, needs dynamic metadata |

### Why React Query (TanStack Query)?

- **Caching**: Same query within 5 minutes = 0ms (from cache)
- **Loading states**: `isLoading` / `isFetching` flags drive skeleton UIs
- **Background refetch**: Data stays fresh without user action
- **`keepPreviousData`**: No blank flash when search query changes

### Why Zustand (over Redux)?

- 90% less boilerplate than Redux
- No Provider wrapping needed
- `persist` middleware handles localStorage in 1 line
- Computed values (`totalItems`, `totalPrice`) as inline functions

---

## 3. Plugin (Modular) Architecture

### Design Principle

Each feature module is a **self-contained vertical slice**:

```
modules/
└── {feature}/
    ├── components/     # UI components (only used by this module or exported)
    ├── hooks/          # Data-fetching & logic hooks
    ├── services/       # API call functions
    ├── store/          # Local state (if needed)
    ├── types.ts        # TypeScript types
    └── index.ts        # PUBLIC API ← only this file imported outside
```

### Dependency Rules

```
pages → modules/{feature}/index.ts     ✅ Allowed
pages → modules/{feature}/components/  ❌ Forbidden (internal)
modules/A → modules/B/index.ts         ✅ Allowed (e.g. cart uses Product type)
modules/A → modules/B/components/      ❌ Forbidden
```

### Adding a New Module (e.g. Reviews)

```
1. mkdir src/modules/reviews
2. Create: components/, hooks/, services/, index.ts
3. Export public API from index.ts
4. Import in /product/[id]/page.tsx
```

Zero changes to existing code. True plug-and-play.

---

## 4. Performance Architecture

### The 100ms UI Rule

The system is designed so the user NEVER waits for an API before seeing UI feedback:

```
User action
    │
    ▼ t=0ms
UI reacts immediately (skeleton / optimistic update)
    │
    ▼ t=300ms (debounce, if search)
API call fires
    │
    ▼ t=600ms (avg with simulated latency)
Real data renders (skeleton replaced)
```

### Caching Layers

```
L1: React Query in-memory cache  (0ms, same session)
L2: CDN edge cache               (< 50ms, static assets)
L3: Next.js ISR page cache       (< 100ms, SSG pages)
L4: Browser cache (Cache-Control headers)
```

### Core Web Vitals Strategy

| Metric | Problem | Solution |
|--------|---------|---------|
| LCP | Large hero image loads late | `priority` prop on above-fold images |
| CLS | Skeleton different size than content | Fixed-dimension skeleton containers |
| FID | Heavy JS blocks main thread | Code splitting, no render-blocking scripts |

---

## 5. NFR Traceability Matrix

| NFR | Requirement | Implementation | Validation |
|-----|-------------|----------------|------------|
| Performance | < 100ms UI response | Skeleton loaders + optimistic updates | Browser DevTools — interaction to paint |
| SEO | Indexed by search engines | Next.js SSR + metadata API + JSON-LD | Lighthouse SEO score |
| Cross-platform | Mobile / tablet / desktop | Tailwind responsive grid (1→2→4 cols) | Chrome DevTools device emulation |
| Scalability | Handle new features without rewrites | Plugin module architecture | Adding module requires 0 changes to core |
| Maintainability | Clean, testable code | TypeScript strict + module boundaries | ESLint + TSC zero-error builds |
| Availability | Resilient to API failures | Error boundaries + retry logic (React Query) | Kill API, verify graceful degradation |
