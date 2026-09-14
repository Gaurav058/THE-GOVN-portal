import React from 'react';
import { apiClient } from '../../config/api';
import { JobCard } from '../../components/JobCard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Closing Soon Government Jobs 2026 | Application Deadline Alert Board',
  description: 'Urgent reminder board for government job applications closing in the next few days. Apply before server cutoff deadlines.',
};

export default async function ClosingSoonPage() {
  const jobs = await apiClient.getClosingSoonJobs(30);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-600 animate-pulse"></span>
          <h1 className="text-2xl font-bold text-slate-900">Application Deadlines: Closing Soon</h1>
        </div>
        <p className="text-xs text-slate-600 mt-1">
          Recruitments closing within the immediate cycle. Avoid last-minute server congestion by submitting applications early.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
