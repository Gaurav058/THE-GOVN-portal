import React from 'react';

export const metadata = {
  title: 'Privacy Policy | THE GOVN Portal',
  description: 'Privacy policy explaining data handling, cookie policies, and candidate security on THE GOVN Portal.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-b pb-4">
        Privacy Policy
      </h1>

      <p>
        THE GOVN Portal values candidate privacy. We do not sell, rent, or trade your personal information.
      </p>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          We do not require user registration to view public government recruitment notices, download gazettes, or check examination dates. We only collect anonymous telemetry for site performance, Core Web Vitals, and search analytics.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Cookies and Storage</h2>
        <p>
          We use functional cookies to remember candidate filter preferences (such as preferred state or qualification) locally within your browser.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Contact Inquiries</h2>
        <p>
          If you send correspondence to our Verification Desk, your email address is used solely to reply to your inquiry.
        </p>
      </div>
    </div>
  );
}
