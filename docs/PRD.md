# Product Requirements Document (PRD)

## 1. Objective
To build a secure, production-grade backend and integrate it with the existing React/Vite frontend for Kush Dental Clinic. The system must support online bookings, doctor schedules, patient profiles, and administrative oversight.

## 2. Requirements Inventory

### A. Confirmed Existing Requirements (from UI)
- The frontend features a Booking flow (`src/pages/Booking.tsx`) collecting: Treatment, Date, Time, Full Name, Phone, Email.
- The UI lists treatments, services, clinicians, and blog articles (currently mocked in `src/data/index.ts`).
- Responsive, luxury-themed "clinical" UI.

### B. Clearly Implied Requirements
- **Backend API**: The frontend needs a way to submit booking requests and fetch dynamic schedules.
- **Database**: Must store Appointments, Patients (implicit from bookings), Doctors/Clinicians.
- **Admin Dashboard**: Necessary for clinic staff to view and manage appointments (implied by the existence of a booking system).

### C. Missing Requirements (Needs Product Decision)
- *Authentication*: Does the patient need an account to book, or is it guest checkout? (Assumption: Guest booking is fine initially, but admin needs auth).
- *Notifications*: Do we send SMS/Email confirmations upon booking?
- *Payments*: Is payment collected upfront or at the clinic? (Assumption: At the clinic for now).
- *Blog CMS*: Will the blog articles be hardcoded, or managed via the backend/CMS?

### D. Security Requirements
- Secure storage of Patient Data (PII).
- RBAC for staff and doctors to manage appointments safely.
- Rate limiting on the booking endpoint.

### E. Operational Requirements
- Reliable hosting (e.g., Vercel for frontend, Node server for backend).
- Database backups.
