import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Contact, ContactStatus, Priority, Source

@pytest_asyncio.fixture
async def setup_contacts(db_session: AsyncSession):
    from datetime import datetime, timezone
    from app.schemas.patient import PatientCreate
    from app.repositories import patient_repo
    import uuid

    now = datetime.now(timezone.utc)
    random_phone = str(uuid.uuid4().int)[:10]
    patient = await patient_repo.create(db_session, PatientCreate(fullName="T", email=f"t_{random_phone}@t.com", phone=random_phone))
    await db_session.flush()

    c1 = Contact(patientId=patient.id, status=ContactStatus.OPEN, priority=Priority.URGENT, source=Source.URGENT_VISIT, updatedAt=now)
    c2 = Contact(patientId=patient.id, status=ContactStatus.IN_PROGRESS, priority=Priority.URGENT, source=Source.INQUIRY, updatedAt=now)
    c3 = Contact(patientId=patient.id, status=ContactStatus.OPEN, priority=Priority.HIGH, source=Source.INQUIRY, updatedAt=now)
    c4 = Contact(patientId=patient.id, status=ContactStatus.COMPLETED, priority=Priority.URGENT, source=Source.URGENT_VISIT, updatedAt=now)
    c5 = Contact(patientId=patient.id, status=ContactStatus.OPEN, priority=Priority.NORMAL, source=Source.BOOKING, updatedAt=now)
    
    db_session.add_all([c1, c2, c3, c4, c5])
    await db_session.commit()
    
    return [c1, c2, c3, c4, c5]

@pytest.mark.asyncio
async def test_urgent_queue_priority_filtering(client: AsyncClient, db_session: AsyncSession, staff_auth_headers: dict, setup_contacts: list):
    res = await client.get("/api/v1/contacts?priority=URGENT", headers=staff_auth_headers)
    assert res.status_code == 200
    data = res.json()["data"]
    
    assert len(data) >= 3
    for c in data:
        assert c["priority"] == "URGENT"

    res2 = await client.get("/api/v1/contacts?priority=HIGH", headers=staff_auth_headers)
    assert res2.status_code == 200
    data2 = res2.json()["data"]
    assert len(data2) >= 1
    for c in data2:
        assert c["priority"] == "HIGH"

@pytest.mark.asyncio
async def test_urgent_queue_multiple_statuses(client: AsyncClient, db_session: AsyncSession, staff_auth_headers: dict, setup_contacts: list):
    res = await client.get("/api/v1/contacts?status=OPEN&status=IN_PROGRESS", headers=staff_auth_headers)
    assert res.status_code == 200
    data = res.json()["data"]
    
    for c in data:
        assert c["status"] in ["OPEN", "IN_PROGRESS"]
        
    res_single = await client.get("/api/v1/contacts?status=COMPLETED", headers=staff_auth_headers)
    assert res_single.status_code == 200
    data_single = res_single.json()["data"]
    for c in data_single:
        assert c["status"] == "COMPLETED"

@pytest.mark.asyncio
async def test_urgent_queue_priority_sorting(client: AsyncClient, db_session: AsyncSession, staff_auth_headers: dict, setup_contacts: list):
    res = await client.get("/api/v1/contacts?priority_sort=true&status=OPEN&status=IN_PROGRESS", headers=staff_auth_headers)
    assert res.status_code == 200
    data = res.json()["data"]
    
    priorities = [c["priority"] for c in data]
    
    urgent_index_max = -1
    high_index_max = -1
    for i, p in enumerate(priorities):
        if p == "URGENT":
            urgent_index_max = i
        elif p == "HIGH":
            high_index_max = i
            assert urgent_index_max < i, "HIGH appeared before URGENT"
        elif p == "NORMAL":
            assert urgent_index_max < i, "NORMAL appeared before URGENT"
            if high_index_max != -1:
                assert high_index_max < i, "NORMAL appeared before HIGH"

@pytest.mark.asyncio
async def test_urgent_queue_pagination_after_sort(client: AsyncClient, db_session: AsyncSession, staff_auth_headers: dict, setup_contacts: list):
    res1 = await client.get("/api/v1/contacts?priority_sort=true&limit=1&skip=0", headers=staff_auth_headers)
    res2 = await client.get("/api/v1/contacts?priority_sort=true&limit=1&skip=1", headers=staff_auth_headers)
    
    assert res1.status_code == 200
    assert res2.status_code == 200
    
    data1 = res1.json()["data"]
    data2 = res2.json()["data"]
    
    assert len(data1) == 1
    assert len(data2) == 1
    assert data1[0]["id"] != data2[0]["id"]

@pytest.mark.asyncio
async def test_urgent_queue_fields_exposed(client: AsyncClient, db_session: AsyncSession, staff_auth_headers: dict, setup_contacts: list):
    res = await client.get("/api/v1/contacts?limit=1", headers=staff_auth_headers)
    assert res.status_code == 200
    contact = res.json()["data"][0]
    
    assert "priority" in contact
    assert "source" in contact
    assert contact["priority"] in ["URGENT", "HIGH", "NORMAL"]

@pytest.mark.asyncio
async def test_urgent_queue_authorization(client: AsyncClient, db_session: AsyncSession, doctor_auth_headers: dict):
    res = await client.get("/api/v1/contacts?priority=URGENT", headers=doctor_auth_headers)
    assert res.status_code == 200
    
    res_unauth = await client.get("/api/v1/contacts?priority=URGENT")
    assert res_unauth.status_code == 401
