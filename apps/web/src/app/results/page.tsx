import React from 'react';
import Link from 'next/link';
import { apiClient } from '../../config/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Government Exam Results 2026 | Cut-Off Marks & Merit Lists',
  description: 'Track declared results for UPSC, SSC, Railways, Banking, Police, and State Commissions. Official scorecards and merit lists.',
};

export default async function ResultsPage() {
  const { data: jobs } = await apiClient.getJobs({ limit: 100 });

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Government Exam Results & Scorecards (2026)</h1>
        <p className="text-xs text-slate-600 mt-1">
          Direct links to official merit lists, category cut-off marks, and candidate scorecards released by commissions.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="p-3">Examination Body</th>
              <th className="p-3">Recruitment Title</th>
              <th className="p-3">Result Type</th>
              <th className="p-3 text-right">Official Link</th>
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
                  <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-semibold text-[10px]">
                    Provisional / Final List
                  </span>
                </td>
                <td className="p-3 text-right">
                  <a
                    href={job.officialNotificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded font-semibold transition"
                  >
                    Check Gazette &nearr;
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
