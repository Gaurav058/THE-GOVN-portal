# Database Architecture & Schema Specification

## 1. Overview

The India Government Jobs Intelligence Platform uses **PostgreSQL** as its single source of truth. All relations, constraints, foreign keys, and indexes are defined using **Prisma ORM** (`packages/database/prisma/schema.prisma`).

The database is designed to handle national-scale recruitment data with zero loss of fidelity regarding eligibility criteria, age relaxations, reservation quotas, multi-stage selection procedures, document versioning, and change audit trails.

---

## 2. Core Entities & Relationships

### Identity & Access Control
- `AdminUser`: Platform administrative accounts.
- `AdminRolePermission`: Role-based granular permissions (`SUPER_ADMIN`, `VERIFIER`, `EDITOR`, etc.).
- `AuditLog`: Immutable log of every administrative update, state transition, and publication event.
- `User`, `UserProfile`, `UserPreference`: Future citizen accounts, bookmarking, and alert subscriptions.

### Taxonomy & Master Data
- `Organization`: Central Ministries, State Departments, PSUs, Banking entities, and Armed Forces.
- `Department`: Sub-units under major organizations.
- `RecruitmentBoard`: Autonomous exam bodies (UPSC, SSC, RRB, IBPS, NTA, State PSCs).
- `State` & `District`: Complete geographic hierarchy of India (36 States/UTs, 700+ Districts).
- `Qualification`: Hierarchical degrees (10th, 12th, ITI, Diploma, Graduate, BTech, Post Graduate, MBBS, LLB, etc.).
- `JobCategory`: High-level domain classifications (Civil Services, Police, Defence, Railway, Banking, Teaching, Healthcare, PSU).
- `JobType`: Employment categorization (Permanent, Contract, Deputation, Apprenticeship).

### The Primary Recruitment Entity: `Job`
Every vacancy announcement maps to a normalized `Job` record with:
- **Identification & Slugs**: Unique human-readable URL slugs, official reference numbers (e.g. `Advt No. 05/2026-ENGG`).
- **Vacancies & Quotas**: Total vacancy count, post-wise breakdowns (`JobPost`), and quota reservations (`JobCategoryRule`).
- **Structured Dates**:
  - `applicationStartDate`, `applicationEndDate`
  - `correctionStartDate`, `correctionEndDate`
  - `admitCardDate`, `examStartDate`, `examEndDate`, `answerKeyDate`, `resultDate`
- **Application Fees**: Category-wise fee structure (General, OBC, SC, ST, Female, PwD).
- **Salary / Remuneration**: Min/max pay scale, Grade Pay, Pay Matrix Level (e.g. 7th CPC Level 10).
- **Official Links**:
  - `officialNotificationUrl`: Direct link to official PDF/Gazette.
  - `officialApplyUrl`: Direct link to government registration portal.
- **Traceability & Verification**:
  - `sourceId`, `sourceDocumentId`
  - `verificationStatus`, `verifiedById`, `verifiedAt`
  - `lastUpdatedAt`, `lastVerifiedAt`

### Granular Eligibility Sub-Tables
Eligibility is never flattened into a simple text blob:
1. `JobQualification`: Many-to-many relationship connecting `Job` with `Qualification`, storing required specialization, mandatory vs desirable flags, and minimum percentage marks.
2. `JobAgeRule`: Minimum and maximum age requirements, reference cut-off date (`ageCutoffDate`), and category-specific relaxations (e.g., SC/ST +5 years, OBC +3 years, PwD +10 years).
3. `JobCategoryRule`: Vertical reservation quota numbers (General, OBC, SC, ST, EWS, Women, Ex-Servicemen).
4. `JobLocationRule`: Geographical restrictions (All India, Specific State, District, Domicile required).
5. `JobSelectionProcess`: Ordered sequence of selection stages (Prelims CBT, Mains Written, Physical Efficiency Test, Interview, Document Verification).

### Document Versioning & Change History
- `SourceDocument`: Official PDFs, corrigendums, addendums, syllabus notices with SHA-256 file hash, storage path, version number, and `isCurrent` boolean flag.
- `SourceSnapshot`: Raw HTML/JSON snapshots stored on disk/S3 at the instant of scraping for legal auditability.
- `JobChangeHistory`: Exact diff of changes detected over time (e.g. `DEADLINE_CHANGED`, `VACANCY_CHANGED`, `EXAM_DATE_RESCHEDULED`), linking previous value, new value, detection timestamp, and verifier approval.

---

## 3. Indexing Strategy

To achieve sub-50ms query response times under high-traffic spikes:
- B-Tree composite indexes on `[status, applicationEndDate]` for fast "Closing Soon" queries.
- Indexes on `[organizationId, status]`, `[stateId, status]`, `[categoryId, status]`.
- Indexes on `slug` (unique) for fast route resolution.
- Full-text search gin indexes on `[title, description, shortTitle]`.
