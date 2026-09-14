import React from 'react';

export const metadata = {
  title: 'About Us | THE GOVN Portal',
  description: 'Learn about the mission, data verification protocols, and engineering architecture behind THE GOVN Portal.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-b pb-4">
        About THE GOVN Portal
      </h1>

      <p className="text-base text-slate-800 font-medium leading-relaxed">
        <strong>THE GOVN Portal</strong> is an independent, production-grade India Government Jobs Intelligence Platform architected to solve one of the most critical challenges facing millions of Indian job seekers: <strong>unverified, delayed, and misleading recruitment information</strong>.
      </p>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">Our Core Architectural Philosophy</h2>
        <p>
          Unlike traditional blogs or content aggregators that manually re-type or hallucinate job listings, THE GOVN Portal enforces a strict <strong>Official Source &rarr; Human Verification &rarr; Database as Single Source of Truth</strong> workflow.
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
          <li><strong>Zero Speculation</strong>: AI is never permitted to guess missing vacancies, age limits, or fees. Missing fields remain strictly null.</li>
          <li><strong>Direct Official Attribution</strong>: Every vacancy listing links directly to the authorized Gazette PDF and the official commission submission domain.</li>
          <li><strong>Corrigendum Tracking</strong>: Our change detection engine continuously diffs official releases to capture deadline extensions and vacancy revisions.</li>
        </ul>
      </div>

      <div className="p-4 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <p className="font-bold text-slate-800">Operational Disclaimer:</p>
        <p>THE GOVN Portal is an independent technological platform and is not affiliated with, endorsed by, or representing any government ministry, commission, or recruitment board.</p>
      </div>
    </div>
  );
}
