import {
  JobModel,
  JobLifecycleStatus,
  AdminDashboardMetrics,
  VerificationReviewItem,
  AuditLogEntry,
} from '@govn/types';

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

export interface IJobRepository {
  readonly isPostgres: boolean;
  healthCheck(): Promise<{ isConnected: boolean; engine: string; count: number }>;
  getAllJobs(): Promise<JobModel[]> | JobModel[];
  getPublishedJobs(): Promise<JobModel[]> | JobModel[];
  getJobBySlug(slug: string): Promise<JobModel | null | undefined> | JobModel | undefined;
  getJobById(id: string): Promise<JobModel | null | undefined> | JobModel | undefined;
  getLatestJobs(limit?: number): Promise<JobModel[]> | JobModel[];
  getClosingSoonJobs(limit?: number, windowDays?: number): Promise<JobModel[]> | JobModel[];
  queryJobs(params: JobFilterParams): Promise<{ jobs: JobModel[]; total: number }> | { jobs: JobModel[]; total: number };
  getFilters(): Promise<{
    categories: string[];
    qualifications: string[];
    states: string[];
    totalPublishedJobs: number;
  }> | {
    categories: string[];
    qualifications: string[];
    states: string[];
    totalPublishedJobs: number;
  };
  getStates(): Promise<Array<{ name: string; slug: string; activeJobsCount: number }>> | Array<{ name: string; slug: string; activeJobsCount: number }>;
  getDashboardMetrics(): Promise<AdminDashboardMetrics> | AdminDashboardMetrics;
  getPendingReviews(): Promise<VerificationReviewItem[]> | VerificationReviewItem[];
  verifyAndPublishJob(jobId: string, adminId?: string, adminName?: string): Promise<JobModel> | JobModel;
  insertExtractedJob(job: JobModel): Promise<JobModel> | JobModel;
  getAuditLogs(): Promise<AuditLogEntry[]> | AuditLogEntry[];
}
