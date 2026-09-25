---
name: dental-clinic-domain
description: Domain knowledge for a dental clinic system, focusing on patient management, treatments, and clinical records.
---

# Dental Clinic Domain

## Purpose
Use this skill when designing or implementing features related to treatments, patient clinical records, and clinic operations.

## When to use it
- Modeling patients, doctors, and treatments.
- Implementing the booking flow (e.g., cosmetic dentistry vs. oral surgery).

## Relevant Project Conventions
- **Treatments**: Currently mocked in `src/data/index.ts`. Must transition to dynamic DB entities.
- **Terminology**: Use precise terminology (e.g., Prosthodontist, Implant Surgeon, Veneers).

## Constraints
- Never expose unrelated patient records to doctors or staff.
- Adhere to the `AGENTS.md` Patient Data Rules.
