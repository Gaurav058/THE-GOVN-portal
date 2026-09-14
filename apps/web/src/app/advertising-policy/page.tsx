import React from 'react';

export const metadata = {
  title: 'Advertising Transparency Policy | THE GOVN Portal',
  description: 'Strict advertising policy prohibiting deceptive buttons, fake download links, or sponsored confusion.',
};

export default function AdvertisingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-b pb-4">
        Advertising Transparency Policy
      </h1>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 font-semibold">
        Core Principle: Advertisements must never visually resemble or mimic official government buttons.
      </div>

      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">1. Prohibition of Deceptive Ads</h2>
        <p>
          We strictly forbid and block advertisements designed to mimic official actions, such as banners labeled &ldquo;Download Admit Card Here&rdquo;, &ldquo;Apply Now&rdquo;, or &ldquo;Start Test&rdquo; that direct users to third-party ad landing pages.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. Clear Visual Separation</h2>
        <p>
          On every job page:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600">
          <li><strong>Official Notification (PDF)</strong> and <strong>Apply on Official Website</strong> buttons are rendered with high-contrast, official styling and explicit government domain designations.</li>
          <li>Any promotional or institutional partner blocks are explicitly labeled with <em>&ldquo;Sponsored&rdquo;</em> or <em>&ldquo;Advertisement&rdquo;</em> tags.</li>
        </ul>

        <h2 className="text-base font-bold text-slate-900">3. Integrity of Editorial Data</h2>
        <p>
          No sponsor or educational advertiser is permitted to alter vacancy numbers, eligibility guidelines, or placement on official rankings.
        </p>
      </div>
    </div>
  );
}
