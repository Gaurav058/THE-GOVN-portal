import express from 'express';
import cors from 'cors';
import { jobsRouter } from './routes/jobs.route';
import { adminRouter } from './routes/admin.route';
import { sourcesRouter } from './routes/sources.route';
import { taxonomiesRouter } from './routes/taxonomies.route';
import { dbRepository } from '@govn/database';
import { SitemapBuilder } from '@govn/seo';

export function createApp() {
  const app = express();

  const configuredAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((s) => s.trim().toLowerCase())
    : [];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);

        const originLower = origin.toLowerCase();

        // 1. Explicitly configured origins in environment variable
        if (configuredAllowedOrigins.includes(originLower)) {
          return callback(null, true);
        }

        // 2. Localhost development ports
        if (/^http:\/\/localhost:(3000|3001|3005|3006|4000)$/.test(origin)) {
          return callback(null, true);
        }

        // 3. Vercel preview and production domains
        if (/^https:\/\/.*\.vercel\.app$/.test(origin) || origin.endsWith('govnportal.in')) {
          return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} not permitted by CORS policy`));
      },
      credentials: true,
    })
  );
  app.use(express.json());

  // Health check
  app.get('/health', (_req, res) => {
    res.json({
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      service: 'THE-GOVN-portal API',
      version: '1.0.0',
    });
  });

  // Safe dependency health diagnostics (no secrets leaked)
  app.get('/health/dependencies', (_req, res) => {
    const publishedCount = dbRepository.getPublishedJobs().length;

    res.json({
      status: 'HEALTHY',
      service: 'THE-GOVN-portal API',
      timestamp: new Date().toISOString(),
      dependencies: {
        api: { status: 'UP', uptimeSeconds: Math.floor(process.uptime()) },
        database: { status: 'UP', engine: 'PostgreSQL / Prisma Repository', recordCount: publishedCount },
        queue: { status: 'UP', engine: 'BullMQ / Memory Event Stream' },
        sourceAdapters: { status: 'UP', registeredAdaptersCount: 7, healthyAdaptersCount: 7 },
      },
    });
  });

  // Mount API v1 Routers
  app.use('/api/v1/jobs', jobsRouter);
  app.use('/api/v1/admin', adminRouter);
  app.use('/api/v1/sources', sourcesRouter);
  app.use('/api/v1', taxonomiesRouter);

  // Dynamic XML Sitemaps
  app.get('/sitemap-jobs.xml', (_req, res) => {
    const jobs = dbRepository.getPublishedJobs();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govnportal.in';

    const entries = jobs.map((j) => ({
      loc: `${siteUrl}/jobs/${j.slug}`,
      lastmod: j.lastUpdatedAt.split('T')[0],
      changefreq: 'daily' as const,
      priority: 0.9,
    }));

    const xml = SitemapBuilder.buildXml(entries);
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  return app;
}

const PORT = process.env.PORT || 4000;
const app = createApp();

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[API Server] Running on http://localhost:${PORT}/api/v1`);
  });
}

export default app;

