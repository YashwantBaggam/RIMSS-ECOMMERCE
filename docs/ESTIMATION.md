# Project Estimation Sheet
## ShopForge — E-Commerce Frontend Platform

**Prepared by:** Frontend Architecture Team  
**Estimation basis:** 1 Senior Frontend Engineer + 0.5 QA  
**Work style:** Agile sprints (2-week)

---

## Summary

| | Days |
|-|------|
| Core development effort | 20.5 days |
| Buffer (30%) | 6.5 days |
| **Total estimated** | **~27 days (~6 weeks)** |

---

## Detailed Breakdown

### Phase 1 — Requirements & Analysis (3 days)

| Task | Effort | Notes |
|------|--------|-------|
| Stakeholder interviews & user story definition | 1 day | |
| NFR identification and priority matrix | 0.5 day | |
| Scope doc + assumptions sign-off | 0.5 day | |
| Tech stack evaluation & ADR write-up | 0.5 day | ADR = Architecture Decision Record |
| Risk register | 0.5 day | |
| **Subtotal** | **3 days** | |

### Phase 2 — Architecture & Design (4 days)

| Task | Effort | Notes |
|------|--------|-------|
| System architecture diagram | 1 day | |
| Component hierarchy design | 0.5 day | |
| Module boundary definition | 0.5 day | |
| API contract specification (OpenAPI) | 1 day | |
| UI/UX wireframes (low-fi) | 1 day | |
| **Subtotal** | **4 days** | |

### Phase 3 — Project Setup (1.5 days)

| Task | Effort | Notes |
|------|--------|-------|
| Next.js + TypeScript scaffold | 0.5 day | |
| Folder structure + module boilerplate | 0.5 day | |
| CI/CD pipeline (GitHub Actions) | 0.25 day | |
| ESLint + Prettier + Husky setup | 0.25 day | |
| **Subtotal** | **1.5 days** | |

### Phase 4 — Feature Development (13 days)

#### Module: Product (4 days)
| Task | Effort |
|------|--------|
| ProductCard component | 0.5 day |
| ProductGrid + skeleton loaders | 0.5 day |
| ProductShowcase with category filters | 1 day |
| ProductDetail page (SSR + metadata) | 1 day |
| Image optimization + lazy loading | 0.5 day |
| productService + useProducts hook | 0.5 day |

#### Module: Search (3 days)
| Task | Effort |
|------|--------|
| SearchBar with debounce | 1 day |
| SearchResults with filters + sort | 1 day |
| useSearch hook (cache + debounce) | 0.5 day |
| searchService | 0.5 day |

#### Module: Cart (3 days)
| Task | Effort |
|------|--------|
| Zustand cart store | 0.5 day |
| Optimistic update logic | 0.5 day |
| CartDrawer UI | 1 day |
| localStorage persistence | 0.25 day |
| Quantity controls + remove | 0.75 day |

#### Shared Infrastructure (3 days)
| Task | Effort |
|------|--------|
| API client abstraction layer | 0.5 day |
| React Query provider + config | 0.25 day |
| Mock API routes with latency simulation | 0.75 day |
| Header + Navigation | 0.5 day |
| HeroBanner + global layout | 0.5 day |
| Error boundaries + 404 page | 0.5 day |

### Phase 5 — Performance Optimization (2.5 days)

| Task | Effort | NFR |
|------|--------|-----|
| Skeleton loader audit (CLS = 0) | 0.5 day | NFR-05 |
| Image priority + sizes attributes | 0.5 day | NFR-05 |
| React Query staleTime tuning | 0.25 day | NFR-01 |
| Code splitting verification (bundle audit) | 0.5 day | NFR-05 |
| Mobile responsiveness pass | 0.75 day | NFR-02 |
| **Subtotal** | **2.5 days** | |

### Phase 6 — Testing (3 days)

| Task | Effort | Coverage |
|------|--------|---------|
| Unit tests: cartStore | 0.5 day | 95% |
| Unit tests: useDebounce | 0.25 day | 100% |
| Unit tests: utils (formatPrice, calculateDiscount) | 0.25 day | 100% |
| Integration tests: search flow | 0.5 day | — |
| Integration tests: cart add/remove | 0.5 day | — |
| Cross-browser QA (Chrome, Safari, Firefox) | 0.5 day | — |
| Mobile QA (iOS + Android) | 0.5 day | — |
| **Subtotal** | **3 days** | |

### Phase 7 — Documentation (2 days)

| Task | Effort |
|------|--------|
| README (requirements, implementation, how it works) | 0.5 day |
| Architecture document | 0.5 day |
| API documentation | 0.25 day |
| Estimation sheet | 0.25 day |
| Inline code comments | 0.5 day |
| **Subtotal** | **2 days** | |

---

## Risk Register

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Backend APIs not ready on time | Medium | High | Mock API layer decouples FE from BE |
| Image CDN configuration delays | Low | Medium | next/image works without CDN in dev |
| Third-party search library licensing | Low | Low | Custom debounce + React Query used instead |
| Mobile edge cases (iOS Safari) | Medium | Medium | 1 dedicated QA day for mobile |
| Performance regression post-merge | Medium | Medium | Lighthouse CI in GitHub Actions |

---

## Assumptions

1. Backend REST APIs will be provided per agreed OpenAPI spec
2. Authentication/JWT handled by backend — not in FE scope
3. Payment gateway (Stripe) is mocked — integration is out of scope
4. Design system / Figma files not provided — using Tailwind defaults
5. Real-time inventory updates not required — polling acceptable
6. Single-language (English) — no i18n in scope
7. Deployment target: Vercel (serverless)

---

## Team

| Role | Allocation | Responsibility |
|------|-----------|----------------|
| Senior Frontend Engineer | 100% | Architecture, development, code review |
| QA Engineer | 50% | Test planning, cross-browser, mobile |
| Product Manager | 20% | Requirements, sign-off |
| DevOps | 10% | Vercel setup, environment variables |
