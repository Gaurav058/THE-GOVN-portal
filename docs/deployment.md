# Deployment & Infrastructure Guide

## 1. Production Deployment Topology

The platform is designed for containerized or serverless edge deployment:

```
[ Cloudflare / WAF / CDN / DDoS Shield ]
                   |
     +-------------+-------------+
     |                           |
     v                           v
[ Next.js Web App ]      [ NestJS / Express API ]
(Vercel / Node Container)  (Container / ECS / K8s)
     |                           |
     +-------------+-------------+
                   |
        +----------+----------+
        |                     |
        v                     v
[ PostgreSQL 16+ ]      [ Redis 7+ / BullMQ ]
(Supabase / RDS / Neon) (Upstash / ElastiCache)
```

---

## 2. Docker & Containerization

A complete multi-stage Docker environment is located in `/infrastructure/docker/`:
- `Dockerfile.web`: Multi-stage build for Next.js standalone server with non-root user.
- `Dockerfile.api`: Multi-stage build for the NestJS/Express API server.
- `docker-compose.yml`: Local multi-service orchestration spinning up PostgreSQL 16, Redis 7, Web, API, and Ingestion Worker.

---

## 3. Environment Modes

1. **Production Mode**: Connects to managed PostgreSQL (`DATABASE_URL=postgresql://...`) and Redis (`REDIS_URL=redis://...`).
2. **Local Development / Offline Mode**: Uses Prisma with direct database connection or embedded database adapter and in-memory queue fallback, enabling full functionality on developer workstations without native services.
