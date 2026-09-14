# Official Source Adapters Architecture

## 1. Overview

The source adapter subsystem (`packages/source-engine`) defines a modular, pluggable architecture. Adapters encapsulate portal-specific scraping logic, pagination, and session handling while adhering to a strict common contract: `ISourceAdapter`.

```typescript
export interface ISourceAdapter {
  readonly sourceId: string;
  readonly sourceName: string;
  readonly trustLevel: SourceTrustLevel;
  readonly baseUrl: string;

  fetchListings(options?: IngestionOptions): Promise<RawListing[]>;
  fetchDetails(listingId: string, url: string): Promise<RawJobDetail>;
  fetchDocuments(rawDetail: RawJobDetail): Promise<SourceDocumentPayload[]>;
  normalize(rawDetail: RawJobDetail): Promise<ExtractedJobData>;
  validate(extracted: ExtractedJobData): Promise<ValidationResult>;
  detectChanges(existingJob: Job, extracted: ExtractedJobData): Promise<DetectedChange[]>;
}
```

---

## 2. Core Implemented Adapters

### 1. Employment News (`employment-news.adapter.ts`)
- **Portal**: `https://employmentnews.gov.in/`
- **Trust Level**: Level 2 (Government Aggregator / Official Gazette)
- **Ingestion Mode**: Queries latest weekly vacancies, extracting Organization, Post Name, Category, Minimum Qualification, and Last Date for Submission, alongside links to full gazette PDF notices.

### 2. UPSC (`upsc.adapter.ts`)
- **Portal**: `https://www.upsc.gov.in/`
- **Trust Level**: Level 1 (Primary Official Commission)
- **Ingestion Mode**: Scrapes the *Recruitment Advertisements* and *Examination Notifications* tables. Extracts advertisement number, post name, application start/end dates, exam schedule, and official notice PDF documents.

### 3. Staff Selection Commission (`ssc.adapter.ts`)
- **Portal**: `https://ssc.gov.in/` (and dynamic mirror configurations)
- **Trust Level**: Level 1 (Primary Official Commission)
- **Ingestion Mode**: Configurable adapter handling major national examination cycles: CGL, CHSL, MTS, CPO, Stenographer, and GD Constable.

### 4. Railway Recruitment Boards (`railway.adapter.ts`)
- **Portal**: Configurable multi-zone RRB/RRC registry (RRB Bhopal, Mumbai, Chennai, Kolkata, Allahabad, etc.)
- **Trust Level**: Level 1 (Primary Official Board)
- **Ingestion Mode**: Discovers Centralized Employment Notifications (CEN) and extracts apprentice, technician, NTPC, and ALP recruitment notices.

### 5. Banking & Regulatory (`ibps.adapter.ts`, `sbi.adapter.ts`, `rbi.adapter.ts`)
- **Portals**: `https://www.ibps.in/`, `https://sbi.co.in/careers`, `https://opportunities.rbi.org.in/`
- **Trust Level**: Level 1 (Primary Official Authority)
- **Ingestion Mode**: Tracks CRP PO/MT, Clerk, Specialist Officer, SBI PO/Clerk, and RBI Grade B recruitment releases.

### 6. Generic Scraper & National Portal (`generic-source.adapter.ts`)
- **Portal**: Extensible adapter capable of parsing structured HTML tables or JSON endpoints with CSS selectors configured in the admin panel.

---

## 3. Resilience & Error Handling

- **Exponential Backoff**: Adapters automatically retry transient 5xx HTTP errors or rate limits up to 3 times with exponential backoff (1s, 3s, 9s).
- **User-Agent & SSL**: Respects official server configurations while maintaining non-intrusive scraping frequencies (minimum 500ms delay between consecutive detail requests).
- **Source Health Logging**: If a website DOM changes structure and parsing fails, the adapter marks `SOURCE_FETCH_FAILED`, records an audit event, and notifies administrators without corrupting existing records.
