---
name: appointment-workflows
description: Rules for handling dental appointment scheduling, conflicts, and state transitions.
---

# Appointment Workflows

## Purpose
Use this skill to safely implement the booking engine for Kush Dental.

## Booking Rules
- **Conflicts**: A doctor cannot have two overlapping appointments.
- **Validation**: Ensure dates are in the future and fall within clinic hours (9 AM - 6 PM).
- **State Machine**: Appointments move through states: `REQUESTED` -> `CONFIRMED` -> `COMPLETED` / `CANCELLED`.
- **Concurrency**: Handle concurrent booking requests gracefully (e.g., database transactions/locks to prevent double-booking).

## Relevant Frontend Mapping
- See `src/pages/Booking.tsx` for the expected fields (Treatment, Date, Time, Full Name, Phone, Email).
