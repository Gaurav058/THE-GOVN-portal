import React from 'react';

export const metadata = {
  title: 'Editorial & Source Verification Policy | THE GOVN Portal',
  description: 'Our four-tier official source trust hierarchy, human verification standards, and anti-hallucination protocols.',
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-b pb-4">
        Editorial & Verification Standards
      </h1>

      <p>
        THE GOVN Portal enforces a rigorous editorial charter designed to combat viral misinformation, outdated vacancy claims, and misleading application links.
      </p>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">1. Four-Tier Source Trust Hierarchy</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2">
          <li><strong>Level 1 (Primary Official)</strong>: Official Commission Portals (UPSC, SSC, RRB, IBPS), State PSCs, High Courts, and Central Ministries. <em>Authoritative source of record.</em></li>
          <li><strong>Level 2 (Government Aggregators)</strong>: Employment News (Ministry of Information & Broadcasting Gazette) and India.gov.in. <em>Official discovery and cross-check source.</em></li>
          <li><strong>Level 3 (Reputable Secondary)</strong>: Established academic and educational press. <em>Discovery only; cannot establish primary records.</em></li>
          <li><strong>Level 4 (Unverified Feeds)</strong>: Social forums, Telegram, and unverified blogs. <em>Requires Level 1 gazette corroboration before processing.</em></li>
        </ul>

        <h2 className="text-base font-bold text-slate-900">2. Anti-Hallucination Mandate</h2>
        <p>
          Our automated extractors are strictly prohibited from inferring or estimating missing data. If an official notification does not state an upper age limit or application fee, the field is tagged as <code>null</code> and submitted to a Human Verifier.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Human Verification Enforced</h2>
        <p>
          Only certified Human Verifiers with verified credentials can approve recruitment records and promote them to the production database.
        </p>
      </div>
    </div>
  );
}
