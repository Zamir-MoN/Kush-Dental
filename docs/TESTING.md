# Testing Strategy

## Layers of Testing

### 1. Security Regression & Authorization Tests (Critical)
- **BOLA/IDOR Tests**: Explicit test cases asserting that `Doctor A` receives a 403 Forbidden when attempting to access `Doctor B`'s appointments.
- **Authentication**: Assert that missing or expired JWTs return 401 Unauthorized.
- **CSRF**: Verify that state-changing requests lacking the proper CSRF token (or Origin header) fail.
- **Rate Limiting**: Assert that the 4th booking attempt from the same IP within an hour returns 429.

### 2. Business Logic Tests (Unit/Integration)
- **Appointment Concurrency**: Test that concurrent requests for the exact same `startsAt`/`endsAt` block for the same doctor trigger the PostgreSQL exclusion constraint and fail gracefully (HTTP 409 Conflict).
- **Duplicate Submissions**: Test idempotency key handling.
- **Timezone Behavior**: Verify that a booking created at UTC X maps perfectly to the clinic's local time Y without offset drift.
- **Invalid State Transitions**: Test that forcing an appointment from `COMPLETED` to `REQUESTED` is rejected by the state machine.

### 3. Database Constraints
- **Migrations**: Test up/down migrations locally on a fresh schema before merging.

### 4. Configuration Testing
- **Validation Rules**: Tests must assert that the application deterministically fails to start if required environment variables are missing or invalid.
- **Scenarios to Cover**:
  - Valid configuration loading.
  - Missing required environment variables.
  - Invalid values (e.g., non-numeric PORT).
  - Rejection of production insecure defaults.
  - Development defaults (where explicitly permitted).
  - Invalid CORS, database, or authentication configurations.

### 5. E2E (End-to-End) Tests
- Verify critical paths via Playwright/Cypress.

## Quality Gates
- **Phase Requirement**: Tests specific to a phase (e.g., Concurrency tests during the Booking API phase) **MUST** be written and pass in CI *before* that phase is marked complete and merged to `main`.
