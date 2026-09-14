import { ExtractedJobData, ValidationResult, ValidationIssue } from '@govn/types';
import { ExtractedJobDataSchema } from './schemas/job.schema';

export class InvariantValidationEngine {
  /**
   * Validates an extracted job record against core government job domain invariants.
   */
  public static validate(data: unknown): ValidationResult {
    const issues: ValidationIssue[] = [];

    // 1. Zod Schema parse
    const parseResult = ExtractedJobDataSchema.safeParse(data);
    if (!parseResult.success) {
      for (const error of parseResult.error.issues) {
        issues.push({
          field: error.path.join('.'),
          message: error.message,
          severity: 'ERROR',
        });
      }
      return { isValid: false, issues };
    }

    const job = parseResult.data;

    // 2. Invariant: application_end_date >= application_start_date
    const startDate = new Date(job.applicationStartDate);
    const endDate = new Date(job.applicationEndDate);

    if (isNaN(startDate.getTime())) {
      issues.push({
        field: 'applicationStartDate',
        message: 'Application start date is an invalid date',
        severity: 'ERROR',
      });
    }

    if (isNaN(endDate.getTime())) {
      issues.push({
        field: 'applicationEndDate',
        message: 'Application end date is an invalid date',
        severity: 'ERROR',
      });
    }

    if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
      if (endDate.getTime() < startDate.getTime()) {
        issues.push({
          field: 'applicationEndDate',
          message: `Application end date (${job.applicationEndDate}) cannot be before start date (${job.applicationStartDate})`,
          severity: 'ERROR',
        });
      }
    }

    // 3. Invariant: exam_date >= application_start_date
    if (job.examStartDate) {
      const examDate = new Date(job.examStartDate);
      if (!isNaN(examDate.getTime()) && !isNaN(startDate.getTime())) {
        if (examDate.getTime() < startDate.getTime()) {
          issues.push({
            field: 'examStartDate',
            message: `Exam start date (${job.examStartDate}) cannot precede application start date (${job.applicationStartDate})`,
            severity: 'ERROR',
          });
        }
      }
    }

    // 4. Invariant: minimum_age <= maximum_age
    if (job.minimumAge > job.maximumAge) {
      issues.push({
        field: 'minimumAge',
        message: `Minimum age (${job.minimumAge}) cannot be greater than maximum age (${job.maximumAge})`,
        severity: 'ERROR',
      });
    }

    // 5. Invariant: vacancy_count >= 0
    if (job.totalVacancies < 0) {
      issues.push({
        field: 'totalVacancies',
        message: 'Total vacancies cannot be negative',
        severity: 'ERROR',
      });
    }

    // 6. Invariant: Salary bounds
    if (job.salaryMin !== undefined && job.salaryMax !== undefined) {
      if (job.salaryMin > job.salaryMax) {
        issues.push({
          field: 'salaryMin',
          message: `Minimum salary (${job.salaryMin}) cannot exceed maximum salary (${job.salaryMax})`,
          severity: 'ERROR',
        });
      }
    }

    // 7. Invariant: HTTPS URLs
    if (job.officialNotificationUrl && !job.officialNotificationUrl.startsWith('https://')) {
      issues.push({
        field: 'officialNotificationUrl',
        message: 'Official notification link must use secure HTTPS',
        severity: 'ERROR',
      });
    }

    if (job.officialApplyUrl && !job.officialApplyUrl.startsWith('https://')) {
      issues.push({
        field: 'officialApplyUrl',
        message: 'Official apply link must use secure HTTPS',
        severity: 'ERROR',
      });
    }

    return {
      isValid: issues.filter((i) => i.severity === 'ERROR').length === 0,
      issues,
    };
  }

  /**
   * Additional check prior to promoting a record to PUBLISHED.
   * Required fields cannot be empty.
   */
  public static validateForPublication(data: unknown): ValidationResult {
    const baseResult = this.validate(data);
    const issues = [...baseResult.issues];

    const job = data as Record<string, unknown>;

    if (!job.officialNotificationUrl) {
      issues.push({
        field: 'officialNotificationUrl',
        message: 'Cannot publish recruitment notice without an official notification URL',
        severity: 'ERROR',
      });
    }

    if (!job.totalVacancies && job.totalVacancies !== 0) {
      issues.push({
        field: 'totalVacancies',
        message: 'Total vacancy count is required for publication',
        severity: 'ERROR',
      });
    }

    return {
      isValid: issues.filter((i) => i.severity === 'ERROR').length === 0,
      issues,
    };
  }
}
