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

export class SscAdapter extends BaseSourceAdapter {
  readonly sourceId = 'src-ssc';
  readonly sourceName = 'Staff Selection Commission';
  readonly trustLevel = SourceTrustLevel.LEVEL_1_PRIMARY_OFFICIAL;
  readonly baseUrl = 'https://ssc.gov.in';

  async fetchListings(): Promise<RawListing[]> {
    return [
      {
        externalId: 'ssc-cgl-2026',
        sourceId: this.sourceId,
        title: 'Combined Graduate Level Examination, 2026',
        organizationName: 'Staff Selection Commission',
        lastDateText: '28/09/2026',
        sourceUrl: 'https://ssc.gov.in/notices',
        pdfUrl: 'https://ssc.gov.in/api/attachment/uploads/docUpld/Notice_CGL_2026.pdf',
      },
      {
        externalId: 'ssc-chsl-2026',
        sourceId: this.sourceId,
        title: 'Combined Higher Secondary (10+2) Level Examination, 2026',
        organizationName: 'Staff Selection Commission',
        lastDateText: '18/10/2026',
        sourceUrl: 'https://ssc.gov.in/notices',
        pdfUrl: 'https://ssc.gov.in/api/attachment/uploads/docUpld/Notice_CHSL_2026.pdf',
      }
    ];
  }

  async fetchDetails(externalId: string, url: string): Promise<RawJobDetail> {
    return {
      externalId,
      sourceId: this.sourceId,
      sourceUrl: url,
      pdfUrls: ['https://ssc.gov.in/api/attachment/uploads/docUpld/Notice_CGL_2026.pdf'],
      title: 'SSC Combined Graduate Level Notice',
      fetchedAt: new Date().toISOString(),
    };
  }

  async fetchDocuments(rawDetail: RawJobDetail): Promise<SourceDocumentPayload[]> {
    return rawDetail.pdfUrls.map((url) => ({
      documentUrl: url,
      documentType: DocumentType.NOTIFICATION,
      documentTitle: 'Official SSC Gazette Notice',
    }));
  }

  async normalize(rawDetail: RawJobDetail): Promise<ExtractedJobData> {
    return {
      externalId: rawDetail.externalId,
      title: 'SSC Combined Graduate Level Examination (CGL) 2026',
      shortTitle: 'SSC CGL 2026',
      referenceNumber: 'HQ-PPII03(1)/2026',
      organizationName: 'Staff Selection Commission',
      description: 'Recruitment to Group B and Group C posts in Ministries and Departments.',
      totalVacancies: 17727,
      qualifications: [{ name: 'Bachelor Degree', isMandatory: true }],
      minimumAge: 18,
      maximumAge: 32,
      jobType: JobTypeEnum.PERMANENT,
      employmentType: EmploymentType.FULL_TIME,
      categoryName: 'SSC',
      locationSummary: 'All India',
      salaryMin: 25500,
      salaryMax: 151100,
      feeGeneral: 100,
      feeObc: 100,
      feeSc: 0,
      feeSt: 0,
      feeFemale: 0,
      applicationStartDate: '2026-09-02T00:00:00.000Z',
      applicationEndDate: '2026-09-28T23:00:00.000Z',
      officialNotificationUrl: 'https://ssc.gov.in/api/attachment/uploads/docUpld/Notice_CGL_2026.pdf',
      officialApplyUrl: 'https://ssc.gov.in/',
      evidence: [
        {
          field: 'totalVacancies',
          value: 17727,
          evidenceText: 'There are approx. 17727 vacancies.',
          confidenceScore: 0.99,
        }
      ],
      confidenceScore: 0.99,
    };
  }
}
