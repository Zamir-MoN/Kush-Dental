# Audit Logging Strategy

## Purpose
To maintain a tamper-evident, secure log of critical actions performed within the clinic's system for operational integrity, security investigations, and general best practices.

## Defined Auditable Events
Do not log every generic database read. Log only meaningful events:

- `LOGIN_SUCCESS` / `LOGIN_FAILURE` / `LOGOUT`
- `PASSWORD_RESET`
- `PATIENT_CREATE` / `PATIENT_UPDATE` / `PATIENT_DELETE`
- `PATIENT_VIEW` (Explicitly viewing a specific patient's clinical profile)
- `APPOINTMENT_CREATE` / `APPOINTMENT_UPDATE` / `APPOINTMENT_CANCEL`
- `ROLE_CHANGE`
- `ADMIN_CONFIGURATION_CHANGE`

## Log Format
Logs must be structured (JSON) and include:
- `timestamp`: ISO-8601 UTC.
- `actorId`: The User ID making the request (or 'GUEST' for public bookings).
- `action`: The event name (e.g., `APPOINTMENT_CREATE`).
- `resourceType`: e.g., 'Appointment', 'Patient'.
- `resourceId`: The UUID of the affected record.
- `result`: `SUCCESS` or `FAILURE`.
- `ipAddress`: Request IP (ensure proxies are trusted if behind load balancer).
- `userAgent`: (Optional) specifically for auth events.
- `correlationId`: A unique request ID linking the log to the web request lifecycle.
- `metadata`: JSON payload of non-sensitive changed context (e.g., `{"oldStatus": "REQUESTED", "newStatus": "CONFIRMED"}`).

*Critical Constraint*: **NEVER** put sensitive patient content (health history), PII (phone numbers), or passwords into the audit logs.

## Retention and Access Controls
- **Retention**: Keep logs for a minimum of 1 year in hot storage, archive thereafter.
- **Access Control**: Audit logs are strictly read-only. Only the highest-tier Admin (or an external compliance auditor) can view the raw logs.
