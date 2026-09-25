---
name: patient-data-security
description: Guidelines for securely handling sensitive patient data (PII/PHI).
---

# Patient Data Security

## Purpose
Use this skill when implementing data access layers, APIs, or database schemas that touch patient personal information.

## Jurisdiction & Compliance
- **Jurisdiction**: India.
- **Legal Context**: Do NOT assume HIPAA applies. Focus on general privacy principles (purpose limitation, data minimization) and local DPDP Act considerations if formally required by the business.
- **Security Best Practices**: Regardless of legal regime, patient records (Name, Phone, Medical History) are sensitive and require strict protection.

## When to use it
- Designing the `User` and `Patient` models.
- Implementing endpoints that return patient names, phone numbers, or treatment history.

## Constraints
- **Audit Logging**: Any fetch, update, or deletion of patient records MUST generate an audit log event (See `AUDIT-LOGGING.md`).
- **No Hard Deletes**: Soft delete patient records (`deletedAt`) to preserve clinical history.
- **Object-Level Authorization**: Validate the `userId` of the requester against the `patientId` (or assigned doctor) being accessed.
