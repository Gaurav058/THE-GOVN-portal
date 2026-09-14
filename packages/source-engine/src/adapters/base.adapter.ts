import {
  ISourceAdapter,
  SourceTrustLevel,
  RawListing,
  RawJobDetail,
  SourceDocumentPayload,
  ExtractedJobData,
  ValidationResult,
  DetectedChange,
} from '@govn/types';
import { InvariantValidationEngine } from '@govn/validation';
import { ChangeDetectionEngine } from '../services/change-detector';
import { RawSnapshotStore } from '../snapshot-store';

export abstract class BaseSourceAdapter implements ISourceAdapter {
  abstract readonly sourceId: string;
  abstract readonly sourceName: string;
  abstract readonly trustLevel: SourceTrustLevel;
  abstract readonly baseUrl: string;

  protected defaultHeaders: Record<string, string> = {
    'User-Agent': 'GovnIntelligenceBot/1.0 (+https://govnportal.in/bot; contact@govnportal.in)',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
  };

  abstract fetchListings(): Promise<RawListing[]>;
  abstract fetchDetails(externalId: string, url: string): Promise<RawJobDetail>;
  abstract fetchDocuments(rawDetail: RawJobDetail): Promise<SourceDocumentPayload[]>;
  abstract normalize(rawDetail: RawJobDetail): Promise<ExtractedJobData>;

  async validate(extracted: ExtractedJobData): Promise<ValidationResult> {
    return InvariantValidationEngine.validate(extracted);
  }

  async detectChanges(
    existingData: Partial<ExtractedJobData>,
    extracted: ExtractedJobData
  ): Promise<DetectedChange[]> {
    return ChangeDetectionEngine.compare(existingData, extracted);
  }

  protected async safeFetch(url: string, options: RequestInit = {}): Promise<string> {
    const res = await fetch(url, {
      ...options,
      headers: { ...this.defaultHeaders, ...options.headers },
    });

    if (!res.ok) {
      throw new Error(`[Adapter: ${this.sourceName}] HTTP error ${res.status} for URL: ${url}`);
    }

    const text = await res.text();
    // Save raw snapshot for auditability
    RawSnapshotStore.saveSnapshot(this.sourceId, url, text, res.status);
    return text;
  }
}
