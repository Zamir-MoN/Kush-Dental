# Kush Dental Clinic

**Current Status**: 
- **Python backend**: Migration implementation (in progress).
- **Node backend**: Temporary rollback/reference implementation.
- **PM2**: Still running Node backend on port 8010.
- **Frontend**: Unchanged.
- **PostgreSQL schema**: Unchanged (Alembic is the future migration authority, currently synchronized to the Prisma baseline without modification).

## Architecture

This project is currently migrating from Node/Express/Prisma to Python/FastAPI/SQLAlchemy.

- **Frontend**: React 19, Vite, TypeScript, TailwindCSS
- **Backend (Target)**: Python 3.12+, FastAPI, SQLAlchemy 2.x, Alembic, PostgreSQL
- **Backend (Current)**: Node.js, Express, TypeScript, Prisma, PostgreSQL

Please see the `python_backend/` directory for the active migration implementation.
