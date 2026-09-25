# Implementation Checklist

This document breaks the backend implementation into safe, verifiable phases.

## Phase 0: Architecture Gates (Status: READY FOR HUMAN APPROVAL)
- [x] Backend framework selected (Express).
- [x] Authentication architecture selected (HttpOnly JWT + Refresh).
- [x] Database architecture approved (Postgres, UTC timezone).
- [x] Appointment concurrency strategy defined (GiST exclude).
- [x] RBAC and Object-Level Authorization finalized.
- [x] Security model finalized (Rate limiting, Zod validation).
- [x] API contract finalized (Error formats, Idempotency).
- [ ] **Human architecture approval**

**STOP**: Do not proceed to Phase 1 until the architecture is explicitly signed off by a human.

## Phase 1: Backend Foundation
- [ ] Initialize Node.js/Express with TypeScript.
- [ ] Environment strategy defined and `.env.example` created.
- [ ] `.env` excluded from Git.
- [ ] Environment schema implemented with Zod validation.
- [ ] Centralized config module implemented (No application module directly reads `process.env`).
- [ ] Startup validation and production insecure-default protection implemented.
- [ ] Configuration tests implemented (Phase 1 Acceptance Criterion).
- [ ] Implement structured logging (e.g., Pino).
- [ ] Implement `GET /health/live` and `GET /health/ready`.
- [ ] Setup global error handler matching the API.md error format.

## Phase 2: Database Initialization (Completed on VPS)
- [x] Install PostgreSQL and Prisma ORM.
- [x] Define the Prisma Schema (`User`, `Patient`, `Appointment`, `RefreshToken`).
- [x] Implement the `EXCLUDE USING gist ("doctorId" WITH =, tstzrange("startsAt", "endsAt") WITH &&)` constraint in an initial Prisma migration (including `CREATE EXTENSION btree_gist`).
- [x] Run initial migration.

### Phase 2 Environment Report
- **VPS Environment**: `ayan` (51.20.121.253) running Ubuntu 22.04 LTS.
- **Backend Port**: `8010` (Managed via PM2 `kush-dental-dev`).
- **PostgreSQL Database Name**: `kush_dental_dev` (Local user `kush_dental_dev`).
- **Migration Status**: Completed successfully using `npx prisma migrate deploy`. GiST exclusion constraint verified natively in PostgreSQL.
- **Test Results**: All 16 Unit and Integration Tests PASSED, including schema checks, validation rules, and health endpoints.
- **Concurrency Test Result**: PASSED. Database physically rejected the race condition overlapping appointment insertion.
- **Infrastructure Assumptions**: `ayan` acts strictly as an isolated development environment. Production databases were NOT touched. Docker was unavailable, so the native PostgreSQL 14 instance on `ayan` was configured instead.

## Phase 3: Authentication & Security
- [ ] Implement Argon2 password hashing.
- [ ] Implement login/logout endpoints (Cookies).
- [ ] Implement CSRF middleware / Origin validation.
- [ ] Implement `requireAuth` and `requireRole` middleware.
- [ ] **Test Gate**: Authentication tests (BOLA, CSRF) must pass.

## Phase 4: Appointments Booking API (Public)
- [ ] Implement `POST /api/v1/appointments`.
- [ ] Add Zod validation (block `status`/`doctorId` injections).
- [ ] Handle concurrency/date conflicts.
- [ ] Implement Rate Limiting middleware.
- [ ] **Test Gate**: Rate limit and concurrency tests must pass.

## Phase 5: Admin / Staff Dashboard API
- [ ] Implement `GET /api/v1/admin/appointments` (Paginated, Filtered).
- [ ] Enforce Object-level Authorization (Doctors see only their own).
- [ ] Implement state machine rules for `PUT /api/v1/admin/appointments/:id`.

## Phase 6: Frontend Integration
- [ ] Wire `Booking.tsx` to `POST /api/v1/appointments`.
- [ ] Send `Idempotency-Key` header from frontend.
- [ ] Handle 409 Conflict and 429 Rate Limit UI states.

## Phase 7: Deployment & Observability
- [ ] Deploy database and backend.
- [ ] Configure Sentry for backend/frontend.
- [ ] Conduct Backup/Restore "Game Day".
