# ADR 001: Backend Framework Selection

## Status
Proposed (Pending Approval)

## Context
The Kush Dental Clinic project requires a robust, scalable backend to serve an existing React/Vite SPA. We evaluated Express, Fastify, and Hono.
- **Fastify**: High performance, great ecosystem, but steeper learning curve for standard middleware.
- **Hono**: Excellent for edge environments (Cloudflare Workers, Deno, Bun), but our deployment target is a standard Node.js environment.
- **Express**: The industry standard for Node.js. Massive ecosystem, universally understood middleware, and perfectly adequate performance for a dental clinic's expected load.

## Decision
We will use **Express (Node.js)** with **TypeScript**.

## Rationale
Given the scale of a single dental clinic, raw request throughput (where Fastify/Hono shine) is less critical than ecosystem maturity, ease of hiring, and vast documentation for security middleware (Helmet, CORS, rate-limiting). Express provides the most stable, predictable foundation for this use case.

## Consequences
- We will rely on standard Express middleware.
- We must handle async errors carefully (e.g., using `express-async-errors` or custom wrappers) since Express 4 does not natively catch promise rejections.
