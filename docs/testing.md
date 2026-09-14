# Quality Assurance & Testing Strategy

## 1. Test Matrix

The platform incorporates comprehensive multi-tiered automated testing:

1. **Unit Tests**:
   - Invariant validation rules (date order, age limits, vacancy numbers, HTTPS URLs).
   - Normalization functions (IST timezones, salary conversions, degree mapping).
2. **Deduplication Tests**:
   - Exact hash matches.
   - Fuzzy title and advertisement reference number similarity matching.
3. **Change Detection Tests**:
   - Simulates notification version 1 vs version 2 with updated application deadlines; verifies `DEADLINE_CHANGED` audit record generation.
4. **Adapter Parser Tests**:
   - Real and mocked HTML/PDF fixtures for Employment News and UPSC to ensure scrapers survive edge cases.
5. **API Contract Tests**:
   - Verifies response schemas for `/api/v1/jobs`, `/api/v1/jobs/search`, and `/api/v1/jobs/:id`.
6. **SEO & Structured Data Tests**:
   - Asserts Schema.org `JobPosting` and `BreadcrumbList` compliance.

---

## 2. Running Tests

```bash
# Run all workspace unit and integration tests
pnpm test

# Run validation engine tests specifically
pnpm --filter @govn/validation test

# Run ingestion and change detection tests
pnpm --filter @govn/source-engine test
```
