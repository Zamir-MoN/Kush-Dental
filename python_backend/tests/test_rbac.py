import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

async def test_staff_cannot_create_user(client: AsyncClient, staff_auth_headers: dict):
    payload = {"email": "newdoc@test.com", "password": "pass", "role": "DOCTOR"}
    resp = await client.post("/api/v1/users", json=payload, headers=staff_auth_headers)
    assert resp.status_code == 403

import uuid

async def test_doctor_can_create_user(client: AsyncClient, doctor_auth_headers: dict):
    unique_email = f"newdoc_{uuid.uuid4().hex[:8]}@test.com"
    payload = {"email": unique_email, "password": "pass", "role": "DOCTOR"}
    resp = await client.post("/api/v1/users", json=payload, headers=doctor_auth_headers)
    assert resp.status_code == 201

async def test_staff_cannot_access_patients(client: AsyncClient, staff_auth_headers: dict):
    resp = await client.get("/api/v1/patients", headers=staff_auth_headers)
    assert resp.status_code == 403

async def test_doctor_can_access_patients(client: AsyncClient, doctor_auth_headers: dict):
    resp = await client.get("/api/v1/patients", headers=doctor_auth_headers)
    assert resp.status_code == 200

async def test_staff_cannot_list_users(client: AsyncClient, staff_auth_headers: dict):
    resp = await client.get("/api/v1/users", headers=staff_auth_headers)
    assert resp.status_code == 403

async def test_doctor_can_list_users(client: AsyncClient, doctor_auth_headers: dict):
    resp = await client.get("/api/v1/users", headers=doctor_auth_headers)
    assert resp.status_code == 200

async def test_staff_cannot_delete_lead(client: AsyncClient, staff_auth_headers: dict):
    resp = await client.delete(f"/api/v1/leads/{uuid.uuid4()}", headers=staff_auth_headers)
    assert resp.status_code == 403

async def test_staff_cannot_post_patch_patients(client: AsyncClient, staff_auth_headers: dict):
    # POST
    resp_post = await client.post("/api/v1/patients", json={"fullName":"x", "phone":"1"}, headers=staff_auth_headers)
    assert resp_post.status_code == 403
    
    # PATCH
    resp_patch = await client.patch(f"/api/v1/patients/{uuid.uuid4()}", json={"fullName":"x"}, headers=staff_auth_headers)
    assert resp_patch.status_code == 403

async def test_staff_cannot_get_user_by_id(client: AsyncClient, staff_auth_headers: dict):
    resp = await client.get(f"/api/v1/users/{uuid.uuid4()}", headers=staff_auth_headers)
    assert resp.status_code == 403

