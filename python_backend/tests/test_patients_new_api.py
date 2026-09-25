import pytest
from httpx import AsyncClient
from datetime import datetime, timedelta, timezone

pytestmark = pytest.mark.asyncio

async def test_doctor_search_patients_by_name(client: AsyncClient, doctor_auth_headers: dict, db_patient):
    # Search by name
    res = await client.get(f"/api/v1/patients/search?q={db_patient.fullName[:4]}", headers=doctor_auth_headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data) >= 1
    assert data[0]["fullName"] == db_patient.fullName

from app.schemas.patient import PatientCreate
from app.repositories import patient_repo

import uuid

async def test_doctor_search_patients_by_phone_prefix(client: AsyncClient, doctor_auth_headers: dict, db_session):
    random_suffix = str(uuid.uuid4().int)[:6]
    target_phone = f"9988{random_suffix}"
    patient_in = PatientCreate(fullName="Prefix Test", email=f"prefixtest_{target_phone}@test.com", phone=target_phone)
    p = await patient_repo.create(db_session, patient_in)
    await db_session.commit()
    
    # 1. Exact phone
    res = await client.get(f"/api/v1/patients/search?q={target_phone}", headers=doctor_auth_headers)
    assert res.status_code == 200
    assert any(p["phone"] == target_phone for p in res.json()["data"])
    
    # 2. Short prefix
    res = await client.get(f"/api/v1/patients/search?q=998", headers=doctor_auth_headers)
    assert any(p["phone"] == target_phone for p in res.json()["data"])
    
    # 3. Longer prefix
    res = await client.get(f"/api/v1/patients/search?q=9988", headers=doctor_auth_headers)
    assert any(p["phone"] == target_phone for p in res.json()["data"])
    
    # 4. Longer valid prefix
    res = await client.get(f"/api/v1/patients/search?q=9988{random_suffix[:2]}", headers=doctor_auth_headers)
    assert any(p["phone"] == target_phone for p in res.json()["data"])
    
    # 5. Non-matching sequence
    res = await client.get(f"/api/v1/patients/search?q=99888", headers=doctor_auth_headers)
    assert not any(p["phone"] == target_phone for p in res.json()["data"])
    
    # 6. Middle substring
    res = await client.get(f"/api/v1/patients/search?q={random_suffix[:4]}", headers=doctor_auth_headers)
    assert not any(p["phone"] == target_phone for p in res.json()["data"])
    
    # 7. Another partial non-prefix
    res = await client.get(f"/api/v1/patients/search?q={random_suffix[1:4]}", headers=doctor_auth_headers)
    assert not any(p["phone"] == target_phone for p in res.json()["data"])

async def test_staff_allowed_patient_search(client: AsyncClient, staff_auth_headers: dict, db_patient):
    # Staff CAN search
    res = await client.get(f"/api/v1/patients/search?q={db_patient.phone}", headers=staff_auth_headers)
    assert res.status_code == 200
    
    # Only permitted fields returned
    data = res.json()["data"]
    assert len(data) >= 1
    patient = data[0]
    assert "id" in patient
    assert "fullName" in patient
    assert "phone" in patient
    # Ensure no clinical fields like treatment history are exposed in search
    assert "clinical_notes" not in patient

async def test_staff_cannot_access_patient_detail(client: AsyncClient, staff_auth_headers: dict, db_patient):
    res = await client.get(f"/api/v1/patients/{db_patient.id}", headers=staff_auth_headers)
    assert res.status_code == 403

async def test_staff_cannot_use_patientId_filtering(client: AsyncClient, staff_auth_headers: dict, db_patient):
    res = await client.get(f"/api/v1/appointments?patientId={db_patient.id}", headers=staff_auth_headers)
    assert res.status_code == 403

async def test_patient_detail_returns_correct_patient(client: AsyncClient, doctor_auth_headers: dict, db_patient):
    res = await client.get(f"/api/v1/patients/{db_patient.id}", headers=doctor_auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == str(db_patient.id)
    assert data["fullName"] == db_patient.fullName

async def test_patient_appointment_history(client: AsyncClient, doctor_auth_headers: dict, db_appointment, db_patient):
    # Fetch history
    res = await client.get(f"/api/v1/appointments?patientId={db_patient.id}&orderDesc=true", headers=doctor_auth_headers)
    assert res.status_code == 200
    data = res.json()
    
    # Only contains that patient's appointments
    assert len(data) >= 1
    for apt in data:
        assert apt["patientId"] == str(db_patient.id)

async def test_patient_history_pagination_and_ordering(client: AsyncClient, doctor_auth_headers: dict, db_patient, db_session, doctor_user):
    from app.schemas.appointment import AppointmentCreate
    from app.repositories import appointment_repo
    
    now = datetime.now(timezone.utc)
    # Create 3 appointments with increasing start times
    for i in range(3):
        apt_in = AppointmentCreate(
            patientId=db_patient.id,
            doctorId=doctor_user.id,
            treatment=f"Tx {i}",
            startsAt=now + timedelta(days=i),
            endsAt=now + timedelta(days=i, hours=1)
        )
        await appointment_repo.create(db_session, apt_in)
    await db_session.commit()
    
    # Fetch history with limit=2, orderDesc=true
    res = await client.get(f"/api/v1/appointments?patientId={db_patient.id}&orderDesc=true&limit=2", headers=doctor_auth_headers)
    assert res.status_code == 200
    data = res.json()
    
    # Should be newest first (Tx 2, then Tx 1)
    assert len(data) == 2
    assert data[0]["treatment"] == "Tx 2"
    assert data[1]["treatment"] == "Tx 1"
    
    # Fetch next page
    res_page2 = await client.get(f"/api/v1/appointments?patientId={db_patient.id}&orderDesc=true&skip=2&limit=2", headers=doctor_auth_headers)
    assert res_page2.status_code == 200
    data_page2 = res_page2.json()
    assert len(data_page2) >= 1
    assert data_page2[0]["treatment"] == "Tx 0"

async def test_patient_search_pagination_and_limits(client: AsyncClient, doctor_auth_headers: dict, db_session):
    # 1. Empty query returns only first page (default limit 50)
    res = await client.get("/api/v1/patients/search?q=", headers=doctor_auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert "data" in data
    assert "total" in data
    assert "limit" in data
    assert "skip" in data
    assert data["limit"] == 50
    assert len(data["data"]) <= 50
    # Ensure it doesn't return all records if total > 50
    if data["total"] > 50:
        assert len(data["data"]) == 50
        
    # 2. Enforces maximum limit 100
    res = await client.get("/api/v1/patients/search?q=&limit=150", headers=doctor_auth_headers)
    assert res.status_code == 422
    
    # 3. Limit <= 0 returns 422
    res = await client.get("/api/v1/patients/search?q=&limit=0", headers=doctor_auth_headers)
    assert res.status_code == 422
    
    # 4. Negative skip returns 422
    res = await client.get("/api/v1/patients/search?q=&skip=-5", headers=doctor_auth_headers)
    assert res.status_code == 422
    
    # 5. Skip/limit returns subset and total is correct
    # create some patients for a unique search query
    import random
    prefix = f"TestPag{uuid.uuid4().hex[:6].replace('0','a').replace('1','b').replace('2','c').replace('3','d').replace('4','e').replace('5','f').replace('6','g').replace('7','h').replace('8','i').replace('9','j')}"
    for i in range(5):
        random_phone = f"99{random.randint(10000000, 99999999)}"
        patient_in = PatientCreate(fullName=f"{prefix} Name", email=f"pag{i}_{prefix}@test.com", phone=random_phone)
        await patient_repo.create(db_session, patient_in)
    await db_session.commit()
    
    res = await client.get(f"/api/v1/patients/search?q={prefix}&limit=2&skip=0", headers=doctor_auth_headers)
    assert res.status_code == 200
    json_data = res.json()
    assert json_data["total"] == 5
    assert len(json_data["data"]) == 2
    
    res2 = await client.get(f"/api/v1/patients/search?q={prefix}&limit=2&skip=2", headers=doctor_auth_headers)
    assert res2.status_code == 200
    json_data2 = res2.json()
    assert len(json_data2["data"]) == 2
    assert json_data["data"][0]["id"] != json_data2["data"][0]["id"] # Deterministic ordering verified indirectly
