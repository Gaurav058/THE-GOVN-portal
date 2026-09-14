import { Router, Request, Response } from 'express';
import { dbRepository } from '@govn/database';
import { generateJobPostingJsonLd } from '@govn/seo';

export const jobsRouter = Router();

// GET /api/v1/jobs (paged & filtered)
jobsRouter.get('/', (req: Request, res: Response) => {
  const { query, category, qualification, state, status, limit, offset } = req.query;

  const result = dbRepository.queryJobs({
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
jobsRouter.get('/latest', (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const jobs = dbRepository.getLatestJobs(limit);
  res.json({ success: true, count: jobs.length, data: jobs });
});

// GET /api/v1/jobs/closing-soon
jobsRouter.get('/closing-soon', (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const jobs = dbRepository.getClosingSoonJobs(limit);
  res.json({ success: true, count: jobs.length, data: jobs });
});

// GET /api/v1/jobs/filters (facet counts)
jobsRouter.get('/filters', (req: Request, res: Response) => {
  const jobs = dbRepository.getPublishedJobs();

  const categories = Array.from(new Set(jobs.map((j) => j.categoryName))).sort();
  const qualifications = ['10th Pass', '12th Pass', 'ITI', 'Diploma', 'Graduate', 'Post Graduate', 'BTech'];
  const states = Array.from(new Set(jobs.map((j) => j.stateName || 'All India'))).sort();

  res.json({
    success: true,
    data: {
      categories,
      qualifications,
      states,
      totalPublishedJobs: jobs.length,
    },
  });
});

// GET /api/v1/jobs/search
jobsRouter.get('/search', (req: Request, res: Response) => {
  const q = (req.query.q as string) || '';
  const result = dbRepository.queryJobs({ query: q, limit: 30 });
  res.json({ success: true, query: q, total: result.total, data: result.jobs });
});

// GET /api/v1/jobs/:idOrSlug
jobsRouter.get('/:idOrSlug', (req: Request, res: Response) => {
  const idOrSlug = req.params.idOrSlug as string;
  const job = dbRepository.getJobBySlug(idOrSlug) || dbRepository.getJobById(idOrSlug);

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
