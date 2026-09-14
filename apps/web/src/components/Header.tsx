'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function isNavItemActive(href: string, rawPathname: string): boolean {
  const pathname = rawPathname.length > 1 && rawPathname.endsWith('/')
    ? rawPathname.slice(0, -1)
    : rawPathname;

  if (href === '/') {
    return pathname === '/';
  }

  // Latest Jobs
  if (href === '/latest-government-jobs') {
    return pathname === '/latest-government-jobs' || pathname === '/jobs';
  }

  // Closing Soon (strict match or sub-paths of closing soon)
  if (href === '/closing-soon') {
    return pathname === '/closing-soon' || pathname.startsWith('/closing-soon/');
  }

  // Graduate
  if (href === '/jobs/graduation') {
    return pathname === '/jobs/graduation' || pathname === '/jobs/graduate';
  }

  // By State
  if (href === '/states') {
    return pathname === '/states' || pathname.startsWith('/states/') || pathname === '/jobs/state';
  }

  // Exam Calendar
  if (href === '/exams') {
    return pathname === '/exams' || pathname.startsWith('/exams/') || pathname === '/exam-calendar';
  }

  // Specific Category Jobs (exact match to prevent collision)
  if (href.startsWith('/jobs/')) {
    return pathname === href;
  }

  // Other section routes
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const rawPathname = usePathname() || '/';
  const pathname = rawPathname.length > 1 && rawPathname.endsWith('/')
    ? rawPathname.slice(0, -1)
    : rawPathname;

  const isClosingSoonActive = isNavItemActive('/closing-soon', pathname);
  const isAdmitCardsActive = isNavItemActive('/admit-cards', pathname);
  const isResultsActive = isNavItemActive('/results', pathname);

  const navItems = [
    { label: 'Home', href: '/', isActive: isNavItemActive('/', pathname) },
    { label: 'Latest Jobs', href: '/latest-government-jobs', isActive: isNavItemActive('/latest-government-jobs', pathname) },
    { label: 'Closing Soon', href: '/closing-soon', isActive: isClosingSoonActive },
    { label: '10th Pass', href: '/jobs/10th-pass', isActive: isNavItemActive('/jobs/10th-pass', pathname) },
    { label: '12th Pass', href: '/jobs/12th-pass', isActive: isNavItemActive('/jobs/12th-pass', pathname) },
    { label: 'Graduate', href: '/jobs/graduation', isActive: isNavItemActive('/jobs/graduation', pathname) },
    { label: 'Railway Jobs', href: '/jobs/railway', isActive: isNavItemActive('/jobs/railway', pathname) },
    { label: 'SSC', href: '/jobs/ssc', isActive: isNavItemActive('/jobs/ssc', pathname) },
    { label: 'Police', href: '/jobs/police', isActive: isNavItemActive('/jobs/police', pathname) },
    { label: 'Defence', href: '/jobs/defence', isActive: isNavItemActive('/jobs/defence', pathname) },
    { label: 'Banking', href: '/jobs/banking', isActive: isNavItemActive('/jobs/banking', pathname) },
    { label: 'Teaching', href: '/jobs/teaching', isActive: isNavItemActive('/jobs/teaching', pathname) },
    { label: 'By State', href: '/states', isActive: isNavItemActive('/states', pathname) },
    { label: 'Exam Calendar', href: '/exams', isActive: isNavItemActive('/exams', pathname) },
    { label: 'Admit Cards', href: '/admit-cards', isActive: isAdmitCardsActive },
    { label: 'Results', href: '/results', isActive: isResultsActive },
    { label: 'Articles', href: '/articles', isActive: isNavItemActive('/articles', pathname) },
  ];

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
              className={`text-xs font-semibold px-3 py-1.5 rounded border transition ${
                pathname === '/jobs' || pathname === '/latest-government-jobs'
                  ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-sm'
                  : 'bg-indigo-50 text-indigo-700 font-semibold border-indigo-200 hover:bg-indigo-100'
              }`}
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
          <Link
            href="/closing-soon"
            aria-current={isClosingSoonActive ? 'page' : undefined}
            data-active={isClosingSoonActive ? 'true' : 'false'}
            className={`px-2.5 py-1 rounded transition flex items-center space-x-1 ${
              isClosingSoonActive
                ? 'bg-amber-100 text-amber-950 border border-amber-400 ring-1 ring-amber-400 font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isClosingSoonActive ? 'bg-amber-600 animate-pulse' : 'bg-slate-400'
              }`}
            ></span>
            <span>Closing Soon</span>
          </Link>
          <Link
            href="/admit-cards"
            aria-current={isAdmitCardsActive ? 'page' : undefined}
            data-active={isAdmitCardsActive ? 'true' : 'false'}
            className={`px-2.5 py-1 rounded transition ${
              isAdmitCardsActive
                ? 'bg-purple-100 text-purple-950 border border-purple-400 ring-1 ring-purple-400 font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            Admit Cards
          </Link>
          <Link
            href="/results"
            aria-current={isResultsActive ? 'page' : undefined}
            data-active={isResultsActive ? 'true' : 'false'}
            className={`px-2.5 py-1 rounded transition ${
              isResultsActive
                ? 'bg-teal-100 text-teal-950 border border-teal-400 ring-1 ring-teal-400 font-bold shadow-sm'
                : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            Results
          </Link>
        </div>
      </div>

      {/* Primary Category Navigation Bar */}
      <nav className="bg-slate-900 text-slate-200 text-xs border-t border-slate-800 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-6 h-10 whitespace-nowrap font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={item.isActive ? 'page' : undefined}
              data-active={item.isActive ? 'true' : 'false'}
              className={`transition ${
                item.isActive
                  ? 'text-amber-300 font-semibold'
                  : 'text-slate-200 hover:text-amber-400 font-medium'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
