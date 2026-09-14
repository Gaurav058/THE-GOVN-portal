# Admin Verification CMS & Workflow

## 1. Split-Screen Verification Interface

To ensure 100% factual accuracy before publication, the Admin Control Center provides a **Split-Screen Verification Interface**:

```
+------------------------------------+------------------------------------+
|  LEFT PANEL: RAW SOURCE DOCUMENT   |  RIGHT PANEL: STRUCTURED JOB FORM  |
|                                    |                                    |
|  [Official Notification PDF]       |  Job Title: [ UPSC Civil Services] |
|  or [Archived Web Snapshot]        |  Organization: [ UPSC (Central)  ] |
|                                    |  Advt Ref: [ 05/2026-CSP         ] |
|  - Zoom / Page Navigation          |                                    |
|  - Highlighted Text Excerpts       |  Vacancies: [ 1056 ] [GREEN: Match]|
|                                    |  End Date: [2026-10-15] [GREEN]    |
|                                    |  Min Age: [ 21 ] Max Age: [ 32 ]   |
|                                    |  Fee (Gen): [ Rs 100 ] [GREEN]     |
|                                    |  Fee (SC/ST/Fem): [ Rs 0 ] [GREEN] |
|                                    |                                    |
|                                    |  Confidence: 98%                   |
|                                    |  Source: upsc.gov.in               |
+------------------------------------+------------------------------------+
| ACTIONS: [ APPROVE & PUBLISH ]  [ REQUEST REPROCESSING ]  [ REJECT ]    |
+-------------------------------------------------------------------------+
```

### Color Coding Rules
- **GREEN**: 100% verified or high-confidence exact match with evidence snippet.
- **YELLOW**: Needs human review (e.g. low-confidence OCR extraction or unusual eligibility requirement).
- **RED**: Conflict detected (e.g. conflicting dates, missing official apply URL, or mismatch against previous corrigendum).

---

## 2. Verifier Capabilities

Only users with roles `VERIFIER` or `SUPER_ADMIN` can transition a recruitment notice to `VERIFIED` and `PUBLISHED`.
Actions available:
1. **Approve & Publish**: Promotes record to live production database, exposes it on `/jobs/[slug]`, and triggers Google Indexing / sitemap ping.
2. **Edit Fields**: Allows manual correction of typos, fees, or dates directly in the form while logging an audit trail.
3. **Request Reprocessing**: Flags document for re-parsing with alternative OCR/extractor configurations.
4. **Reject Notice**: Marks as rejected with a mandatory reason code (Duplicate, Invalid Source, Withdrawn).
5. **View Change History**: Inspects time-series diffs between previous notices and latest corrigendums.
