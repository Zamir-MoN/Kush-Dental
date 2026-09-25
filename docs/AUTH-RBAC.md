# Authentication & RBAC

## Authentication vs Authorization
- **Authentication**: Verifying WHO the user is (via verifying their JWT).
- **Role Authorization (RBAC)**: Verifying if the user's role allows them to perform a specific action class (e.g., "Can DOCTORS view appointments?").
- **Object-Level Authorization**: Verifying if the user is allowed to access the *specific* record (e.g., "Can Doctor A view Doctor B's appointment?").

## Role Authorization (RBAC) Matrix

| Resource / Endpoint | Unauthenticated (Guest) | Patient (Future) | Staff (Reception) | Doctor | Admin |
| --- | --- | --- | --- | --- | --- |
| `POST /appointments` | Create | Create | Create | Create | Create |
| `GET /appointments` | Denied | Own Only | All | Assigned Only | All |
| `PUT /appointments/:id` | Denied | Cancel Own | Update All | Update Assigned | Update All |
| `GET /patients` | Denied | Own Profile | All | Assigned Only | All |
| `POST /staff` | Denied | Denied | Denied | Denied | Create |

## Object-Level Authorization Scoping

Never rely on UI hiding elements. The backend must explicitly verify access on every request.

1. **Patient Scoping**:
   - `GET /patients/:id` - If requester is DOCTOR, query must include `WHERE appointments.doctorId = req.user.id`. Doctor A cannot view a Patient who has never booked with Doctor A.
   
2. **Appointment Scoping**:
   - `GET /appointments/:id` - If requester is DOCTOR, query must ensure `appointment.doctorId === req.user.id`.

3. **Staff Scoping**:
   - Staff have broad access to schedules and patient records to facilitate clinic operations, but they cannot modify core Clinic Settings or create other Staff users.

## Implementation Details
- See `ADR-002` for the Session strategy (JWT in HttpOnly cookies + DB Refresh Tokens).
- Middleware `requireAuth` parses the token.
- Middleware `requireRole(['ADMIN', 'STAFF'])` enforces RBAC.
- Service-level logic enforces Object-Level Authorization based on `req.user.id`.
