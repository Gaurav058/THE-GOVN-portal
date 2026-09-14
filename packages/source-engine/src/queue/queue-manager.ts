import { EventEmitter } from 'events';

export interface QueueJob<T = unknown> {
  id: string;
  name: string;
  data: T;
  attemptCount: number;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

export type JobHandler<T = unknown> = (job: QueueJob<T>) => Promise<void>;

export class IngestionQueueManager {
  private static queues: Map<string, IngestionQueueManager> = new Map();
  private emitter = new EventEmitter();
  private jobs: QueueJob[] = [];
  private handlers: Map<string, JobHandler> = new Map();

  constructor(public readonly queueName: string) {}

  public static getQueue(name: string): IngestionQueueManager {
    if (!this.queues.has(name)) {
      this.queues.set(name, new IngestionQueueManager(name));
    }
    return this.queues.get(name)!;
  }

  public async add<T>(jobName: string, data: T): Promise<QueueJob<T>> {
    const job: QueueJob<T> = {
      id: `job-${this.queueName}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: jobName,
      data,
      attemptCount: 0,
      status: 'QUEUED',
      createdAt: new Date().toISOString(),
    };

    this.jobs.push(job as QueueJob);

    // Process asynchronously
    setImmediate(() => this.processNext());

    return job;
  }

  public process(jobName: string, handler: JobHandler): void {
    this.handlers.set(jobName, handler);
    setImmediate(() => this.processNext());
  }

  private async processNext(): Promise<void> {
    const nextJob = this.jobs.find((j) => j.status === 'QUEUED');
    if (!nextJob) return;

    const handler = this.handlers.get(nextJob.name);
    if (!handler) return;

    nextJob.status = 'RUNNING';
    nextJob.startedAt = new Date().toISOString();
    nextJob.attemptCount++;

    try {
      await handler(nextJob);
      nextJob.status = 'COMPLETED';
      nextJob.completedAt = new Date().toISOString();
    } catch (err) {
      nextJob.status = 'FAILED';
      nextJob.error = (err as Error).message;
    }

    setImmediate(() => this.processNext());
  }

  public getJobs(): QueueJob[] {
    return this.jobs;
  }
}
