import { PrismaClient } from '@prisma/client';
import {
  JobModel,
  JobLifecycleStatus,
  VerificationStatus,
  AdminDashboardMetrics,
  VerificationReviewItem,
  AuditLogEntry,
  JobTypeEnum,
  EmploymentType,
} from '@govn/types';
import { IJobRepository, JobFilterParams } from './repository.interface';
import { JobLifecycleEngine } from './lifecycle';

function mapPrismaJob(pj: any): JobModel {
  return {
    id: pj.id,
    slug: pj.slug,
    title: pj.title,
    shortTitle: pj.shortTitle,
    referenceNumber: pj.referenceNumber || null,
    organizationId: pj.organizationId,
    organizationName: pj.organization?.name || pj.organizationId,
    organizationSlug: pj.organization?.slug,
    departmentId: pj.departmentId || null,
    departmentName: pj.department?.name || null,
    recruitmentBoardId: pj.recruitmentBoardId || null,
    recruitmentBoardName: pj.recruitmentBoard?.name || null,
    description: pj.description,
    shortDescription: pj.shortDescription || null,
    totalVacancies: pj.totalVacancies,
    qualificationMin: pj.qualificationMin || null,
    qualificationMax: pj.qualificationMax || null,
    minimumAge: pj.minimumAge,
    maximumAge: pj.maximumAge,
    ageCutoffDate: pj.ageCutoffDate ? pj.ageCutoffDate.toISOString() : null,
    experienceRequired: pj.experienceRequired || null,
    jobType: (pj.jobType as JobTypeEnum) || JobTypeEnum.PERMANENT,
    employmentType: (pj.employmentType as EmploymentType) || EmploymentType.FULL_TIME,
    stateId: pj.stateId || null,
    stateName: pj.state?.name || null,
    districtId: pj.districtId || null,
    districtName: pj.district?.name || null,
    locationSummary: pj.locationSummary,
    categoryId: pj.categoryId,
    categoryName: pj.category?.name || pj.categoryId,
    salaryMin: pj.salaryMin ? Number(pj.salaryMin) : null,
    salaryMax: pj.salaryMax ? Number(pj.salaryMax) : null,
    payScale: pj.payScale || null,
    salaryDescription: pj.salaryDescription || null,
    feeGeneral: pj.feeGeneral ? Number(pj.feeGeneral) : null,
    feeObc: pj.feeObc ? Number(pj.feeObc) : null,
    feeSc: pj.feeSc ? Number(pj.feeSc) : null,
    feeSt: pj.feeSt ? Number(pj.feeSt) : null,
    feeFemale: pj.feeFemale ? Number(pj.feeFemale) : null,
    feeOther: pj.feeOther ? Number(pj.feeOther) : null,
    feePaymentMethod: pj.feePaymentMethod || null,
    applicationStartDate: pj.applicationStartDate instanceof Date ? pj.applicationStartDate.toISOString() : pj.applicationStartDate,
    applicationEndDate: pj.applicationEndDate instanceof Date ? pj.applicationEndDate.toISOString() : pj.applicationEndDate,
    correctionStartDate: pj.correctionStartDate ? pj.correctionStartDate.toISOString() : null,
    correctionEndDate: pj.correctionEndDate ? pj.correctionEndDate.toISOString() : null,
    admitCardDate: pj.admitCardDate ? pj.admitCardDate.toISOString() : null,
    examStartDate: pj.examStartDate ? pj.examStartDate.toISOString() : null,
    examEndDate: pj.examEndDate ? pj.examEndDate.toISOString() : null,
    resultDate: pj.resultDate ? pj.resultDate.toISOString() : null,
    officialNotificationUrl: pj.officialNotificationUrl,
    officialApplyUrl: pj.officialApplyUrl || null,
    status: pj.status as JobLifecycleStatus,
    verificationStatus: pj.verificationStatus as VerificationStatus,
    confidenceLevel: pj.confidenceLevel,
    verifiedById: pj.verifiedById || null,
    verifiedByName: pj.verifiedBy?.fullName || null,
    sourceId: pj.sourceId,
    sourceName: pj.source?.name || pj.sourceId,
    sourceUrl: pj.source?.baseUrl || null,
    publishedAt: pj.publishedAt ? pj.publishedAt.toISOString() : pj.createdAt.toISOString(),
    lastUpdatedAt: pj.lastUpdatedAt ? pj.lastUpdatedAt.toISOString() : pj.updatedAt.toISOString(),
    lastVerifiedAt: pj.lastVerifiedAt ? pj.lastVerifiedAt.toISOString() : null,
    createdAt: pj.createdAt ? pj.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: pj.updatedAt ? pj.updatedAt.toISOString() : new Date().toISOString(),
    qualifications: pj.qualifications?.map((jq: any) => ({
      qualificationId: jq.qualificationId,
      name: jq.qualification?.name || jq.qualificationId,
      isMandatory: jq.isMandatory,
    })) || [],
    ageRules: pj.ageRules?.map((ar: any) => ({
      category: ar.category,
      relaxationYears: ar.relaxationYears,
      remarks: ar.remarks,
    })) || [],
    selectionProcess: pj.selectionProcess?.map((sp: any) => ({
      stageOrder: sp.stageOrder,
      stageName: sp.stageName,
      description: sp.description,
    })) || [],
  };
}

const defaultInclude = {
  organization: true,
  category: true,
  state: true,
  source: true,
  verifiedBy: true,
  selectionProcess: { orderBy: { stageOrder: 'asc' as const } },
  ageRules: true,
  qualifications: { include: { qualification: true } },
};

export class PrismaRepository implements IJobRepository {
  public readonly isPostgres = true;

  constructor(private prisma: PrismaClient) {}

  public async healthCheck(): Promise<{ isConnected: boolean; engine: string; count: number }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      const count = await this.prisma.job.count({
        where: { verificationStatus: VerificationStatus.VERIFIED },
      });
      return { isConnected: true, engine: 'PostgreSQL / Prisma', count };
    } catch (err: any) {
      return { isConnected: false, engine: `PostgreSQL (Error: ${err?.message || err})`, count: 0 };
    }
  }

  public async getAllJobs(): Promise<JobModel[]> {
    const jobs = await this.prisma.job.findMany({
      include: defaultInclude,
      orderBy: { createdAt: 'desc' },
    });
    return jobs.map(mapPrismaJob);
  }

  public async getPublishedJobs(): Promise<JobModel[]> {
    const jobs = await this.prisma.job.findMany({
      where: { verificationStatus: VerificationStatus.VERIFIED },
      include: defaultInclude,
      orderBy: { publishedAt: 'desc' },
    });
    return jobs.map(mapPrismaJob);
  }

  public async getJobBySlug(slug: string): Promise<JobModel | null> {
    const job = await this.prisma.job.findUnique({
      where: { slug },
      include: defaultInclude,
    });
    return job ? mapPrismaJob(job) : null;
  }

  public async getJobById(id: string): Promise<JobModel | null> {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: defaultInclude,
    });
    return job ? mapPrismaJob(job) : null;
  }

  public async getLatestJobs(limit = 10): Promise<JobModel[]> {
    const jobs = await this.prisma.job.findMany({
      where: { verificationStatus: VerificationStatus.VERIFIED },
      include: defaultInclude,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
    return jobs.map(mapPrismaJob);
  }

  public async getClosingSoonJobs(limit = 10, windowDays = 14): Promise<JobModel[]> {
    const now = new Date();
    const maxDate = new Date(now.getTime() + windowDays * 24 * 60 * 60 * 1000);

    const jobs = await this.prisma.job.findMany({
      where: {
        verificationStatus: VerificationStatus.VERIFIED,
        applicationEndDate: {
          gte: now,
          lte: maxDate,
        },
      },
      include: defaultInclude,
      orderBy: { applicationEndDate: 'asc' },
      take: limit,
    });
    return jobs.map(mapPrismaJob);
  }

  public async queryJobs(params: JobFilterParams): Promise<{ jobs: JobModel[]; total: number }> {
    const where: any = {
      verificationStatus: VerificationStatus.VERIFIED,
    };

    if (params.query) {
      const q = params.query.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { shortTitle: { contains: q, mode: 'insensitive' } },
        { locationSummary: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { qualificationMin: { contains: q, mode: 'insensitive' } },
        { organization: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (params.category) {
      const cat = params.category.trim();
      where.category = {
        OR: [
          { slug: { equals: cat, mode: 'insensitive' } },
          { name: { contains: cat, mode: 'insensitive' } },
        ],
      };
    }

    if (params.qualification) {
      const qf = params.qualification.trim();
      where.OR = [
        ...(where.OR || []),
        { qualificationMin: { contains: qf, mode: 'insensitive' } },
        {
          qualifications: {
            some: {
              qualification: {
                name: { contains: qf, mode: 'insensitive' },
              },
            },
          },
        },
      ];
    }

    if (params.state) {
      const st = params.state.trim().toLowerCase();
      if (st === 'all-india') {
        where.locationSummary = { contains: 'All India', mode: 'insensitive' };
      } else {
        where.OR = [
          { state: { slug: { equals: st, mode: 'insensitive' } } },
          { state: { name: { contains: st, mode: 'insensitive' } } },
          { locationSummary: { contains: st, mode: 'insensitive' } },
        ];
      }
    }

    if (params.status) {
      where.status = params.status;
    }

    if (params.closingSoonOnly) {
      const now = new Date();
      const maxDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      where.applicationEndDate = {
        gte: now,
        lte: maxDate,
      };
    }

    const total = await this.prisma.job.count({ where });
    const offset = params.offset || 0;
    const limit = params.limit || 50;

    const jobs = await this.prisma.job.findMany({
      where,
      include: defaultInclude,
      orderBy: { publishedAt: 'desc' },
      skip: offset,
      take: limit,
    });

    return { jobs: jobs.map(mapPrismaJob), total };
  }

  public async getFilters(): Promise<{
    categories: string[];
    qualifications: string[];
    states: string[];
    totalPublishedJobs: number;
  }> {
    const totalPublishedJobs = await this.prisma.job.count({
      where: { verificationStatus: VerificationStatus.VERIFIED },
    });

    const categories = await this.prisma.jobCategory.findMany({
      where: { jobs: { some: { verificationStatus: VerificationStatus.VERIFIED } } },
      select: { name: true },
      orderBy: { name: 'asc' },
    });

    const states = await this.prisma.state.findMany({
      select: { name: true },
      orderBy: { name: 'asc' },
    });

    const qualifications = ['10th Pass', '12th Pass', 'ITI', 'Diploma', 'Graduate', 'Post Graduate', 'BTech'];

    return {
      categories: categories.map((c) => c.name),
      qualifications,
      states: states.map((s) => s.name),
      totalPublishedJobs,
    };
  }

  public async getStates(): Promise<Array<{ name: string; slug: string; activeJobsCount: number }>> {
    const states = await this.prisma.state.findMany({
      include: {
        _count: {
          select: { jobs: { where: { verificationStatus: VerificationStatus.VERIFIED } } },
        },
      },
      orderBy: { name: 'asc' },
    });

    return states.map((s) => ({
      name: s.name,
      slug: s.slug,
      activeJobsCount: s._count.jobs,
    }));
  }

  public async getDashboardMetrics(): Promise<AdminDashboardMetrics> {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    const [allJobsCount, publishedJobsCount, pendingCount, vacanciesAggregate] = await Promise.all([
      this.prisma.job.count(),
      this.prisma.job.count({ where: { verificationStatus: VerificationStatus.VERIFIED } }),
      this.prisma.job.count({
        where: {
          verificationStatus: { in: [VerificationStatus.PENDING_REVIEW, VerificationStatus.NEEDS_REVIEW] },
        },
      }),
      this.prisma.job.aggregate({
        where: { verificationStatus: VerificationStatus.VERIFIED },
        _sum: { totalVacancies: true },
      }),
    ]);

    const closingSoonJobs = await this.prisma.job.findMany({
      where: {
        verificationStatus: VerificationStatus.VERIFIED,
        applicationEndDate: {
          gte: now,
          lte: new Date(now.getTime() + 7 * oneDay),
        },
      },
      select: { applicationEndDate: true },
    });

    let closingToday = 0;
    let closingIn3 = 0;
    let closingIn7 = 0;

    for (const j of closingSoonJobs) {
      const diff = j.applicationEndDate.getTime() - now.getTime();
      if (diff > 0 && diff <= oneDay) closingToday++;
      if (diff > 0 && diff <= 3 * oneDay) closingIn3++;
      if (diff > 0 && diff <= 7 * oneDay) closingIn7++;
    }

    return {
      totalJobs: allJobsCount,
      newSources: 8,
      pendingVerification: pendingCount,
      published: publishedJobsCount,
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

  public async getPendingReviews(): Promise<VerificationReviewItem[]> {
    const pendings = await this.prisma.job.findMany({
      where: {
        verificationStatus: {
          in: [
            VerificationStatus.PENDING_REVIEW,
            VerificationStatus.NEEDS_REVIEW,
            VerificationStatus.UNVERIFIED,
          ],
        },
      },
      include: defaultInclude,
      take: 20,
    });

    return pendings.map((p) => ({
      jobId: p.id,
      title: p.title,
      organization: p.organization.name,
      sourceUrl: p.source.baseUrl,
      officialNotificationUrl: p.officialNotificationUrl,
      verificationStatus: p.verificationStatus as VerificationStatus,
      confidenceScore: p.confidenceLevel,
      createdAt: p.createdAt.toISOString(),
      totalVacancies: p.totalVacancies,
      applicationEndDate: p.applicationEndDate.toISOString(),
      sourceSnapshotHtml: `<html><body><h3>${p.title}</h3><p>Official notification reference: ${p.referenceNumber || 'N/A'}</p><p>Total vacancies: ${p.totalVacancies}</p><p>Last Date: ${p.applicationEndDate}</p></body></html>`,
      extractedData: mapPrismaJob(p) as any,
      fieldFlags: {
        title: 'GREEN',
        organizationName: 'GREEN',
        totalVacancies: 'GREEN',
        applicationEndDate: 'GREEN',
        officialNotificationUrl: 'GREEN',
      },
    }));
  }

  public async verifyAndPublishJob(jobId: string, adminId = 'admin-verifier-01', adminName = 'Human Verifier'): Promise<JobModel> {
    const updated = await this.prisma.job.update({
      where: { id: jobId },
      data: {
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedById: adminId,
        lastVerifiedAt: new Date(),
        status: JobLifecycleStatus.APPLICATION_OPEN,
      },
      include: defaultInclude,
    });

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'APPROVE_AND_PUBLISH',
        entityType: 'Job',
        entityId: jobId,
        oldState: { verificationStatus: VerificationStatus.PENDING_REVIEW },
        newState: { verificationStatus: VerificationStatus.VERIFIED, status: updated.status },
      },
    });

    return mapPrismaJob(updated);
  }

  public async insertExtractedJob(job: JobModel): Promise<JobModel> {
    return job;
  }

  public async getAuditLogs(): Promise<AuditLogEntry[]> {
    const logs = await this.prisma.auditLog.findMany({
      include: { admin: true },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    return logs.map((l) => ({
      id: l.id,
      adminId: l.adminId || 'system',
      adminName: l.admin?.fullName || 'System Automated Engine',
      action: l.action,
      entityType: l.entityType,
      entityId: l.entityId,
      oldState: l.oldState as any,
      newState: l.newState as any,
      timestamp: l.timestamp.toISOString(),
    }));
  }
}
