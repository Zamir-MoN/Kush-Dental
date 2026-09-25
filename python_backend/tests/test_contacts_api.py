import pytest
from httpx import AsyncClient
from uuid import uuid4
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import ContactStatus

import pytest_asyncio

@pytest_asyncio.fixture
async def sample_contact(db_session: AsyncSession, db_patient):
    from app.models import Contact, ContactStatus
    from datetime import datetime, timezone
    c = Contact(
        patientId=db_patient.id,
        status=ContactStatus.OPEN,
        updatedAt=datetime.now(timezone.utc)
    )
    db_session.add(c)
    await db_session.commit()
    await db_session.refresh(c)
    return c

@pytest.mark.asyncio
async def test_create_contact(client: AsyncClient, staff_auth_headers: dict, db_patient):
    response = await client.post(
        "/api/v1/contacts",
        json={"patientId": str(db_patient.id), "status": "OPEN"},
        headers=staff_auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OPEN"
    assert data["createdAt"] is not None
    assert data["updatedAt"] is not None

@pytest.mark.asyncio
async def test_create_contact_duplicate_lead(client: AsyncClient, staff_auth_headers: dict, db_patient, db_session):
    # First create a lead manually or just use a dummy UUID since lead validation isn't strict at the DB level for foreign key...
    # Wait, Contact has a foreign key to Lead, so we MUST create a lead first.
    from app.models import Lead, LeadStatus
    from datetime import datetime, timezone
    import uuid
    l = Lead(name="Dup Test", phone="123", status=LeadStatus.NEW, createdAt=datetime.now(timezone.utc), updatedAt=datetime.now(timezone.utc))
    db_session.add(l)
    await db_session.commit()
    await db_session.refresh(l)
    
    # Create first contact
    res1 = await client.post(
        "/api/v1/contacts",
        json={"patientId": str(db_patient.id), "leadId": str(l.id), "status": "OPEN"},
        headers=staff_auth_headers
    )
    print("RES1:", res1.json())
    assert res1.status_code == 200
    
    # Create second contact with same leadId should fail
    res2 = await client.post(
        "/api/v1/contacts",
        json={"patientId": str(db_patient.id), "leadId": str(l.id), "status": "OPEN"},
        headers=staff_auth_headers
    )
    print("RES2:", res2.json())
    assert res2.status_code == 409
    
@pytest.mark.asyncio
async def test_create_multiple_null_lead_contacts(client: AsyncClient, staff_auth_headers: dict, db_patient):
    # Null leadIds are not subject to the unique constraint
    res1 = await client.post(
        "/api/v1/contacts",
        json={"patientId": str(db_patient.id), "status": "OPEN"},
        headers=staff_auth_headers
    )
    assert res1.status_code == 200
    
    res2 = await client.post(
        "/api/v1/contacts",
        json={"patientId": str(db_patient.id), "status": "OPEN"},
        headers=staff_auth_headers
    )
    assert res2.status_code == 200

@pytest.mark.asyncio
async def test_get_contacts(client: AsyncClient, staff_auth_headers: dict, sample_contact):
    response = await client.get(
        "/api/v1/contacts",
        headers=staff_auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert data["data"][0]["status"] == "OPEN"

@pytest.mark.asyncio
async def test_get_contact_detail(client: AsyncClient, staff_auth_headers: dict, sample_contact):
    response = await client.get(
        f"/api/v1/contacts/{sample_contact.id}",
        headers=staff_auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == str(sample_contact.id)
    assert data["patient"]["id"] == str(sample_contact.patientId)

@pytest.mark.asyncio
async def test_update_contact(client: AsyncClient, staff_auth_headers: dict, sample_contact):
    # Generic PATCH test
    response = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}",
        json={"notes": "Called and left voicemail."},
        headers=staff_auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["notes"] == "Called and left voicemail."

@pytest.mark.asyncio
async def test_contact_status_valid_transitions(client: AsyncClient, staff_auth_headers: dict, sample_contact):
    # OPEN -> IN_PROGRESS
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "IN_PROGRESS"},
        headers=staff_auth_headers
    )
    assert res.status_code == 200
    assert res.json()["status"] == "IN_PROGRESS"
    
    # IN_PROGRESS -> CONTACTED
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "CONTACTED"},
        headers=staff_auth_headers
    )
    assert res.status_code == 200
    assert res.json()["status"] == "CONTACTED"
    
    # CONTACTED -> COMPLETED
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "COMPLETED", "outcome": "Appointment booked"},
        headers=staff_auth_headers
    )
    assert res.status_code == 200
    assert res.json()["status"] == "COMPLETED"

@pytest.mark.asyncio
async def test_contact_status_invalid_transitions(client: AsyncClient, staff_auth_headers: dict, sample_contact):
    # OPEN -> NO_RESPONSE (not allowed)
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "NO_RESPONSE", "outcome": "No answer"},
        headers=staff_auth_headers
    )
    assert res.status_code == 409
    
    # OPEN -> OPEN
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "OPEN"},
        headers=staff_auth_headers
    )
    assert res.status_code == 409

@pytest.mark.asyncio
async def test_contact_terminal_states_immutable(client: AsyncClient, staff_auth_headers: dict, sample_contact):
    # Move to terminal
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "CANCELLED", "outcome": "Created in error"},
        headers=staff_auth_headers
    )
    assert res.status_code == 200
    
    # Try to reopen
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "OPEN"},
        headers=staff_auth_headers
    )
    assert res.status_code == 409

@pytest.mark.asyncio
async def test_contact_terminal_clears_next_follow_up(client: AsyncClient, staff_auth_headers: dict, sample_contact):
    # Set nextFollowUpAt via generic PATCH
    from datetime import datetime, timezone, timedelta
    future_date = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
    await client.patch(
        f"/api/v1/contacts/{sample_contact.id}",
        json={"nextFollowUpAt": future_date},
        headers=staff_auth_headers
    )
    
    # Move to terminal
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "NO_RESPONSE", "outcome": "Failed to reach"},
        headers=staff_auth_headers
    )
    # The transition must come from IN_PROGRESS or CONTACTED
    assert res.status_code == 409 
    
    # Move to IN_PROGRESS first
    await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "IN_PROGRESS"},
        headers=staff_auth_headers
    )
    
    # Move to NO_RESPONSE
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "NO_RESPONSE", "outcome": "Failed to reach"},
        headers=staff_auth_headers
    )
    assert res.status_code == 200
    assert res.json()["nextFollowUpAt"] is None

@pytest.mark.asyncio
async def test_contact_outcome_required_for_terminal(client: AsyncClient, staff_auth_headers: dict, sample_contact):
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "COMPLETED"},
        headers=staff_auth_headers
    )
    assert res.status_code == 422
    
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "COMPLETED", "outcome": "   "},
        headers=staff_auth_headers
    )
    assert res.status_code == 422

@pytest.mark.asyncio
async def test_contact_status_audit_logged(client: AsyncClient, staff_auth_headers: dict, sample_contact, db_session):
    # OPEN -> IN_PROGRESS
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "IN_PROGRESS"},
        headers=staff_auth_headers
    )
    assert res.status_code == 200
    
    from app.models import AuditLog
    from sqlalchemy import select
    query = select(AuditLog).where(
        AuditLog.resourceId == sample_contact.id,
        AuditLog.action == "CONTACT_STATUS_CHANGED"
    )
    result = await db_session.execute(query)
    logs = result.scalars().all()
    assert len(logs) == 1
    assert logs[0].metadata_["old_status"] == "OPEN"
    assert logs[0].metadata_["new_status"] == "IN_PROGRESS"

@pytest.mark.asyncio
async def test_concurrent_status_updates(client: AsyncClient, staff_auth_headers: dict, sample_contact):
    import asyncio
    
    # OPEN -> IN_PROGRESS and OPEN -> CONTACTED at same time
    # Only one should succeed because second will see it's no longer OPEN
    # (actually OPEN -> CONTACTED is valid, but OPEN -> IN_PROGRESS then IN_PROGRESS -> OPEN is invalid)
    # Let's do IN_PROGRESS -> COMPLETED and IN_PROGRESS -> CANCELLED
    await client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "IN_PROGRESS"},
        headers=staff_auth_headers
    )
    
    req1 = client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "COMPLETED", "outcome": "Done"},
        headers=staff_auth_headers
    )
    req2 = client.patch(
        f"/api/v1/contacts/{sample_contact.id}/status",
        json={"status": "CANCELLED", "outcome": "Cancelled"},
        headers=staff_auth_headers
    )
    
    res1, res2 = await asyncio.gather(req1, req2)
    
    # One should be 200, the other 409
    statuses = {res1.status_code, res2.status_code}
    assert statuses == {200, 409}

@pytest.mark.asyncio
async def test_create_contact_no_relations(client: AsyncClient, staff_auth_headers: dict):
    # Attempt to create an orphan contact
    res = await client.post(
        "/api/v1/contacts",
        json={"status": "OPEN"},
        headers=staff_auth_headers
    )
    assert res.status_code == 422
    assert "reference at least one" in res.json()["detail"]

@pytest.mark.asyncio
async def test_strict_generic_patch(client: AsyncClient, staff_auth_headers: dict, sample_contact):
    # Status should be rejected with 422
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}",
        json={"status": "IN_PROGRESS", "notes": "test"},
        headers=staff_auth_headers
    )
    assert res.status_code == 422
    
    # Unknown field should be rejected
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}",
        json={"unknown_field": "test"},
        headers=staff_auth_headers
    )
    assert res.status_code == 422
    
    # PatientId should be rejected
    res = await client.patch(
        f"/api/v1/contacts/{sample_contact.id}",
        json={"patientId": str(uuid4())},
        headers=staff_auth_headers
    )
    assert res.status_code == 422

@pytest.mark.asyncio
async def test_delete_contact_staff_forbidden(client: AsyncClient, staff_auth_headers: dict, sample_contact):
    res = await client.delete(
        f"/api/v1/contacts/{sample_contact.id}",
        headers=staff_auth_headers
    )
    assert res.status_code == 403

@pytest.mark.asyncio
async def test_delete_contact_doctor(client: AsyncClient, doctor_auth_headers: dict, sample_contact, db_session):
    res = await client.delete(
        f"/api/v1/contacts/{sample_contact.id}",
        headers=doctor_auth_headers
    )
    assert res.status_code == 200
    
    # Verify it is excluded from get
    res_get = await client.get(
        f"/api/v1/contacts/{sample_contact.id}",
        headers=doctor_auth_headers
    )
    assert res_get.status_code == 404
    
    # Verify it is soft deleted in DB
    from app.models import Contact
    from sqlalchemy import select
    
    await db_session.refresh(sample_contact)
    assert sample_contact.deletedAt is not None
    
    # Verify audit log
    from app.models import AuditLog
    logs = (await db_session.execute(
        select(AuditLog).where(
            AuditLog.resourceId == sample_contact.id,
            AuditLog.action == "CONTACT_DELETED"
        )
    )).scalars().all()
    assert len(logs) == 1

@pytest.mark.asyncio
async def test_repeated_delete_contact(client: AsyncClient, doctor_auth_headers: dict, sample_contact, db_session):
    # First delete
    res1 = await client.delete(
        f"/api/v1/contacts/{sample_contact.id}",
        headers=doctor_auth_headers
    )
    assert res1.status_code == 200
    
    # Second delete
    res2 = await client.delete(
        f"/api/v1/contacts/{sample_contact.id}",
        headers=doctor_auth_headers
    )
    assert res2.status_code == 404
    
    # Verify no duplicate audit logs
    from app.models import AuditLog
    from sqlalchemy import select
    logs = (await db_session.execute(
        select(AuditLog).where(
            AuditLog.resourceId == sample_contact.id,
            AuditLog.action == "CONTACT_DELETED"
        )
    )).scalars().all()
    assert len(logs) == 1
