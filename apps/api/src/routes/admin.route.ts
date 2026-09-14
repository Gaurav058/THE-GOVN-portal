import { Router, Request, Response } from 'express';
import { dbRepository } from '@govn/database';

export const adminRouter = Router();

// GET /api/v1/admin/analytics - Real-time CMS Dashboard Metrics
adminRouter.get('/analytics', (_req: Request, res: Response) => {
  const metrics = dbRepository.getDashboardMetrics();
  res.json({ success: true, data: metrics });
});

// GET /api/v1/admin/verification - Queue of notices awaiting verifier review
adminRouter.get('/verification', (_req: Request, res: Response) => {
  const items = dbRepository.getPendingReviews();
  res.json({ success: true, count: items.length, data: items });
});

// POST /api/v1/admin/verification/:id/approve - Verifier approves notice
adminRouter.post('/verification/:id/approve', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { adminId, adminName } = req.body || {};

  try {
    const updated = dbRepository.verifyAndPublishJob(id, adminId, adminName);
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
adminRouter.get('/audit-logs', (_req: Request, res: Response) => {
  const logs = dbRepository.getAuditLogs();
  res.json({ success: true, count: logs.length, data: logs });
});
