import { Router, Request, Response } from 'express';
import { dbRepository } from '@govn/database';

export const adminRouter = Router();

// GET /api/v1/admin/analytics - Real-time CMS Dashboard Metrics
adminRouter.get('/analytics', async (_req: Request, res: Response) => {
  const metrics = await dbRepository.getDashboardMetrics();
  res.json({ success: true, data: metrics });
});

// GET /api/v1/admin/verification - Queue of notices awaiting verifier review
adminRouter.get('/verification', async (_req: Request, res: Response) => {
  const items = await dbRepository.getPendingReviews();
  res.json({ success: true, count: items.length, data: items });
});

// POST /api/v1/admin/verification/:id/approve - Verifier approves notice
adminRouter.post('/verification/:id/approve', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { adminId, adminName } = req.body || {};

  try {
    const updated = await dbRepository.verifyAndPublishJob(id, adminId, adminName);
    res.json({
      success: true,
      message: `Job ${id} verified and published successfully.`,
      data: updated,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: (err as Error).message });
  }
});

// GET /api/v1/admin/audit-logs - Audit trail
adminRouter.get('/audit-logs', async (_req: Request, res: Response) => {
  const logs = await dbRepository.getAuditLogs();
  res.json({ success: true, count: logs.length, data: logs });
});
