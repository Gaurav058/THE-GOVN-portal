import Link from 'next/link';
import { apiClient } from '../config/api';
import { JobCard } from '../components/JobCard';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Query actual live REST API for every homepage section
  const [latestJobs, closingSoonJobs, tenthPassRes, twelfthPassRes, gradRes, rrbRes, sscRes, policeRes, defenceRes, bankingRes] =
    await Promise.all([
      apiClient.getLatestJobs(6),
      apiClient.getClosingSoonJobs(4),
      apiClient.getJobs({ qualification: '10th', limit: 4 }),
      apiClient.getJobs({ qualification: '12th', limit: 4 }),
      apiClient.getJobs({ qualification: 'Graduate', limit: 4 }),
      apiClient.getJobs({ category: 'Railway', limit: 4 }),
      apiClient.getJobs({ category: 'SSC', limit: 4 }),
      apiClient.getJobs({ category: 'Police', limit: 4 }),
      apiClient.getJobs({ category: 'Defence', limit: 4 }),
      apiClient.getJobs({ category: 'Banking', limit: 4 }),
    ]);

  const tenthPassJobs = tenthPassRes.data;
  const twelfthPassJobs = twelfthPassRes.data;
  const graduateJobs = gradRes.data;
  const railwayJobs = rrbRes.data;
  const sscJobs = sscRes.data;
  const policeJobs = policeRes.data;
  const defenceJobs = defenceRes.data;
  const bankingJobs = bankingRes.data;
  const stateJobs = latestJobs.filter((j) => j.stateName).slice(0, 4);
  const upcomingExams = latestJobs.filter((j) => j.examStartDate).slice(0, 4);
  const recentlyUpdated = latestJobs.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Platform Authority Intro Header */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-lg p-6 sm:p-8 shadow-sm border border-slate-800">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded text-xs font-semibold">
            <span>Verified Gazette Intelligence Engine</span>
            <span>&bull;</span>
            <span>September 2026 Cycle</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Authoritative India Government Jobs Intelligence
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Directly connected to official central and state recruitment commissions. Every notification is factual, verified, and traceable to original government gazette circulars.
          </p>
        </div>

        {/* Quick Shortcut Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/60 text-xs font-semibold">
          <Link href="/latest-government-jobs" className="bg-slate-800/80 hover:bg-slate-700 p-3 rounded border border-slate-700 transition block">
            <span className="text-amber-400 block mb-0.5">🔥 Latest Vacancies</span>
            <span className="text-slate-300 font-normal">Active official circulars</span>
          </Link>
          <Link href="/closing-soon" className="bg-slate-800/80 hover:bg-slate-700 p-3 rounded border border-slate-700 transition block">
            <span className="text-rose-400 block mb-0.5">⏳ Closing Soon</span>
            <span className="text-slate-300 font-normal">Deadlines within 3 days</span>
          </Link>
          <Link href="/admit-cards" className="bg-slate-800/80 hover:bg-slate-700 p-3 rounded border border-slate-700 transition block">
            <span className="text-purple-300 block mb-0.5">🎫 Admit Cards</span>
            <span className="text-slate-300 font-normal">Hall ticket releases</span>
          </Link>
          <Link href="/results" className="bg-slate-800/80 hover:bg-slate-700 p-3 rounded border border-slate-700 transition block">
            <span className="text-teal-300 block mb-0.5">🏆 Final Results</span>
            <span className="text-slate-300 font-normal">Merit lists & scorecards</span>
          </Link>
        </div>
      </section>

      {/* 1. Latest Government Jobs */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">1. Latest Government Jobs (Verified 2026)</h2>
            <p className="text-xs text-slate-500">Newly released recruitment circulars verified by gazette verifiers</p>
          </div>
          <Link href="/latest-government-jobs" className="text-xs font-bold text-indigo-700 hover:underline">
            View All Latest &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* 2. Closing Soon */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping"></span>
            <div>
              <h2 className="text-xl font-bold text-slate-900">2. Closing Soon (Application Deadlines)</h2>
              <p className="text-xs text-slate-500">Submit application before official registration portals close</p>
            </div>
          </div>
          <Link href="/closing-soon" className="text-xs font-bold text-rose-700 hover:underline">
            View All Closing Soon &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {closingSoonJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Qualification Grid (3, 4, 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. 10th Pass Jobs */}
        <section className="space-y-3">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-900 text-base">3. 10th Pass Jobs</h3>
            <Link href="/jobs/10th-pass" className="text-xs text-indigo-700 font-semibold hover:underline">More &rarr;</Link>
          </div>
          <div className="space-y-3">
            {tenthPassJobs.map((j) => (
              <div key={j.id} className="p-3 bg-white border border-slate-200 rounded text-xs space-y-1 hover:border-slate-300">
                <Link href={`/jobs/${j.slug}`} className="font-bold text-slate-900 hover:text-indigo-700 block">
                  {j.shortTitle}
                </Link>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>{j.organizationName}</span>
                  <span className="font-semibold text-slate-800">{j.totalVacancies} Posts</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 12th Pass Jobs */}
        <section className="space-y-3">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-900 text-base">4. 12th Pass Jobs</h3>
            <Link href="/jobs/12th-pass" className="text-xs text-indigo-700 font-semibold hover:underline">More &rarr;</Link>
          </div>
          <div className="space-y-3">
            {twelfthPassJobs.map((j) => (
              <div key={j.id} className="p-3 bg-white border border-slate-200 rounded text-xs space-y-1 hover:border-slate-300">
                <Link href={`/jobs/${j.slug}`} className="font-bold text-slate-900 hover:text-indigo-700 block">
                  {j.shortTitle}
                </Link>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>{j.organizationName}</span>
                  <span className="font-semibold text-slate-800">{j.totalVacancies} Posts</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Graduate Jobs */}
        <section className="space-y-3">
          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
            <h3 className="font-bold text-slate-900 text-base">5. Graduate Jobs</h3>
            <Link href="/jobs/graduation" className="text-xs text-indigo-700 font-semibold hover:underline">More &rarr;</Link>
          </div>
          <div className="space-y-3">
            {graduateJobs.map((j) => (
              <div key={j.id} className="p-3 bg-white border border-slate-200 rounded text-xs space-y-1 hover:border-slate-300">
                <Link href={`/jobs/${j.slug}`} className="font-bold text-slate-900 hover:text-indigo-700 block">
                  {j.shortTitle}
                </Link>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>{j.organizationName}</span>
                  <span className="font-semibold text-slate-800">{j.totalVacancies} Posts</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Sectoral Breakdown: 6. Railway, 7. SSC, 8. Police, 9. Defence, 10. Banking */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-2">
          <h2 className="text-xl font-bold text-slate-900">Official Recruitment Sectors (Central & State)</h2>
          <p className="text-xs text-slate-500">Categorized by constitutional commission and administrative ministry</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 6. Railway Jobs */}
          <div className="bg-white p-4 rounded border border-slate-200 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">6. Railway Jobs (RRB / RRC)</h4>
              <Link href="/jobs/railway" className="text-xs text-indigo-700 font-semibold">Explore &rarr;</Link>
            </div>
            {railwayJobs.map((j) => (
              <div key={j.id} className="text-xs border-b border-slate-50 pb-2 last:border-0">
                <Link href={`/jobs/${j.slug}`} className="font-semibold text-slate-800 hover:text-indigo-600 block">
                  {j.shortTitle}
                </Link>
                <span className="text-[11px] text-slate-500">{j.totalVacancies.toLocaleString()} Posts &bull; Closes: {new Date(j.applicationEndDate).toLocaleDateString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* 7. SSC Jobs */}
          <div className="bg-white p-4 rounded border border-slate-200 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">7. Staff Selection (SSC)</h4>
              <Link href="/jobs/ssc" className="text-xs text-indigo-700 font-semibold">Explore &rarr;</Link>
            </div>
            {sscJobs.map((j) => (
              <div key={j.id} className="text-xs border-b border-slate-50 pb-2 last:border-0">
                <Link href={`/jobs/${j.slug}`} className="font-semibold text-slate-800 hover:text-indigo-600 block">
                  {j.shortTitle}
                </Link>
                <span className="text-[11px] text-slate-500">{j.totalVacancies.toLocaleString()} Posts &bull; Closes: {new Date(j.applicationEndDate).toLocaleDateString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* 8. Police Jobs */}
          <div className="bg-white p-4 rounded border border-slate-200 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">8. Police Recruitment</h4>
              <Link href="/jobs/police" className="text-xs text-indigo-700 font-semibold">Explore &rarr;</Link>
            </div>
            {policeJobs.map((j) => (
              <div key={j.id} className="text-xs border-b border-slate-50 pb-2 last:border-0">
                <Link href={`/jobs/${j.slug}`} className="font-semibold text-slate-800 hover:text-indigo-600 block">
                  {j.shortTitle}
                </Link>
                <span className="text-[11px] text-slate-500">{j.totalVacancies.toLocaleString()} Posts &bull; Closes: {new Date(j.applicationEndDate).toLocaleDateString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* 9. Defence Jobs */}
          <div className="bg-white p-4 rounded border border-slate-200 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">9. Defence & Armed Forces</h4>
              <Link href="/jobs/defence" className="text-xs text-indigo-700 font-semibold">Explore &rarr;</Link>
            </div>
            {defenceJobs.map((j) => (
              <div key={j.id} className="text-xs border-b border-slate-50 pb-2 last:border-0">
                <Link href={`/jobs/${j.slug}`} className="font-semibold text-slate-800 hover:text-indigo-600 block">
                  {j.shortTitle}
                </Link>
                <span className="text-[11px] text-slate-500">{j.totalVacancies.toLocaleString()} Posts &bull; Closes: {new Date(j.applicationEndDate).toLocaleDateString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* 10. Banking Jobs */}
          <div className="bg-white p-4 rounded border border-slate-200 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">10. Banking & Insurance</h4>
              <Link href="/jobs/banking" className="text-xs text-indigo-700 font-semibold">Explore &rarr;</Link>
            </div>
            {bankingJobs.map((j) => (
              <div key={j.id} className="text-xs border-b border-slate-50 pb-2 last:border-0">
                <Link href={`/jobs/${j.slug}`} className="font-semibold text-slate-800 hover:text-indigo-600 block">
                  {j.shortTitle}
                </Link>
                <span className="text-[11px] text-slate-500">{j.totalVacancies.toLocaleString()} Posts &bull; Closes: {new Date(j.applicationEndDate).toLocaleDateString('en-IN')}</span>
              </div>
            ))}
          </div>

          {/* 11. State Government Jobs */}
          <div className="bg-white p-4 rounded border border-slate-200 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">11. State Government Jobs</h4>
              <Link href="/states" className="text-xs text-indigo-700 font-semibold">View States &rarr;</Link>
            </div>
            {stateJobs.map((j) => (
              <div key={j.id} className="text-xs border-b border-slate-50 pb-2 last:border-0">
                <Link href={`/jobs/${j.slug}`} className="font-semibold text-slate-800 hover:text-indigo-600 block">
                  {j.shortTitle}
                </Link>
                <span className="text-[11px] text-slate-500">{j.stateName} &bull; {j.totalVacancies.toLocaleString()} Posts</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. Upcoming Exams & 13. Recently Updated Jobs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-slate-900 text-base">12. Upcoming Government Examinations</h3>
            <Link href="/exams" className="text-xs font-semibold text-indigo-700 hover:underline">Exam Calendar &rarr;</Link>
          </div>
          <div className="space-y-3 text-xs">
            {upcomingExams.map((e) => (
              <div key={e.id} className="flex justify-between items-center p-2 rounded bg-slate-50">
                <div>
                  <p className="font-bold text-slate-900">{e.shortTitle}</p>
                  <p className="text-[11px] text-slate-500">{e.organizationName}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-semibold">
                    {new Date(e.examStartDate!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-5 rounded border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="font-bold text-slate-900 text-base">13. Recently Updated & Corrigendums</h3>
            <span className="text-xs text-emerald-700 font-semibold">Auto-Tracked</span>
          </div>
          <div className="space-y-3 text-xs">
            {recentlyUpdated.map((u) => (
              <div key={u.id} className="p-2 rounded bg-slate-50 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{u.shortTitle}</p>
                  <p className="text-[11px] text-slate-500">Ref: {u.referenceNumber || 'Official Notice'}</p>
                </div>
                <span className="text-[11px] text-slate-600 font-medium">
                  Verified: {new Date(u.lastVerifiedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 14. Download App & 15. Career Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="p-6 rounded-lg bg-slate-900 text-white space-y-3 border border-slate-800">
          <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            14. Mobile Intelligence
          </span>
          <h3 className="text-lg font-bold">THE GOVN Mobile App (Android / iOS)</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            Get instant push notifications on your phone the moment an official gazette releases a vacancy, admit card, or answer key. Zero spam, 100% verified alerts.
          </p>
          <div className="pt-2 flex items-center space-x-3 text-xs">
            <button className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded hover:bg-amber-400 transition">
              Get App Beta
            </button>
            <span className="text-slate-400 text-[11px]">Free for all Indian citizens</span>
          </div>
        </section>

        <section className="p-6 rounded-lg bg-indigo-900 text-white space-y-3 border border-indigo-800">
          <span className="text-xs bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            15. Career Tools
          </span>
          <h3 className="text-lg font-bold">Personalized Eligibility Matching Engine</h3>
          <p className="text-indigo-200 text-xs leading-relaxed">
            Input your qualification (10th, 12th, B.Tech, Graduate), age, and category to see the exact government posts you qualify for across Central and State departments.
          </p>
          <div className="pt-2 flex items-center space-x-3 text-xs">
            <Link href="/jobs" className="bg-white text-indigo-950 font-bold px-4 py-2 rounded hover:bg-slate-100 transition">
              Launch Matcher
            </Link>
            <span className="text-indigo-300 text-[11px]">No registration required</span>
          </div>
        </section>
      </div>
    </div>
  );
}
