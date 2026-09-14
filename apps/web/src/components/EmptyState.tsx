import React from 'react';
import Link from 'next/link';

interface EmptyStateProps {
  message?: string;
  subMessage?: string;
}

export function EmptyState({
  message = 'No verified recruitments currently found in this category.',
  subMessage = 'New notifications are synchronized with official government gazettes continuously.',
}: EmptyStateProps) {
  return (
    <div className="p-8 sm:p-12 text-center bg-white rounded-lg border border-slate-200 shadow-sm space-y-4">
      <div className="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-800">{message}</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">{subMessage}</p>
      </div>

      <div className="pt-2">
        <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-3">
          Explore Active Government Vacancies
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <Link
            href="/latest-government-jobs"
            className="bg-slate-900 hover:bg-slate-800 text-white font-medium px-3.5 py-1.5 rounded transition shadow-sm"
          >
            View All Latest Jobs
          </Link>
          <Link
            href="/closing-soon"
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-medium px-3.5 py-1.5 rounded transition"
          >
            Closing Soon
          </Link>
          <Link
            href="/jobs/graduation"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-3.5 py-1.5 rounded transition"
          >
            Browse by Qualification
          </Link>
          <Link
            href="/states"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium px-3.5 py-1.5 rounded transition"
          >
            Browse by State
          </Link>
        </div>
      </div>
    </div>
  );
}
