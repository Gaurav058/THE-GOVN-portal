import React from 'react';
import Link from 'next/link';
import { apiClient } from '../../config/api';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Government Exam Calendar 2026 | Scheduled Exam Dates & Shifts',
  description: 'Complete examination calendar for UPSC, SSC, Railways, Banking, and Defence recruitment tests.',
};

export default async function ExamsCalendarPage() {
  const { data: jobs } = await apiClient.getJobs({ limit: 100 });
  const jobsWithExams = jobs.filter((j) => j.examStartDate);

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">National Examination Calendar (2026)</h1>
        <p className="text-xs text-slate-600 mt-1">
          Confirmed examination dates scheduled by national commissions. Synchronized with official commission notices.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="p-3">Conducting Authority</th>
              <th className="p-3">Examination Name</th>
              <th className="p-3">Scheduled Date</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobsWithExams.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-800">{job.organizationName}</td>
                <td className="p-3 font-bold text-slate-900">
                  <Link href={`/jobs/${job.slug}`} className="hover:text-indigo-700">
                    {job.title}
                  </Link>
                </td>
                <td className="p-3 font-semibold text-indigo-900">
                  {new Date(job.examStartDate!).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">
                    Confirmed Schedule
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1 rounded font-semibold transition"
                  >
                    View Notice
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
