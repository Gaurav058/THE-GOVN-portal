import { PrismaClient } from '@prisma/client';
import { VERIFIED_CURRENT_JOBS_2026 } from './verified-data';
import { JobLifecycleStatus, VerificationStatus, JobTypeEnum, EmploymentType, AdminRole, SourceTrustLevel } from '@govn/types';

export async function seedPrisma(prisma: PrismaClient) {
  console.log(`[seed-prisma] Starting migration import for ${VERIFIED_CURRENT_JOBS_2026.length} verified government job records...`);

  // 1. Ensure Default Admin Users
  await prisma.adminUser.upsert({
    where: { email: 'admin@govnportal.in' },
    update: {},
    create: {
      id: 'admin-verifier-01',
      email: 'admin@govnportal.in',
      fullName: 'Chief Gazette Verifier',
      passwordHash: '$2b$10$e8gP8nC9...hashed...',
      role: AdminRole.SUPER_ADMIN,
    },
  });

  await prisma.adminUser.upsert({
    where: { email: 'banking@govnportal.in' },
    update: {},
    create: {
      id: 'admin-verifier-02',
      email: 'banking@govnportal.in',
      fullName: 'Banking Verification Desk',
      passwordHash: '$2b$10$e8gP8nC9...hashed...',
      role: AdminRole.VERIFIER,
    },
  });

  // 2. Iterate through authentic verified records and seed prerequisites
  for (const job of VERIFIED_CURRENT_JOBS_2026) {
    // 2a. JobSource
    await prisma.jobSource.upsert({
      where: { id: job.sourceId },
      update: {
        name: job.sourceName || job.sourceId,
        baseUrl: job.sourceUrl || 'https://govnportal.in',
        trustLevel: SourceTrustLevel.LEVEL_1_PRIMARY_OFFICIAL,
      },
      create: {
        id: job.sourceId,
        name: job.sourceName || job.sourceId,
        slug: job.sourceId.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        baseUrl: job.sourceUrl || 'https://govnportal.in',
        trustLevel: SourceTrustLevel.LEVEL_1_PRIMARY_OFFICIAL,
      },
    });

    // 2b. Organization
    await prisma.organization.upsert({
      where: { id: job.organizationId },
      update: {
        name: job.organizationName,
        slug: job.organizationSlug || job.organizationId,
        type: 'Central/State Department',
        officialWebsiteUrl: job.officialApplyUrl || 'https://govn.gov.in',
      },
      create: {
        id: job.organizationId,
        name: job.organizationName,
        slug: job.organizationSlug || job.organizationId,
        type: 'Central/State Department',
        officialWebsiteUrl: job.officialApplyUrl || 'https://govn.gov.in',
      },
    });

    // 2c. JobCategory
    await prisma.jobCategory.upsert({
      where: { id: job.categoryId },
      update: {
        name: job.categoryName,
        slug: job.categoryId.replace(/^cat-/, ''),
      },
      create: {
        id: job.categoryId,
        name: job.categoryName,
        slug: job.categoryId.replace(/^cat-/, ''),
      },
    });

    // 2d. State (if applicable)
    if (job.stateId) {
      await prisma.state.upsert({
        where: { id: job.stateId },
        update: {
          name: job.stateName || job.stateId,
          code: job.stateId.replace(/^state-/, '').toUpperCase(),
        },
        create: {
          id: job.stateId,
          name: job.stateName || job.stateId,
          slug: (job.stateName || job.stateId).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          code: job.stateId.replace(/^state-/, '').toUpperCase(),
        },
      });
    }

    // 2e. Qualifications
    if (job.qualifications && job.qualifications.length > 0) {
      for (const q of job.qualifications) {
        await prisma.qualification.upsert({
          where: { id: q.qualificationId },
          update: { name: q.name },
          create: {
            id: q.qualificationId,
            name: q.name,
            slug: q.qualificationId.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            tierLevel: 1,
          },
        });
      }
    }

    // 3. Upsert Job entity
    await prisma.job.upsert({
      where: { id: job.id },
      update: {
        slug: job.slug,
        title: job.title,
        shortTitle: job.shortTitle,
        referenceNumber: job.referenceNumber,
        organizationId: job.organizationId,
        description: job.description,
        shortDescription: job.shortDescription,
        totalVacancies: job.totalVacancies,
        qualificationMin: job.qualificationMin,
        qualificationMax: job.qualificationMax,
        minimumAge: job.minimumAge,
        maximumAge: job.maximumAge,
        ageCutoffDate: job.ageCutoffDate ? new Date(job.ageCutoffDate) : null,
        experienceRequired: job.experienceRequired,
        jobType: job.jobType as any,
        employmentType: job.employmentType as any,
        stateId: job.stateId || null,
        locationSummary: job.locationSummary,
        categoryId: job.categoryId,
        salaryMin: job.salaryMin !== null && job.salaryMin !== undefined ? job.salaryMin : null,
        salaryMax: job.salaryMax !== null && job.salaryMax !== undefined ? job.salaryMax : null,
        payScale: job.payScale,
        salaryDescription: job.salaryDescription,
        feeGeneral: job.feeGeneral !== null && job.feeGeneral !== undefined ? job.feeGeneral : null,
        feeObc: job.feeObc !== null && job.feeObc !== undefined ? job.feeObc : null,
        feeSc: job.feeSc !== null && job.feeSc !== undefined ? job.feeSc : null,
        feeSt: job.feeSt !== null && job.feeSt !== undefined ? job.feeSt : null,
        feeFemale: job.feeFemale !== null && job.feeFemale !== undefined ? job.feeFemale : null,
        feeOther: job.feeOther !== null && job.feeOther !== undefined ? job.feeOther : null,
        feePaymentMethod: job.feePaymentMethod,
        applicationStartDate: new Date(job.applicationStartDate),
        applicationEndDate: new Date(job.applicationEndDate),
        correctionStartDate: job.correctionStartDate ? new Date(job.correctionStartDate) : null,
        correctionEndDate: job.correctionEndDate ? new Date(job.correctionEndDate) : null,
        admitCardDate: job.admitCardDate ? new Date(job.admitCardDate) : null,
        examStartDate: job.examStartDate ? new Date(job.examStartDate) : null,
        examEndDate: job.examEndDate ? new Date(job.examEndDate) : null,
        resultDate: job.resultDate ? new Date(job.resultDate) : null,
        officialNotificationUrl: job.officialNotificationUrl,
        officialApplyUrl: job.officialApplyUrl,
        status: job.status as any,
        verificationStatus: job.verificationStatus as any,
        confidenceLevel: job.confidenceLevel,
        verifiedById: job.verifiedById || null,
        sourceId: job.sourceId,
        publishedAt: job.publishedAt ? new Date(job.publishedAt) : new Date(),
        lastUpdatedAt: new Date(),
        lastVerifiedAt: job.lastVerifiedAt ? new Date(job.lastVerifiedAt) : new Date(),
      },
      create: {
        id: job.id,
        slug: job.slug,
        title: job.title,
        shortTitle: job.shortTitle,
        referenceNumber: job.referenceNumber,
        organizationId: job.organizationId,
        description: job.description,
        shortDescription: job.shortDescription,
        totalVacancies: job.totalVacancies,
        qualificationMin: job.qualificationMin,
        qualificationMax: job.qualificationMax,
        minimumAge: job.minimumAge,
        maximumAge: job.maximumAge,
        ageCutoffDate: job.ageCutoffDate ? new Date(job.ageCutoffDate) : null,
        experienceRequired: job.experienceRequired,
        jobType: job.jobType as any,
        employmentType: job.employmentType as any,
        stateId: job.stateId || null,
        locationSummary: job.locationSummary,
        categoryId: job.categoryId,
        salaryMin: job.salaryMin !== null && job.salaryMin !== undefined ? job.salaryMin : null,
        salaryMax: job.salaryMax !== null && job.salaryMax !== undefined ? job.salaryMax : null,
        payScale: job.payScale,
        salaryDescription: job.salaryDescription,
        feeGeneral: job.feeGeneral !== null && job.feeGeneral !== undefined ? job.feeGeneral : null,
        feeObc: job.feeObc !== null && job.feeObc !== undefined ? job.feeObc : null,
        feeSc: job.feeSc !== null && job.feeSc !== undefined ? job.feeSc : null,
        feeSt: job.feeSt !== null && job.feeSt !== undefined ? job.feeSt : null,
        feeFemale: job.feeFemale !== null && job.feeFemale !== undefined ? job.feeFemale : null,
        feeOther: job.feeOther !== null && job.feeOther !== undefined ? job.feeOther : null,
        feePaymentMethod: job.feePaymentMethod,
        applicationStartDate: new Date(job.applicationStartDate),
        applicationEndDate: new Date(job.applicationEndDate),
        correctionStartDate: job.correctionStartDate ? new Date(job.correctionStartDate) : null,
        correctionEndDate: job.correctionEndDate ? new Date(job.correctionEndDate) : null,
        admitCardDate: job.admitCardDate ? new Date(job.admitCardDate) : null,
        examStartDate: job.examStartDate ? new Date(job.examStartDate) : null,
        examEndDate: job.examEndDate ? new Date(job.examEndDate) : null,
        resultDate: job.resultDate ? new Date(job.resultDate) : null,
        officialNotificationUrl: job.officialNotificationUrl,
        officialApplyUrl: job.officialApplyUrl,
        status: job.status as any,
        verificationStatus: job.verificationStatus as any,
        confidenceLevel: job.confidenceLevel,
        verifiedById: job.verifiedById || null,
        sourceId: job.sourceId,
        publishedAt: job.publishedAt ? new Date(job.publishedAt) : new Date(),
        lastUpdatedAt: new Date(),
        lastVerifiedAt: job.lastVerifiedAt ? new Date(job.lastVerifiedAt) : new Date(),
      },
    });

    // 4. Selection Process stages
    if (job.selectionProcess && job.selectionProcess.length > 0) {
      await prisma.jobSelectionProcess.deleteMany({ where: { jobId: job.id } });
      for (const sp of job.selectionProcess) {
        await prisma.jobSelectionProcess.create({
          data: {
            jobId: job.id,
            stageOrder: sp.stageOrder,
            stageName: sp.stageName,
            description: sp.description || null,
          },
        });
      }
    }

    // 5. Age Rules
    if (job.ageRules && job.ageRules.length > 0) {
      await prisma.jobAgeRule.deleteMany({ where: { jobId: job.id } });
      for (const ar of job.ageRules) {
        await prisma.jobAgeRule.create({
          data: {
            jobId: job.id,
            category: ar.category,
            relaxationYears: ar.relaxationYears,
            remarks: ar.remarks || null,
          },
        });
      }
    }

    // 6. Job Qualifications relation
    if (job.qualifications && job.qualifications.length > 0) {
      await prisma.jobQualification.deleteMany({ where: { jobId: job.id } });
      for (const jq of job.qualifications) {
        await prisma.jobQualification.create({
          data: {
            jobId: job.id,
            qualificationId: jq.qualificationId,
            isMandatory: jq.isMandatory,
          },
        });
      }
    }
  }

  const count = await prisma.job.count();
  console.log(`[seed-prisma] Successfully seeded ${count} authentic verified jobs into PostgreSQL.`);
  return count;
}

if (require.main === module) {
  const prisma = new PrismaClient();
  seedPrisma(prisma)
    .then(async (c) => {
      console.log(`[seed-prisma] Verified records in DB: ${c}`);
      await prisma.$disconnect();
      process.exit(0);
    })
    .catch(async (e) => {
      console.error('[seed-prisma] Error seeding PostgreSQL:', e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
