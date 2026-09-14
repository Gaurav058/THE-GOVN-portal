import React from 'react';
import { apiClient } from '../../config/api';
import { JobCard } from '../../components/JobCard';
import { EmptyState } from '../../components/EmptyState';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Latest Government Jobs 2026 | New Official Recruitment Vacancies',
  description: 'Browse all active government recruitment notifications recently released by UPSC, SSC, RRB, Banking, and State Commissions.',
};

export default async function LatestJobsPage() {
  const jobs = await apiClient.getLatestJobs(30);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Latest Government Jobs (September 2026)</h1>
        <p className="text-xs text-slate-600 mt-1">
          Chronological listing of verified official recruitment notifications across Central Ministries and State Departments.
        </p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          message={(jobs as any).isError ? "Government job data is temporarily unavailable." : "No verified recruitments currently found in this category."}
          subMessage={(jobs as any).isError ? "Please try again shortly. We are reconnecting to official gazette data streams." : "Check back shortly or explore closing vacancies and other categories below."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
