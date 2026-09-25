# Timezone Strategy

## Context
Dental appointments are highly time-sensitive. Incorrect timezone conversions can lead to missed appointments or overlapping bookings.

## Strategy Definitions

### 1. TECHNICAL DECISION: Database & API
- **Database Storage**: ALL timestamps (`startsAt`, `endsAt`, `createdAt`, `updatedAt`) MUST be stored in the database in **UTC** without exception using the `TIMESTAMP WITH TIME ZONE` (`timestamptz`) data type.
- **API Representation**: The API will exclusively communicate timestamps in **ISO-8601 format** with the `Z` (UTC) suffix (e.g., `"2024-11-02T05:00:00Z"`).
- **Business Logic**: Any server-side calculations involving business hours (e.g. 9:00 AM - 6:00 PM) must strictly evaluate the UTC timestamps converted to the Clinic Timezone in memory.

### 2. BUSINESS DECISION: Clinic Timezone (Pending Confirmation)
- **Status**: **PENDING EXPLICIT CLINIC-OWNER CONFIRMATION**.
- **Proposed Value**: `Asia/Kolkata` (IST, UTC+5:30).
- **Frontend Display**: The frontend will convert the UTC ISO-8601 strings into the user's local timezone (or ideally, strictly force the display to the Clinic's timezone to avoid patient confusion if they are traveling).

2. **Database Storage**
   - ALL timestamps (`startsAt`, `endsAt`, `createdAt`, `updatedAt`) MUST be stored in the database in **UTC** without exception.
   - Postgres data type: `TIMESTAMP WITH TIME ZONE` (timestamptz).

3. **API Representation**
   - The API will exclusively communicate timestamps in **ISO-8601 format** with the `Z` (UTC) suffix.
   - Example: `"2024-11-02T05:00:00Z"` (which corresponds to 10:30 AM IST).

4. **Frontend Display**
   - The frontend will convert the UTC ISO-8601 strings into the user's local timezone (or strictly force the display to the Clinic's timezone to avoid patient confusion if they are traveling).
   - **Recommendation**: Force display to Asia/Kolkata so the patient knows exactly when to show up at the physical clinic.

5. **Daylight Saving Time (DST)**
   - India does not observe DST. If the jurisdiction changes, storing in UTC gracefully handles local DST shifts.
