import Link from 'next/link';
import { notFound } from 'next/navigation';
import { apiClient } from '../../../config/api';
import { generateJobPostingJsonLd, generateBreadcrumbJsonLd } from '@govn/seo';
import { JobCard } from '../../../components/JobCard';

export const dynamic = 'force-dynamic';

const CATEGORY_MAP: Record<string, { type: 'qualification' | 'category'; filterValue: string; title: string; desc: string }> = {
  '10th-pass': { type: 'qualification', filterValue: '10th', title: '10th Pass Government Jobs 2026', desc: 'Active central and state government recruitments requiring matriculation / 10th pass qualification.' },
  '12th-pass': { type: 'qualification', filterValue: '12th', title: '12th Pass Government Jobs 2026', desc: 'Verified 10+2 / Intermediate government vacancies across Police, Defence, Railways, and Clerical cadres.' },
  'iti': { type: 'qualification', filterValue: 'ITI', title: 'ITI Technician Government Jobs 2026', desc: 'Trade apprentice and technician vacancies in Railways, Ordnance Factories, and PSUs.' },
  'diploma': { type: 'qualification', filterValue: 'Diploma', title: 'Diploma Polytechnic Government Jobs 2026', desc: 'Junior Engineer and technical cadre vacancies for polytechnic diploma holders.' },
  'graduation': { type: 'qualification', filterValue: 'Graduate', title: 'Graduate Government Jobs 2026', desc: 'UPSC, SSC, Banking, and State Administrative positions for college degree holders.' },
  'post-graduation': { type: 'qualification', filterValue: 'Post Graduate', title: 'Post Graduate Government Jobs 2026', desc: 'Specialist officer, research scientist, professorship, and teaching positions.' },
  'railway': { type: 'category', filterValue: 'Railway', title: 'Railway Recruitment (RRB & RRC) 2026', desc: 'Official Centralized Employment Notices (CEN) for Indian Railways zones and production units.' },
  'ssc': { type: 'category', filterValue: 'SSC', title: 'Staff Selection Commission (SSC) Jobs 2026', desc: 'Central Secretariat and ministerial appointments through CGL, CHSL, MTS, and GD Constable.' },
  'police': { type: 'category', filterValue: 'Police', title: 'State Police & Constable Jobs 2026', desc: 'Sub-Inspector, Constable, and Telecommunications recruitments across State Police forces.' },
  'defence': { type: 'category', filterValue: 'Defence', title: 'Defence & Armed Forces Recruitment 2026', desc: 'Indian Army, Navy, Air Force, and DRDO technical vacancies for young aspirants.' },
  'banking': { type: 'category', filterValue: 'Banking', title: 'Banking & Financial Sector Jobs 2026', desc: 'Probationary Officers, Clerks, and Specialist Officers in SBI, RBI, and IBPS participating banks.' },
  'teaching': { type: 'category', filterValue: 'Teaching', title: 'Teaching & Education Department Jobs 2026', desc: 'KVS, NVS, and State Education Commission appointments for PGT, TGT, PRT, and Lecturers.' },
  'psu': { type: 'category', filterValue: 'PSU', title: 'Public Sector Undertakings (PSU) Jobs 2026', desc: 'Navratna, Maharatna, and autonomous institution recruitments through GATE or direct exam.' },
  'civil-services': { type: 'category', filterValue: 'Civil Services', title: 'Civil Services & Administrative Jobs 2026', desc: 'UPSC CSE and State PSC examinations for SDM, DSP, and Group A administrative posts.' },
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const categoryMeta = CATEGORY_MAP[params.slug.toLowerCase()];
  if (categoryMeta) {
    return {
      title: `${categoryMeta.title} | Verified Recruitment Notices`,
      description: categoryMeta.desc,
      alternates: { canonical: `/jobs/${params.slug}` },
    };
  }

  const job = await apiClient.getJobBySlug(params.slug);
  if (!job) return { title: 'Recruitment Not Found | THE GOVN Portal' };

  return {
    title: `${job.title} | Official Notification & Apply Online`,
    description: `${job.shortDescription || job.description.slice(0, 160)} Check eligibility, vacancies, fees, and official gazette notice.`,
    alternates: { canonical: `/jobs/${job.slug}` },
  };
}

export default async function JobOrCategoryPage({ params }: { params: { slug: string } }) {
  const slugKey = params.slug.toLowerCase();
  const categoryInfo = CATEGORY_MAP[slugKey];

  // CASE 1: Category or Qualification Hub Page
  if (categoryInfo) {
    const queryOpts = categoryInfo.type === 'qualification'
      ? { qualification: categoryInfo.filterValue, limit: 50 }
      : { category: categoryInfo.filterValue, limit: 50 };

    const matching = await apiClient.getJobs(queryOpts);

    return (
      <div className="space-y-6">
        <nav className="text-xs text-slate-500 flex items-center space-x-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:underline">Jobs</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{categoryInfo.title}</span>
        </nav>

        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-bold text-slate-900">{categoryInfo.title}</h1>
          <p className="text-xs text-slate-600 mt-1">{categoryInfo.desc}</p>
        </div>

        {matching.data.length === 0 ? (
          <div className="p-12 text-center bg-white rounded border border-slate-200">
            <p className="text-slate-700 font-semibold text-sm">No active recruitments currently found under this sector.</p>
            <Link href="/jobs" className="mt-3 inline-block text-xs bg-slate-900 text-white px-4 py-2 rounded">
              View All Open Vacancies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matching.data.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // CASE 2: Single Job Detail Dossier
  const job = await apiClient.getJobBySlug(params.slug);
  if (!job) {
    notFound();
  }

  const jsonLd = generateJobPostingJsonLd(job);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://govnportal.in/' },
    { name: 'Government Jobs', url: 'https://govnportal.in/jobs' },
    { name: job.categoryName, url: `https://govnportal.in/jobs/${job.categoryId.replace('cat-', '')}` },
    { name: job.shortTitle, url: `https://govnportal.in/jobs/${job.slug}` },
  ]);

  const relatedJobsRes = await apiClient.getJobs({ category: job.categoryName, limit: 3 });
  const relatedJobs = relatedJobsRes.data.filter((j) => j.id !== job.id);

  const startDate = new Date(job.applicationStartDate);
  const endDate = new Date(job.applicationEndDate);
  const lastUpdated = new Date(job.lastUpdatedAt);
  const lastVerified = new Date(job.lastVerifiedAt);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="space-y-8">
        <nav className="text-xs text-slate-500 flex items-center space-x-2">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/jobs" className="hover:underline">Jobs</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{job.shortTitle}</span>
        </nav>

        {/* Verification & Authority Header Banner */}
        <header className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                ✓ Human Verified
              </span>
              <span className="text-slate-500">
                Verified: <strong className="text-slate-800">{lastVerified.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-500">
                Updated: <strong className="text-slate-800">{lastUpdated.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
              </span>
            </div>

            <span className="px-3 py-1 rounded bg-slate-900 text-amber-300 font-bold uppercase tracking-wider text-[10px]">
              {job.status.replace(/_/g, ' ')}
            </span>
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase block">
              {job.organizationName}
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-tight">
              {job.title}
            </h1>
            {job.referenceNumber && (
              <p className="text-xs font-mono text-slate-500 mt-2">
                Official Circular Ref: <strong>{job.referenceNumber}</strong>
              </p>
            )}
          </div>

          {/* CRITICAL ACTIONS: Distinct Official Notification vs Apply Online */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 items-center">
            <a
              href={job.officialNotificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded shadow-sm flex items-center space-x-2 transition"
            >
              <span>📄 Official Notification (PDF)</span>
              <span className="text-slate-400 text-[10px]">&nearr;</span>
            </a>

            {job.officialApplyUrl ? (
              <a
                href={job.officialApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded shadow-sm flex items-center space-x-2 transition"
              >
                <span>🌐 Apply on Official Website</span>
                <span className="text-emerald-200 text-[10px]">&nearr;</span>
              </a>
            ) : (
              <span className="text-xs text-slate-500 italic bg-slate-100 px-3 py-2 rounded">
                Official application link will activate as per gazetted schedule.
              </span>
            )}
          </div>
        </header>

        {/* Quick Overview Table */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
              Quick Overview & Key Specifications
            </h2>
          </div>
          <table className="w-full text-xs text-left">
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 w-1/3 bg-slate-50/50">Issuing Department / Commission</td>
                <td className="p-3 font-bold text-slate-900">{job.organizationName}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Total Vacancies</td>
                <td className="p-3 font-extrabold text-indigo-900 text-sm">{job.totalVacancies.toLocaleString()} Posts</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Educational Qualification Required</td>
                <td className="p-3 font-medium text-slate-800">{job.qualificationMin || 'Graduation'}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Age Limit</td>
                <td className="p-3 text-slate-800">{job.minimumAge} to {job.maximumAge} Years (Relaxation as per rules)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Pay Scale / Remuneration</td>
                <td className="p-3 font-medium text-slate-800">{job.payScale || '7th CPC Scale'}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Job Location</td>
                <td className="p-3 text-slate-800">{job.locationSummary}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Important Dates Timeline & Application Fee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b pb-2">
              Important Dates
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 font-medium">Application Opening:</span>
                <span className="font-bold text-slate-900">{startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 bg-amber-50/60 p-1.5 rounded">
                <span className="text-amber-950 font-bold">Closing Date (Deadline):</span>
                <span className="font-extrabold text-amber-900">{endDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              {job.examStartDate && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Exam Date:</span>
                  <span className="font-bold text-indigo-700">{new Date(job.examStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b pb-2">
              Application Fee
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">General / OBC Candidates:</span>
                <span className="font-bold text-slate-900">{job.feeGeneral !== undefined && job.feeGeneral !== null ? `₹ ${job.feeGeneral}` : 'Nil'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600">SC / ST / Female Candidates:</span>
                <span className="font-bold text-slate-900">{job.feeSc !== undefined && job.feeSc !== null ? `₹ ${job.feeSc}` : 'Nil'}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Payment Method: {job.feePaymentMethod || 'Online Net Banking / Debit Card / UPI'}
              </p>
            </div>
          </section>
        </div>

        {/* Eligibility & Selection Process */}
        <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide border-b pb-2">
            Eligibility & Selection Procedure
          </h2>
          <div className="space-y-3 text-xs leading-relaxed text-slate-700">
            <p><strong>Description:</strong> {job.description}</p>
            {job.selectionProcess && job.selectionProcess.length > 0 && (
              <div className="pt-2">
                <p className="font-bold text-slate-900 mb-2">Stages of Selection:</p>
                <div className="space-y-1.5">
                  {job.selectionProcess.map((s) => (
                    <div key={s.stageOrder} className="p-2 rounded bg-slate-50 border border-slate-100">
                      <strong>Stage {s.stageOrder}:</strong> {s.stageName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Source Attribution & Disclaimer */}
        <section className="bg-slate-100 p-4 rounded border border-slate-300 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800">Source Transparency & Verification Audit:</p>
          <p>Official Source: {job.sourceName} &bull; Verified URL: {job.sourceUrl}</p>
          <p className="text-[11px] text-slate-500">
            Last Verified by Official Desk on {lastVerified.toLocaleDateString('en-IN')}. This portal is an independent discovery layer.
          </p>
        </section>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Related Vacancies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedJobs.map((rj) => (
                <div key={rj.id} className="p-3 bg-white border border-slate-200 rounded text-xs space-y-1">
                  <Link href={`/jobs/${rj.slug}`} className="font-bold text-slate-900 hover:text-indigo-700 block">
                    {rj.shortTitle}
                  </Link>
                  <p className="text-[11px] text-slate-500">{rj.totalVacancies} Vacancies &bull; Closes: {new Date(rj.applicationEndDate).toLocaleDateString('en-IN')}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
