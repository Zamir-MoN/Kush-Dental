import pytest
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timezone, timedelta
from app.models import User, Patient, Appointment, Role, AppointmentStatus
import uuid

@pytest.mark.asyncio
async def test_database_connection(db_session):
    assert db_session.is_active

@pytest.mark.asyncio
async def test_gist_exclusion_constraint(db_session):
    # Setup
    doctor_id = uuid.uuid4()
    patient_id = uuid.uuid4()
    
    now = datetime.now(timezone.utc)
    doctor = User(id=doctor_id, email=f"doc_{doctor_id}@test.com", passwordHash="hash", role=Role.DOCTOR, updatedAt=now)
    patient = Patient(id=patient_id, fullName="Test Patient", phone=f"555{str(uuid.uuid4().int)[:7]}", updatedAt=now)
    
    db_session.add(doctor)
    db_session.add(patient)
    await db_session.flush()

    now = datetime.now(timezone.utc)
    # Appointment 1: 10:00 to 11:00
    apt1 = Appointment(
        patientId=patient_id,
        doctorId=doctor_id,
        treatment="Checkup",
        startsAt=now,
        endsAt=now + timedelta(hours=1),
        status=AppointmentStatus.CONFIRMED,
        updatedAt=now
    )
    db_session.add(apt1)
    await db_session.flush()

    # Appointment 2: 10:30 to 11:30 (OVERLAPS!)
    apt2 = Appointment(
        patientId=patient_id,
        doctorId=doctor_id,
        treatment="Cleaning",
        startsAt=now + timedelta(minutes=30),
        endsAt=now + timedelta(hours=1, minutes=30),
        status=AppointmentStatus.REQUESTED,
        updatedAt=now
    )
    db_session.add(apt2)
    
    with pytest.raises(IntegrityError) as exc_info:
        await db_session.flush()
    
    assert 'no_overlapping_appointments' in str(exc_info.value)
