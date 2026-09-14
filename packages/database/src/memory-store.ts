import { JobModel, JobLifecycleStatus, VerificationStatus, AdminDashboardMetrics, VerificationReviewItem, AuditLogEntry } from '@govn/types';
import { VERIFIED_CURRENT_JOBS_2026 } from './seed/verified-data';
import { JobLifecycleEngine } from './lifecycle';

export interface JobFilterParams {
  query?: string;
  category?: string;
  qualification?: string;
  state?: string;
  status?: JobLifecycleStatus;
  closingSoonOnly?: boolean;
  limit?: number;
  offset?: number;
}

export class DevelopmentRepository {
  private jobs: JobModel[] = [...VERIFIED_CURRENT_JOBS_2026];
  private auditLogs: AuditLogEntry[] = [
    {
      id: 'audit-init-01',
      adminId: 'admin-verifier-01',
      adminName: 'Senior Verifier',
      action: 'INITIAL_OFFICIAL_SEED_VERIFICATION',
      entityType: 'Job',
      entityId: 'job-upsc-cse-2026',
      timestamp: '2026-09-14T08:30:00.000Z',
    }
  ];

  constructor() {
    this.refreshDynamicStatuses();
  }

  public refreshDynamicStatuses() {
    const now = new Date('2026-09-14T09:00:00.000Z');
    for (const job of this.jobs) {
      if (job.verificationStatus === VerificationStatus.VERIFIED) {
        job.status = JobLifecycleEngine.calculateStatus(
          {
            applicationStartDate: job.applicationStartDate,
            applicationEndDate: job.applicationEndDate,
            correctionStartDate: job.correctionStartDate,
            correctionEndDate: job.correctionEndDate,
            admitCardDate: job.admitCardDate,
            examStartDate: job.examStartDate,
            examEndDate: job.examEndDate,
            resultDate: job.resultDate,
          },
          now
        );
      }
    }
  }

  public getAllJobs(): JobModel[] {
    this.refreshDynamicStatuses();
    return this.jobs;
  }

  public getPublishedJobs(): JobModel[] {
    this.refreshDynamicStatuses();
    return this.jobs.filter((j) => j.verificationStatus === VerificationStatus.VERIFIED);
  }

  public getJobBySlug(slug: string): JobModel | undefined {
    this.refreshDynamicStatuses();
    return this.jobs.find((j) => j.slug === slug);
  }

  public getJobById(id: string): JobModel | undefined {
    this.refreshDynamicStatuses();
    return this.jobs.find((j) => j.id === id);
  }

  public queryJobs(params: JobFilterParams): { jobs: JobModel[]; total: number } {
    this.refreshDynamicStatuses();
    let result = this.jobs.filter((j) => j.verificationStatus === VerificationStatus.VERIFIED);

    if (params.query) {
      const q = params.query.toLowerCase().trim();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.shortTitle.toLowerCase().includes(q) ||
          j.organizationName.toLowerCase().includes(q) ||
          j.categoryName.toLowerCase().includes(q) ||
          j.locationSummary.toLowerCase().includes(q) ||
          (j.qualificationMin && j.qualificationMin.toLowerCase().includes(q)) ||
          (j.description && j.description.toLowerCase().includes(q))
      );
    }

    if (params.category) {
      const cat = params.category.toLowerCase().replace(/-/g, ' ');
      result = result.filter((j) => j.categoryName.toLowerCase().includes(cat) || j.categoryId.toLowerCase().includes(cat));
    }

    if (params.qualification) {
      const qf = params.qualification.toLowerCase().replace(/-/g, ' ');
      result = result.filter(
        (j) =>
          (j.qualificationMin && j.qualificationMin.toLowerCase().includes(qf)) ||
          j.qualifications?.some((q) => q.name.toLowerCase().includes(qf))
      );
    }

    if (params.state) {
      const st = params.state.toLowerCase().replace(/-/g, ' ');
      result = result.filter(
        (j) =>
          (j.stateName && j.stateName.toLowerCase().includes(st)) ||
          j.locationSummary.toLowerCase().includes(st) ||
          (st === 'all-india' && j.locationSummary.toLowerCase().includes('all india'))
      );
    }

    if (params.status) {
      result = result.filter((j) => j.status === params.status);
    }

    if (params.closingSoonOnly) {
      result = result.filter((j) => j.status === JobLifecycleStatus.CLOSING_SOON);
    }

    const total = result.length;
    const offset = params.offset || 0;
    const limit = params.limit || 50;
    const paged = result.slice(offset, offset + limit);

    return { jobs: paged, total };
  }

  public getLatestJobs(limit = 10): JobModel[] {
    return this.getPublishedJobs()
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  public getClosingSoonJobs(limit = 10): JobModel[] {
    return this.getPublishedJobs()
      .filter((j) => j.status === JobLifecycleStatus.CLOSING_SOON || j.status === JobLifecycleStatus.APPLICATION_OPEN)
      .sort((a, b) => new Date(a.applicationEndDate).getTime() - new Date(b.applicationEndDate).getTime())
      .slice(0, limit);
  }

  public getDashboardMetrics(): AdminDashboardMetrics {
    this.refreshDynamicStatuses();
    const all = this.jobs;
    const published = all.filter((j) => j.verificationStatus === VerificationStatus.VERIFIED);
    const pending = all.filter((j) => j.verificationStatus === VerificationStatus.PENDING_REVIEW || j.verificationStatus === VerificationStatus.NEEDS_REVIEW);

    const now = new Date('2026-09-14T09:00:00.000Z').getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    let closingToday = 0;
    let closingIn3 = 0;
    let closingIn7 = 0;

    for (const j of published) {
      const diff = new Date(j.applicationEndDate).getTime() - now;
      if (diff > 0 && diff <= oneDay) closingToday++;
      if (diff > 0 && diff <= 3 * oneDay) closingIn3++;
      if (diff > 0 && diff <= 7 * oneDay) closingIn7++;
    }

    return {
      totalJobs: all.length,
      newSources: 8,
      pendingVerification: pending.length,
      published: published.length,
      closingToday,
      closingIn3Days: closingIn3,
      closingIn7Days: closingIn7,
      recentlyUpdated: 4,
      brokenSourceLinks: 0,
      failedIngestions: 0,
      duplicates: 0,
      conflicts: 0,
    };
  }

  public getPendingReviews(): VerificationReviewItem[] {
    const pendings = this.jobs.filter(
      (j) =>
        j.verificationStatus === VerificationStatus.PENDING_REVIEW ||
        j.verificationStatus === VerificationStatus.NEEDS_REVIEW ||
        j.verificationStatus === VerificationStatus.UNVERIFIED
    );

    return pendings.map((p) => ({
      jobId: p.id,
      title: p.title,
      organization: p.organizationName,
      sourceUrl: p.sourceUrl,
      officialNotificationUrl: p.officialNotificationUrl,
      verificationStatus: p.verificationStatus,
      confidenceScore: p.confidenceLevel,
      createdAt: p.createdAt,
      totalVacancies: p.totalVacancies,
      applicationEndDate: p.applicationEndDate,
      sourceSnapshotHtml: `<html><body><h3>${p.title}</h3><p>Official notification reference: ${p.referenceNumber || 'N/A'}</p><p>Total vacancies: ${p.totalVacancies}</p><p>Last Date: ${p.applicationEndDate}</p></body></html>`,
      extractedData: { ...p },
      fieldFlags: {
        title: 'GREEN',
        organizationName: 'GREEN',
        totalVacancies: 'GREEN',
        applicationEndDate: 'GREEN',
        officialNotificationUrl: 'GREEN',
      },
    }));
  }

  public verifyAndPublishJob(jobId: string, adminId = 'admin-verifier-01', adminName = 'Human Verifier'): JobModel {
    const job = this.jobs.find((j) => j.id === jobId);
    if (!job) throw new Error(`Job not found: ${jobId}`);

    const oldStatus = job.verificationStatus;
    job.verificationStatus = VerificationStatus.VERIFIED;
    job.verifiedById = adminId;
    job.verifiedByName = adminName;
    job.lastVerifiedAt = new Date().toISOString();
    job.status = JobLifecycleEngine.calculateStatus(
      {
        applicationStartDate: job.applicationStartDate,
        applicationEndDate: job.applicationEndDate,
      },
      new Date('2026-09-14T09:00:00.000Z')
    );

    this.auditLogs.unshift({
      id: `audit-${Date.now()}`,
      adminId,
      adminName,
      action: 'APPROVE_AND_PUBLISH',
      entityType: 'Job',
      entityId: jobId,
      oldState: { verificationStatus: oldStatus },
      newState: { verificationStatus: VerificationStatus.VERIFIED, status: job.status },
      timestamp: new Date().toISOString(),
    });

    return job;
  }

  public insertExtractedJob(job: JobModel): JobModel {
    this.jobs.unshift(job);
    return job;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }
}

export const dbRepository = new DevelopmentRepository();
