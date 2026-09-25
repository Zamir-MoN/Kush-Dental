# Security & Threat Model

## General Security Controls
- **Input Validation**: Stripping and strictly validating incoming data shapes (via Zod).
- **Output Encoding**: Ensuring data returned by the API is properly formatted (React handles XSS HTML sanitization on the client, but the API should ensure it returns JSON as `application/json`).
- **Transport Security**: TLS 1.2/1.3 enforced for all traffic.
- **Headers**: Helmet.js for secure HTTP headers (HSTS, X-Content-Type-Options, X-Frame-Options).
- **Configuration & Secrets**:
  - No secrets (e.g. JWT_SECRET, DATABASE_URL) are ever hardcoded in source code or committed to Git.
  - No secrets may appear in logs or error responses.
  - Production secrets are supplied strictly through secure environment/secrets management.
  - The application MUST validate all configuration on startup and fail fast if invalid.
  - Secret rotation considerations must be designed into the infrastructure.
  - Configuration access is limited to a centralized module; arbitrary application code cannot access `process.env`.

## Data Privacy & Jurisdiction
- **Jurisdiction**: India.
- **Privacy Requirements**: The application must comply with applicable local data protection standards (e.g., DPDP Act) focusing on consent, purpose limitation, and secure storage. 
- **Note**: This application is NOT automatically subject to HIPAA (US Law), however, strict security controls (encryption, audit logging) are implemented as universal security best practices regardless of the specific legal regime.

## Public Booking Endpoint Security
The `POST /appointments` endpoint is exposed to unauthenticated users. It requires robust defense:
- **Application Rate Limiting**: Limit to 3 bookings per IP per hour. (Distinct from Infrastructure DDoS protection like AWS Shield or Cloudflare WAF).
- **Idempotency**: Prevent duplicate submissions using a frontend-generated idempotency key or by checking existing exact-match records (same patient phone + time).
- **Server-Side Validation**: Never trust the `treatment`, `date`, or `time` from the browser. The backend must strictly validate the payload against business rules (e.g., date is in the future, time is during clinic hours).
- **Conflict Checking**: Enforced at the DB level (Postgres EXCLUDE constraint).
- **Spam Protection**: Consider integrating reCAPTCHA v3 or Turnstile if bot abuse occurs.

## Threat Model

| Threat | Attack Surface | Impact | Mitigation | Verification |
| --- | --- | --- | --- | --- |
| **Mass Assignment** | `POST /appointments` | Attacker sets `status=CONFIRMED` on creation. | Use Zod schema to restrict allowed fields. Strip unapproved keys. | Automated tests. |
| **BOLA / IDOR** | `GET /appointments/:id` | Doctor views another doctor's bookings. | Enforce Object-Level Authorization in the service layer. | API integration tests. |
| **Brute Force**| `POST /login` | Password guessing. | Implement specific login rate limiting (e.g., 5 failures/15 mins). | Load test script. |
| **CSRF** | State-changing endpoints | Attacker forces authenticated admin to create an account. | Double Submit Cookie pattern or strict Origin validation. | Security tests. |
