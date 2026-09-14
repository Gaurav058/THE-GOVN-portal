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

  private async get<T>(endpoint: string, fallback: T, retries = 1): Promise<T & { isError?: boolean }> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const res = await fetch(url, {
          signal: controller.signal,
          next: { revalidate: 60 },
          headers: {
            'Accept': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          if (attempt === retries) {
            console.warn(`[WebApiClient] Non-200 response (${res.status}) from ${url}`);
            const errFallback = Array.isArray(fallback) ? [...(fallback as any[])] : { ...fallback };
            (errFallback as any).isError = true;
            return errFallback as any;
          }
          continue;
        }

        const data = await res.json();
        return data;
      } catch (err: any) {
        clearTimeout(timeoutId);
        if (attempt === retries) {
          console.warn(`[WebApiClient] Failed to fetch from ${url}: ${err?.message || err}`);
          const errFallback = Array.isArray(fallback) ? [...(fallback as any[])] : { ...fallback };
          (errFallback as any).isError = true;
          return errFallback as any;
        }
      }
    }

    const errFallback = Array.isArray(fallback) ? [...(fallback as any[])] : { ...fallback };
    (errFallback as any).isError = true;
    return errFallback as any;
  }

  public async getJobs(params: QueryJobsParams = {}): Promise<{
    total: number;
    count: number;
    data: JobModel[];
    jobs: JobModel[];
    isError: boolean;
  }> {
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
      { success: false, total: 0, count: 0, data: [] }
    );
    const data = res.data || [];
    const isError = !!(res as any).isError || !res.success;
    (data as any).isError = isError;
    return { total: res.total || 0, count: res.count || 0, data, jobs: data, isError };
  }

  public async getJobBySlug(slug: string): Promise<JobModel | null> {
    const res = await this.get<{ success: boolean; data?: JobModel }>(`/jobs/${slug}`, { success: false });
    return res.data || null;
  }

  public async getLatestJobs(limit = 10): Promise<JobModel[]> {
    const res = await this.get<{ success: boolean; count: number; data: JobModel[] }>(
      `/jobs/latest?limit=${limit}`,
      { success: false, count: 0, data: [] }
    );
    const data = res.data || [];
    (data as any).isError = !!(res as any).isError || !res.success;
    return data;
  }

  public async getClosingSoonJobs(limit = 10, days = 14): Promise<JobModel[]> {
    const res = await this.get<{ success: boolean; count: number; data: JobModel[] }>(
      `/jobs/closing-soon?limit=${limit}&days=${days}`,
      { success: false, count: 0, data: [] }
    );
    const data = res.data || [];
    (data as any).isError = !!(res as any).isError || !res.success;
    return data;
  }

  public async getFilters(): Promise<{
    categories: string[];
    qualifications: string[];
    states: string[];
    totalPublishedJobs: number;
  }> {
    const res = await this.get<{
      success: boolean;
      data?: {
        categories: string[];
        qualifications: string[];
        states: string[];
        totalPublishedJobs: number;
      };
    }>('/jobs/filters', {
      success: true,
      data: { categories: [], qualifications: [], states: [], totalPublishedJobs: 0 },
    });
    return (
      res.data || {
        categories: [],
        qualifications: [],
        states: [],
        totalPublishedJobs: 0,
      }
    );
  }

  public async searchJobs(query: string): Promise<{ total: number; data: JobModel[] }> {
    const res = await this.get<{ success: boolean; query: string; total: number; data: JobModel[] }>(
      `/jobs/search?q=${encodeURIComponent(query)}`,
      { success: true, query, total: 0, data: [] }
    );
    return { total: res.total || 0, data: res.data || [] };
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
