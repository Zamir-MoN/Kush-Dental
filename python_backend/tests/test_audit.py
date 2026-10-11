import pytest
from httpx import AsyncClient
from app.models import Role, LeadStatus, AppointmentStatus, ContactStatus
from app.repositories import user_repo, patient_repo, lead_repo, contact_repo
from sqlalchemy import select, func

@pytest.mark.asyncio
async def test_appointment_creation(client: AsyncClient, staff_auth_headers, db_session):
    # Setup test data
    staff = await user_repo.get_by_email(db_session, "staff@example.com")
    
    # 1. Create a patient to book for
    from app.schemas.patient import PatientCreate
    import uuid
    patient = await patient_repo.create(db_session, PatientCreate(fullName="Audit Patient", phone=f"99{str(uuid.uuid4().int)[:8]}"))
    await db_session.commit()

    # 2. Staff books appointment
    payload = {
        "patientId": str(patient.id),
        "doctorId": None,
        "treatment": "Checkup",
        "startsAt": "2030-01-01T10:00:00Z",
        "endsAt": "2030-01-01T11:00:00Z"
    }

    response = await client.post("/api/v1/appointments", json=payload, headers=staff_auth_headers)
    
    print(f"\nAppointment Creation Status: {response.status_code}")
    print(f"Appointment Creation Response: {response.json()}")

@pytest.mark.asyncio
async def test_lead_conversion_duplicate_phone(client: AsyncClient, staff_auth_headers, db_session):
    from app.schemas.patient import PatientCreate
    from app.schemas.lead import LeadCreate
    
    import uuid
    phone = f"99{str(uuid.uuid4().int)[:8]}"
    # Create patient with phone
    await patient_repo.create(db_session, PatientCreate(fullName="Existing Patient", phone=phone))
    
    # Create lead with SAME phone
    lead = await lead_repo.create(db_session, LeadCreate(name="New Lead", phone=phone, desiredTreatment="Whitening"))
    await db_session.commit()

    # Staff converts lead
    response = await client.post(f"/api/v1/leads/{lead.id}/convert", headers=staff_auth_headers)
    
    print(f"\nLead Conversion Duplicate Phone Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Verify lead state did not change
    await db_session.refresh(lead)
    print(f"Lead Status After Failed Conversion: {lead.status.name}")

@pytest.mark.asyncio
async def test_dashboard_lead_count(client: AsyncClient, staff_auth_headers, db_session):
    from app.schemas.lead import LeadCreate
    
    import uuid
    lead = await lead_repo.create(db_session, LeadCreate(name="Convertible Lead", phone=f"99{str(uuid.uuid4().int)[:8]}", desiredTreatment="Implants"))
    await db_session.commit()

    res_before = await client.get("/api/v1/dashboard", headers=staff_auth_headers)
    
    new_leads_before = res_before.json()["summary"]["newLeads"]

    # Convert the lead successfully
    res_convert = await client.post(f"/api/v1/leads/{lead.id}/convert", headers=staff_auth_headers)
    
    # Get dashboard count after conversion
    res_after = await client.get("/api/v1/dashboard", headers=staff_auth_headers)
    new_leads_after = res_after.json()["summary"]["newLeads"]

    print(f"\nLead Count Before: {new_leads_before}")
    print(f"Lead Count After: {new_leads_after}")

@pytest.mark.asyncio
async def test_staff_patient_access(client: AsyncClient, staff_auth_headers, db_session):
    from app.schemas.patient import PatientCreate
    import uuid
    patient = await patient_repo.create(db_session, PatientCreate(fullName="Secret Patient", phone=f"99{str(uuid.uuid4().int)[:8]}"))
    await db_session.commit()

    # A. GET /api/v1/patients
    res_list = await client.get("/api/v1/patients", headers=staff_auth_headers)
    
    # B. GET /api/v1/patients/{id}
    res_get = await client.get(f"/api/v1/patients/{patient.id}", headers=staff_auth_headers)
    
    # C. GET /api/v1/patients/search
    res_search = await client.get("/api/v1/patients/search?q=Secret", headers=staff_auth_headers)
    
    print(f"\nPatient List Status: {res_list.status_code}")
    print(f"Patient Get Status: {res_get.status_code}")
    print(f"Patient Search Status: {res_search.status_code}, Data: {res_search.json() if res_search.status_code == 200 else ''}")

@pytest.mark.asyncio
async def test_follow_ups_metrics(client: AsyncClient, staff_auth_headers, db_session):
    from app.schemas.patient import PatientCreate
    from app.schemas.contact import ContactCreate
    from app.models import ContactStatus
    from datetime import datetime, timezone, timedelta
    
    # Clear existing contacts
    await db_session.execute(func.count())
    
    import uuid
    patient = await patient_repo.create(db_session, PatientCreate(fullName="Followup Patient", phone=f"99{str(uuid.uuid4().int)[:8]}"))
    await db_session.commit()
    
    now = datetime.now(timezone.utc)
    
    # Create OPEN contact
    c1 = await contact_repo.create(db_session, ContactCreate(patientId=patient.id, notes="Need info"))
    c1.status = ContactStatus.OPEN
    c1.nextFollowUpAt = now + timedelta(days=1)
    
    # Create IN_PROGRESS contact
    c2 = await contact_repo.create(db_session, ContactCreate(patientId=patient.id, notes="Negotiating"))
    c2.status = ContactStatus.IN_PROGRESS
    c2.nextFollowUpAt = now - timedelta(days=1)
    
    # Create COMPLETED contact
    c3 = await contact_repo.create(db_session, ContactCreate(patientId=patient.id, notes="Done"))
    c3.status = ContactStatus.COMPLETED
    c3.nextFollowUpAt = None
    
    await db_session.commit()
    
    res = await client.get("/api/v1/dashboard", headers=staff_auth_headers)
    
    summary = res.json()["summary"]
    print(f"\nOpen Follow-Ups: {summary['openFollowUps']}")
    print(f"In-Progress Follow-Ups: {summary['inProgressFollowUps']}")
    
    # Verify ContactList endpoint
    res_open = await client.get("/api/v1/contacts?status=OPEN", headers=staff_auth_headers)
    print(f"Open List Length: {len(res_open.json()['data'])}")
    
    res_prog = await client.get("/api/v1/contacts?status=IN_PROGRESS", headers=staff_auth_headers)
    print(f"In-Progress List Length: {len(res_prog.json()['data'])}")

