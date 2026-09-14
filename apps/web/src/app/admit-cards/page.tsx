import React from 'react';
import Link from 'next/link';
import { apiClient } from '../../config/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admit Cards & Hall Tickets 2026 | Direct Download Links',
  description: 'Download hall tickets and e-Admit cards for upcoming government examinations across UPSC, SSC, RRB, and Banking portals.',
};

export default async function AdmitCardsPage() {
  const { data: jobs } = await apiClient.getJobs({ limit: 100 });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Admit Cards & Hall Ticket Tracker (2026)</h1>
        <p className="text-xs text-slate-600 mt-1">
          Direct access to commission login portals for hall ticket download. Have your registration ID and date of birth ready.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="p-3">Issuing Commission</th>
              <th className="p-3">Recruitment Name</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Download Portal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.slice(0, 6).map((job) => (
              <tr key={job.id} className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-800">{job.organizationName}</td>
                <td className="p-3 font-bold text-slate-900">
                  <Link href={`/jobs/${job.slug}`} className="hover:text-indigo-700">
                    {job.shortTitle}
                  </Link>
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold text-[10px]">
                    Release Notice Active
                  </span>
                </td>
                <td className="p-3 text-right">
                  <a
                    href={job.officialApplyUrl || job.officialNotificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-slate-900 text-white hover:bg-indigo-700 px-3 py-1 rounded font-semibold transition"
                  >
                    Candidate Login &nearr;
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
