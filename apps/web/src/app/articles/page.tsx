import React from 'react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Preparation & Syllabus Articles | Government Exam Intelligence',
  description: 'In-depth analysis of syllabus patterns, previous year cutoff marks, and application procedural guides.',
};

export default function ArticlesPage() {
  const articles = [
    {
      title: 'UPSC Civil Services 2026: Detailed Paper Pattern & Qualifying Marks',
      slug: 'upsc-cse-2026-pattern-guide',
      category: 'Exam Strategy',
      date: '10 Sept 2026',
      readTime: '6 min read',
      excerpt: 'Comprehensive breakdown of General Studies Paper I and CSAT Paper II marks distribution, negative marking rules, and stage-by-stage preparation strategy.',
    },
    {
      title: 'RRB NTPC CEN 05/2026: Understanding Post Preferences & CBAT Requirements',
      slug: 'rrb-ntpc-2026-post-preferences',
      category: 'Railway Recruitment',
      date: '08 Sept 2026',
      readTime: '5 min read',
      excerpt: 'How to accurately order post preferences between Station Master, Goods Guard, and Senior Clerk based on medical standards and Computer Based Aptitude Test requirements.',
    },
    {
      title: 'SSC CGL Tier-I vs Tier-II Marking Scheme & Sectional Cutoff Dynamics',
      slug: 'ssc-cgl-marking-scheme-2026',
      category: 'SSC Guidance',
      date: '05 Sept 2026',
      readTime: '4 min read',
      excerpt: 'Essential information regarding negative marking, mathematical abilities, and data entry speed test qualification standards for Group B and C central government posts.',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Preparation & Examination Intelligence Articles</h1>
        <p className="text-xs text-slate-600 mt-1">
          Factual editorial analysis of official syllabi, cutoff trends, and commission procedural notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <article key={art.slug} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {art.category}
              </span>
              <h2 className="text-sm font-bold text-slate-900 hover:text-indigo-700 transition">
                {art.title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {art.excerpt}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
              <span>{art.date}</span>
              <span>{art.readTime}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
