import React from 'react';
import { adminApiClient } from '../../config/api';

export const dynamic = 'force-dynamic';

export default async function AuditLogsPage() {
  const logs = await adminApiClient.getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Immutable Administrative Audit Trail</h1>
        <p className="text-sm text-slate-600 mt-1">
          Complete historical register of all data verification approvals, field overrides, status transitions, and publication events.
        </p>
      </div>

      <div className="bg-white rounded border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="p-3">Timestamp (UTC)</th>
              <th className="p-3">Action</th>
              <th className="p-3">Verifier / Admin</th>
              <th className="p-3">Target Entity</th>
              <th className="p-3">Mutation Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-3 font-mono text-slate-500">{log.timestamp}</td>
                <td className="p-3 font-bold text-indigo-700">{log.action}</td>
                <td className="p-3 text-slate-700">{log.adminName || log.adminId}</td>
                <td className="p-3 text-slate-800">
                  {log.entityType} #{log.entityId}
                </td>
                <td className="p-3 font-mono text-[11px] text-slate-600">
                  {log.oldState ? `Old: ${JSON.stringify(log.oldState)} ` : ''}
                  {log.newState ? `New: ${JSON.stringify(log.newState)}` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
