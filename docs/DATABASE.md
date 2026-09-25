# Database Schema Design

## Core Entities

### 1. User (Staff, Doctors, Admins) [REQUIRED NOW]
- `id` (UUID, PK)
- `email` (String, Unique)
- `passwordHash` (String)
- `role` (Enum: ADMIN, DOCTOR, STAFF)
- `createdAt`, `updatedAt`, `deletedAt`

### 2. Patient [REQUIRED NOW]
- `id` (UUID, PK)
- `fullName` (String)
- `phone` (String, Unique)
- `email` (String, Nullable)
- `createdAt`, `updatedAt`, `deletedAt`

### 3. Appointment [REQUIRED NOW]
- `id` (UUID, PK)
- `patientId` (FK -> Patient)
- `doctorId` (FK -> User, Nullable if unassigned)
- `treatment` (String)
- `startsAt` (timestamptz)
- `endsAt` (timestamptz)
- `status` (Enum: REQUESTED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW)
- `cancellationReason` (String, Nullable)
- `createdAt`, `updatedAt`, `deletedAt`

### 4. RefreshToken [REQUIRED NOW]
- `id` (UUID, PK)
- `userId` (FK -> User)
- `hashedToken` (String)
- `expiresAt` (timestamptz)
- `createdAt`

### 5. Treatment/Service [OPTIONAL/FUTURE]
- For now, services are statically defined in the frontend. Can be migrated to DB later for CMS capabilities.

### 6. AuditLog [REQUIRED NOW]
- `id` (UUID, PK)
- `actorId` (UUID, Nullable for Guest)
- `action` (String)
- `resourceType` (String)
- `resourceId` (UUID, Nullable)
- `result` (Enum: SUCCESS, FAILURE)
- `metadata` (JSONB)
- `timestamp` (timestamptz)

## Security & Concurrency Constraints
- **Concurrency (Overlapping Appointments)**: Relying purely on application-layer logic (e.g., `SELECT` before `INSERT`) is vulnerable to race conditions.
  - **PostgreSQL Strategy**: We will use a database-level exclusion constraint using GiST indexes to guarantee a doctor cannot be double-booked.
  - **Migration Strategy**: The initial Prisma migration must execute `CREATE EXTENSION IF NOT EXISTS btree_gist;` (required to support UUID equality operators in GiST indexes), followed by:
    `ALTER TABLE "Appointment" ADD CONSTRAINT no_overlapping_appointments EXCLUDE USING gist ("doctorId" WITH =, tstzrange("startsAt", "endsAt") WITH &&);`
- **Referential Integrity**: All FKs must explicitly define `ON DELETE RESTRICT` for Patients/Users to prevent accidental hard deletion of associated appointments.
- **Soft Deletion**: `deletedAt` will be used for Users, Patients, and Appointments.
