import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { InvariantValidationEngine } from './validator';
import { JobTypeEnum, EmploymentType } from '@govn/types';

describe('InvariantValidationEngine', () => {
  const validJobPayload = {
    title: 'UPSC Civil Services Examination 2026',
    organizationName: 'Union Public Service Commission',
    description: 'Recruitment for IAS, IPS, IFS and Central Group A & B services.',
    totalVacancies: 1056,
    qualifications: [{ name: 'Graduate', isMandatory: true }],
    minimumAge: 21,
    maximumAge: 32,
    jobType: JobTypeEnum.PERMANENT,
    employmentType: EmploymentType.FULL_TIME,
    categoryName: 'Civil Services',
    locationSummary: 'All India',
    applicationStartDate: '2026-09-01T00:00:00.000Z',
    applicationEndDate: '2026-10-15T23:59:59.000Z',
    examStartDate: '2026-11-20T09:00:00.000Z',
    officialNotificationUrl: 'https://www.upsc.gov.in/sites/default/files/CSP-2026.pdf',
    officialApplyUrl: 'https://upsconline.nic.in/',
    confidenceScore: 0.98,
  };

  test('passes validation for valid official job data', () => {
    const result = InvariantValidationEngine.validate(validJobPayload);
    assert.equal(result.isValid, true);
    assert.equal(result.issues.length, 0);
  });

  test('fails when applicationEndDate is before applicationStartDate', () => {
    const invalidDatesJob = {
      ...validJobPayload,
      applicationStartDate: '2026-10-15T00:00:00.000Z',
      applicationEndDate: '2026-09-01T00:00:00.000Z',
    };
    const result = InvariantValidationEngine.validate(invalidDatesJob);
    assert.equal(result.isValid, false);
    const hasDateError = result.issues.some((i) => i.field === 'applicationEndDate');
    assert.equal(hasDateError, true);
  });

  test('fails when minimumAge > maximumAge', () => {
    const invalidAgeJob = {
      ...validJobPayload,
      minimumAge: 35,
      maximumAge: 25,
    };
    const result = InvariantValidationEngine.validate(invalidAgeJob);
    assert.equal(result.isValid, false);
    const hasAgeError = result.issues.some((i) => i.field === 'minimumAge');
    assert.equal(hasAgeError, true);
  });

  test('fails when official URLs are not HTTPS', () => {
    const insecureUrlJob = {
      ...validJobPayload,
      officialNotificationUrl: 'http://insecure-domain.gov.in/notice.pdf',
    };
    const result = InvariantValidationEngine.validate(insecureUrlJob);
    assert.equal(result.isValid, false);
    const hasUrlError = result.issues.some((i) => i.field === 'officialNotificationUrl');
    assert.equal(hasUrlError, true);
  });

  test('fails when totalVacancies is negative', () => {
    const negativeVacancyJob = {
      ...validJobPayload,
      totalVacancies: -5,
    };
    const result = InvariantValidationEngine.validate(negativeVacancyJob);
    assert.equal(result.isValid, false);
    const hasVacancyError = result.issues.some((i) => i.field === 'totalVacancies');
    assert.equal(hasVacancyError, true);
  });
});
