# Deployment & Infrastructure Guide

## 1. Official GitHub Repository

- **Repository URL**: [https://github.com/Gaurav058/THE-GOVN-portal](https://github.com/Gaurav058/THE-GOVN-portal)
- **Default Branch**: `main`
- **Monorepo Engine**: PNPM Workspaces + Turborepo

---

## 2. Production Topology & Decoupled Architecture

Neither frontend application connects directly to the database. All reads and mutations occur via the REST API layer:

```
[ Cloudflare / Edge CDN ]
           |
   +-------+-------+
   |               |
   v               v
[ apps/web ]  [ apps/admin ]
 (Public SSR)   (Control Center)
       |               |
       +-------+-------+
               | (HTTPS / REST API v1)
               v
         [ apps/api ]
      (Express / Node.js)
               |
         +-----+-----+
         |           |
         v           v
   [ PostgreSQL ] [ Redis / BullMQ ]
    (Prisma ORM)   (Change Stream)
```

---

## 3. Vercel Deployment Guide (Step-by-Step)

To deploy the three services from the monorepo onto Vercel:

### Project 1: Public Web Portal (`apps/web`)
1. In Vercel Dashboard, click **Add New...** &rarr; **Project**.
2. Select **`Gaurav058/THE-GOVN-portal`**.
3. Under **Root Directory**, click *Edit* and select **`apps/web`**.
4. Framework Preset: **Next.js** (detected automatically).
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://api.govnportal.in/api/v1` (or your deployed API Vercel URL, e.g. `https://the-govn-api.vercel.app/api/v1`)
   - `NEXT_PUBLIC_SITE_URL`: `https://govnportal.in` (or your Vercel preview domain)
6. Click **Deploy**.

---

### Project 2: Admin Control Center (`apps/admin`)
1. In Vercel Dashboard, click **Add New...** &rarr; **Project**.
2. Select **`Gaurav058/THE-GOVN-portal`**.
3. Under **Root Directory**, click *Edit* and select **`apps/admin`**.
4. Framework Preset: **Next.js** (detected automatically).
5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://api.govnportal.in/api/v1` (or your deployed API Vercel URL)
6. Click **Deploy**.

---

### Project 3: Live REST API (`apps/api`)
1. In Vercel Dashboard, click **Add New...** &rarr; **Project**.
2. Select **`Gaurav058/THE-GOVN-portal`**.
3. Under **Root Directory**, click *Edit* and select **`apps/api`**.
4. Framework Preset: **Other**.
5. Add Environment Variables:
   - `DATABASE_URL`: `postgresql://user:password@neon.tech/govn_prod?sslmode=require`
   - `REDIS_URL`: `rediss://default:token@upstash.io:6379`
   - `CORS_ORIGIN`: `https://govnportal.in,https://admin.govnportal.in`
6. Click **Deploy**. The included `apps/api/vercel.json` and `apps/api/api/index.ts` will route requests serverlessly to the Express API.

---

## 4. Docker & Containerized On-Premise Deployment

For dedicated VPS / AWS ECS / DigitalOcean Kubernetes deployments:

1. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
2. Build and launch all services via Docker Compose:
   ```bash
   docker compose -f infrastructure/docker/docker-compose.yml up -d --build
   ```
3. Verify cluster health:
   ```bash
   curl http://localhost:4000/health
   curl http://localhost:4000/health/dependencies
   ```

---

## 5. Local Development Ports

- **Public Web Portal**: [http://localhost:3005](http://localhost:3005)
- **Admin Control Center**: [http://localhost:3006](http://localhost:3006)
- **Live REST API**: [http://localhost:4000/api/v1](http://localhost:4000/api/v1)
- **API Health Check**: [http://localhost:4000/health](http://localhost:4000/health)
- **API Diagnostics**: [http://localhost:4000/health/dependencies](http://localhost:4000/health/dependencies)
