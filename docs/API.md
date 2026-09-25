# API Specification

## General API Standards
- **Timestamps**: All date/time fields MUST be ISO-8601 UTC strings.
- **Error Format**: All errors return a standard JSON structure:
  ```json
  {
    "error": {
      "code": "VALIDATION_FAILED", // or AUTHENTICATION_FAILED, AUTHORIZATION_FAILED, RATE_LIMIT_EXCEEDED, CONFLICT
      "message": "Invalid date format",
      "details": [{ "path": "date", "issue": "Must be a future date" }]
    },
    "correlationId": "req-12345"
  }
  ```
- **Pagination & Filtering**: List endpoints (`GET /admin/appointments`) use query parameters `?page=1&limit=20` and return `{ data: [...], meta: { total, page } }`.

## 1. Booking API
**POST /api/v1/appointments**
- **Purpose**: Submit a new booking request.
- **Auth**: Public (Guest)
- **Security Context**: 
  - Do NOT accept `status` or `doctorId` from the client payload. Force status to `REQUESTED`.
  - Validate treatment against a strict enum.
- **Idempotency**: Clients should send an `Idempotency-Key` header to prevent duplicate submissions.
- **Rate Limit**: 3 per IP per hour. (Returns HTTP 429).
- **Request**:
  ```json
  {
    "treatment": "Cosmetic Veneers",
    "startsAt": "2024-11-02T05:00:00Z", // Representing 10:30 AM IST
    "patient": {
      "fullName": "John Doe",
      "phone": "+919876543210",
      "email": "john@example.com"
    }
  }
  ```

## 2. Schedule API
**GET /api/v1/schedule/available-slots**
- **Purpose**: Fetch available times.
- **Auth**: Public

## 3. Admin Appointments
**GET /api/v1/admin/appointments**
- **Auth**: Requires JWT (Role: ADMIN, STAFF, DOCTOR). Object-level auth applies (Doctors see only their own).
