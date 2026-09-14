import React from 'react';

export const metadata = {
  title: 'Corrigendum & Correction Policy | THE GOVN Portal',
  description: 'Procedures for processing official corrigendums, deadline extensions, and candidate error reports.',
};

export default function CorrectionPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-b pb-4">
        Corrigendum & Correction Policy
      </h1>

      <p>
        Government recruitment cycles frequently issue corrigendums, addendums, and deadline revisions. This document establishes how our platform ingests, audits, and surfaces corrections.
      </p>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">1. Automated Change Detection</h2>
        <p>
          When an official recruitment authority issues a revised circular:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
          <li>The previous data state is permanently archived in the <code>job_change_history</code> database table.</li>
          <li>A <code>DEADLINE_CHANGED</code> or <code>VACANCY_CHANGED</code> event is created.</li>
          <li>The record is marked with <code>NEEDS_REVIEW</code> and dispatched to the Verifier Queue.</li>
        </ul>

        <h2 className="text-base font-bold text-slate-900">2. Transparency to Candidates</h2>
        <p>
          Whenever a major change is verified (e.g. last date extended by 10 days), the job dossier displays a conspicuous update badge indicating the exact date of revision and the official corrigendum reference.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Reporting an Erratum</h2>
        <p>
          Candidates can report discrepancies directly to <a href="mailto:verification@govnportal.in" className="text-indigo-600 underline">verification@govnportal.in</a>. All verified corrections are published within 2 hours of receipt.
        </p>
      </div>
    </div>
  );
}
