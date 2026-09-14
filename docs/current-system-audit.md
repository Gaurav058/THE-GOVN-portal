# Current System Audit Report

**Date:** September 14, 2026  
**Platform:** India Government Jobs Intelligence Platform (THE GOVN Portal)  
**Author:** Principal Software Architect & Senior DevOps Engineer  

---

## 1. Executive Summary & Inventory

An exhaustive inspection of the local environment, GitHub account (`Gaurav058`), and Vercel CLI was performed prior to making any modifications.

### Existing Repositories & Accounts
- **GitHub CLI (`gh`)**: Version 2.83.1 is installed and authenticated to account `Gaurav058`.
  - Active GitHub account: `Gaurav058` (token scopes: `gist`, `read:org`, `repo`, `workflow`).
  - GitHub repositories audited: No pre-existing repositories exist for `government-jobs-web`, `government-jobs-admin`, `government-jobs-api`, or `the-govn-portal`.
- **Vercel CLI (`vercel`)**: Version 50.11.0 is installed.
  - Authentication status: `No existing credentials found`. Running `vercel login` or supplying `VERCEL_TOKEN` is required for programmatic CLI deployments.
- **Local Workspace**: `c:\Users\user\OneDrive\Documents\AETHORA\THE-GOVN-portal`.
  - Git repository status: Local workspace was not yet initialized as a git repository.

---

## 2. Existing Applications & Frameworks

| Application / Package | Framework / Runtime | Location | Purpose & Function |
|---|---|---|---|
| **Public Website (`web`)** | Next.js 14.2.23 (App Router, Tailwind CSS, SSR) | `apps/web` | Citizen-facing jobs discovery portal, SEO, Google `JobPosting` schema, search & multi-facet filters. |
| **Admin Portal (`admin`)** | Next.js 14.2.23 (Tailwind CSS, React 18) | `apps/admin` | Internal management & Split-Screen Verification CMS (Left: source notice/PDF, Right: structured form). |
| **REST API Server (`api`)** | Express 4.21.2 + TypeScript (REST v1) | `apps/api` | Central backend exposing `/api/v1/jobs`, `/api/v1/admin`, `/api/v1/sources`, `/health`. |
| **Database Package** | Prisma ORM 6.19.3 (PostgreSQL target) | `packages/database` | 30+ tables schema (`schema.prisma`), dynamic lifecycle status engine, and 12 authentic 2026 seed jobs. |
| **Source Engine** | TypeScript + Cheerio + Crypto | `packages/source-engine` | Adapters for Employment News, UPSC, SSC, Railways, IBPS, SBI, RBI, and generic scrapers; snapshot store; change detector; deduplication engine. |
| **Validation Package** | Zod 3.24.2 | `packages/validation` | Invariant domain rules (date order, age limits, vacancy count, HTTPS validation). |
| **SEO Package** | TypeScript | `packages/seo` | Google Schema.org `JobPosting` JSON-LD, `BreadcrumbList`, dynamic XML sitemaps. |
| **UI Package** | TypeScript + Tailwind tokens | `packages/ui` | Shared tokens, status badges, official buttons. |

---

## 3. Architecture Audit & Data Flow Evaluation

### Current Architecture Strengths
1. **Strong Invariant Validation**: The `@govn/validation` engine strictly rejects impossible dates (`endDate < startDate`), inverted age ranges (`minAge > maxAge`), negative vacancies, and non-HTTPS links.
2. **True Change Detection**: The `@govn/source-engine` change detector identifies `DEADLINE_CHANGED`, `VACANCY_CHANGED`, `FEE_CHANGED`, and `EXAM_DATE_RESCHEDULED`, preserving old and new values with audit logs.
3. **Automated Status Calculation**: Statuses (`APPLICATION_OPEN`, `CLOSING_SOON`, `APPLICATION_CLOSED`, etc.) are computed dynamically by `JobLifecycleEngine` based on current IST time (September 2026).
4. **Clean Monorepo Organization**: Turbo + pnpm workspaces allows modular package sharing without code duplication.

### Architecture Gaps & Required Changes
1. **Web & Admin Data Coupling**:
   - *Current State*: `apps/web` and `apps/admin` previously imported `dbRepository` directly in some server components.
   - *Required State*: Per Sections 8, 9, 22, and 23 of the prompt, `apps/web` and `apps/admin` must query the deployed REST API via `NEXT_PUBLIC_API_URL` (e.g. `src/config/api.ts`). Neither the public website nor the admin browser should have direct database coupling.
2. **CORS Configuration on REST API**:
   - `apps/api` must explicitly whitelist the deployed Vercel domains for the Public Website and Admin Portal while restricting administrative mutation routes.
3. **Health Diagnostics Endpoint**:
   - Must implement `GET /health` and `GET /health/dependencies` reporting status of API, Database, Memory Store, and Adapters without leaking secrets.
4. **Git & GitHub Deployment**:
   - Need to initialize git repository, create `.gitignore`, commit clean code, and push to GitHub (`Gaurav058/THE-GOVN-portal` or individual repos).
5. **Vercel Deployment Setup**:
   - Configure Vercel projects for Web, Admin, and API, using generated Vercel URLs.

---

## 4. Technical Debt & Security Audit

- **Secrets**: `.env.example` exists with dummy values; zero actual secrets committed in git.
- **XSS & Injection**: Parameterized queries via Prisma; strictly typed Zod DTOs prevent prototype pollution and malformed inputs.
- **RBAC**: Admin CMS distinguishes `VERIFIER` and `SUPER_ADMIN` roles for publishing actions.
- **Build Scripts**: Monorepo builds cleanly with `pnpm build` across all packages.

---

## 5. Items that Should NOT Be Changed

1. **Database Schema & Models**: The 30+ entity schema in `packages/database/prisma/schema.prisma` is comprehensive, robust, and correctly models all requirements. Do NOT rewrite or flatten it.
2. **Source Adapters**: The pluggable `ISourceAdapter` architecture (Employment News, UPSC, SSC, Railways, IBPS, SBI, RBI) is modular and working.
3. **Core Design & UX**: The public website design is serious, information-dense, fast, and mobile-first. Do not replace it with generic marketing templates.
4. **Validation Invariants**: The date, age, vacancy, and URL validation rules are rigorously tested and must remain intact.
