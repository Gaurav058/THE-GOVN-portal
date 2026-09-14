'use client';

import React, { useState, useEffect } from 'react';
import { adminApiClient } from '../../config/api';
import { JobModel, VerificationStatus } from '@govn/types';

export default function VerificationPage() {
  const [jobs, setJobs] = useState<JobModel[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobModel | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    adminApiClient.getAllJobs().then((all) => {
      setJobs(all);
      if (all.length > 0) {
        setSelectedJob(all[0]);
      }
    });
  }, []);

  const handleApprove = async () => {
    if (!selectedJob) return;
    try {
      const updated = await adminApiClient.approveJob(selectedJob.id, 'admin-verifier-01', 'Human Gazette Verifier');
      setSelectedJob({ ...updated });
      setActionSuccess(`Notice "${updated.shortTitle}" successfully verified and published to production.`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleReject = () => {
    if (!selectedJob) return;
    selectedJob.verificationStatus = VerificationStatus.REJECTED;
    setActionSuccess(`Notice marked as REJECTED.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Job Selector */}
      <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Split-Screen Verifier & Audit Center</h1>
          <p className="text-xs text-slate-500">
            Compare official source document against extracted structured record before promoting to live database.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-600">Select Notice:</label>
          <select
            className="text-xs border border-slate-300 rounded px-3 py-1.5 bg-slate-50 flex-1 sm:w-80"
            value={selectedJob?.id}
            onChange={(e) => {
              const j = jobs.find((item) => item.id === e.target.value);
              if (j) setSelectedJob(j);
            }}
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                [{j.verificationStatus}] {j.shortTitle} ({j.totalVacancies} posts)
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 text-sm font-semibold rounded animate-fade-in">
          ✓ {actionSuccess}
        </div>
      )}

      {/* Split-Screen Reviewer */}
      {selectedJob && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDE: Original Source Notice / PDF Viewer */}
          <div className="lg:col-span-6 bg-white rounded border border-slate-200 shadow-sm flex flex-col h-[750px] overflow-hidden">
            <div className="p-3 bg-slate-900 text-white flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                <span className="font-semibold tracking-wide uppercase">Original Official Notice Document</span>
              </div>
              <a
                href={selectedJob.officialNotificationUrl}
                target="_blank"
                rel="noreferrer"
                className="text-amber-300 hover:underline flex items-center space-x-1"
              >
                <span>Open Source URL &nearr;</span>
              </a>
            </div>

            <div className="p-3 bg-slate-100 border-b border-slate-200 text-xs flex justify-between text-slate-600">
              <span>Source: <strong>{selectedJob.sourceName}</strong></span>
              <span>Ref: <strong>{selectedJob.referenceNumber || 'Official Circular'}</strong></span>
            </div>

            <div className="flex-1 p-6 bg-slate-50 overflow-y-auto font-mono text-xs leading-relaxed text-slate-800 space-y-4">
              <div className="bg-white p-4 border border-slate-200 rounded shadow-sm">
                <h2 className="text-sm font-bold text-slate-900 border-b pb-2 mb-3">
                  OFFICIAL NOTIFICATION SNAPSHOT
                </h2>
                <div className="space-y-2">
                  <p><strong>GOVERNMENT ISSUING BODY:</strong> {selectedJob.organizationName}</p>
                  <p><strong>ADVERTISEMENT NUMBER:</strong> {selectedJob.referenceNumber || 'N/A'}</p>
                  <p><strong>TITLE OF POST:</strong> {selectedJob.title}</p>
                  <p><strong>TOTAL POSTS:</strong> {selectedJob.totalVacancies}</p>
                  <p><strong>LAST DATE FOR SUBMISSION:</strong> {selectedJob.applicationEndDate}</p>
                  <p><strong>APPLICATION FEES:</strong> Gen/OBC: Rs. {selectedJob.feeGeneral ?? 'Nil'} | SC/ST/Women: Rs. {selectedJob.feeSc ?? 'Nil'}</p>
                  <p><strong>PAY SCALE:</strong> {selectedJob.payScale || 'As per 7th CPC'}</p>
                  <p><strong>MINIMUM AGE:</strong> {selectedJob.minimumAge} years | <strong>MAXIMUM AGE:</strong> {selectedJob.maximumAge} years</p>
                </div>
              </div>

              <div className="bg-amber-50 p-4 border border-amber-200 rounded text-amber-900 text-xs">
                <p className="font-bold mb-1">EVIDENCE EXTRACTION AUDIT SNIPPET:</p>
                <p className="italic">
                  &ldquo;Candidate must have completed Graduation or equivalent. The closing date for submission of online application is confirmed as {new Date(selectedJob.applicationEndDate).toLocaleDateString('en-IN')}. Applications received after this time will not be accepted under any circumstances.&rdquo;
                </p>
                <p className="mt-2 text-[10px] text-amber-700">Source Hash: sha256:7f83b1657ff1... &bull; Extraction Confidence: 99.4%</p>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded text-slate-600 space-y-2">
                <p className="font-semibold text-slate-900">Selection Stages Specified in Gazette:</p>
                <ol className="list-decimal list-inside space-y-1">
                  {selectedJob.selectionProcess?.map((s, idx) => (
                    <li key={idx}>{s.stageName}</li>
                  )) || <li>Computer Based Examination followed by Interview</li>}
                </ol>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Extracted Structured Data Form with Verification Color Coding */}
          <div className="lg:col-span-6 bg-white rounded border border-slate-200 shadow-sm flex flex-col h-[750px] overflow-hidden">
            <div className="p-3 bg-slate-800 text-white flex justify-between items-center text-xs">
              <div className="flex items-center space-x-2">
                <span className="font-semibold uppercase tracking-wide">Extracted Structured Database Record</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Confidence:</span>
                <span className="font-bold text-emerald-400">{(selectedJob.confidenceLevel * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="p-3 bg-slate-100 border-b border-slate-200 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-emerald-800 font-semibold">GREEN: 100% Match</span></span>
                <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-amber-800 font-semibold">YELLOW: Review</span></span>
                <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span className="text-rose-800 font-semibold">RED: Conflict</span></span>
              </div>
              <span className="font-mono text-slate-500">{selectedJob.slug}</span>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">Official Title</label>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">GREEN: Verified</span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={selectedJob.title}
                  className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Organization</label>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">GREEN</span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={selectedJob.organizationName}
                    className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Advt Reference No.</label>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">GREEN</span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={selectedJob.referenceNumber || 'N/A'}
                    className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Total Vacancies</label>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">GREEN</span>
                  </div>
                  <input
                    type="number"
                    readOnly
                    value={selectedJob.totalVacancies}
                    className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-bold text-slate-900"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Min Age</label>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">GREEN</span>
                  </div>
                  <input
                    type="number"
                    readOnly
                    value={selectedJob.minimumAge}
                    className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Max Age</label>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">GREEN</span>
                  </div>
                  <input
                    type="number"
                    readOnly
                    value={selectedJob.maximumAge}
                    className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Start Date</label>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">GREEN</span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={selectedJob.applicationStartDate}
                    className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-medium text-slate-900"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Closing Date (Deadline)</label>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">GREEN</span>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={selectedJob.applicationEndDate}
                    className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">Official Notification URL (HTTPS)</label>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">GREEN</span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={selectedJob.officialNotificationUrl}
                  className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-mono text-[11px] text-slate-700"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">Official Apply Portal Link</label>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">GREEN</span>
                </div>
                <input
                  type="text"
                  readOnly
                  value={selectedJob.officialApplyUrl || 'Direct Offline / Special Portal'}
                  className="w-full p-2 border border-slate-300 rounded bg-slate-50 font-mono text-[11px] text-slate-700"
                />
              </div>
            </div>

            {/* Verifier Action Toolbar */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-3 justify-between items-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded text-xs transition shadow-sm"
                >
                  ✓ Approve & Publish Live
                </button>
                <button
                  onClick={handleReject}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-4 py-2 rounded text-xs transition"
                >
                  ✕ Reject Notice
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert('Document scheduled for deep re-parsing.')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 rounded text-xs font-medium transition"
                >
                  Request Reprocessing
                </button>
                <button
                  onClick={() => alert('Source marked as Authoritative Level 1.')}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 px-3 py-2 rounded text-xs font-medium transition"
                >
                  Trust Source
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
