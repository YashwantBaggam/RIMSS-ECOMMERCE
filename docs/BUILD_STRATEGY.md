# Build & Deployment Strategy
## ShopForge — E-Commerce Frontend Platform

---

## CI/CD Pipeline Overview

```
Developer pushes code
        │
        ▼
GitHub Actions triggers
        │
        ├──▶ Job 1: Quality Gate
        │         TypeScript check (tsc --noEmit)
        │         ESLint (zero warnings)
        │         [BLOCKS if fails]
        │
        ├──▶ Job 2: Tests
        │         Jest unit tests
        │         Coverage report uploaded
        │         [BLOCKS if < 80% coverage]
        │
        └──▶ Job 3: Build
                  next build
                  Bundle size check (< 200KB initial JS)
                  [BLOCKS if fails]
                        │
                        ▼ (main branch only)
                  Job 4: Deploy
                        Vercel prod deploy
                        Smoke test
                        CDN cache invalidation
```

---

## Branch Strategy

```
main          ←── Production deployments only
develop       ←── Integration branch (preview deployments)
feature/*     ←── Individual features (PR → develop)
hotfix/*      ←── Emergency fixes (PR → main + develop)
```

---

## Build Optimization

### Bundle Splitting
Next.js App Router automatically splits bundles per route. Additional manual splits:

```typescript
// Lazy-load heavy modules only when needed
const CartDrawer = dynamic(() => import('@/modules/cart/components/CartDrawer'), {
  ssr: false  // Cart is client-only
});
```

### Image Pipeline
```
Source image (any format)
        │
        ▼ next/image
Converted to WebP (50-70% smaller)
Resized to requested dimensions
Served from CDN with Cache-Control: max-age=31536000
```

### Performance Budget

| Asset | Budget | Strategy if exceeded |
|-------|--------|---------------------|
| Initial JS | < 200KB | Audit with `next/bundle-analyzer` |
| LCP image | < 200KB | Compress source, use WebP |
| Total page weight | < 1MB | Defer non-critical JS |

---

## Environment Matrix

| Environment | URL | Latency Simulation | Purpose |
|-------------|-----|--------------------|---------|
| Local dev | localhost:3000 | Enabled (500ms) | Development |
| Preview | vercel-preview-*.vercel.app | Enabled (500ms) | PR review |
| Staging | staging.shopforge.com | Disabled | QA sign-off |
| Production | shopforge.com | Disabled | Live users |

---

## Monitoring (Post-Launch)

- **Vercel Analytics** — Core Web Vitals per route, real user data
- **Error tracking** — Sentry (add `@sentry/nextjs`)
- **Uptime** — Vercel status + PagerDuty alert
- **Bundle size** — `bundlesize` check in CI on every PR
