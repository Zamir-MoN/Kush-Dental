# ADR 002: Authentication Strategy

## Status
Proposed (Pending Approval)

## Context
We need to authenticate Clinic Staff, Doctors, and Admins. We must protect against XSS and CSRF attacks.

## Decision
We will implement **Session-based JWT Authentication via HttpOnly Cookies**.
- **Access Token**: Short-lived JWT (e.g., 15 minutes), stored in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
- **Refresh Strategy**: A long-lived refresh token (e.g., 7 days) stored as a hashed entry in the database (for revocation) and issued as a separate `HttpOnly` cookie.
- **CSRF Protection**: Because cookies will be sent automatically, `HttpOnly` and `SameSite` mitigate most CSRF vectors. Additionally, we will implement the **Synchronizer Token Pattern** or **Double Submit Cookie** for state-changing endpoints, AND validate the `Origin` header.

## Rationale
- Storing JWTs in `localStorage` exposes them to XSS.
- `HttpOnly` cookies protect against XSS payload extraction.
- Using a database-backed refresh token allows immediate session revocation by Admins (essential if a staff device is compromised).

## Consequences
- The frontend and backend must share the same domain (or be configured meticulously for CORS with `credentials: true`).
- We must implement endpoints for explicit Logout (clearing cookies and DB refresh token) and Password Reset.
- Strict password hashing (Argon2id) and brute-force protection on the `/login` endpoint are required.
