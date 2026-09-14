import React from 'react';
import './globals.css';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata = {
  title: 'THE GOVN Portal | India Government Jobs Intelligence Platform',
  description: 'Authoritative, verified India Government Jobs discovery platform. 100% official gazette notices, UPSC, SSC, Railways, Banking, Police, Defence vacancies.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://govnportal.in'),
  openGraph: {
    title: 'THE GOVN Portal - India Government Jobs Intelligence',
    description: 'Verified Central & State Government Recruitment Notifications with direct official gazettes.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'THE GOVN Portal',
    url: 'https://govnportal.in',
    description: 'India Government Jobs Intelligence and Official Recruitment Verification Platform',
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
