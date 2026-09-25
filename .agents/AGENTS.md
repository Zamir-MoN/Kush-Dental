# Project Rules for Kush Dental Clinic

## 1. Project Architecture Rules
- **Actual Stack:** Frontend is React 19 + Vite + TypeScript + TailwindCSS + Framer Motion. There is currently no backend framework.
- **Frontend/Backend Boundaries:** The frontend currently relies on static data (`src/data/index.ts`). A clear REST API boundary must be established.
- **API Conventions:** Future backend must expose a RESTful JSON API under `/api/v1`.
- **Database Conventions:** PostgreSQL with an ORM (Prisma or Drizzle) is recommended for relational data (users, appointments, treatments).
- **Service/Repository Patterns:** Backend should separate route controllers from business logic (services).
- **Validation Patterns:** Zod should be used for end-to-end type safety and runtime validation.
- **Error Handling:** Standardized JSON error responses (e.g., `{ error: { code, message, details } }`).
- **Configuration Management:** All application configuration must be accessed through the centralized validated configuration layer. Direct `process.env` access outside the configuration module is prohibited.
- **Secrets Management:** Never hardcode secrets, credentials, tokens, private keys, or production infrastructure credentials. NEVER commit `.env` to source control.

## 2. Production Safety Rules
- **Read-Only Audit:** ALWAYS inspect the existing implementation before making changes. Do not invent endpoints if the frontend does not need them.
- **Preserve Changes:** Preserve all existing working-tree changes and UI polish. Do not rewrite frontend components just because you'd do it differently.
- **No Destructive DB Operations:** `prisma db push`, `prisma migrate reset`, and DROP/TRUNCATE are strictly forbidden in production.
- **Test Before Deployment:** Run build `npm run build` and tests before any deployment step.
- **No Blind Upgrades:** Do not upgrade dependencies without inspecting the changelog.

## 3. Security Rules
- **Least Privilege:** Enforce strict RBAC (Patient, Doctor, Staff, Admin).
- **Authentication:** Use robust session management or secure, HttpOnly JWTs.
- **Input Validation:** All user input must be sanitized and validated server-side.
- **Rate Limiting:** Protect login, booking, and contact endpoints against brute force.

## 4. Patient Data Rules
- **Data Minimization:** Only request and store patient information strictly necessary for care and booking.
- **Secure Storage & Transmission:** Patient records and PII must be encrypted at rest and in transit.
- **Auditability:** All access and modification to patient records MUST be logged.
- **Least-Privilege Access:** Doctors can only see their patients; staff have tailored access.

## 5. Database Rules
- **Migrations:** Use explicit migration files (e.g., Prisma migrations) instead of destructive schema syncs.
- **Referential Integrity:** Enforce foreign keys.
- **Soft Deletion:** Use `deletedAt` for important records (appointments, patients, doctors) to preserve history.

## 6. API Rules
- **Pagination & Filtering:** Apply pagination limits to all list endpoints.
- **Idempotency:** Payment or critical state-changing operations must be idempotent.

## 7. Testing Rules
- **Unit & Integration:** Critical business logic (booking conflicts, authorization) must have test coverage.
- **API Tests:** Ensure RBAC boundaries are strictly enforced.

## 8. Documentation Rules
- **Architecture Decisions:** Document all significant technical decisions (ADRs).
