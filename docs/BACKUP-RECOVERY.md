# Backup & Recovery Strategy

## Objective
To ensure that Kush Dental Clinic does not lose patient records, appointment data, or critical infrastructure configurations in the event of an outage, corruption, or malicious attack.

## 1. Database Backups (Provider-owned Responsibilities)
- **Strategy**: Automated daily snapshots + Point-In-Time Recovery (PITR).
- **Encryption**: Backups MUST be encrypted at rest using provider-managed keys (e.g., AWS KMS).
- **Access Control**: Backup restoration capabilities are restricted to root infrastructure administrators only. Application Admins (Clinic Staff) cannot trigger DB restores.

## 2. Recovery Objectives (Proposed Targets)
*Note: These are proposed targets and require formal sign-off from the project owners.*
- **RPO (Recovery Point Objective)**: 5 minutes (via PITR).
- **RTO (Recovery Time Objective)**: 1 hour (time to spin up a new DB instance and redirect traffic).

## 3. Disaster Recovery Plan (Project-owned Responsibilities)
- **Scenario A: Database Recovery**
  1. Halt backend traffic (maintenance mode).
  2. Request infrastructure admin to restore DB from the last known good PITR snapshot to a new instance.
  3. Update backend secrets/configuration with new DB URL.
  4. Resume traffic.
- **Scenario B: Application Recovery (Frontend/Backend)**
  1. Ensure deployment pipelines (CI/CD) can recreate the application state purely from the Git repository.
  2. Redeploy to an alternative region or provider if the primary region fails.
- **Scenario C: Secrets/Configuration Recovery**
  1. Maintain a secure backup of production environment variables in a dedicated Secrets Manager (e.g., AWS Secrets Manager, 1Password) separate from the hosting provider.

## 4. Testing Backups
- A restore test ("Game Day") must be conducted semi-annually to verify data integrity and practice the recovery procedure.
