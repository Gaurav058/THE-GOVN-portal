# System Architecture: India Government Jobs Intelligence Platform

## 1. Architectural Philosophy

The **India Government Jobs Intelligence Platform** is built on a non-negotiable core principle:
**The database is the source of truth; official government recruitment notices are the factual sources. The AI model is NOT an unverified source of truth.**

Every job vacancy, eligibility rule, pay scale, important date, and corrigendum must be traceable to an official primary (Level 1) or secondary aggregator (Level 2) government source.

```
+-----------------------------------------------------------------------------------+
|                            OFFICIAL SOURCE NETWORK                                |
|  Level 1: Ministries, Commissions (UPSC, SSC), Boards (RRB), Public Banks, PSUs   |
|  Level 2: Employment News (Official Gazette), India.gov.in (National Portal)      |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        SOURCE ENGINE & INGESTION PIPELINE                         |
|  [Cron Scheduler / Trigger]                                                       |
|       --> [Source Adapter (Fetch Listings & Raw HTML/PDF)]                        |
|       --> [Raw Snapshot Storage (Immutable Content Hash)]                         |
|       --> [Document / Text Extraction (Regex + Structural + AI Extractor)]         |
|       --> [Normalization Engine (IST Timestamps, Enum Mappings)]                  |
|       --> [Business Validation Engine (Date Logic, HTTPS, Vacancy Checks)]        |
|       --> [Deduplication Engine (SHA-256, Title/Org Fuzzy Similarity)]            |
|       --> [Change Detection Engine (Detect DEADLINE_CHANGED, Corrigendum)]        |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        ADMIN CONTROL & VERIFICATION CMS                           |
|  [Review Queue: PENDING_REVIEW / NEEDS_REVIEW / CONFLICT_DETECTED]                |
|  [Split-Screen Verifier: Left = Official Notice / PDF | Right = Structured Data]  |
|  [Verifier Action: Approve, Edit, Reject, Reprocess]                              |
|  [Role-Based Access Control: VERIFIER / SUPER_ADMIN only for publish]             |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                          PRODUCTION POSTGRESQL DATABASE                           |
|  Prisma ORM | Normalized 30+ Entities | Full Audit Log & Change History           |
+-----------------------------------------------------------------------------------+
                                          |
                     +--------------------+--------------------+
                     |                                         |
                     v                                         v
+------------------------------------+   +------------------------------------------+
|      REST API SERVER (NestJS/v1)   |   |        PUBLIC WEB PORTAL (Next.js)       |
|  /api/v1/jobs                      |   |  - SSR / SSG / ISR for Core Web Vitals   |
|  /api/v1/jobs/search & filters     |   |  - Information-dense, mobile-first UX    |
|  /api/v1/states, /api/v1/exams     |   |  - Google JobPosting JSON-LD             |
|  /api/v1/admin/verification        |   |  - Clear Official vs Apply separation    |
+------------------------------------+   +------------------------------------------+
```

---

## 2. Monorepo Organization

We employ a unified monorepo managed with `pnpm workspaces`:

- `apps/web`: Public-facing Next.js application delivering high-performance server-rendered pages, search, multi-facet filtering, and dynamic SEO metadata.
- `apps/api`: Production REST API exposing versioned `/api/v1/...` endpoints for web clients, administrative tools, and future native mobile apps (Android/iOS).
- `apps/admin`: Verification CMS featuring split-screen side-by-side inspection of original government notifications vs structured extracted records.
- `packages/database`: Prisma schema targeting PostgreSQL with comprehensive migrations, seed data, and connection utilities.
- `packages/types`: Core domain TypeScript types, enums, DTOs, and interface contracts.
- `packages/source-engine`: Ingestion adapters, scrapers, snapshot store, document parser, deduplication, and change detection engines.
- `packages/validation`: Zod schemas and invariant assertion rules.
- `packages/seo`: Structured data schema generators (JobPosting, Breadcrumbs, Organization) and sitemap builders.
- `packages/ui`: Shared design tokens, buttons, status badges, and layout primitives.

---

## 3. Trust Model Hierarchy

Sources are categorized into strict trust levels:

| Level | Classification | Examples | Permissions |
|---|---|---|---|
| **Level 1** | Primary Official | UPSC, SSC, RRB, IBPS, SBI, Central Ministries, State PSCs | Authoritative factual source. Can automatically establish primary record. |
| **Level 2** | Government Aggregator | Employment News (Govt of India), India.gov.in | Authoritative discovery and cross-verification source. |
| **Level 3** | Secondary Reputable | Recognized educational journals, press agencies | Discovery only. Cannot override Level 1/2 notifications. |
| **Level 4** | Discovery / Unverified | Forums, Social feeds, Telegram | Discovery trigger only. Requires Level 1 official verification before ingestion. |

---

## 4. Lifecycle Status Engine

Every recruitment record dynamically transitions through lifecycle stages:

1. `DRAFT`: Initial ingestion or manual draft.
2. `PENDING_REVIEW`: Structured data extracted; waiting for verifier review.
3. `VERIFIED`: Approved by a certified Human Verifier or Super Admin.
4. `PUBLISHED`: Publicly indexable and accessible on website.
5. `APPLICATION_OPEN`: Current date falls within `[applicationStartDate, applicationEndDate]`.
6. `CLOSING_SOON`: Application closes within $\le 3$ days.
7. `APPLICATION_CLOSED`: Current date $> applicationEndDate$.
8. `CORRECTION_OPEN`: Application correction window is active.
9. `ADMIT_CARD_AVAILABLE`: Admit cards released by the conducting authority.
10. `EXAM_SCHEDULED`: Exam dates announced and pending.
11. `EXAM_COMPLETED`: Exam concluded.
12. `ANSWER_KEY_AVAILABLE`: Provisional or final answer key published.
13. `RESULT_DECLARED`: Examination results released.
14. `FINAL_RESULT`: Final merit list or selection list published.
15. `CANCELLED`: Officially cancelled or withdrawn by issuing authority.
16. `ARCHIVED`: Historic recruitment cycle completed.

---

## 5. Security and RBAC

- Super Admin: Complete platform authority, user management, source configurations.
- Verifier: Authorized to approve extracted recruitment data and commit changes to the live database.
- Editor: Authorized to write informational guides, articles, and syllabus breakdowns.
- Data Operator: Authorized to trigger scrapers and view ingestion logs.
- Audit Logging: All mutations to jobs, verification status, and change approvals are permanently logged with verifier ID, IP address, and diff snapshots.
