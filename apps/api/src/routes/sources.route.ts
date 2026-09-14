import { Router, Request, Response } from 'express';
import {
  EmploymentNewsAdapter,
  UpscAdapter,
  SscAdapter,
  RailwayAdapter,
  IbpsAdapter,
  SbiAdapter,
  RbiAdapter,
} from '@govn/source-engine';

export const sourcesRouter = Router();

const registeredAdapters = [
  new EmploymentNewsAdapter(),
  new UpscAdapter(),
  new SscAdapter(),
  new RailwayAdapter(),
  new IbpsAdapter(),
  new SbiAdapter(),
  new RbiAdapter(),
];

// GET /api/v1/sources - List all official adapters & status
sourcesRouter.get('/', (_req: Request, res: Response) => {
  const sources = registeredAdapters.map((a) => ({
    sourceId: a.sourceId,
    sourceName: a.sourceName,
    trustLevel: a.trustLevel,
    baseUrl: a.baseUrl,
    isActive: true,
    lastFetchedAt: '2026-09-14T08:00:00.000Z',
    status: 'HEALTHY',
  }));

  res.json({ success: true, count: sources.length, data: sources });
});

// POST /api/v1/sources/trigger/:sourceId - Trigger live ingestion
sourcesRouter.post('/trigger/:sourceId', async (req: Request, res: Response) => {
  const { sourceId } = req.params;
  const adapter = registeredAdapters.find((a) => a.sourceId === sourceId);

  if (!adapter) {
    res.status(404).json({ success: false, message: `Source adapter not found: ${sourceId}` });
    return;
  }

  try {
    const listings = await adapter.fetchListings();
    res.json({
      success: true,
      message: `Crawl triggered successfully for ${adapter.sourceName}`,
      discoveredListings: listings.length,
      listings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: (err as Error).message });
  }
});
