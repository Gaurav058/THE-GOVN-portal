import { SourceTrustLevel, DocumentType, ChangeType, VerificationStatus, JobTypeEnum, EmploymentType } from './enums';
import { FieldEvidence } from './job';

export interface RawListing {
  externalId: string;
  sourceId: string;
  title: string;
  sourceUrl: string;
  publishedDateText?: string;
  lastDateText?: string;
  pdfUrl?: string;
  organizationName?: string;
  extraMeta?: Record<string, unknown>;
}

export interface RawJobDetail {
  externalId: string;
  sourceId: string;
  sourceUrl: string;
  htmlContent?: string;
  pdfUrls: string[];
  title: string;
  fetchedAt: string;
  headers?: Record<string, string>;
  rawMeta?: Record<string, unknown>;
}

export interface SourceDocumentPayload {
  documentUrl: string;
  documentType: DocumentType;
  documentTitle: string;
  fileBuffer?: Uint8Array | unknown;
  fileHash?: string;
  mimeType?: string;
}

export interface ExtractedJobData {
  externalId?: string;
  title: string;
  shortTitle?: string;
  referenceNumber?: string;
  organizationName: string;
  departmentName?: string;
  recruitmentBoardName?: string;

  description: string;
  shortDescription?: string;
  totalVacancies: number;

  qualifications: Array<{
    name: string;
    isMandatory: boolean;
    specialization?: string;
    minPercentage?: number;
  }>;

  minimumAge: number;
  maximumAge: number;
  ageCutoffDate?: string;
  ageRelaxations?: Array<{ category: string; relaxationYears: number }>;

  jobType: JobTypeEnum;
  employmentType: EmploymentType;
  categoryName: string;
  locationSummary: string;
  stateName?: string;

  salaryMin?: number;
  salaryMax?: number;
  payScale?: string;
  salaryDescription?: string;

  feeGeneral?: number;
  feeObc?: number;
  feeSc?: number;
  feeSt?: number;
  feeFemale?: number;
  feeOther?: number;
  feePaymentMethod?: string;

  applicationStartDate: string;
  applicationEndDate: string;
  correctionStartDate?: string;
  correctionEndDate?: string;
  examStartDate?: string;
  examEndDate?: string;
  admitCardDate?: string;
  resultDate?: string;

  officialNotificationUrl: string;
  officialApplyUrl?: string;

  selectionProcess?: Array<{ stageOrder: number; stageName: string }>;
  evidence: FieldEvidence[];
  confidenceScore: number;
}

export interface ValidationIssue {
  field: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
}

export interface ValidationResult {
  isValid: boolean;
  issues: ValidationIssue[];
}

export interface DetectedChange {
  field: string;
  oldValue: string | number | boolean | null;
  newValue: string | number | boolean | null;
  changeType: ChangeType;
  detectedAt: string;
  evidenceSnippet?: string;
}

export interface ISourceAdapter {
  readonly sourceId: string;
  readonly sourceName: string;
  readonly trustLevel: SourceTrustLevel;
  readonly baseUrl: string;

  fetchListings(): Promise<RawListing[]>;
  fetchDetails(externalId: string, url: string): Promise<RawJobDetail>;
  fetchDocuments(rawDetail: RawJobDetail): Promise<SourceDocumentPayload[]>;
  normalize(rawDetail: RawJobDetail): Promise<ExtractedJobData>;
  validate(extracted: ExtractedJobData): Promise<ValidationResult>;
  detectChanges(existingData: Partial<ExtractedJobData>, extracted: ExtractedJobData): Promise<DetectedChange[]>;
}
