import { z } from 'zod';
import { JobLifecycleStatus, VerificationStatus, JobTypeEnum, EmploymentType } from '@govn/types';

export const HttpsUrlSchema = z.string().url().refine((url) => url.startsWith('https://'), {
  message: 'Must be a secure HTTPS URL',
});

export const ExtractedJobDataSchema = z.object({
  externalId: z.string().optional(),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  shortTitle: z.string().optional(),
  referenceNumber: z.string().optional(),
  organizationName: z.string().min(2, 'Organization name is required'),
  departmentName: z.string().optional(),
  recruitmentBoardName: z.string().optional(),

  description: z.string().min(20, 'Description must be at least 20 characters'),
  shortDescription: z.string().optional(),
  totalVacancies: z.number().int().nonnegative('Vacancy count must be non-negative'),

  qualifications: z.array(
    z.object({
      name: z.string().min(1, 'Qualification name is required'),
      isMandatory: z.boolean().default(true),
      specialization: z.string().optional(),
      minPercentage: z.number().min(0).max(100).optional(),
    })
  ).min(1, 'At least one qualification requirement must be specified'),

  minimumAge: z.number().int().min(14, 'Minimum age must be at least 14').max(65, 'Minimum age must be <= 65'),
  maximumAge: z.number().int().min(14, 'Maximum age must be at least 14').max(70, 'Maximum age must be <= 70'),
  ageCutoffDate: z.string().optional(),

  jobType: z.nativeEnum(JobTypeEnum).default(JobTypeEnum.PERMANENT),
  employmentType: z.nativeEnum(EmploymentType).default(EmploymentType.FULL_TIME),
  categoryName: z.string().min(2, 'Category name is required'),
  locationSummary: z.string().min(2, 'Location summary is required'),
  stateName: z.string().optional(),

  salaryMin: z.number().positive().optional(),
  salaryMax: z.number().positive().optional(),
  payScale: z.string().optional(),
  salaryDescription: z.string().optional(),

  feeGeneral: z.number().min(0).optional(),
  feeObc: z.number().min(0).optional(),
  feeSc: z.number().min(0).optional(),
  feeSt: z.number().min(0).optional(),
  feeFemale: z.number().min(0).optional(),
  feeOther: z.number().min(0).optional(),
  feePaymentMethod: z.string().optional(),

  applicationStartDate: z.string().datetime({ message: 'applicationStartDate must be ISO-8601 UTC' }),
  applicationEndDate: z.string().datetime({ message: 'applicationEndDate must be ISO-8601 UTC' }),
  correctionStartDate: z.string().datetime().optional().nullable(),
  correctionEndDate: z.string().datetime().optional().nullable(),
  examStartDate: z.string().datetime().optional().nullable(),
  examEndDate: z.string().datetime().optional().nullable(),
  admitCardDate: z.string().datetime().optional().nullable(),
  resultDate: z.string().datetime().optional().nullable(),

  officialNotificationUrl: HttpsUrlSchema,
  officialApplyUrl: HttpsUrlSchema.optional().nullable(),

  selectionProcess: z.array(
    z.object({
      stageOrder: z.number().int().positive(),
      stageName: z.string().min(2),
    })
  ).optional(),
  confidenceScore: z.number().min(0).max(1).default(1.0),
});
