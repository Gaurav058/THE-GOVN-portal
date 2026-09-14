import { Router, Request, Response } from 'express';
import { dbRepository } from '@govn/database';
import { generateJobPostingJsonLd } from '@govn/seo';

export const jobsRouter = Router();

// GET /api/v1/jobs (paged & filtered)
jobsRouter.get('/', async (req: Request, res: Response) => {
  const { query, category, qualification, state, status, limit, offset } = req.query;

  const result = await dbRepository.queryJobs({
    query: query as string,
    category: category as string,
    qualification: qualification as string,
    state: state as string,
    status: status as any,
    limit: limit ? parseInt(limit as string, 10) : 50,
    offset: offset ? parseInt(offset as string, 10) : 0,
  });

  res.json({
    success: true,
    total: result.total,
    count: result.jobs.length,
    data: result.jobs,
  });
});

// GET /api/v1/jobs/latest
jobsRouter.get('/latest', async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const jobs = await dbRepository.getLatestJobs(limit);
  res.json({ success: true, count: jobs.length, data: jobs });
});

// GET /api/v1/jobs/closing-soon
jobsRouter.get('/closing-soon', async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const days = req.query.days ? parseInt(req.query.days as string, 10) : 14;
  const jobs = await dbRepository.getClosingSoonJobs(limit, days);
  res.json({ success: true, count: jobs.length, windowDays: days, data: jobs });
});

// GET /api/v1/jobs/filters (facet counts)
jobsRouter.get('/filters', async (_req: Request, res: Response) => {
  const filterData = await dbRepository.getFilters();
  res.json({
    success: true,
    data: filterData,
  });
});

// GET /api/v1/jobs/search
jobsRouter.get('/search', async (req: Request, res: Response) => {
  const q = (req.query.q as string) || '';
  const result = await dbRepository.queryJobs({ query: q, limit: 30 });
  res.json({ success: true, query: q, total: result.total, data: result.jobs });
});

// GET /api/v1/jobs/:idOrSlug
jobsRouter.get('/:idOrSlug', async (req: Request, res: Response) => {
  const idOrSlug = req.params.idOrSlug as string;
  const job = (await dbRepository.getJobBySlug(idOrSlug)) || (await dbRepository.getJobById(idOrSlug));

  if (!job) {
    res.status(404).json({ success: false, message: `Recruitment notice not found: ${idOrSlug}` });
    return;
  }

  const jsonLd = generateJobPostingJsonLd(job);

  res.json({
    success: true,
    data: job,
    jsonLd,
  });
});
