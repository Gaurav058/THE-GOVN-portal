# India Government Jobs Intelligence Platform (THE GOVN Portal)

> **Stage 1: Production Foundation + Live Government Job Data Engine**

An enterprise-grade, authoritative India Government Jobs Intelligence Platform built with Next.js, Node.js/NestJS, PostgreSQL (Prisma ORM), and a modular official source ingestion engine.

---

## 🏛️ Core Principle: The Database is the Source of Truth

Government websites and official recruitment gazettes are the only factual sources. AI is used solely for extraction assistance with source evidence tracking, and never publishes unverified information.

```
OFFICIAL SOURCE → SOURCE FETCHER → DOCUMENT PROCESSOR → STRUCTURED EXTRACTION → VALIDATION → HUMAN VERIFICATION → DATABASE → WEBSITE/API → CITIZEN
```

---

## 📁 Monorepo Structure

```
├── apps/
│   ├── web/                     # Public Next.js portal (SSR, high information density, SEO, Tailwind CSS)
│   ├── api/                     # REST API (/api/v1/jobs, search, filters, verification)
│   └── admin/                   # Split-screen verification CMS & control center
├── packages/
│   ├── database/                # PostgreSQL schema (Prisma ORM), migrations, seed scripts
│   ├── source-engine/           # Ingestion adapters (Employment News, UPSC, SSC, Railways, etc.)
│   ├── types/                   # Shared TypeScript contracts, DTOs & domain models
│   ├── validation/              # Invariant business rule validation engine (Zod)
│   ├── ui/                      # Shared UI components and design tokens
│   └── seo/                     # Google JobPosting JSON-LD schemas & sitemap generators
├── docs/                        # Complete technical documentation suite
└── infrastructure/              # Docker, Nginx, and cloud deployment configs
```

---

## 🚀 Quickstart

### Prerequisites
- Node.js 20+ (Node v24 supported)
- pnpm v10+

### Installation & Setup

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

3. **Generate Prisma Client & Database**:
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

4. **Seed initial verified data**:
   ```bash
   pnpm db:seed
   ```

5. **Start development servers**:
   ```bash
   pnpm dev
   ```
   - Public Web Portal: `http://localhost:3000`
   - Admin Verification CMS: `http://localhost:3001`
   - REST API: `http://localhost:4000/api/v1`

---

## 🧪 Testing

```bash
# Run all unit and validation tests
pnpm test
```

---

## 📜 Documentation

- [System Architecture](docs/architecture.md)
- [Database Schema & ERD](docs/database.md)
- [Data Pipeline](docs/data-pipeline.md)
- [Source Adapters](docs/source-adapters.md)
- [Admin Verification Workflow](docs/admin-workflow.md)
- [SEO & Structured Data](docs/seo.md)
- [Deployment & Docker](docs/deployment.md)
- [Security & RBAC](docs/security.md)
- [Testing Strategy](docs/testing.md)
