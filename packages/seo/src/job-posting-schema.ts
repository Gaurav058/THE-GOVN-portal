import { JobModel } from '@govn/types';

export interface GoogleJobPostingSchema {
  '@context': string;
  '@type': string;
  title: string;
  description: string;
  identifier?: {
    '@type': string;
    name: string;
    value: string;
  };
  datePosted: string;
  validThrough: string;
  employmentType: string;
  hiringOrganization: {
    '@type': string;
    name: string;
    sameAs?: string;
  };
  jobLocation: {
    '@type': string;
    address: {
      '@type': string;
      addressCountry: string;
      addressRegion?: string;
    };
  };
  baseSalary?: {
    '@type': string;
    currency: string;
    value: {
      '@type': string;
      minValue?: number;
      maxValue?: number;
      unitText: string;
    };
  };
  applicantLocationRequirements?: {
    '@type': string;
    name: string;
  };
}

export function generateJobPostingJsonLd(job: JobModel): GoogleJobPostingSchema {
  const schema: GoogleJobPostingSchema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.publishedAt || job.createdAt,
    validThrough: job.applicationEndDate,
    employmentType: job.employmentType === 'FULL_TIME' ? 'FULL_TIME' : 'OTHER',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.organizationName,
      sameAs: job.sourceUrl,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
        addressRegion: job.stateName || 'All India',
      },
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'India',
    },
  };

  if (job.referenceNumber) {
    schema.identifier = {
      '@type': 'PropertyValue',
      name: job.organizationName,
      value: job.referenceNumber,
    };
  }

  if (job.salaryMin && job.salaryMax) {
    schema.baseSalary = {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: Number(job.salaryMin),
        maxValue: Number(job.salaryMax),
        unitText: 'MONTH',
      },
    };
  }

  return schema;
}
