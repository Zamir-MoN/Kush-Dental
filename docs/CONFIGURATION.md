# Centralized Configuration Architecture

## Objective
The Kush Dental Clinic backend strictly prohibits scattering `process.env.X` access across application modules. All environment-specific configuration, secrets, infrastructure settings, security settings, clinic configuration, and configurable application behavior must be centrally managed and validated at startup.

## Environment File Strategy
- **`.env`**: Must **NEVER** be committed to version control. Contains actual secrets and environment-specific overrides.
- **`.env.example`**: **MUST** be committed. Contains only variable names and safe example values/placeholders.

Production secrets must come from the deployment platform's secret manager (e.g., AWS Secrets Manager, Vercel Env, Render Secrets) and never from a committed file.

## Configuration Categories
We explicitly distinguish between three types of configuration:

1. **SECRET CONFIGURATION**: Must never be logged, hardcoded, or exposed in API responses.
   - `DATABASE_URL` (Includes DB password)
   - `JWT_SECRET`
2. **NON-SECRET CONFIGURATION**: Infrastructure and application wiring.
   - `NODE_ENV` (development, staging, production)
   - `PORT`
   - `CORS_ORIGIN`
   - `LOG_LEVEL`
3. **BUSINESS CONFIGURATION**: Application behavior that is environment-specific but doesn't belong in the database.
   - `CLINIC_TIMEZONE` (e.g., `Asia/Kolkata`)
   - `PAGINATION_DEFAULT_LIMIT`
   - *Note*: Things like specific operating hours, pricing, or doctor availability should be managed in the **Database**, not in `.env`, to allow Admin Dashboard mutations without a server restart.

## Centralized Configuration Layer Structure
The backend configuration module acts as a strict boundary.

```
process.env -> Zod Schema Validation -> Validated Env Object -> Application Modules
```

**Proposed File Structure:**
```
backend/
└── src/
    └── config/
        ├── env.ts       (Zod schema definitions and process.env parsing)
        └── index.ts     (Exporting the categorized config object)
```

## Fail Fast Principle
The application **MUST FAIL** synchronously during startup if required configuration is missing or invalid.
- Missing `DATABASE_URL` -> Crash.
- Missing `JWT_SECRET` in production -> Crash.
- Invalid `PORT` (e.g., string instead of number) -> Crash.

Insecure placeholders (e.g., `JWT_SECRET=supersecret`) are strictly forbidden in production.

## Application Code Rule
Application and business modules must **NOT** use `process.env` directly.

**BAD:**
```typescript
const port = process.env.PORT || 3000;
```

**GOOD:**
```typescript
import { config } from '../config';
const port = config.server.port;
```
