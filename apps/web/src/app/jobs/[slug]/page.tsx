import Link from 'next/link';
import { notFound } from 'next/navigation';
import { apiClient } from '../../../config/api';
import { generateJobPostingJsonLd, generateBreadcrumbJsonLd } from '@govn/seo';
import { JobCard } from '../../../components/JobCard';
import { EmptyState } from '../../../components/EmptyState';

export const dynamic = 'force-dynamic';

const CATEGORY_MAP: Record<string, { type: 'qualification' | 'category'; filterValue: string; title: string; desc: string }> = {
  '10th-pass': { type: 'qualification', filterValue: '10th', title: '10th Pass Government Jobs 2026', desc: 'Active central and state government recruitments requiring matriculation / 10th pass qualification.' },
  '12th-pass': { type: 'qualification', filterValue: '12th', title: '12th Pass Government Jobs 2026', desc: 'Verified 10+2 / Intermediate government vacancies across Police, Defence, Railways, and Clerical cadres.' },
  'iti': { type: 'qualification', filterValue: 'ITI', title: 'ITI Technician Government Jobs 2026', desc: 'Trade apprentice and technician vacancies in Railways, Ordnance Factories, and PSUs.' },
  'diploma': { type: 'qualification', filterValue: 'Diploma', title: 'Diploma Polytechnic Government Jobs 2026', desc: 'Junior Engineer and technical cadre vacancies for polytechnic diploma holders.' },
  'graduation': { type: 'qualification', filterValue: 'Graduate', title: 'Graduate Government Jobs 2026', desc: 'UPSC, SSC, Banking, and State Administrative positions for college degree holders.' },
  'graduate': { type: 'qualification', filterValue: 'Graduate', title: 'Graduate Government Jobs 2026', desc: 'UPSC, SSC, Banking, and State Administrative positions for college degree holders.' },
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
      openGraph: {
        title: `${categoryMeta.title} | Verified Recruitment Notices`,
        description: categoryMeta.desc,
        url: `/jobs/${params.slug}`,
        siteName: 'THE GOVN Portal',
        type: 'website',
      },
    };
  }

  const job = await apiClient.getJobBySlug(params.slug);
  if (!job) return { title: 'Recruitment Not Found | THE GOVN Portal' };

  return {
    title: `${job.title} | Official Notification & Apply Online`,
    description: `${job.shortDescription || job.description.slice(0, 160)} Check eligibility, vacancies, fees, and official gazette notice.`,
    alternates: { canonical: `/jobs/${job.slug}` },
    openGraph: {
      title: `${job.shortTitle} - Official Notification & Apply Online`,
      description: job.shortDescription || job.description.slice(0, 160),
      url: `/jobs/${job.slug}`,
      siteName: 'THE GOVN Portal',
      type: 'article',
      publishedTime: job.publishedAt,
      modifiedTime: job.lastUpdatedAt,
    },
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
          <EmptyState
            message="No verified recruitments currently found in this category."
            subMessage="New official circulars are synchronized continuously with government gazettes."
          />
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

  // CASE 2: Single Job Detail Dossier (18 Sections Architecture)
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

  const relatedJobsRes = await apiClient.getJobs({ category: job.categoryName, limit: 4 });
  const relatedJobs = relatedJobsRes.data.filter((j) => j.id !== job.id).slice(0, 3);

  const startDate = new Date(job.applicationStartDate);
  const endDate = new Date(job.applicationEndDate);
  const lastUpdated = new Date(job.lastUpdatedAt);
  const lastVerified = new Date(job.lastVerifiedAt);
  const now = new Date();
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

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

        {/* 1. Job Title, 2. Organization, 3. Verification Status, 4. Last Updated */}
        <header className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-3 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center space-x-1">
                <span>✓</span>
                <span>Human Verified</span>
              </span>
              <span className="text-slate-500">
                Verified: <strong className="text-slate-800">{lastVerified.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-500">
                Last Updated: <strong className="text-slate-800">{lastUpdated.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold text-[11px]">
                {job.categoryName}
              </span>
              <span className="px-3 py-1 rounded bg-slate-900 text-amber-300 font-bold uppercase tracking-wider text-[10px]">
                {job.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase block">
              {job.organizationName}
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-tight">
              {job.title}
            </h1>
            {job.departmentName && (
              <p className="text-xs text-slate-600 mt-1">
                Department: <span className="font-semibold text-slate-800">{job.departmentName}</span>
              </p>
            )}
            {job.referenceNumber && (
              <p className="text-xs font-mono text-slate-500 mt-2">
                Official Circular Ref: <strong>{job.referenceNumber}</strong>
              </p>
            )}
          </div>

          {/* 14. Official Notification & 15. Official Application Portal (Distinct Prominence) */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 items-center">
            <a
              href={job.officialNotificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded shadow-sm flex items-center space-x-2 transition"
              title="Open Official Gazette Notification PDF"
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
                title="Navigate directly to Government Registration Site"
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

        {/* 6. Vacancy Specifications & Overview */}
        <section className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-sm text-slate-900 uppercase tracking-wide">
              Key Specifications & Vacancy Breakdown
            </h2>
            <span className="text-xs font-semibold text-indigo-700">Ref: {job.referenceNumber || 'Official'}</span>
          </div>
          <table className="w-full text-xs text-left">
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 w-1/3 bg-slate-50/50">Recruiting Authority</td>
                <td className="p-3 font-bold text-slate-900">{job.organizationName}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Total Vacancies</td>
                <td className="p-3 font-extrabold text-indigo-900 text-sm">{job.totalVacancies.toLocaleString()} Posts</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Minimum Educational Qualification</td>
                <td className="p-3 font-medium text-slate-800">{job.qualificationMin || 'Graduation in Any Stream'}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Age Limit Criteria</td>
                <td className="p-3 text-slate-800">{job.minimumAge} to {job.maximumAge} Years (Age relaxation applicable)</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Pay Scale / Remuneration</td>
                <td className="p-3 font-medium text-slate-800">{job.payScale || '7th CPC Scale'}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Job Location</td>
                <td className="p-3 text-slate-800">{job.locationSummary}</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-semibold text-slate-600 bg-slate-50/50">Employment Nature</td>
                <td className="p-3 text-slate-800">{job.jobType} &bull; {job.employmentType}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 5. Important Dates & 9. Application Fee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b pb-2 flex items-center justify-between">
              <span>Important Dates</span>
              {daysRemaining >= 0 && daysRemaining <= 14 && (
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                  {daysRemaining === 0 ? 'Closing Today' : `${daysRemaining} Days Remaining`}
                </span>
              )}
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
              {job.correctionStartDate && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Correction Window:</span>
                  <span className="font-medium text-slate-800">
                    {new Date(job.correctionStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {job.correctionEndDate ? new Date(job.correctionEndDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'N/A'}
                  </span>
                </div>
              )}
              {job.admitCardDate && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-600">Admit Card Release:</span>
                  <span className="font-medium text-slate-800">{new Date(job.admitCardDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              )}
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
              Application Fee & Payment Mode
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 font-medium">General / OBC Candidates:</span>
                <span className="font-bold text-slate-900">{job.feeGeneral !== undefined && job.feeGeneral !== null ? `₹ ${job.feeGeneral}` : 'Nil'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 font-medium">SC / ST / PwD Candidates:</span>
                <span className="font-bold text-slate-900">{job.feeSc !== undefined && job.feeSc !== null ? `₹ ${job.feeSc}` : 'Nil'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-600 font-medium">Female Candidates:</span>
                <span className="font-bold text-slate-900">{job.feeFemale !== undefined && job.feeFemale !== null ? `₹ ${job.feeFemale}` : 'Nil'}</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Payment Method: {job.feePaymentMethod || 'Online Net Banking / Debit Card / Credit Card / UPI'}
              </p>
            </div>
          </section>
        </div>

        {/* 7. Educational Eligibility & 8. Age Limit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b pb-2">
              Educational Eligibility Requirements
            </h2>
            <div className="space-y-2 text-xs text-slate-700">
              <p className="font-semibold text-slate-900">Minimum Prescribed Level: {job.qualificationMin || 'Graduation'}</p>
              {job.qualifications && job.qualifications.length > 0 ? (
                <ul className="space-y-1.5 list-disc pl-4 text-slate-700">
                  {job.qualifications.map((q) => (
                    <li key={q.qualificationId}>
                      <span className="font-medium text-slate-900">{q.name}</span>
                      {q.isMandatory ? ' (Mandatory)' : ' (Desirable)'}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-600 leading-relaxed">
                  Candidate must possess a recognized degree/diploma from an accredited university or institution recognized by the Government of India.
                </p>
              )}
            </div>
          </section>

          <section className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b pb-2">
              Age Limit & Category Relaxations
            </h2>
            <div className="space-y-2 text-xs text-slate-700">
              <p>
                <strong>Prescribed Age:</strong> {job.minimumAge} to {job.maximumAge} Years
              </p>
              {job.ageRules && job.ageRules.length > 0 && (
                <div>
                  <p className="font-semibold text-slate-800 mb-1">Permissible Upper Age Relaxations:</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {job.ageRules.map((rule, idx) => (
                      <div key={idx} className="p-1.5 bg-slate-50 border border-slate-100 rounded">
                        <span className="font-bold text-slate-800">{rule.category}:</span> {rule.relaxationYears} Years
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* 10. Salary & 11. Selection Process */}
        <section className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide border-b pb-2">
            Selection Procedure & Remuneration
          </h2>
          <div className="space-y-4 text-xs leading-relaxed text-slate-700">
            <div>
              <h3 className="font-bold text-slate-900 text-xs mb-1">Pay Scale Details:</h3>
              <p className="p-2.5 rounded bg-slate-50 border border-slate-100 font-medium text-slate-800">
                {job.payScale || 'As per 7th Central Pay Commission Pay Matrix.'}
              </p>
            </div>

            {job.selectionProcess && job.selectionProcess.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-900 text-xs mb-2">Prescribed Stages of Examination:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {job.selectionProcess.map((s) => (
                    <div key={s.stageOrder} className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">
                        Stage {s.stageOrder}
                      </span>
                      <strong className="text-slate-900 block">{s.stageName}</strong>
                      {s.description && <p className="text-[11px] text-slate-600">{s.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 12. Important Documents & 13. Application Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b pb-2">
              Important Documents Checklist
            </h2>
            <ul className="text-xs space-y-2 text-slate-700 list-disc pl-4">
              <li>Scanned copy of recent color passport-size photograph (JPEG format, 20-50 KB).</li>
              <li>Scanned signature of candidate on white paper with black/blue pen (10-20 KB).</li>
              <li>Valid Photo Identity Proof (Aadhaar Card, PAN Card, Voter ID, or Passport).</li>
              <li>Class 10th / Matriculation Certificate as proof of Date of Birth.</li>
              <li>Prescribed Educational Degree / Marksheets and Final Certificate.</li>
              <li>Community / Caste / EWS Certificate in prescribed Central/State Government format.</li>
            </ul>
          </section>

          <section className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide border-b pb-2">
              Official Application Instructions
            </h2>
            <ol className="text-xs space-y-2 text-slate-700 list-decimal pl-4">
              <li>Visit the official recruitment portal using the direct link provided below.</li>
              <li>Complete One Time Registration (OTR) if registering for the first time.</li>
              <li>Log in with registered credentials and select the target recruitment notice.</li>
              <li>Fill in personal details, educational qualifications, and exam center preference.</li>
              <li>Upload required documents, signature, and photograph as per prescribed specs.</li>
              <li>Pay the application fee via online gateway and download the acknowledgment receipt.</li>
            </ol>
          </section>
        </div>

        {/* 17. Source Information & 18. Verification Disclaimer */}
        <section className="bg-slate-100 p-5 rounded-lg border border-slate-300 text-xs text-slate-700 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 font-bold text-slate-900">
            <span>Official Gazette Source Verification</span>
            <span className="text-emerald-700">Audit Status: PASS</span>
          </div>
          <p>
            <strong>Publishing Source:</strong> {job.sourceName} &bull; <strong>Verified Source URL:</strong>{' '}
            <a href={job.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline break-all">
              {job.sourceUrl}
            </a>
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Statutory Disclaimer: THE GOVN Portal is an independent discovery and intelligence service. All details are transcribed directly from official government gazettes. Candidates must verify all terms from the official PDF circular before submitting applications.
          </p>
        </section>

        {/* 16. Related Jobs */}
        {relatedJobs.length > 0 && (
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Related Official Vacancies</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedJobs.map((rj) => (
                <div key={rj.id} className="p-3 bg-white border border-slate-200 rounded text-xs space-y-1.5 shadow-sm">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase block">{rj.categoryName}</span>
                  <Link href={`/jobs/${rj.slug}`} className="font-bold text-slate-900 hover:text-indigo-700 block leading-tight">
                    {rj.shortTitle}
                  </Link>
                  <p className="text-[11px] text-slate-500">
                    {rj.totalVacancies.toLocaleString()} Posts &bull; Closes: {new Date(rj.applicationEndDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
