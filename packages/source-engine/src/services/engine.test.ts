import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ChangeDetectionEngine } from './change-detector';
import { DeduplicationEngine } from './deduplication-engine';
import { ChangeType, JobLifecycleStatus, VerificationStatus, JobTypeEnum, EmploymentType } from '@govn/types';

describe('ChangeDetectionEngine', () => {
  test('detects DEADLINE_CHANGED when applicationEndDate is updated', () => {
    const existing = {
      applicationEndDate: '2026-09-20T23:59:59.000Z',
    };
    const extracted = {
      title: 'UPSC Civil Services 2026',
      organizationName: 'UPSC',
      description: 'Exam',
      totalVacancies: 1056,
      qualifications: [{ name: 'Graduation', isMandatory: true }],
      minimumAge: 21,
      maximumAge: 32,
      jobType: JobTypeEnum.PERMANENT,
      employmentType: EmploymentType.FULL_TIME,
      categoryName: 'Civil Services',
      locationSummary: 'All India',
      applicationStartDate: '2026-09-01T00:00:00.000Z',
      applicationEndDate: '2026-09-25T23:59:59.000Z', // Changed!
      officialNotificationUrl: 'https://upsc.gov.in/notice.pdf',
      evidence: [],
      confidenceScore: 1.0,
    };

    const changes = ChangeDetectionEngine.compare(existing, extracted);
    assert.equal(changes.length, 1);
    assert.equal(changes[0].changeType, ChangeType.DEADLINE_CHANGED);
    assert.equal(changes[0].oldValue, '2026-09-20T23:59:59.000Z');
    assert.equal(changes[0].newValue, '2026-09-25T23:59:59.000Z');
  });

  test('detects VACANCY_CHANGED when vacancies increase or decrease', () => {
    const existing = { totalVacancies: 1000 };
    const extracted = {
      title: 'SSC CGL 2026',
      organizationName: 'SSC',
      description: 'Exam',
      totalVacancies: 1200,
      qualifications: [{ name: 'Graduation', isMandatory: true }],
      minimumAge: 18,
      maximumAge: 30,
      jobType: JobTypeEnum.PERMANENT,
      employmentType: EmploymentType.FULL_TIME,
      categoryName: 'SSC',
      locationSummary: 'All India',
      applicationStartDate: '2026-09-01T00:00:00.000Z',
      applicationEndDate: '2026-09-30T23:59:59.000Z',
      officialNotificationUrl: 'https://ssc.gov.in/cgl.pdf',
      evidence: [],
      confidenceScore: 1.0,
    };

    const changes = ChangeDetectionEngine.compare(existing, extracted);
    assert.equal(changes.length, 1);
    assert.equal(changes[0].changeType, ChangeType.VACANCY_CHANGED);
    assert.equal(changes[0].oldValue, 1000);
    assert.equal(changes[0].newValue, 1200);
  });
});

describe('DeduplicationEngine', () => {
  const existingJob = {
    id: 'job-existing-01',
    slug: 'upsc-civil-services-2026',
    title: 'UPSC Civil Services Examination 2026',
    shortTitle: 'UPSC CSE 2026',
    referenceNumber: '05/2026-CSP',
    organizationId: 'org-upsc',
    organizationName: 'Union Public Service Commission',
    description: 'Recruitment',
    totalVacancies: 1056,
    minimumAge: 21,
    maximumAge: 32,
    jobType: JobTypeEnum.PERMANENT,
    employmentType: EmploymentType.FULL_TIME,
    locationSummary: 'All India',
    categoryId: 'cat-civil-services',
    categoryName: 'Civil Services',
    applicationStartDate: '2026-09-01T00:00:00.000Z',
    applicationEndDate: '2026-10-05T18:00:00.000Z',
    officialNotificationUrl: 'https://www.upsc.gov.in/notice-csp-2026.pdf',
    status: JobLifecycleStatus.APPLICATION_OPEN,
    verificationStatus: VerificationStatus.VERIFIED,
    confidenceLevel: 1.0,
    sourceId: 'src-upsc',
    sourceName: 'UPSC',
    sourceUrl: 'https://upsc.gov.in',
    publishedAt: '2026-09-01T00:00:00.000Z',
    lastUpdatedAt: '2026-09-01T00:00:00.000Z',
    lastVerifiedAt: '2026-09-01T00:00:00.000Z',
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  };

  test('flags exact duplicate on matching reference number', () => {
    const newlyDiscovered = {
      title: 'Civil Services Exam 2026 Notice',
      referenceNumber: '05/2026-CSP',
      organizationName: 'Union Public Service Commission',
      description: 'Civil services notification',
      totalVacancies: 1056,
      qualifications: [{ name: 'Graduate', isMandatory: true }],
      minimumAge: 21,
      maximumAge: 32,
      jobType: JobTypeEnum.PERMANENT,
      employmentType: EmploymentType.FULL_TIME,
      categoryName: 'Civil Services',
      locationSummary: 'All India',
      applicationStartDate: '2026-09-01T00:00:00.000Z',
      applicationEndDate: '2026-10-05T18:00:00.000Z',
      officialNotificationUrl: 'https://www.upsc.gov.in/notice-csp-2026.pdf',
      evidence: [],
      confidenceScore: 0.95,
    };

    const match = DeduplicationEngine.findDuplicate(newlyDiscovered, [existingJob]);
    assert.equal(match.isDuplicate, true);
    assert.equal(match.matchedJobId, 'job-existing-01');
  });

  test('does not flag distinct recruitment notices', () => {
    const differentJob = {
      title: 'Indian Forest Service Examination 2026',
      referenceNumber: '06/2026-IFS',
      organizationName: 'Union Public Service Commission',
      description: 'Forest service notification',
      totalVacancies: 150,
      qualifications: [{ name: 'B.Sc Forestry / Botany', isMandatory: true }],
      minimumAge: 21,
      maximumAge: 32,
      jobType: JobTypeEnum.PERMANENT,
      employmentType: EmploymentType.FULL_TIME,
      categoryName: 'Civil Services',
      locationSummary: 'All India',
      applicationStartDate: '2026-09-01T00:00:00.000Z',
      applicationEndDate: '2026-10-05T18:00:00.000Z',
      officialNotificationUrl: 'https://www.upsc.gov.in/notice-ifs-2026.pdf',
      evidence: [],
      confidenceScore: 0.95,
    };

    const match = DeduplicationEngine.findDuplicate(differentJob, [existingJob]);
    assert.equal(match.isDuplicate, false);
  });
});
