import pytest
import uuid
from datetime import datetime, timezone, timedelta
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import PendingRollbackError

from app.models import Role, AppointmentStatus
from app.schemas.appointment import AppointmentCreate, AppointmentUpdateStatus
from app.services.appointment_service import create_appointment, update_appointment_status
from app.core.exceptions import NotFoundException, ValidationException, ConflictException
from app.repositories import user_repo, patient_repo
from app.schemas.user import UserCreate
from app.schemas.patient import PatientCreate

import pytest_asyncio

@pytest_asyncio.fixture
async def setup_data(db_session: AsyncSession):
    doc = await user_repo.create(db_session, UserCreate(email=f"doc_{uuid.uuid4()}@test.com", role=Role.DOCTOR, password="pass"), "hash")
    pat = await patient_repo.create(db_session, PatientCreate(fullName="Test Pat", phone=f"555{str(uuid.uuid4().int)[:7]}"))
    return doc, pat

@pytest.mark.asyncio
async def test_appointment_creation(db_session, setup_data):
    doc, pat = setup_data
    now = datetime.now(timezone.utc)
    apt_in = AppointmentCreate(
        patientId=pat.id, doctorId=doc.id, treatment="Checkup",
        startsAt=now, endsAt=now + timedelta(hours=1)
    )
    apt = await create_appointment(db_session, actor_id=doc.id, apt_in=apt_in)
    assert apt.id is not None
    assert apt.status == AppointmentStatus.REQUESTED

@pytest.mark.asyncio
async def test_nonexistent_patient_and_doctor(db_session, setup_data):
    doc, pat = setup_data
    now = datetime.now(timezone.utc)
    # Nonexistent patient
    with pytest.raises(NotFoundException) as exc:
        await create_appointment(db_session, actor_id=doc.id, apt_in=AppointmentCreate(
            patientId=uuid.uuid4(), doctorId=doc.id, treatment="C", startsAt=now, endsAt=now+timedelta(hours=1)
        ))
    assert exc.value.code == "NOT_FOUND"

    # Nonexistent doctor
    with pytest.raises(NotFoundException):
        await create_appointment(db_session, actor_id=doc.id, apt_in=AppointmentCreate(
            patientId=pat.id, doctorId=uuid.uuid4(), treatment="C", startsAt=now, endsAt=now+timedelta(hours=1)
        ))

@pytest.mark.asyncio
async def test_overlapping_appointments(db_session, setup_data):
    doc, pat = setup_data
    now = datetime.now(timezone.utc)
    
    # First appointment
    apt1 = await create_appointment(db_session, actor_id=doc.id, apt_in=AppointmentCreate(
        patientId=pat.id, doctorId=doc.id, treatment="C", startsAt=now, endsAt=now+timedelta(hours=1)
    ))
    
    # Overlapping appointment
    with pytest.raises(ConflictException) as exc:
        await create_appointment(db_session, actor_id=doc.id, apt_in=AppointmentCreate(
            patientId=pat.id, doctorId=doc.id, treatment="C", startsAt=now+timedelta(minutes=30), endsAt=now+timedelta(hours=1, minutes=30)
        ))
    assert "overlaps" in exc.value.message

@pytest.mark.asyncio
async def test_adjacent_appointments_allowed(db_session, setup_data):
    doc, pat = setup_data
    now = datetime.now(timezone.utc)
    
    await create_appointment(db_session, actor_id=doc.id, apt_in=AppointmentCreate(
        patientId=pat.id, doctorId=doc.id, treatment="C", startsAt=now, endsAt=now+timedelta(hours=1)
    ))
    
    # Exactly adjacent
    apt2 = await create_appointment(db_session, actor_id=doc.id, apt_in=AppointmentCreate(
        patientId=pat.id, doctorId=doc.id, treatment="C", startsAt=now+timedelta(hours=1), endsAt=now+timedelta(hours=2)
    ))
    assert apt2.id is not None

@pytest.mark.asyncio
async def test_cancelled_appointment_not_blocking(db_session, setup_data):
    doc, pat = setup_data
    now = datetime.now(timezone.utc)
    
    apt1 = await create_appointment(db_session, actor_id=doc.id, apt_in=AppointmentCreate(
        patientId=pat.id, doctorId=doc.id, treatment="C", startsAt=now, endsAt=now+timedelta(hours=1)
    ))
    await update_appointment_status(db_session, apt1.id, AppointmentUpdateStatus(status=AppointmentStatus.CANCELLED, cancellationReason="Sick"), actor_id=doc.id)
    
    # Slot is now free
    apt2 = await create_appointment(db_session, actor_id=doc.id, apt_in=AppointmentCreate(
        patientId=pat.id, doctorId=doc.id, treatment="C", startsAt=now, endsAt=now+timedelta(hours=1)
    ))
    assert apt2.id is not None

@pytest.mark.asyncio
async def test_valid_transitions(db_session, setup_data):
    doc, pat = setup_data
    now = datetime.now(timezone.utc)
    apt = await create_appointment(db_session, actor_id=doc.id, apt_in=AppointmentCreate(
        patientId=pat.id, doctorId=doc.id, treatment="C", startsAt=now, endsAt=now+timedelta(hours=1)
    ))
    
    apt = await update_appointment_status(db_session, apt.id, AppointmentUpdateStatus(status=AppointmentStatus.CONFIRMED), actor_id=doc.id)
    assert apt.status == AppointmentStatus.CONFIRMED

    apt = await update_appointment_status(db_session, apt.id, AppointmentUpdateStatus(status=AppointmentStatus.COMPLETED), actor_id=doc.id)
    assert apt.status == AppointmentStatus.COMPLETED

@pytest.mark.asyncio
async def test_invalid_and_terminal_transitions(db_session, setup_data):
    doc, pat = setup_data
    now = datetime.now(timezone.utc)
    apt = await create_appointment(db_session, actor_id=doc.id, apt_in=AppointmentCreate(
        patientId=pat.id, doctorId=doc.id, treatment="C", startsAt=now, endsAt=now+timedelta(hours=1)
    ))
    
    # REQUESTED -> COMPLETED is invalid
    with pytest.raises(ConflictException):
        await update_appointment_status(db_session, apt.id, AppointmentUpdateStatus(status=AppointmentStatus.COMPLETED), actor_id=doc.id)
        
    # REQUESTED -> CANCELLED
    apt = await update_appointment_status(db_session, apt.id, AppointmentUpdateStatus(status=AppointmentStatus.CANCELLED, cancellationReason="No"), actor_id=doc.id)
    
    # Terminal check
    with pytest.raises(ConflictException) as exc:
        await update_appointment_status(db_session, apt.id, AppointmentUpdateStatus(status=AppointmentStatus.REQUESTED), actor_id=doc.id)
    assert "terminal state" in exc.value.message

@pytest.mark.asyncio
async def test_concurrent_appointment_creation(db_session, setup_data):
    doc, pat = setup_data
    now = datetime.now(timezone.utc)
    
    # Create two identically timed appointments
    apt_in1 = AppointmentCreate(patientId=pat.id, doctorId=doc.id, treatment="C", startsAt=now, endsAt=now+timedelta(hours=1))
    apt_in2 = AppointmentCreate(patientId=pat.id, doctorId=doc.id, treatment="C", startsAt=now, endsAt=now+timedelta(hours=1))

    # This should succeed
    await create_appointment(db_session, actor_id=doc.id, apt_in=apt_in1)

    # This should fail due to concurrency/overlap constraint
    with pytest.raises(ConflictException):
        await create_appointment(db_session, actor_id=doc.id, apt_in=apt_in2)
