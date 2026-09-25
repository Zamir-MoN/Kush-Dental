import pytest
import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings
from app.models import Base
from fastapi.testclient import TestClient
from httpx import AsyncClient, ASGITransport
from app.main import app
import asyncio

import sys
from urllib.parse import urlparse

def verify_test_db_safety(node_env: str, test_db_url: str):
    if node_env != 'test':
        print("ERROR: NODE_ENV must be 'test' to run tests.", file=sys.stderr)
        sys.exit(1)
        
    if not test_db_url:
        print("ERROR: TEST_DATABASE_URL is missing.", file=sys.stderr)
        sys.exit(1)
        
    try:
        parsed = urlparse(test_db_url)
        db_name = parsed.path.lstrip('/')
    except Exception as e:
        print(f"ERROR: Could not parse TEST_DATABASE_URL safely. {e}", file=sys.stderr)
        sys.exit(1)
        
    if db_name != 'kush_dental_test':
        print(f"ERROR: Safety guard tripped! Target DB is '{db_name}', strictly expected 'kush_dental_test'.", file=sys.stderr)
        sys.exit(1)

verify_test_db_safety(settings.NODE_ENV, settings.TEST_DATABASE_URL)

from sqlalchemy.pool import NullPool
SQLALCHEMY_DATABASE_URL = settings.TEST_DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(SQLALCHEMY_DATABASE_URL, echo=False, poolclass=NullPool)
TestingSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)

import pytest_asyncio

# Removed deprecated event_loop fixture

@pytest_asyncio.fixture(scope="function")
async def db_session():
    async with TestingSessionLocal() as session:
        yield session
        await session.rollback()

@pytest_asyncio.fixture(scope="function")
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c

from app.db.session import get_db

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

from app.utils.security import create_access_token, get_password_hash
from app.models import Role, User
from app.schemas.user import UserCreate
from app.repositories import user_repo
import uuid

@pytest.fixture
def csrf_token():
    return "test-csrf-token"

@pytest_asyncio.fixture
async def doctor_user(db_session):
    user_id = uuid.uuid4()
    password_hash = get_password_hash("pass")
    doc = await user_repo.create(db_session, UserCreate(email=f"doc_{user_id}@test.com", role=Role.DOCTOR, password="pass"), password_hash)
    await db_session.commit()
    return doc

@pytest_asyncio.fixture
async def doctor_auth_headers(doctor_user, csrf_token):
    token = create_access_token({"sub": str(doctor_user.id), "role": Role.DOCTOR.value})
    return {
        "Authorization": f"Bearer {token}",
        "x-csrf-token": csrf_token,
        "Cookie": f"csrf_token={csrf_token}"
    }

@pytest_asyncio.fixture
async def staff_user(db_session):
    user_id = uuid.uuid4()
    password_hash = get_password_hash("pass")
    staff = await user_repo.create(db_session, UserCreate(email=f"staff_{user_id}@test.com", role=Role.STAFF, password="pass"), password_hash)
    await db_session.commit()
    return staff

@pytest_asyncio.fixture
async def staff_auth_headers(staff_user, csrf_token):
    token = create_access_token({"sub": str(staff_user.id), "role": Role.STAFF.value})
    return {
        "Authorization": f"Bearer {token}",
        "x-csrf-token": csrf_token,
        "Cookie": f"csrf_token={csrf_token}"
    }

from app.schemas.patient import PatientCreate
from app.repositories import patient_repo

@pytest_asyncio.fixture
async def db_patient(db_session):
    import uuid
    random_phone = str(uuid.uuid4().int)[:10]
    patient_in = PatientCreate(fullName="Test Patient", email=f"testpatient_{random_phone}@test.com", phone=random_phone)
    patient = await patient_repo.create(db_session, patient_in)
    await db_session.commit()
    return patient

from app.schemas.appointment import AppointmentCreate
from app.repositories import appointment_repo
import datetime

@pytest_asyncio.fixture
async def db_appointment(db_session, db_patient, doctor_user):
    apt_in = AppointmentCreate(
        patientId=db_patient.id,
        doctorId=doctor_user.id,
        treatment="Test Treatment",
        startsAt=datetime.datetime.now(datetime.timezone.utc),
        endsAt=datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
    )
    apt = await appointment_repo.create(db_session, apt_in)
    await db_session.commit()
    return apt
