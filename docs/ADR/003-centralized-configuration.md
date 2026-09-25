# ADR 003: Centralized and Validated Configuration

## Status
Accepted

## Context
Configuration currently needs to support development, testing, staging, and production without scattering values across source files. Relying directly on `process.env` throughout the codebase leads to hidden dependencies, missing validation, and delayed runtime crashes when secrets are forgotten.

## Decision
Use environment variables as the external configuration source and a centralized, validated TypeScript configuration layer as the application's internal configuration interface.

## Validation
Use **Zod** to define schemas for all environment variables, applying type coercion (e.g., converting `"3000"` to `3000`) and strict runtime validation during the initial server boot sequence.

## Security
Secrets remain in environment/secrets management and are never hardcoded or logged. The config object should be designed such that sensitive fields are clearly categorized, preventing accidental exposure if the config object is serialized.

## Consequences
- **Consistent configuration access**: `config.database.url` instead of `process.env.DATABASE_URL`.
- **Fail-fast startup**: The server crashes immediately with a clear error message if the environment is misconfigured.
- **Easier deployment**: Operations teams know exactly what environment variables are required by looking at `env.ts` or `.env.example`.
- **Safer secret management**: Only the config module interfaces with the raw environment.
- **Easier testing**: The config object can be mocked or overridden easily during unit tests.
- **Reduced configuration drift**: Staging and production configurations share the exact same validation logic.
