# Security Architecture & Policies

## 1. Zero Trust Principles

1. **Secret Management**:
   - Zero hardcoded credentials or API keys.
   - All external keys loaded via environment variables (`.env`).
   - `.env.example` provides complete template with dummy tokens.
2. **Role-Based Access Control (RBAC)**:
   - Verification and publication endpoints restricted to `VERIFIER` and `SUPER_ADMIN`.
   - JWT tokens signed with SHA-256 / RS256 with short lifetimes (15m access, 7d refresh).
   - Passwords hashed using `bcrypt` (work factor 12) or `argon2id`.
3. **Input Sanitization & Injection Prevention**:
   - Prisma ORM parameterized queries prevent SQL injection.
   - HTML sanitization prevents stored XSS in job descriptions.
   - Strict Zod schemas reject malformed request bodies.
4. **Rate Limiting & Anti-Scraping**:
   - IP rate limiting on public API endpoints (100 requests per minute per IP).
   - Verifier CMS protected behind IP whitelisting and session rate limits.
5. **Audit Logging**:
   - Every verification, publication, field mutation, and deletion is recorded in `AuditLog` with actor ID, IP address, and timestamp.
