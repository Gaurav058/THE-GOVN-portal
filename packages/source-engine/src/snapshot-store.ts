import * as crypto from 'crypto';

export interface SnapshotRecord {
  id: string;
  sourceId: string;
  url: string;
  httpStatus: number;
  payloadHash: string;
  rawPayload: string;
  fetchedAt: string;
}

export class RawSnapshotStore {
  private static inMemoryStore: Map<string, SnapshotRecord> = new Map();

  /**
   * Generates a SHA-256 hash of raw document or HTML payload for legal auditability.
   */
  public static calculateHash(content: string | Buffer): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Archives a raw snapshot payload.
   */
  public static saveSnapshot(sourceId: string, url: string, rawPayload: string, httpStatus = 200): SnapshotRecord {
    const payloadHash = this.calculateHash(rawPayload);
    const id = `snap-${Date.now()}-${payloadHash.slice(0, 8)}`;

    const record: SnapshotRecord = {
      id,
      sourceId,
      url,
      httpStatus,
      payloadHash,
      rawPayload,
      fetchedAt: new Date().toISOString(),
    };

    this.inMemoryStore.set(id, record);
    return record;
  }

  public static getSnapshot(id: string): SnapshotRecord | undefined {
    return this.inMemoryStore.get(id);
  }

  public static getAllSnapshots(): SnapshotRecord[] {
    return Array.from(this.inMemoryStore.values());
  }
}
