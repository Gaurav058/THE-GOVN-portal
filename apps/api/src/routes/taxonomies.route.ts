import { Router, Request, Response } from 'express';
import { dbRepository } from '@govn/database';

export const taxonomiesRouter = Router();

// GET /api/v1/states
taxonomiesRouter.get('/states', async (_req: Request, res: Response) => {
  const states = await dbRepository.getStates();
  res.json({ success: true, data: states });
});

// GET /api/v1/exams
taxonomiesRouter.get('/exams', async (_req: Request, res: Response) => {
  const allJobs = await dbRepository.getPublishedJobs();
  const jobs = allJobs.filter((j) => j.examStartDate);
  const exams = jobs.map((j) => ({
    id: `exam-${j.id}`,
    jobId: j.id,
    jobSlug: j.slug,
    name: `${j.shortTitle} Examination 2026`,
    conductingBody: j.organizationName,
    examStartDate: j.examStartDate,
    examEndDate: j.examEndDate,
    status: 'SCHEDULED',
  }));

  res.json({ success: true, count: exams.length, data: exams });
});

// GET /api/v1/admit-cards
taxonomiesRouter.get('/admit-cards', async (_req: Request, res: Response) => {
  const allJobs = await dbRepository.getPublishedJobs();
  const jobs = allJobs.filter((j) => j.admitCardDate);
  const cards = jobs.map((j) => ({
    id: `card-${j.id}`,
    jobId: j.id,
    title: `${j.shortTitle} Admit Card 2026`,
    releaseDate: j.admitCardDate,
    officialDownloadUrl: j.officialApplyUrl || j.officialNotificationUrl,
    status: 'AVAILABLE',
  }));

  res.json({ success: true, count: cards.length, data: cards });
});

// GET /api/v1/results
taxonomiesRouter.get('/results', async (_req: Request, res: Response) => {
  const allJobs = await dbRepository.getPublishedJobs();
  const jobs = allJobs.filter((j) => j.resultDate);
  const results = jobs.map((j) => ({
    id: `res-${j.id}`,
    jobId: j.id,
    title: `${j.shortTitle} Final Selection Result`,
    declaredAt: j.resultDate,
    officialResultUrl: j.officialNotificationUrl,
    status: 'DECLARED',
  }));

  res.json({ success: true, count: results.length, data: results });
});
