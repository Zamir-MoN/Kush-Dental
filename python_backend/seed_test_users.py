import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from datetime import datetime, timezone

from app.core.config import settings
from app.models import User, Role
from app.utils.security import get_password_hash
from app.schemas.auth import LoginRequest
from app.services.auth_service import authenticate_user

# Use the primary DB
DATABASE_URL = settings.DATABASE_URL

engine = create_async_engine(DATABASE_URL)
async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def seed_users():
    async with async_session_maker() as db:
        # STAFF
        staff_email = settings.SEED_STAFF_EMAIL
        # Query by ROLE instead of email to avoid creating duplicates if email changed
        result = await db.execute(select(User).where(User.role == Role.STAFF))
        staff_user = result.scalars().first()
        if not staff_user:
            staff_user = User(
                email=staff_email,
                passwordHash=get_password_hash(settings.SEED_STAFF_PASSWORD),
                role=Role.STAFF,
                updatedAt=datetime.now(timezone.utc)
            )
            db.add(staff_user)
            print("Created STAFF user.")
        else:
            staff_user.email = staff_email
            staff_user.passwordHash = get_password_hash(settings.SEED_STAFF_PASSWORD)
            print("Updated STAFF user.")
            
        # DOCTOR
        doctor_email = settings.SEED_DOCTOR_EMAIL
        result = await db.execute(select(User).where(User.role == Role.DOCTOR))
        doctor_user = result.scalars().first()
        if not doctor_user:
            doctor_user = User(
                email=doctor_email,
                passwordHash=get_password_hash(settings.SEED_DOCTOR_PASSWORD),
                role=Role.DOCTOR,
                updatedAt=datetime.now(timezone.utc)
            )
            db.add(doctor_user)
            print("Created DOCTOR user.")
        else:
            doctor_user.email = doctor_email
            doctor_user.passwordHash = get_password_hash(settings.SEED_DOCTOR_PASSWORD)
            print("Updated DOCTOR user.")
            
        await db.commit()

        try:
            print("\nVerifying STAFF login...")
            staff_token, _ = await authenticate_user(db, LoginRequest(email=staff_email, password=settings.SEED_STAFF_PASSWORD))
            print(f"STAFF Login SUCCESS. Role verified: {staff_token.user.role}")
            
            print("Verifying DOCTOR login...")
            doctor_token, _ = await authenticate_user(db, LoginRequest(email=doctor_email, password=settings.SEED_DOCTOR_PASSWORD))
            print(f"DOCTOR Login SUCCESS. Role verified: {doctor_token.user.role}")
        except Exception as e:
            print(f"Login failed: {e}")

if __name__ == "__main__":
    asyncio.run(seed_users())
