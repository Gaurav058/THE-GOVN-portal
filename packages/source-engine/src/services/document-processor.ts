import { SourceDocumentPayload, DocumentType } from '@govn/types';
import { RawSnapshotStore } from '../snapshot-store';

export interface ProcessedDocumentResult {
  fileHash: string;
  documentType: DocumentType;
  documentTitle: string;
  documentUrl: string;
  extractedTextSnippets: string[];
  pageCount?: number;
}

export class DocumentProcessor {
  /**
   * Processes an official recruitment document (PDF or HTML attachment).
   */
  public static async processDocument(payload: SourceDocumentPayload): Promise<ProcessedDocumentResult> {
    const hash = payload.fileBuffer
      ? RawSnapshotStore.calculateHash(payload.fileBuffer as any)
      : RawSnapshotStore.calculateHash(payload.documentUrl);

    // In production with pdf-parse / tesseract / OCR, text layers are extracted.
    // For now we extract structured document metadata and preserve hash traceability.
    return {
      fileHash: hash,
      documentType: payload.documentType,
      documentTitle: payload.documentTitle,
      documentUrl: payload.documentUrl,
      extractedTextSnippets: [
        `Document Title: ${payload.documentTitle}`,
        `Document URL: ${payload.documentUrl}`,
        `Verified SHA-256: ${hash}`,
      ],
      pageCount: 1,
    };
  }
}
