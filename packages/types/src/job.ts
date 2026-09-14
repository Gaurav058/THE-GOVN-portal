import { JobLifecycleStatus, VerificationStatus, EmploymentType, JobTypeEnum, DocumentType } from './enums';

export interface FieldEvidence {
  field: string;
  value: string | number | boolean | null;
  evidenceText?: string | null;
  pageNumber?: number | null;
  confidenceScore: number;
}

export interface JobQualificationRequirement {
  qualificationId: string;
  name: string;
  code?: string;
  isMandatory: boolean;
  specialization?: string | null;
  minPercentage?: number | null;
}

export interface JobAgeRelaxationRule {
  category: string; // SC, ST, OBC, PwD, Ex-Servicemen, Women
  relaxationYears: number;
  remarks?: string | null;
}

export interface JobCategoryQuotaRule {
  category: string; // UR, OBC, SC, ST, EWS
  vacancies: number;
}

export interface JobSelectionStage {
  stageOrder: number;
  stageName: string; // Prelims CBT, Mains, Interview, Physical Test, DV
  description?: string | null;
}

export interface JobDocumentSummary {
  id: string;
  documentType: DocumentType;
  documentTitle: string;
  documentUrl: string;
  publishedDate?: string | null;
  fileHash?: string | null;
  isCurrent: boolean;
  version: number;
}

export interface JobModel {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  referenceNumber?: string | null;

  organizationId: string;
  organizationName: string;
  organizationSlug?: string;
  departmentId?: string | null;
  departmentName?: string | null;
  recruitmentBoardId?: string | null;
  recruitmentBoardName?: string | null;

  description: string;
  shortDescription?: string | null;
  totalVacancies: number;

  qualificationMin?: string | null;
  qualificationMax?: string | null;

  minimumAge: number;
  maximumAge: number;
  ageCutoffDate?: string | null;
  experienceRequired?: string | null;

  jobType: JobTypeEnum;
  employmentType: EmploymentType;

  stateId?: string | null;
  stateName?: string | null;
  districtId?: string | null;
  districtName?: string | null;
  locationSummary: string; // e.g. "All India", "Rajasthan", "New Delhi"
  categoryId: string;
  categoryName: string; // Police, Railway, SSC, Banking, Defence, Teaching, PSU, etc.

  salaryMin?: number | null;
  salaryMax?: number | null;
  payScale?: string | null; // e.g. "Pay Level 10 (Rs. 56,100 - 1,77,500)"
  salaryDescription?: string | null;

  feeGeneral?: number | null;
  feeObc?: number | null;
  feeSc?: number | null;
  feeSt?: number | null;
  feeFemale?: number | null;
  feeOther?: number | null;
  feePaymentMethod?: string | null;

  applicationStartDate: string; // ISO-8601 UTC
  applicationEndDate: string; // ISO-8601 UTC
  correctionStartDate?: string | null;
  correctionEndDate?: string | null;

  admitCardDate?: string | null;
  examStartDate?: string | null;
  examEndDate?: string | null;
  answerKeyDate?: string | null;
  resultDate?: string | null;

  officialNotificationUrl: string;
  officialApplyUrl?: string | null;

  status: JobLifecycleStatus;
  verificationStatus: VerificationStatus;
  confidenceLevel: number;
  verifiedById?: string | null;
  verifiedByName?: string | null;

  sourceId: string;
  sourceName: string;
  sourceUrl: string;

  publishedAt: string;
  lastUpdatedAt: string;
  lastVerifiedAt: string;
  createdAt: string;
  updatedAt: string;

  qualifications?: JobQualificationRequirement[];
  ageRules?: JobAgeRelaxationRule[];
  categoryRules?: JobCategoryQuotaRule[];
  selectionProcess?: JobSelectionStage[];
  documents?: JobDocumentSummary[];
  evidenceList?: FieldEvidence[];
}
