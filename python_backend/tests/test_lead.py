import pytest
from httpx import AsyncClient
from typing import AsyncGenerator
from app.models import Role, LeadStatus
from uuid import uuid4

pytestmark = pytest.mark.asyncio

import uuid

async def test_lead_lifecycle_and_conversion(client: AsyncClient, doctor_auth_headers: dict):
    # Create Lead
    unique_id = str(uuid.uuid4().int)[:8]
    payload = {
        "name": "John Doe",
        "phone": f"+123{unique_id}",
        "email": "john@test.com",
        "notes": "Interested in implants"
    }
    response = await client.post("/api/v1/leads", json=payload, headers=doctor_auth_headers)
    assert response.status_code == 201
    lead = response.json()
    assert lead["status"] == LeadStatus.NEW.value
    assert lead["name"] == "John Doe"

    lead_id = lead["id"]

    # Update Lead
    update_payload = {"status": LeadStatus.CONTACTED.value}
    response = await client.patch(f"/api/v1/leads/{lead_id}", json=update_payload, headers=doctor_auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == LeadStatus.CONTACTED.value

    # Convert Lead
    response = await client.post(f"/api/v1/leads/{lead_id}/convert", headers=doctor_auth_headers)
    assert response.status_code == 200

async def test_lead_conversion_phone_conflict(client: AsyncClient, doctor_auth_headers: dict):
    # Create Patient with a phone
    unique_id = str(uuid.uuid4().int)[:8]
    phone = f"+199{unique_id}"
    patient_payload = {"fullName": "Jane Doe", "phone": phone}
    resp = await client.post("/api/v1/patients", json=patient_payload, headers=doctor_auth_headers)
    assert resp.status_code == 201

    # Create Lead with SAME phone
    lead_payload = {
        "name": "Jane Lead",
        "phone": phone,
        "email": "jane@test.com",
    }
    resp = await client.post("/api/v1/leads", json=lead_payload, headers=doctor_auth_headers)
    assert resp.status_code == 201
    lead_id = resp.json()["id"]

    # Attempt to convert -> should 409
    resp = await client.post(f"/api/v1/leads/{lead_id}/convert", headers=doctor_auth_headers)
    assert resp.status_code == 409
    
    # Check lead is NOT converted
    resp = await client.get(f"/api/v1/leads/{lead_id}", headers=doctor_auth_headers)
    assert resp.json()["status"] == LeadStatus.NEW.value
