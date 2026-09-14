import React from 'react';
import Link from 'next/link';
import { apiClient } from '../../config/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'State Government Jobs 2026 | State PSC & Police Vacancies',
  description: 'Browse government recruitment across 36 Indian States and Union Territories. State PSC, Police, Health, and Education vacancies.',
};

export default async function StatesDirectoryPage() {
  const states = await apiClient.getStates();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">State Government Jobs Directory</h1>
        <p className="text-xs text-slate-600 mt-1">
          Explore recruitment notifications across State Public Service Commissions (PSCs), Police Boards, and High Courts.
        </p>
      </div>

      {states.length === 0 ? (
        <div className="p-8 text-center bg-white rounded border border-slate-200">
          <p className="text-slate-700 font-semibold text-sm">No state-specific vacancies currently indexed.</p>
          <Link href="/latest-government-jobs" className="mt-3 inline-block text-xs bg-slate-900 text-white px-4 py-2 rounded">
            View All Central & State Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {states.map((st) => (
            <Link
              key={st.slug}
              href={`/states/${st.slug}`}
              className="p-4 bg-white border border-slate-200 hover:border-indigo-400 rounded transition shadow-sm block group"
            >
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700">{st.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{st.activeJobsCount} Active {st.activeJobsCount === 1 ? 'Recruitment' : 'Recruitments'}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
