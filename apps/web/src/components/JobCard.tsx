import React from 'react';
import Link from 'next/link';
import { JobModel, JobLifecycleStatus } from '@govn/types';

export function JobCard({ job }: { job: JobModel }) {
  const endDate = new Date(job.applicationEndDate);
  const now = new Date('2026-09-14T09:00:00.000Z');
  const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const isClosingSoon = job.status === JobLifecycleStatus.CLOSING_SOON || (diffDays >= 0 && diffDays <= 3);

  return (
    <article className="govn-card p-4 rounded bg-white border border-slate-200 hover:border-indigo-300 transition shadow-sm flex flex-col justify-between">
      <div>
        {/* Top Meta Line: Organization, Status Badge, Verified Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 text-[11px]">
          <span className="font-bold text-slate-700 truncate max-w-[260px] sm:max-w-xs">
            {job.organizationName}
          </span>
          <div className="flex items-center space-x-1.5">
            {isClosingSoon ? (
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300 animate-pulse text-[10px]">
                Closes in {diffDays} {diffDays === 1 ? 'day' : 'days'}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-[10px]">
                Application Open
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
              Verified
            </span>
          </div>
        </div>

        {/* Job Title */}
        <h3 className="text-sm sm:text-base font-bold text-slate-900 hover:text-indigo-700 transition leading-snug">
          <Link href={`/jobs/${job.slug}`}>
            {job.title}
          </Link>
        </h3>

        {job.referenceNumber && (
          <p className="text-[11px] font-mono text-slate-500 mt-1">
            Ref: {job.referenceNumber}
          </p>
        )}

        {/* Key Vacancy Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 p-2.5 rounded bg-slate-50 border border-slate-100 text-xs">
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Vacancies</span>
            <span className="font-bold text-indigo-900">{job.totalVacancies.toLocaleString()} Posts</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Qualification</span>
            <span className="font-medium text-slate-800 truncate block">{job.qualificationMin || 'Graduate'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Age Limit</span>
            <span className="font-medium text-slate-800">{job.minimumAge} - {job.maximumAge} Yrs</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Location</span>
            <span className="font-medium text-slate-800">{job.locationSummary}</span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="text-[11px] text-slate-500">
          Last Date: <strong className="text-slate-800">{endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
        </div>

        <Link
          href={`/jobs/${job.slug}`}
          className="font-semibold text-xs bg-slate-900 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition shadow-sm"
        >
          View Notification &rarr;
        </Link>
      </div>
    </article>
  );
}
