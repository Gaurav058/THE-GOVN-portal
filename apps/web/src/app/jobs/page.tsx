import Link from 'next/link';
import { apiClient } from '../../config/api';
import { JobCard } from '../../components/JobCard';

export const dynamic = 'force-dynamic';

export default async function JobsFilterSearchPage({
  searchParams,
}: {
  searchParams: {
    query?: string;
    category?: string;
    qualification?: string;
    state?: string;
    status?: string;
  };
}) {
  const { query, category, qualification, state, status } = searchParams;

  const result = await apiClient.getJobs({
    query,
    category,
    qualification,
    state,
    status: status as any,
    limit: 50,
  });

  const categories = ['All', 'Civil Services', 'Railway', 'SSC', 'Banking', 'Police', 'Defence', 'Teaching', 'PSU'];
  const qualifications = ['All', '10th', '12th', 'ITI', 'Diploma', 'Graduate', 'BTech', 'Post Graduate'];
  const states = ['All', 'All India', 'Rajasthan', 'Uttar Pradesh', 'Delhi', 'Bihar', 'Maharashtra'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Government Jobs Discovery & Filter Engine</h1>
        <p className="text-xs text-slate-600 mt-1">
          Search and filter verified government vacancies across qualifications, state boards, and recruitment commissions.
        </p>
      </div>

      {/* Filter Matrix Controls */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <form method="GET" action="/jobs" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Keyword Search */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Search Keywords</label>
            <input
              type="text"
              name="query"
              defaultValue={query || ''}
              placeholder="e.g. UPSC, Constable, Engineer..."
              className="w-full p-2 border border-slate-300 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-indigo-600"
            />
          </div>

          {/* Qualification Filter */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Qualification</label>
            <select
              name="qualification"
              defaultValue={qualification || 'All'}
              className="w-full p-2 border border-slate-300 rounded bg-slate-50 focus:bg-white"
            >
              {qualifications.map((q) => (
                <option key={q} value={q === 'All' ? '' : q}>
                  {q === 'All' ? 'All Qualifications' : q}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Category / Sector</label>
            <select
              name="category"
              defaultValue={category || 'All'}
              className="w-full p-2 border border-slate-300 rounded bg-slate-50 focus:bg-white"
            >
              {categories.map((c) => (
                <option key={c} value={c === 'All' ? '' : c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* State Filter */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Location / State</label>
            <select
              name="state"
              defaultValue={state || 'All'}
              className="w-full p-2 border border-slate-300 rounded bg-slate-50 focus:bg-white"
            >
              {states.map((s) => (
                <option key={s} value={s === 'All' ? '' : s}>
                  {s === 'All' ? 'All India / Any State' : s}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <button
                type="submit"
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold px-5 py-2 rounded transition shadow-sm"
              >
                Apply Filters
              </button>
              <Link
                href="/jobs"
                className="text-xs text-slate-600 hover:text-slate-900 px-3 py-2"
              >
                Reset Filters
              </Link>
            </div>

            <span className="text-xs text-slate-500">
              Showing <strong>{result.total}</strong> verified government vacancies
            </span>
          </div>
        </form>
      </div>

      {/* Results Grid */}
      {result.total === 0 ? (
        <div className="p-12 text-center bg-white rounded border border-slate-200">
          <p className="text-slate-700 font-semibold text-sm">No vacancies match your current filter criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting qualification or location filters to see all available jobs.</p>
          <Link href="/jobs" className="mt-4 inline-block text-xs bg-slate-900 text-white px-4 py-2 rounded">
            View All Open Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.data.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
