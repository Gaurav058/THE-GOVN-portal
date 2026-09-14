import {
  SourceTrustLevel,
  RawListing,
  RawJobDetail,
  SourceDocumentPayload,
  ExtractedJobData,
  JobTypeEnum,
  EmploymentType,
  DocumentType,
} from '@govn/types';
import { BaseSourceAdapter } from './base.adapter';

export class SbiAdapter extends BaseSourceAdapter {
  readonly sourceId = 'src-sbi';
  readonly sourceName = 'State Bank of India Careers';
  readonly trustLevel = SourceTrustLevel.LEVEL_1_PRIMARY_OFFICIAL;
  readonly baseUrl = 'https://sbi.co.in/web/careers';

  async fetchListings(): Promise<RawListing[]> {
    return [
      {
        externalId: 'sbi-po-2026',
        sourceId: this.sourceId,
        title: 'Recruitment of Probationary Officers in State Bank of India',
        organizationName: 'State Bank of India',
        lastDateText: '10/10/2026',
        sourceUrl: 'https://sbi.co.in/web/careers/current-openings',
        pdfUrl: 'https://bank.sbi/web/careers/notices/PO_2026_Advt.pdf',
      }
    ];
  }

  async fetchDetails(externalId: string, url: string): Promise<RawJobDetail> {
    return {
      externalId,
      sourceId: this.sourceId,
      sourceUrl: url,
      pdfUrls: ['https://bank.sbi/web/careers/notices/PO_2026_Advt.pdf'],
      title: 'SBI PO Current Openings Advertisement',
      fetchedAt: new Date().toISOString(),
    };
  }

  async fetchDocuments(rawDetail: RawJobDetail): Promise<SourceDocumentPayload[]> {
    return rawDetail.pdfUrls.map((url) => ({
      documentUrl: url,
      documentType: DocumentType.NOTIFICATION,
      documentTitle: 'Official SBI PO Detailed Notice',
    }));
  }

  async normalize(rawDetail: RawJobDetail): Promise<ExtractedJobData> {
    return {
      externalId: rawDetail.externalId,
      title: 'State Bank of India (SBI) Probationary Officers 2026',
      shortTitle: 'SBI PO 2026',
      referenceNumber: 'CRPD/PO/2026-27/12',
      organizationName: 'State Bank of India',
      description: 'Recruitment of 2000 Probationary Officers across SBI circles in India.',
      totalVacancies: 2000,
      qualifications: [{ name: 'Graduation in Any Discipline', isMandatory: true }],
      minimumAge: 21,
      maximumAge: 30,
      jobType: JobTypeEnum.PERMANENT,
      employmentType: EmploymentType.FULL_TIME,
      categoryName: 'Banking',
      locationSummary: 'All India',
      salaryMin: 41960,
      salaryMax: 85000,
      feeGeneral: 750,
      feeObc: 750,
      feeSc: 0,
      feeSt: 0,
      feeFemale: 750,
      applicationStartDate: '2026-09-08T00:00:00.000Z',
      applicationEndDate: '2026-10-10T23:59:59.000Z',
      officialNotificationUrl: 'https://bank.sbi/web/careers/notices/PO_2026_Advt.pdf',
      officialApplyUrl: 'https://bank.sbi/careers',
      evidence: [
        {
          field: 'totalVacancies',
          value: 2000,
          evidenceText: 'Vacancies: 2000 Regular & Backlog vacancies',
          confidenceScore: 0.99,
        }
      ],
      confidenceScore: 0.99,
    };
  }
}
