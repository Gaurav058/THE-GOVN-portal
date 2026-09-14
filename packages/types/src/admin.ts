import { AdminRole, VerificationStatus } from './enums';

export interface AdminUserDto {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string | null;
}

export interface AdminDashboardMetrics {
  totalJobs: number;
  newSources: number;
  pendingVerification: number;
  published: number;
  closingToday: number;
  closingIn3Days: number;
  closingIn7Days: number;
  recentlyUpdated: number;
  brokenSourceLinks: number;
  failedIngestions: number;
  duplicates: number;
  conflicts: number;
}

export interface VerificationReviewItem {
  jobId: string;
  title: string;
  organization: string;
  sourceUrl: string;
  officialNotificationUrl: string;
  verificationStatus: VerificationStatus;
  confidenceScore: number;
  createdAt: string;
  totalVacancies: number;
  applicationEndDate: string;
  sourceSnapshotHtml?: string;
  extractedData: Record<string, unknown>;
  fieldFlags: Record<string, 'GREEN' | 'YELLOW' | 'RED'>;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  adminName?: string;
  action: string;
  entityType: string;
  entityId: string;
  oldState?: Record<string, unknown> | null;
  newState?: Record<string, unknown> | null;
  ipAddress?: string | null;
  timestamp: string;
}
