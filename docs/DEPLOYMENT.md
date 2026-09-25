# Deployment Strategy

## Current State
- The frontend is a static Vite build. It contains a `vercel.json`, implying it is currently (or intended to be) deployed on Vercel.

## Future State (with Backend)
We have two primary options for the backend deployment:

### Option A: Serverless (Next.js / Vercel Functions)
- *Pros*: Extremely easy to integrate with the existing Vercel setup. No infrastructure to manage.
- *Cons*: Cold starts, connection pooling issues with relational databases.

### Option B: Containerized / VPS (Docker / AWS ECS / Render)
- *Pros*: Persistent connections to Postgres, better for background jobs (e.g., reminder emails).
- *Cons*: Higher DevOps overhead.

## Recommended Pipeline
1. **Source Control**: GitHub repository.
2. **CI**: GitHub Actions (Lint `oxlint`, Build `npm run build`, Test `npm test`).
3. **CD**:
   - Frontend: Auto-deploy to Vercel on push to `main`.
   - Backend: Deploy to Render/Railway or AWS App Runner on push to `main`.
   - Database: Hosted Postgres (e.g., Supabase, Neon, AWS RDS).
4. **Environment**: Separate Staging and Production environments.
