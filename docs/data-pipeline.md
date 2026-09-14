# Data Pipeline & Ingestion Lifecycle

## 1. Pipeline Overview

The Data Pipeline guarantees that official government recruitment data is ingested, processed, audited, verified, and published without human error or AI hallucinations.

```
+-------------------------------------------------------------------------------+
| 1. CRON / SCHEDULER                                                           |
|    Triggers discovery at defined intervals (e.g., 30-60 mins for UPSC/EN).    |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 2. SOURCE DISCOVERY & ADAPTER FETCH                                           |
|    Adapter queries target portal (HTML / RSS / JSON API) with retry logic.    |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 3. RAW SNAPSHOT CREATION                                                      |
|    Raw payload + HTTP response headers saved to disk/S3 with SHA-256 hash.    |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 4. DOCUMENT & PDF PROCESSING                                                  |
|    Downloads official notification PDF, extracts text layers and tables.      |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 5. STRUCTURED EXTRACTION                                                      |
|    Extracts post name, vacancies, qualification, age, fees, dates.            |
|    *Rule*: Missing data is preserved as NULL (never guessed).                 |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 6. NORMALIZATION                                                              |
|    Converts dates to UTC / IST, standardizes degrees and organization IDs.     |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 7. BUSINESS VALIDATION ENGINE                                                 |
|    Checks: endDate >= startDate; minAge <= maxAge; valid HTTPS links; etc.     |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 8. DEDUPLICATION & CONFLICT DETECTION                                         |
|    Identifies matches by Advt No., Org + Post hash, or URL fingerprints.     |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 9. CHANGE DETECTION                                                           |
|    If existing record found, diffs fields (e.g. deadline changed).            |
|    Generates DEADLINE_CHANGED / VACANCY_CHANGED event.                        |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 10. ADMIN REVIEW QUEUE (PENDING_REVIEW / NEEDS_REVIEW)                        |
|     Split-screen verifier presentation: original PDF vs extracted fields.     |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 11. HUMAN VERIFICATION                                                        |
|     Verifier or Super Admin inspects and approves.                            |
+-------------------------------------------------------------------------------+
                                       |
                                       v
+-------------------------------------------------------------------------------+
| 12. PUBLICATION & CACHE INVALIDATION                                          |
|     Status set to PUBLISHED; JobPosting schema exposed; sitemap updated.      |
+-------------------------------------------------------------------------------+
```

---

## 2. Invariant Extraction Rules

1. **No Hallucinations**: If a notification does not mention an application fee for SC/ST or does not specify an upper age limit, the field must remain `null`. It must NEVER be defaulted to "Free" or "Any" unless explicitly stated.
2. **Evidence Preservation**: For each extracted key field (especially `applicationEndDate`, `totalVacancies`, and `qualification`), the engine preserves an `evidence` object containing:
   - `pageNumber`: Document page where the assertion was found.
   - `sourceSnippet`: Exact excerpt from the official document.
   - `confidence`: Numeric score between 0.0 and 1.0.
3. **Change Detection Auditing**:
   When an addendum or corrigendum changes an existing parameter:
   - The previous value is archived into `JobChangeHistory`.
   - The status is flagged with `NEEDS_REVIEW` and change type `DEADLINE_CHANGED` or `CORRIGENDUM_ISSUED`.
   - Subscribers to that specific job can be notified once verified.
