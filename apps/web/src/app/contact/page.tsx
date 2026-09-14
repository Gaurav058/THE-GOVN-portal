import React from 'react';

export const metadata = {
  title: 'Contact Us & Verification Inquiries | THE GOVN Portal',
  description: 'Reach our editorial verification desk, report factual discrepancies, or inquire about official recruitment integrations.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg border border-slate-200 shadow-sm space-y-6 text-xs sm:text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-b pb-4">
        Contact & Verification Desk
      </h1>

      <p>
        If you are an applicant reporting an official corrigendum update, a department representative submitting a public gazette circular, or an engineer inquiring about our source adapters, please reach out via our dedicated channels:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
          <h3 className="font-bold text-slate-900">Verification & Corrections Desk</h3>
          <p className="text-slate-600">Email: <a href="mailto:verification@govnportal.in" className="text-indigo-600 underline">verification@govnportal.in</a></p>
          <p className="text-[11px] text-slate-500">For reporting official deadline extensions, errata, or changed apply URLs.</p>
        </div>

        <div className="p-4 rounded bg-slate-50 border border-slate-200 space-y-1">
          <h3 className="font-bold text-slate-900">General & Legal Inquiries</h3>
          <p className="text-slate-600">Email: <a href="mailto:contact@govnportal.in" className="text-indigo-600 underline">contact@govnportal.in</a></p>
          <p className="text-[11px] text-slate-500">For institutional inquiries and compliance notices.</p>
        </div>
      </div>
    </div>
  );
}
