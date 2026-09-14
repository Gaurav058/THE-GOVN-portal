import React from 'react';
import Link from 'next/link';
import { adminApiClient } from '../config/api';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [metrics, pendingReviews, allJobs] = await Promise.all([
    adminApiClient.getAnalytics(),
    adminApiClient.getPendingVerification(),
    adminApiClient.getAllJobs(),
  ]);
  const publishedJobs = allJobs.slice(0, 8);

  const cards = [
    { label: 'Total Jobs in DB', value: metrics.totalJobs, color: 'border-l-4 border-indigo-600' },
    { label: 'Published & Live', value: metrics.published, color: 'border-l-4 border-emerald-600' },
    { label: 'Pending Verification', value: metrics.pendingVerification, color: 'border-l-4 border-amber-500' },
    { label: 'Closing Today', value: metrics.closingToday, color: 'border-l-4 border-rose-600' },
    { label: 'Closing in 3 Days', value: metrics.closingIn3Days, color: 'border-l-4 border-amber-600' },
    { label: 'Closing in 7 Days', value: metrics.closingIn7Days, color: 'border-l-4 border-blue-500' },
    { label: 'New Sources Monitored', value: metrics.newSources, color: 'border-l-4 border-sky-500' },
    { label: 'Recently Updated', value: metrics.recentlyUpdated, color: 'border-l-4 border-purple-500' },
    { label: 'Broken Source Links', value: metrics.brokenSourceLinks, color: 'border-l-4 border-slate-400' },
    { label: 'Failed Ingestions', value: metrics.failedIngestions, color: 'border-l-4 border-red-400' },
    { label: 'Duplicate Notices Detected', value: metrics.duplicates, color: 'border-l-4 border-orange-400' },
    { label: 'Conflicts Pending Verifier', value: metrics.conflicts, color: 'border-l-4 border-rose-700' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Intelligence Operations Dashboard</h1>
        <p className="text-sm text-slate-600 mt-1">
          Real-time oversight of official recruitment ingestion, invariant validation, and human verification queues.
        </p>
      </div>

      {/* Operational Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className={`bg-white p-4 rounded shadow-sm border border-slate-200 ${c.color}`}>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Verification Queue Preview */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="font-semibold text-slate-900">Pending Human Verification Queue</h2>
            <p className="text-xs text-slate-500">Recruitment notices extracted by adapters awaiting verification before publishing.</p>
          </div>
          <Link
            href="/verification"
            className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded transition"
          >
            Open Split-Screen Reviewer
          </Link>
        </div>

        {pendingReviews.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            <span className="inline-block text-emerald-600 font-bold mb-1">Queue Clear</span>
            <p>All extracted notices have been human-verified and published to the live portal.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingReviews.map((item) => (
              <div key={item.jobId} className="p-4 flex items-center justify-between hover:bg-slate-50">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">{item.title}</h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span>Org: {item.organization}</span>
                    <span>&bull;</span>
                    <span>Vacancies: {item.totalVacancies}</span>
                    <span>&bull;</span>
                    <span>Last Date: {item.applicationEndDate}</span>
                  </div>
                </div>
                <Link
                  href={`/verification?jobId=${item.jobId}`}
                  className="text-xs bg-amber-50 text-amber-900 border border-amber-300 font-semibold px-3 py-1.5 rounded hover:bg-amber-100"
                >
                  Inspect & Verify
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recently Published Jobs */}
      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900">Active Published Government Vacancies</h2>
          <span className="text-xs text-slate-500">Serving live to public web portal</span>
        </div>
        <div className="divide-y divide-slate-100">
          {publishedJobs.map((job) => (
            <div key={job.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {job.status}
                  </span>
                  <span className="font-semibold text-sm text-slate-900">{job.title}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {job.organizationName} &bull; Vacancies: <strong className="text-slate-800">{job.totalVacancies.toLocaleString()}</strong> &bull; Verified By: {job.verifiedByName || 'Official Desk'}
                </p>
              </div>
              <div className="text-right text-xs">
                <p className="text-slate-500">Closing Date</p>
                <p className="font-semibold text-slate-800">{new Date(job.applicationEndDate).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
