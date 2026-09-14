import { ExtractedJobData, DetectedChange, ChangeType } from '@govn/types';

export class ChangeDetectionEngine {
  /**
   * Diffs an existing record with newly extracted data to detect official modifications (e.g. deadline extension).
   */
  public static compare(
    existing: Partial<ExtractedJobData>,
    extracted: ExtractedJobData
  ): DetectedChange[] {
    const changes: DetectedChange[] = [];
    const now = new Date().toISOString();

    // 1. Deadline Changed
    if (
      existing.applicationEndDate &&
      extracted.applicationEndDate &&
      existing.applicationEndDate !== extracted.applicationEndDate
    ) {
      changes.push({
        field: 'applicationEndDate',
        oldValue: existing.applicationEndDate,
        newValue: extracted.applicationEndDate,
        changeType: ChangeType.DEADLINE_CHANGED,
        detectedAt: now,
        evidenceSnippet: `Deadline changed from ${existing.applicationEndDate} to ${extracted.applicationEndDate}`,
      });
    }

    // 2. Vacancy Count Changed
    if (
      existing.totalVacancies !== undefined &&
      extracted.totalVacancies !== undefined &&
      existing.totalVacancies !== extracted.totalVacancies
    ) {
      changes.push({
        field: 'totalVacancies',
        oldValue: existing.totalVacancies,
        newValue: extracted.totalVacancies,
        changeType: ChangeType.VACANCY_CHANGED,
        detectedAt: now,
        evidenceSnippet: `Vacancies updated from ${existing.totalVacancies} to ${extracted.totalVacancies}`,
      });
    }

    // 3. Application Fee Changed
    if (
      existing.feeGeneral !== undefined &&
      extracted.feeGeneral !== undefined &&
      existing.feeGeneral !== extracted.feeGeneral
    ) {
      changes.push({
        field: 'feeGeneral',
        oldValue: existing.feeGeneral,
        newValue: extracted.feeGeneral,
        changeType: ChangeType.FEE_CHANGED,
        detectedAt: now,
        evidenceSnippet: `General category fee updated from ${existing.feeGeneral} to ${extracted.feeGeneral}`,
      });
    }

    // 4. Exam Date Rescheduled
    if (
      existing.examStartDate &&
      extracted.examStartDate &&
      existing.examStartDate !== extracted.examStartDate
    ) {
      changes.push({
        field: 'examStartDate',
        oldValue: existing.examStartDate,
        newValue: extracted.examStartDate,
        changeType: ChangeType.EXAM_DATE_RESCHEDULED,
        detectedAt: now,
        evidenceSnippet: `Exam date changed from ${existing.examStartDate} to ${extracted.examStartDate}`,
      });
    }

    // 5. Official Apply URL updated
    if (
      existing.officialApplyUrl &&
      extracted.officialApplyUrl &&
      existing.officialApplyUrl !== extracted.officialApplyUrl
    ) {
      changes.push({
        field: 'officialApplyUrl',
        oldValue: existing.officialApplyUrl,
        newValue: extracted.officialApplyUrl,
        changeType: ChangeType.APPLICATION_LINK_UPDATED,
        detectedAt: now,
        evidenceSnippet: `Official application portal link changed`,
      });
    }

    return changes;
  }
}
