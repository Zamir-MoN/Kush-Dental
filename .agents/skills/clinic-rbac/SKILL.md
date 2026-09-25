---
name: clinic-rbac
description: Role-Based Access Control logic for Kush Dental Clinic.
---

# Clinic RBAC

## Purpose
Use this skill to implement and verify authorization rules across the backend.

## Roles
1. **Patient**: Can manage their own profile and book/view their own appointments.
2. **Doctor**: Can view their schedule and access records of patients assigned to them.
3. **Staff/Receptionist**: Can manage the master schedule and create appointments on behalf of patients.
4. **Admin**: Has full system access, including staff management and clinic configuration.

## Verification Requirements
- Every protected route MUST verify the user's role before accessing the database.
- Unit tests must be written to ensure Role A cannot access Role B's privileged endpoints.
