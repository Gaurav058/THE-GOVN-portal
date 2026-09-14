import React from 'react';
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Verification CMS | India Government Jobs Intelligence Platform',
  description: 'Authoritative Human Verification & Audit Control Center',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-100 text-slate-900">
        <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="bg-amber-500 text-slate-950 font-black px-2.5 py-1 rounded text-sm tracking-wider uppercase">
                THE GOVN
              </span>
              <span className="font-semibold text-lg tracking-tight">Intelligence Verification CMS</span>
              <span className="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                Live Engine (Sept 2026)
              </span>
            </div>

            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/" className="text-slate-300 hover:text-white transition">
                Dashboard
              </Link>
              <Link href="/verification" className="text-slate-300 hover:text-white transition">
                Verification Queue
              </Link>
              <Link href="/sources" className="text-slate-300 hover:text-white transition">
                Sources & Adapters
              </Link>
              <Link href="/audit" className="text-slate-300 hover:text-white transition">
                Audit Logs
              </Link>
            </nav>

            <div className="flex items-center space-x-3 text-xs">
              <span className="px-2 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                Role: VERIFIER / SUPER_ADMIN
              </span>
              <span className="text-slate-400">ID: admin-verifier-01</span>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">{children}</main>

        <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
          India Government Jobs Intelligence Platform &bull; Human Verification Protocol Enforced &bull; All mutations logged
        </footer>
      </body>
    </html>
  );
}
