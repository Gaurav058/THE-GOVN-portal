import React from 'react';
import Link from 'next/link';
import { apiClient } from '../../../config/api';
import { JobCard } from '../../../components/JobCard';

import { EmptyState } from '../../../components/EmptyState';

export const dynamic = 'force-dynamic';

export default async function StateJobListingPage({ params }: { params: { state: string } }) {
  const stateNormalized = params.state.replace(/-/g, ' ');
  const result = await apiClient.getJobs({ state: params.state });

  return (
    <div className="space-y-6">
      <nav className="text-xs text-slate-500 flex items-center space-x-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/states" className="hover:underline">States</Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold capitalize">{stateNormalized}</span>
      </nav>

      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 capitalize">
          Government Jobs in {stateNormalized} (2026)
        </h1>
        <p className="text-xs text-slate-600 mt-1">
          Showing active vacancies located in {stateNormalized} and All India central vacancies open to residents.
        </p>
      </div>

      {result.data.length === 0 ? (
        <EmptyState
          message={`No verified recruitments currently found for ${stateNormalized}.`}
          subMessage="Explore central All India vacancies or browse other state recruitment boards below."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.data.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
