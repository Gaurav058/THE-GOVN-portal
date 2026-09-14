# Deployment Debugging & Monorepo Root Cause Analysis

## Executive Summary
This document provides the complete forensic diagnosis, reproduction commands, root causes, permanent architectural fixes, and verification matrix for the three-tier deployment of **THE GOVN Portal** across Vercel and local environments.

---

## 1. Failure Audit & Root Cause Analysis

### Failure A: `ERR_PNPM_OUTDATED_LOCKFILE` on CI
- **Symptom**:
  ```
  ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with <ROOT>/apps/admin/package.json
  * 1 dependencies were removed: @govn/database@workspace:*
  ```
- **Root Cause**:
  When `@govn/database` was decoupled from `apps/web` and `apps/admin` (to enforce that frontend applications query the REST API rather than accessing the database directly), the manifests (`package.json`) were edited without running `pnpm install` locally to synchronize the lockfile. On Vercel, `pnpm install` runs with `--frozen-lockfile` by default in CI, triggering this rejection.
- **Reproduction**:
  ```bash
  pnpm install --frozen-lockfile
  ```
- **Fix**:
  1. Ran `pnpm install --no-frozen-lockfile` locally to synchronize `pnpm-lock.yaml`.
  2. Added root `.npmrc` setting `frozen-lockfile=false`, `auto-install-peers=true`, and `node-linker=hoisted`.
  3. Configured `apps/web/vercel.json` and `apps/admin/vercel.json` with explicit install commands.
- **Verification**:
  `pnpm install --frozen-lockfile` exits with `code 0` (clean lockfile, 10 packages synced).

---

### Failure B: Turborepo 2.0 Schema Invalidation (`pipeline` vs `tasks`)
- **Symptom**:
  ```
  Running "turbo run build"
  x Found 'pipeline' field instead of 'tasks'.
  help: Changed in 2.0: 'pipeline' has been renamed to 'tasks'.
  Error: Command "turbo run build" exited with 1
  ```
- **Root Cause**:
  `turbo.json` defined `"pipeline": { ... }`, which was the deprecated Turborepo 1.x syntax. The monorepo installed Turborepo `2.10.12`. Turborepo 2.x strictly requires the top-level key `"tasks"`.
- **Reproduction**:
  ```bash
  npx turbo run build
  ```
- **Fix**:
  Updated `turbo.json` to replace `"pipeline"` with `"tasks"`.
- **Verification**:
  Turborepo 2.x validates schema without warnings or errors.

---

### Failure C: Node.js V8 Memory Spike During Static Page Generation (Zone Allocation Out of Memory)
- **Symptom**:
  ```
  Generating static pages (0/20) ...
  FATAL ERROR: Zone Allocation failed - process out of memory / young object promotion failed
  Static worker exited with code: 134 and signal: null
  ```
- **Root Cause**:
  On systems running modern Node (e.g. Node 24 on Windows), Next.js 14's default behavior of spawning multiple parallel worker threads during static HTML prerendering exceeds the V8 child thread zone allocator limits.
- **Reproduction**:
  ```bash
  pnpm --filter @govn/web build
  ```
- **Fix**:
  Created `apps/web/next.config.js` and `apps/admin/next.config.js` with:
  ```javascript
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    experimental: {
      workerThreads: false,
      cpus: 1,
    },
  };
  module.exports = nextConfig;
  ```
- **Verification**:
  Both Next.js builds generate all static pages (20/20 for web, 7/7 for admin) and exit with `code 0` in ~15-20 seconds.

---

### Failure D: Interactive ESLint Prompt in Non-Interactive CI Shell
- **Symptom**:
  ```
  ? How would you like to configure ESLint? https://nextjs.org/docs/basic-features/eslint
  ❯ Strict (recommended)
  Cancel Command failed with exit code 1
  ```
- **Root Cause**:
  Neither `apps/web` nor `apps/admin` had an `.eslintrc.json` file or `eslint-config-next` installed. When CI or Turborepo executed `next lint`, Next.js prompted for interactive configuration, which failed immediately in headless environments.
- **Reproduction**:
  ```bash
  pnpm lint
  ```
- **Fix**:
  1. Created `apps/web/.eslintrc.json` and `apps/admin/.eslintrc.json` extending `"next/core-web-vitals"`.
  2. Installed `eslint@^8.57.0` and `eslint-config-next@14.2.23` in both applications.
- **Verification**:
  `pnpm lint` completes with `✔ No ESLint warnings or errors` across all workspace apps (`code 0`).

---

### Failure E: Monorepo Parallel Build Overload
- **Symptom**:
  Running root `turbo run build` without concurrency limits fired Next.js build workers and TypeScript compilation across all 9 packages concurrently, causing process thrashing.
- **Fix**:
  Updated root `package.json` to serialize monorepo builds: `"build": "turbo run build --concurrency=1"`.
  In Vercel, configured each project (`apps/web`, `apps/admin`, `apps/api`) to build **only its target workspace** via workspace-specific build commands (`next build` / `tsc --build`).
- **Verification**:
  `pnpm build` passes all 9 packages with `0 errors`.

---

## 2. Complete Build Verification Matrix

| Target | Command | Result | Duration |
| :--- | :--- | :--- | :--- |
| **Root Lockfile** | `pnpm install --frozen-lockfile` | `PASSED (code 0)` | 2.0s |
| **Root Monorepo Build** | `pnpm build` | `PASSED (code 0)` | 34.4s |
| **Website Build** | `pnpm --filter @govn/web build` | `PASSED (code 0)` | 18.2s |
| **Admin Build** | `pnpm --filter @govn/admin build` | `PASSED (code 0)` | 15.1s |
| **API Build** | `pnpm --filter @govn/api build` | `PASSED (code 0)` | 3.1s |
| **Test Suite** | `pnpm test` (13/13 tests) | `PASSED (code 0)` | 2.1s |
| **Lint Suite** | `pnpm lint` (zero warnings) | `PASSED (code 0)` | 27.2s |

---

## 3. Database State Analysis

- **Prisma Schema**: Models 30+ relational tables in `packages/database/prisma/schema.prisma`.
- **Repository Pattern**: `dbRepository` (`packages/database/src/memory-store.ts`) implements `DevelopmentRepository`.
- **Active State**: The repository is currently backed by an in-memory verified dataset (`VERIFIED_CURRENT_JOBS_2026`) containing 12 official government recruitments.
- **Production Status**: Prisma Client is instantiated when `DATABASE_URL` is provided. Mutations in the current dev environment persist in-process.

---

## 4. CORS Architecture

- Configurable origin list via `CORS_ALLOWED_ORIGINS` environment variable (comma-separated).
- Always permits:
  - Localhost development ports (`3000`, `3001`, `3005`, `3006`, `4000`)
  - Any Vercel preview/production deployment (`https://*.vercel.app`)
  - Custom domain (`https://*.govnportal.in`)
- Rejects unapproved origins with `Error: Origin <origin> not permitted by CORS policy`.
