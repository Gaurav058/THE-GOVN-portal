import { ExtractedJobData, JobModel } from '@govn/types';

export interface DeduplicationMatch {
  isDuplicate: boolean;
  confidence: number;
  matchedJobId?: string;
  reason?: string;
}

export class DeduplicationEngine {
  /**
   * Evaluates whether newly extracted data matches an existing database recruitment notice.
   */
  public static findDuplicate(
    extracted: ExtractedJobData,
    existingJobs: JobModel[]
  ): DeduplicationMatch {
    for (const existing of existingJobs) {
      // 1. Exact Reference Number match (highest confidence)
      if (
        extracted.referenceNumber &&
        existing.referenceNumber &&
        this.normalizeRef(extracted.referenceNumber) === this.normalizeRef(existing.referenceNumber)
      ) {
        return {
          isDuplicate: true,
          confidence: 1.0,
          matchedJobId: existing.id,
          reason: `Exact match on official reference number (${extracted.referenceNumber})`,
        };
      }

      // 2. Exact Official Notification PDF URL match
      if (
        extracted.officialNotificationUrl &&
        existing.officialNotificationUrl &&
        extracted.officialNotificationUrl.toLowerCase() === existing.officialNotificationUrl.toLowerCase()
      ) {
        return {
          isDuplicate: true,
          confidence: 0.95,
          matchedJobId: existing.id,
          reason: 'Identical official notification document URL',
        };
      }

      // 3. Organization + Title similarity + Close application end dates
      const orgMatch = this.normalizeText(extracted.organizationName) === this.normalizeText(existing.organizationName);
      const titleSim = this.computeSimilarity(extracted.title, existing.title);

      if (orgMatch && titleSim > 0.8) {
        return {
          isDuplicate: true,
          confidence: titleSim,
          matchedJobId: existing.id,
          reason: `High fuzzy similarity (${Math.round(titleSim * 100)}%) with existing job "${existing.title}"`,
        };
      }
    }

    return {
      isDuplicate: false,
      confidence: 0.0,
    };
  }

  private static normalizeRef(ref: string): string {
    return ref.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  private static normalizeText(text: string): string {
    return text.toLowerCase().trim();
  }

  private static computeSimilarity(s1: string, s2: string): number {
    const w1 = new Set(this.normalizeText(s1).split(/\s+/));
    const w2 = new Set(this.normalizeText(s2).split(/\s+/));
    const intersection = new Set([...w1].filter((x) => w2.has(x)));
    const union = new Set([...w1, ...w2]);
    return union.size === 0 ? 0 : intersection.size / union.size;
  }
}
