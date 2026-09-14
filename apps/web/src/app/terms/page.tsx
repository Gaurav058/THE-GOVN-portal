import React from 'react';

export const metadata = {
  title: 'Terms of Service | THE GOVN Portal',
  description: 'Terms of service governing the use of THE GOVN Portal and access to recruitment data.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-b pb-4">
        Terms of Service
      </h1>

      <p>
        By accessing or using THE GOVN Portal (govnportal.in), you acknowledge and agree to these Terms of Service.
      </p>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">1. License and Permitted Use</h2>
        <p>
          You are granted a personal, non-exclusive, revocable license to search, view, and bookmark public recruitment information for individual career discovery. Automated abusive scraping that impairs system performance is prohibited.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Verification Precedence</h2>
        <p>
          Candidates agree that before paying any government application fee or traveling for any examination, they will verify all details against the official Gazette notification issued by the respective government commission.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Amendments</h2>
        <p>
          We reserve the right to modify these terms as platform services and examination intelligence features expand.
        </p>
      </div>
    </div>
  );
}
