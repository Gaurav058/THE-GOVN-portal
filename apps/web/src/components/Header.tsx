import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Gazette Alert Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase">
              Official Alert
            </span>
            <span className="font-medium text-slate-300">
              UPSC CSE 2026, RRB NTPC (11,558 Posts), and SSC CGL (17,727 Posts) application portals are currently live.
            </span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Verified Sources: UPSC &bull; SSC &bull; Employment News</span>
            <span className="text-emerald-400 font-semibold">&bull; System Live (IST)</span>
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-slate-900 text-amber-400 flex items-center justify-center font-black text-xl rounded border border-slate-800 shadow-inner">
              G
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block leading-none">
                THE GOVN <span className="text-indigo-700 text-sm font-semibold">PORTAL</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-wide block mt-0.5">
                India Government Jobs Intelligence Platform
              </span>
            </div>
          </Link>

          <div className="md:hidden">
            <Link
              href="/jobs"
              className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1.5 rounded border border-indigo-200"
            >
              Search All
            </Link>
          </div>
        </div>

        {/* Search Input */}
        <form action="/jobs" method="GET" className="flex-1 max-w-md mx-0 md:mx-6">
          <div className="relative">
            <input
              type="text"
              name="query"
              placeholder="Search by post, board (e.g. 12th pass police, RRB, UPSC)..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </form>

        {/* Quick Badges */}
        <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold">
          <Link href="/closing-soon" className="px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span>
            <span>Closing Soon</span>
          </Link>
          <Link href="/admit-cards" className="px-2.5 py-1 rounded bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100 transition">
            Admit Cards
          </Link>
          <Link href="/results" className="px-2.5 py-1 rounded bg-teal-50 text-teal-900 border border-teal-200 hover:bg-teal-100 transition">
            Results
          </Link>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="bg-slate-900 text-slate-200 text-xs border-t border-slate-800 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-6 h-10 whitespace-nowrap font-medium">
          <Link href="/" className="hover:text-amber-400 transition font-bold text-white">
            Home
          </Link>
          <Link href="/latest-government-jobs" className="hover:text-amber-400 transition">
            Latest Jobs
          </Link>
          <Link href="/closing-soon" className="hover:text-amber-400 transition text-amber-300 font-semibold">
            Closing Soon
          </Link>
          <Link href="/jobs/10th-pass" className="hover:text-amber-400 transition">
            10th Pass
          </Link>
          <Link href="/jobs/12th-pass" className="hover:text-amber-400 transition">
            12th Pass
          </Link>
          <Link href="/jobs/graduation" className="hover:text-amber-400 transition">
            Graduate
          </Link>
          <Link href="/jobs/railway" className="hover:text-amber-400 transition">
            Railway Jobs
          </Link>
          <Link href="/jobs/ssc" className="hover:text-amber-400 transition">
            SSC
          </Link>
          <Link href="/jobs/police" className="hover:text-amber-400 transition">
            Police
          </Link>
          <Link href="/jobs/defence" className="hover:text-amber-400 transition">
            Defence
          </Link>
          <Link href="/jobs/banking" className="hover:text-amber-400 transition">
            Banking
          </Link>
          <Link href="/jobs/teaching" className="hover:text-amber-400 transition">
            Teaching
          </Link>
          <Link href="/states" className="hover:text-amber-400 transition">
            By State
          </Link>
          <Link href="/exams" className="hover:text-amber-400 transition">
            Exam Calendar
          </Link>
        </div>
      </nav>
    </header>
  );
}
