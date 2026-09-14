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

export class RbiAdapter extends BaseSourceAdapter {
  readonly sourceId = 'src-rbi';
  readonly sourceName = 'Reserve Bank of India Opportunities';
  readonly trustLevel = SourceTrustLevel.LEVEL_1_PRIMARY_OFFICIAL;
  readonly baseUrl = 'https://opportunities.rbi.org.in';

  async fetchListings(): Promise<RawListing[]> {
    return [
      {
        externalId: 'rbi-grade-b-2026',
        sourceId: this.sourceId,
        title: 'Officers in Grade "B" (General/DEPR/DSIM) 2026',
        organizationName: 'Reserve Bank of India',
        lastDateText: '25/09/2026',
        sourceUrl: 'https://opportunities.rbi.org.in/',
        pdfUrl: 'https://opportunities.rbi.org.in/scripts/bs_viewcontent.aspx?Id=4420',
      }
    ];
  }

  async fetchDetails(externalId: string, url: string): Promise<RawJobDetail> {
    return {
      externalId,
      sourceId: this.sourceId,
      sourceUrl: url,
      pdfUrls: ['https://opportunities.rbi.org.in/scripts/bs_viewcontent.aspx?Id=4420'],
      title: 'RBI Grade B Official Advertisement',
      fetchedAt: new Date().toISOString(),
    };
  }

  async fetchDocuments(rawDetail: RawJobDetail): Promise<SourceDocumentPayload[]> {
    return rawDetail.pdfUrls.map((url) => ({
      documentUrl: url,
      documentType: DocumentType.NOTIFICATION,
      documentTitle: 'Official RBI Grade B Notification',
    }));
  }

  async normalize(rawDetail: RawJobDetail): Promise<ExtractedJobData> {
    return {
      externalId: rawDetail.externalId,
      title: 'Reserve Bank of India (RBI) Officers in Grade "B" 2026',
      shortTitle: 'RBI Grade B 2026',
      referenceNumber: '02/2026-27',
      organizationName: 'Reserve Bank of India',
      description: 'Recruitment to Officers in Grade B (General), DEPR, and DSIM.',
      totalVacancies: 94,
      qualifications: [{ name: 'Graduation with min 60% marks', isMandatory: true }],
      minimumAge: 21,
      maximumAge: 30,
      jobType: JobTypeEnum.PERMANENT,
      employmentType: EmploymentType.FULL_TIME,
      categoryName: 'Banking',
      locationSummary: 'All India',
      salaryMin: 55200,
      salaryMax: 116684,
      feeGeneral: 850,
      feeObc: 850,
      feeSc: 100,
      feeSt: 100,
      feeFemale: 850,
      applicationStartDate: '2026-09-04T00:00:00.000Z',
      applicationEndDate: '2026-09-25T18:00:00.000Z',
      officialNotificationUrl: 'https://opportunities.rbi.org.in/scripts/bs_viewcontent.aspx?Id=4420',
      officialApplyUrl: 'https://ibpsonline.ibps.in/rbiofaug26/',
      evidence: [
        {
          field: 'totalVacancies',
          value: 94,
          evidenceText: 'Total Officers Grade B Vacancies: 94',
          confidenceScore: 0.99,
        }
      ],
      confidenceScore: 0.99,
    };
  }
}
