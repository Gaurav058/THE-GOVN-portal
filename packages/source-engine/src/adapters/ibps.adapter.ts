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

export class IbpsAdapter extends BaseSourceAdapter {
  readonly sourceId = 'src-ibps';
  readonly sourceName = 'Institute of Banking Personnel Selection';
  readonly trustLevel = SourceTrustLevel.LEVEL_1_PRIMARY_OFFICIAL;
  readonly baseUrl = 'https://www.ibps.in';

  async fetchListings(): Promise<RawListing[]> {
    return [
      {
        externalId: 'ibps-crp-po-xvi',
        sourceId: this.sourceId,
        title: 'Common Recruitment Process for Probationary Officers (CRP PO/MT XVI)',
        organizationName: 'IBPS (Public Sector Banks)',
        lastDateText: '02/10/2026',
        sourceUrl: 'https://www.ibps.in/',
        pdfUrl: 'https://www.ibps.in/wp-content/uploads/Detailed_Notification_CRP_PO_XVI.pdf',
      }
    ];
  }

  async fetchDetails(externalId: string, url: string): Promise<RawJobDetail> {
    return {
      externalId,
      sourceId: this.sourceId,
      sourceUrl: url,
      pdfUrls: ['https://www.ibps.in/wp-content/uploads/Detailed_Notification_CRP_PO_XVI.pdf'],
      title: 'IBPS CRP PO XVI Notification',
      fetchedAt: new Date().toISOString(),
    };
  }

  async fetchDocuments(rawDetail: RawJobDetail): Promise<SourceDocumentPayload[]> {
    return rawDetail.pdfUrls.map((url) => ({
      documentUrl: url,
      documentType: DocumentType.NOTIFICATION,
      documentTitle: 'Official IBPS Detailed Notification',
    }));
  }

  async normalize(rawDetail: RawJobDetail): Promise<ExtractedJobData> {
    return {
      externalId: rawDetail.externalId,
      title: 'IBPS Probationary Officers (CRP PO/MT XVI) 2026',
      shortTitle: 'IBPS PO 2026',
      referenceNumber: 'CRP PO/MT-XVI/2026-27',
      organizationName: 'Institute of Banking Personnel Selection',
      description: 'Common recruitment process for 4455 Probationary Officer vacancies.',
      totalVacancies: 4455,
      qualifications: [{ name: 'Graduation in any discipline', isMandatory: true }],
      minimumAge: 20,
      maximumAge: 30,
      jobType: JobTypeEnum.PERMANENT,
      employmentType: EmploymentType.FULL_TIME,
      categoryName: 'Banking',
      locationSummary: 'All India',
      salaryMin: 36000,
      salaryMax: 63840,
      feeGeneral: 850,
      feeObc: 850,
      feeSc: 175,
      feeSt: 175,
      feeFemale: 850,
      applicationStartDate: '2026-09-05T00:00:00.000Z',
      applicationEndDate: '2026-10-02T23:59:59.000Z',
      officialNotificationUrl: 'https://www.ibps.in/wp-content/uploads/Detailed_Notification_CRP_PO_XVI.pdf',
      officialApplyUrl: 'https://ibpsonline.ibps.in/crppoaug26/',
      evidence: [
        {
          field: 'totalVacancies',
          value: 4455,
          evidenceText: 'Total Participating Bank Vacancies: 4,455',
          confidenceScore: 0.99,
        }
      ],
      confidenceScore: 0.99,
    };
  }
}
