import React from 'react';

export const metadata = {
  title: 'Official Statutory Disclaimer | THE GOVN Portal',
  description: 'Statutory disclaimer clarifying independent platform status, non-government affiliation, and source verification.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-b pb-4">
        Statutory Non-Affiliation Disclaimer
      </h1>

      <div className="p-4 bg-amber-50 border border-amber-300 rounded text-amber-950 font-medium">
        THE GOVN Portal (govnportal.in) is an independent private discovery and information service. We are not an official government entity, agency, or commission of the Republic of India.
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">1. Nature of the Service</h2>
        <p>
          The materials and recruitment notices made available on this website are compiled solely for informational, guidance, and discovery purposes for Indian citizens seeking employment in the public sector. While we make every endeavor to ensure all data precisely reflects official Gazette notices, <strong>the official Gazette or Commission circular published on the government issuing authority domain remains the ultimate legal authority</strong>.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Official Document Verification</h2>
        <p>
          Candidates are strictly advised to download and read the official advertisement PDF (provided on every job dossier) and verify examination dates, age criteria, fee categories, and physical parameters directly from the official commission website before submitting applications or remitting fees.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Limitation of Liability</h2>
        <p>
          THE GOVN Portal and its operators shall not be held liable for any loss, damage, administrative cancellation, or technical difficulty arising from reliance upon the information provided herein. Any discrepancy should be reported immediately to our Verification Desk.
        </p>
      </div>
    </div>
  );
}
