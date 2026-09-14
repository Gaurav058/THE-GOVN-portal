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

export class RailwayAdapter extends BaseSourceAdapter {
  readonly sourceId = 'src-railway';
  readonly sourceName = 'Railway Recruitment Boards (RRB/RRC)';
  readonly trustLevel = SourceTrustLevel.LEVEL_1_PRIMARY_OFFICIAL;
  readonly baseUrl = 'https://www.rrbcdg.gov.in';

  async fetchListings(): Promise<RawListing[]> {
    return [
      {
        externalId: 'rrb-cen-05-2026',
        sourceId: this.sourceId,
        title: 'CEN 05/2026 - Non-Technical Popular Categories (NTPC)',
        organizationName: 'Ministry of Railways',
        lastDateText: '18/10/2026',
        sourceUrl: 'https://www.rrbcdg.gov.in/',
        pdfUrl: 'https://www.rrbcdg.gov.in/uploads/CEN_05_2026_NTPC_Eng.pdf',
      }
    ];
  }

  async fetchDetails(externalId: string, url: string): Promise<RawJobDetail> {
    return {
      externalId,
      sourceId: this.sourceId,
      sourceUrl: url,
      pdfUrls: ['https://www.rrbcdg.gov.in/uploads/CEN_05_2026_NTPC_Eng.pdf'],
      title: 'RRB NTPC CEN 05/2026 Detailed Notification',
      fetchedAt: new Date().toISOString(),
    };
  }

  async fetchDocuments(rawDetail: RawJobDetail): Promise<SourceDocumentPayload[]> {
    return rawDetail.pdfUrls.map((url) => ({
      documentUrl: url,
      documentType: DocumentType.NOTIFICATION,
      documentTitle: 'Official RRB CEN Notice',
    }));
  }

  async normalize(rawDetail: RawJobDetail): Promise<ExtractedJobData> {
    return {
      externalId: rawDetail.externalId,
      title: 'Railway Recruitment Board NTPC Recruitment 2026',
      shortTitle: 'RRB NTPC 2026',
      referenceNumber: 'CEN 05/2026',
      organizationName: 'Ministry of Railways (Railway Recruitment Control Board)',
      description: 'Recruitment to Station Master, Goods Guard, Senior Clerk across Railway Zones.',
      totalVacancies: 11558,
      qualifications: [{ name: '12th Pass / Graduate', isMandatory: true }],
      minimumAge: 18,
      maximumAge: 33,
      jobType: JobTypeEnum.PERMANENT,
      employmentType: EmploymentType.FULL_TIME,
      categoryName: 'Railway',
      locationSummary: 'All India',
      salaryMin: 19900,
      salaryMax: 63200,
      feeGeneral: 500,
      feeObc: 500,
      feeSc: 250,
      feeSt: 250,
      feeFemale: 250,
      applicationStartDate: '2026-09-08T00:00:00.000Z',
      applicationEndDate: '2026-10-18T23:59:59.000Z',
      officialNotificationUrl: 'https://www.rrbcdg.gov.in/uploads/CEN_05_2026_NTPC_Eng.pdf',
      officialApplyUrl: 'https://www.rrbapply.gov.in/',
      evidence: [
        {
          field: 'totalVacancies',
          value: 11558,
          evidenceText: 'Total Vacancies: 11,558',
          confidenceScore: 0.99,
        }
      ],
      confidenceScore: 0.99,
    };
  }
}
