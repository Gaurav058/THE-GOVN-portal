import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs border-t border-slate-800 mt-16">
      {/* Official Transparency Bar */}
      <div className="border-b border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Strict Official Verification</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Every recruitment notice is checked against primary Level 1 & Level 2 government sources (UPSC, SSC, RRB, Employment News) before publication.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Direct Official Links</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              We clearly distinguish between official PDF notifications, official application portals, and informational commentary. No misleading buttons.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Real-time Corrigendum Tracking</h4>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Our data engine continuously monitors official gazettes for deadline extensions, vacancy revisions, and exam rescheduling.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Popular Recruitments</h5>
          <ul className="space-y-2 text-[11px] text-slate-400">
            <li><Link href="/jobs/railway" className="hover:text-white transition">Railway RRB Recruitment</Link></li>
            <li><Link href="/jobs/ssc" className="hover:text-white transition">SSC CGL / CHSL / MTS</Link></li>
            <li><Link href="/jobs/civil-services" className="hover:text-white transition">UPSC Civil Services IAS</Link></li>
            <li><Link href="/jobs/banking" className="hover:text-white transition">IBPS & SBI Banking Jobs</Link></li>
            <li><Link href="/jobs/defence" className="hover:text-white transition">Defence & Armed Forces</Link></li>
            <li><Link href="/jobs/police" className="hover:text-white transition">State Police Constables</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">By Qualification</h5>
          <ul className="space-y-2 text-[11px] text-slate-400">
            <li><Link href="/jobs/10th-pass" className="hover:text-white transition">10th Pass Government Jobs</Link></li>
            <li><Link href="/jobs/12th-pass" className="hover:text-white transition">12th Pass Government Jobs</Link></li>
            <li><Link href="/jobs/iti" className="hover:text-white transition">ITI Technician Vacancies</Link></li>
            <li><Link href="/jobs/diploma" className="hover:text-white transition">Polytechnic Diploma Jobs</Link></li>
            <li><Link href="/jobs/graduation" className="hover:text-white transition">Graduate Central Vacancies</Link></li>
            <li><Link href="/jobs/post-graduation" className="hover:text-white transition">Post Graduate / B.Ed Jobs</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Exam Portals & Tools</h5>
          <ul className="space-y-2 text-[11px] text-slate-400">
            <li><Link href="/exams" className="hover:text-white transition">2026 Examination Calendar</Link></li>
            <li><Link href="/admit-cards" className="hover:text-white transition">Admit Card Tracker</Link></li>
            <li><Link href="/results" className="hover:text-white transition">Results & Cut-Off Marks</Link></li>
            <li><Link href="/closing-soon" className="hover:text-white transition">Closing Soon Alert Board</Link></li>
            <li><Link href="/states" className="hover:text-white transition">State PSC Directory</Link></li>
            <li><Link href="/articles" className="hover:text-white transition">Preparation & Syllabus Guides</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Institutional Policies</h5>
          <ul className="space-y-2 text-[11px] text-slate-400">
            <li><Link href="/about" className="hover:text-white transition">About THE GOVN Portal</Link></li>
            <li><Link href="/contact" className="hover:text-white transition">Contact & Verification Inquiries</Link></li>
            <li><Link href="/disclaimer" className="hover:text-white transition">Official Disclaimer</Link></li>
            <li><Link href="/editorial-policy" className="hover:text-white transition">Editorial Policy & Source Standards</Link></li>
            <li><Link href="/correction-policy" className="hover:text-white transition">Corrigendum & Correction Policy</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            <li><Link href="/advertising-policy" className="hover:text-white transition">Advertising Transparency Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Mandatory Disclaimer Section */}
      <div className="bg-slate-950 border-t border-slate-800 py-6 px-4">
        <div className="max-w-7xl mx-auto space-y-3 text-[11px] leading-relaxed text-slate-400 text-center sm:text-left">
          <p className="font-semibold text-amber-400 uppercase tracking-wide">
            Statutory Disclaimer:
          </p>
          <p>
            THE GOVN Portal (govnportal.in) is an independent private employment intelligence and examination discovery service. We do not claim any official affiliation with, authorization from, or representation of the Government of India, any State Government, Union Territory Administration, or any Constitutional Recruitment Commission (including UPSC, SSC, RRB, or State PSCs).
          </p>
          <p>
            All recruitment notices, eligibility guidelines, dates, and vacancy counts published herein are compiled strictly from publicly accessible official gazettes, department employment notifications, and authentic commission releases. Candidates are urged to verify all instructions directly from the official notification PDF and respective application portals before applying.
          </p>
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[10px]">
            <span>&copy; 2026 THE GOVN Portal. All rights reserved.</span>
            <span>Indian Standard Time (IST) &bull; Verified Data Engine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
