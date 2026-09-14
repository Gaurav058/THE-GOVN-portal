import { JobModel, JobLifecycleStatus } from '@govn/types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:4000/api/v1';

export interface QueryJobsParams {
  query?: string;
  category?: string;
  qualification?: string;
  state?: string;
  status?: JobLifecycleStatus;
  limit?: number;
  offset?: number;
}

export class WebApiClient {
  private baseUrl: string;

  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async get<T>(endpoint: string, fallback: T): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
      const res = await fetch(url, {
        next: { revalidate: 60 },
      });
      if (!res.ok) {
        return fallback;
      }
      const data = await res.json();
      return data;
    } catch {
      return fallback;
    }
  }

  public async getJobs(params: QueryJobsParams = {}): Promise<{ total: number; count: number; data: JobModel[]; jobs: JobModel[] }> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set('query', params.query);
    if (params.category) searchParams.set('category', params.category);
    if (params.qualification) searchParams.set('qualification', params.qualification);
    if (params.state) searchParams.set('state', params.state);
    if (params.status) searchParams.set('status', params.status);
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.offset) searchParams.set('offset', params.offset.toString());

    const qs = searchParams.toString();
    const endpoint = `/jobs${qs ? `?${qs}` : ''}`;
    const res = await this.get<{ success: boolean; total: number; count: number; data: JobModel[] }>(
      endpoint,
      { success: true, total: 0, count: 0, data: [] }
    );
    const data = res.data || [];
    return { total: res.total || 0, count: res.count || 0, data, jobs: data };
  }

  public async getJobBySlug(slug: string): Promise<JobModel | null> {
    const res = await this.get<{ success: boolean; data?: JobModel }>(`/jobs/${slug}`, { success: false });
    return res.data || null;
  }

  public async getLatestJobs(limit = 10): Promise<JobModel[]> {
    const res = await this.get<{ success: boolean; count: number; data: JobModel[] }>(
      `/jobs/latest?limit=${limit}`,
      { success: true, count: 0, data: [] }
    );
    return res.data || [];
  }

  public async getClosingSoonJobs(limit = 10): Promise<JobModel[]> {
    const res = await this.get<{ success: boolean; count: number; data: JobModel[] }>(
      `/jobs/closing-soon?limit=${limit}`,
      { success: true, count: 0, data: [] }
    );
    return res.data || [];
  }

  public async getStates(): Promise<Array<{ name: string; slug: string; activeJobsCount: number }>> {
    const res = await this.get<{ success: boolean; data: Array<{ name: string; slug: string; activeJobsCount: number }> }>(
      '/states',
      { success: true, data: [] }
    );
    return res.data || [];
  }

  public async getExams(): Promise<any[]> {
    const res = await this.get<{ success: boolean; data: any[] }>('/exams', { success: true, data: [] });
    return res.data || [];
  }

  public async getAdmitCards(): Promise<any[]> {
    const res = await this.get<{ success: boolean; data: any[] }>('/admit-cards', { success: true, data: [] });
    return res.data || [];
  }

  public async getResults(): Promise<any[]> {
    const res = await this.get<{ success: boolean; data: any[] }>('/results', { success: true, data: [] });
    return res.data || [];
  }
}

export const apiClient = new WebApiClient();
