import React from 'react';
import Link from 'next/link';
import { apiClient } from '../../config/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'State Government Jobs 2026 | State PSC & Police Vacancies',
  description: 'Browse government recruitment across 36 Indian States and Union Territories. State PSC, Police, Health, and Education vacancies.',
};

export default async function StatesDirectoryPage() {
  const { data: jobs } = await apiClient.getJobs({ limit: 100 });

  const stateList = [
    { name: 'All India (Central)', slug: 'all-india', count: jobs.filter((j) => j.locationSummary.toLowerCase().includes('all india')).length },
    { name: 'Rajasthan', slug: 'rajasthan', count: jobs.filter((j) => j.stateName === 'Rajasthan' || j.locationSummary.includes('Rajasthan')).length },
    { name: 'Uttar Pradesh', slug: 'uttar-pradesh', count: jobs.filter((j) => j.stateName === 'Uttar Pradesh' || j.locationSummary.includes('UP')).length },
    { name: 'Delhi NCR', slug: 'delhi', count: jobs.filter((j) => j.locationSummary.includes('Delhi')).length },
    { name: 'Bihar', slug: 'bihar', count: 1 },
    { name: 'Madhya Pradesh', slug: 'madhya-pradesh', count: 1 },
    { name: 'Maharashtra', slug: 'maharashtra', count: 1 },
    { name: 'Haryana', slug: 'haryana', count: 1 },
    { name: 'Punjab', slug: 'punjab', count: 1 },
    { name: 'Gujarat', slug: 'gujarat', count: 1 },
    { name: 'Karnataka', slug: 'karnataka', count: 1 },
    { name: 'Tamil Nadu', slug: 'tamil-nadu', count: 1 },
    { name: 'West Bengal', slug: 'west-bengal', count: 1 },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">State Government Jobs Directory</h1>
        <p className="text-xs text-slate-600 mt-1">
          Explore recruitment notifications across State Public Service Commissions (PSCs), Police Boards, and High Courts.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stateList.map((st) => (
          <Link
            key={st.slug}
            href={`/states/${st.slug}`}
            className="p-4 bg-white border border-slate-200 hover:border-indigo-400 rounded transition shadow-sm block group"
          >
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-700">{st.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{st.count} Active Recruitments</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
