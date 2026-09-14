'use client';

import React, { useState } from 'react';

const INITIAL_SOURCES = [
  { id: 'src-employment-news', name: 'Employment News / Rozgar Samachar', trustLevel: 'LEVEL 2 (AGGREGATOR)', url: 'https://employmentnews.gov.in', schedule: 'Every 6 hours', status: 'HEALTHY', lastRun: '2026-09-14 08:00 IST' },
  { id: 'src-upsc', name: 'Union Public Service Commission (UPSC)', trustLevel: 'LEVEL 1 (PRIMARY)', url: 'https://www.upsc.gov.in', schedule: 'Every 30 mins', status: 'HEALTHY', lastRun: '2026-09-14 08:30 IST' },
  { id: 'src-ssc', name: 'Staff Selection Commission (SSC)', trustLevel: 'LEVEL 1 (PRIMARY)', url: 'https://ssc.gov.in', schedule: 'Every 1 hour', status: 'HEALTHY', lastRun: '2026-09-14 08:15 IST' },
  { id: 'src-railway', name: 'Railway Recruitment Control Board (RRB/RRC)', trustLevel: 'LEVEL 1 (PRIMARY)', url: 'https://www.rrbcdg.gov.in', schedule: 'Every 2 hours', status: 'HEALTHY', lastRun: '2026-09-14 07:45 IST' },
  { id: 'src-ibps', name: 'Institute of Banking Personnel Selection (IBPS)', trustLevel: 'LEVEL 1 (PRIMARY)', url: 'https://www.ibps.in', schedule: 'Every 1 hour', status: 'HEALTHY', lastRun: '2026-09-14 08:00 IST' },
  { id: 'src-sbi', name: 'State Bank of India Careers (SBI)', trustLevel: 'LEVEL 1 (PRIMARY)', url: 'https://sbi.co.in/web/careers', schedule: 'Every 3 hours', status: 'HEALTHY', lastRun: '2026-09-14 06:30 IST' },
  { id: 'src-rbi', name: 'Reserve Bank of India Opportunities (RBI)', trustLevel: 'LEVEL 1 (PRIMARY)', url: 'https://opportunities.rbi.org.in', schedule: 'Every 4 hours', status: 'HEALTHY', lastRun: '2026-09-14 05:00 IST' },
];

export default function SourcesMonitoringPage() {
  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [message, setMessage] = useState<string | null>(null);

  const triggerIngestion = (id: string, name: string) => {
    setMessage(`Triggering immediate live crawl for ${name}...`);
    setTimeout(() => {
      setMessage(`Successfully scanned ${name}. Snapshot archived and processed.`);
      setTimeout(() => setMessage(null), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Official Source Ingestion Network</h1>
        <p className="text-sm text-slate-600 mt-1">
          Monitor adapter health, crawl schedules, raw document snapshot stores, and trigger on-demand crawls.
        </p>
      </div>

      {message && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold rounded">
          {message}
        </div>
      )}

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="p-3">Official Issuing Authority</th>
              <th className="p-3">Trust Level</th>
              <th className="p-3">Base Domain</th>
              <th className="p-3">Frequency</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Crawled</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sources.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">{s.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.trustLevel.includes('LEVEL 1') ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}`}>
                    {s.trustLevel}
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-600">{s.url}</td>
                <td className="p-3 text-slate-600">{s.schedule}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                    {s.status}
                  </span>
                </td>
                <td className="p-3 text-slate-500">{s.lastRun}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => triggerIngestion(s.id, s.name)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-2.5 py-1 rounded border border-slate-300 transition"
                  >
                    Trigger Crawl
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
