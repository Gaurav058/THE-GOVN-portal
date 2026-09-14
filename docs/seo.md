# SEO Architecture & Structured Data

## 1. Core SEO Principles

The platform follows Google's official search quality evaluator guidelines for recruitment and governmental information portals:
1. **Google `JobPosting` Structured Data**: Injected into every individual job page (`/jobs/[slug]`).
2. **Strict Semantic Hierarchy**: Single `<h1>` tag per page, logical `<h2>` and `<h3>` tags for vacancy breakdowns, eligibility, fee structure, and important dates.
3. **No Keyword Stuffing**: High-utility, factual content; zero thin or duplicate programmatic pages.
4. **Distinct Canonical URLs**: Absolute canonical links preventing duplicate content penalties across category filters.
5. **Dynamic XML Sitemaps**: Split into indexable categories:
   - `/sitemap-jobs.xml`
   - `/sitemap-states.xml`
   - `/sitemap-exams.xml`
   - `/sitemap-articles.xml`

---

## 2. Google JobPosting Schema Format

Every `/jobs/[slug]` dynamically generates Schema.org `JobPosting` JSON-LD:

```json
{
  "@context": "https://schema.org/",
  "@type": "JobPosting",
  "title": "UPSC Civil Services Examination 2026",
  "description": "<p>Union Public Service Commission (UPSC) invites applications for 1,056 vacancies...</p>",
  "datePosted": "2026-09-01T00:00:00Z",
  "validThrough": "2026-10-15T23:59:59Z",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Union Public Service Commission",
    "sameAs": "https://www.upsc.gov.in"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "INR",
    "value": {
      "@type": "QuantitativeValue",
      "minValue": 56100,
      "maxValue": 177500,
      "unitText": "MONTH"
    }
  }
}
```

---

## 3. Site Navigation Schema

Category, State, and Search pages implement `BreadcrumbList` and `Organization` schemas with search query specifications, while strictly avoiding putting `JobPosting` markup on multi-job aggregation lists.
