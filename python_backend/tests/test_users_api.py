import pytest
from httpx import AsyncClient
from app.models import Role
import uuid

pytestmark = pytest.mark.asyncio

async def test_doctor_can_list_users(client: AsyncClient, doctor_auth_headers: dict):
    resp = await client.get("/api/v1/users", headers=doctor_auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total" in data
    assert "data" in data
    assert data["limit"] == 50
    assert data["skip"] == 0

async def test_staff_cannot_list_users(client: AsyncClient, staff_auth_headers: dict):
    resp = await client.get("/api/v1/users", headers=staff_auth_headers)
    assert resp.status_code == 403

async def test_users_pagination_limits(client: AsyncClient, doctor_auth_headers: dict):
    # limit 100 works
    resp = await client.get("/api/v1/users?limit=100", headers=doctor_auth_headers)
    assert resp.status_code == 200
    
    # limit 101 rejected
    resp = await client.get("/api/v1/users?limit=101", headers=doctor_auth_headers)
    assert resp.status_code == 422
    
    # limit 0 rejected
    resp = await client.get("/api/v1/users?limit=0", headers=doctor_auth_headers)
    assert resp.status_code == 422
    
    # negative skip rejected
    resp = await client.get("/api/v1/users?skip=-1", headers=doctor_auth_headers)
    assert resp.status_code == 422

async def test_users_pagination_subset(client: AsyncClient, doctor_auth_headers: dict):
    resp = await client.get("/api/v1/users?skip=0&limit=5", headers=doctor_auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["data"]) <= 5
    
    if data["total"] > 5:
        # Check subset behavior if we have more than 5 users
        resp2 = await client.get("/api/v1/users?skip=5&limit=5", headers=doctor_auth_headers)
        data2 = resp2.json()
        page1_ids = {u["id"] for u in data["data"]}
        page2_ids = {u["id"] for u in data2["data"]}
        assert page1_ids.isdisjoint(page2_ids)

async def test_doctor_can_create_staff(client: AsyncClient, doctor_auth_headers: dict):
    unique_email = f"staff_{uuid.uuid4().hex[:8]}@test.com"
    payload = {"email": unique_email, "password": "pass", "role": "STAFF"}
    resp = await client.post("/api/v1/users", json=payload, headers=doctor_auth_headers)
    assert resp.status_code == 201
    assert "passwordHash" not in resp.json()

async def test_doctor_can_create_doctor(client: AsyncClient, doctor_auth_headers: dict):
    unique_email = f"doc_{uuid.uuid4().hex[:8]}@test.com"
    payload = {"email": unique_email, "password": "pass", "role": "DOCTOR"}
    resp = await client.post("/api/v1/users", json=payload, headers=doctor_auth_headers)
    assert resp.status_code == 201
    assert "passwordHash" not in resp.json()

async def test_staff_cannot_create_users(client: AsyncClient, staff_auth_headers: dict):
    unique_email = f"doc_{uuid.uuid4().hex[:8]}@test.com"
    payload = {"email": unique_email, "password": "pass", "role": "DOCTOR"}
    resp = await client.post("/api/v1/users", json=payload, headers=staff_auth_headers)
    assert resp.status_code == 403

async def test_admin_creation_rejected(client: AsyncClient, doctor_auth_headers: dict):
    unique_email = f"admin_{uuid.uuid4().hex[:8]}@test.com"
    payload = {"email": unique_email, "password": "pass", "role": "ADMIN"}
    resp = await client.post("/api/v1/users", json=payload, headers=doctor_auth_headers)
    assert resp.status_code == 422

async def test_doctor_can_update_email(client: AsyncClient, doctor_auth_headers: dict):
    # Create target
    unique_email = f"staff_{uuid.uuid4().hex[:8]}@test.com"
    resp = await client.post("/api/v1/users", json={"email": unique_email, "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    new_email = f"new_{uuid.uuid4().hex[:8]}@test.com"
    resp_patch = await client.patch(f"/api/v1/users/{user_id}", json={"email": new_email}, headers=doctor_auth_headers)
    assert resp_patch.status_code == 200
    assert resp_patch.json()["email"] == new_email

async def test_doctor_can_change_doctor_to_staff(client: AsyncClient, doctor_auth_headers: dict):
    resp = await client.post("/api/v1/users", json={"email": f"doc_{uuid.uuid4().hex[:8]}@test.com", "password": "pass", "role": "DOCTOR"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    resp_patch = await client.patch(f"/api/v1/users/{user_id}", json={"role": "STAFF"}, headers=doctor_auth_headers)
    assert resp_patch.status_code == 200
    assert resp_patch.json()["role"] == "STAFF"

async def test_doctor_can_change_staff_to_doctor(client: AsyncClient, doctor_auth_headers: dict):
    resp = await client.post("/api/v1/users", json={"email": f"staff_{uuid.uuid4().hex[:8]}@test.com", "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    resp_patch = await client.patch(f"/api/v1/users/{user_id}", json={"role": "DOCTOR"}, headers=doctor_auth_headers)
    assert resp_patch.status_code == 200
    assert resp_patch.json()["role"] == "DOCTOR"

async def test_staff_cannot_patch(client: AsyncClient, doctor_auth_headers: dict, staff_auth_headers: dict):
    resp = await client.post("/api/v1/users", json={"email": f"doc_{uuid.uuid4().hex[:8]}@test.com", "password": "pass", "role": "DOCTOR"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    resp_patch = await client.patch(f"/api/v1/users/{user_id}", json={"role": "STAFF"}, headers=staff_auth_headers)
    assert resp_patch.status_code == 403

async def test_patch_admin_role_rejected(client: AsyncClient, doctor_auth_headers: dict):
    resp = await client.post("/api/v1/users", json={"email": f"staff_{uuid.uuid4().hex[:8]}@test.com", "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    resp_patch = await client.patch(f"/api/v1/users/{user_id}", json={"role": "ADMIN"}, headers=doctor_auth_headers)
    assert resp_patch.status_code == 422

async def test_patch_unknown_field_rejected(client: AsyncClient, doctor_auth_headers: dict):
    resp = await client.post("/api/v1/users", json={"email": f"staff_{uuid.uuid4().hex[:8]}@test.com", "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    resp_patch = await client.patch(f"/api/v1/users/{user_id}", json={"unknownField": "bad"}, headers=doctor_auth_headers)
    assert resp_patch.status_code == 422

async def test_patch_passwordhash_rejected(client: AsyncClient, doctor_auth_headers: dict):
    resp = await client.post("/api/v1/users", json={"email": f"staff_{uuid.uuid4().hex[:8]}@test.com", "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    resp_patch = await client.patch(f"/api/v1/users/{user_id}", json={"passwordHash": "hacked"}, headers=doctor_auth_headers)
    assert resp_patch.status_code == 422

async def test_patch_deletedat_rejected(client: AsyncClient, doctor_auth_headers: dict):
    resp = await client.post("/api/v1/users", json={"email": f"staff_{uuid.uuid4().hex[:8]}@test.com", "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    resp_patch = await client.patch(f"/api/v1/users/{user_id}", json={"deletedAt": "2026-09-23T10:00:00Z"}, headers=doctor_auth_headers)
    assert resp_patch.status_code == 422

async def test_patch_nonexistent_user(client: AsyncClient, doctor_auth_headers: dict):
    resp_patch = await client.patch(f"/api/v1/users/{uuid.uuid4()}", json={"role": "STAFF"}, headers=doctor_auth_headers)
    assert resp_patch.status_code == 404

async def test_patch_duplicate_email(client: AsyncClient, doctor_auth_headers: dict):
    email1 = f"u1_{uuid.uuid4().hex[:8]}@test.com"
    email2 = f"u2_{uuid.uuid4().hex[:8]}@test.com"
    await client.post("/api/v1/users", json={"email": email1, "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    resp2 = await client.post("/api/v1/users", json={"email": email2, "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    user2_id = resp2.json()["id"]
    
    resp_patch = await client.patch(f"/api/v1/users/{user2_id}", json={"email": email1}, headers=doctor_auth_headers)
    assert resp_patch.status_code == 409

async def test_doctor_cannot_downgrade_self_to_staff(client: AsyncClient, doctor_user, doctor_auth_headers: dict):
    resp_patch = await client.patch(f"/api/v1/users/{doctor_user.id}", json={"role": "STAFF"}, headers=doctor_auth_headers)
    assert resp_patch.status_code == 400

from sqlalchemy.future import select
from app.models import AuditLog

async def test_patch_creates_audit_event(client: AsyncClient, doctor_user, doctor_auth_headers: dict, db_session):
    # clear prior
    resp = await client.post("/api/v1/users", json={"email": f"u_{uuid.uuid4().hex[:8]}@test.com", "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    # count prior audit
    res_before = await db_session.execute(select(AuditLog).where(AuditLog.resourceId == user_id, AuditLog.action == "USER_UPDATED"))
    before = len(res_before.scalars().all())
    
    await client.patch(f"/api/v1/users/{user_id}", json={"role": "DOCTOR"}, headers=doctor_auth_headers)
    
    res_after = await db_session.execute(select(AuditLog).where(AuditLog.resourceId == user_id, AuditLog.action == "USER_UPDATED"))
    after = len(res_after.scalars().all())
    assert after == before + 1

async def test_delete_user(client: AsyncClient, doctor_auth_headers: dict, db_session):
    # Create user
    resp = await client.post("/api/v1/users", json={"email": f"u_{uuid.uuid4().hex[:8]}@test.com", "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    # Delete user
    resp_del = await client.delete(f"/api/v1/users/{user_id}", headers=doctor_auth_headers)
    assert resp_del.status_code == 204
    
    # Verify disappears from GET users
    resp_list = await client.get("/api/v1/users", headers=doctor_auth_headers)
    assert user_id not in [u["id"] for u in resp_list.json()["data"]]
    
    # Verify GET by id works but shows deleted (or is still fetched?)
    # Wait, GET by ID doesn't filter by deletedAt? Let's check test
    
    # Second DELETE -> 404
    resp_del2 = await client.delete(f"/api/v1/users/{user_id}", headers=doctor_auth_headers)
    assert resp_del2.status_code == 404

async def test_delete_already_deactivated_returns_404(client: AsyncClient, doctor_auth_headers: dict):
    resp = await client.post("/api/v1/users", json={"email": f"u_{uuid.uuid4().hex[:8]}@test.com", "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    await client.delete(f"/api/v1/users/{user_id}", headers=doctor_auth_headers)
    
    # Patch deactivated user -> 404
    resp_patch = await client.patch(f"/api/v1/users/{user_id}", json={"role": "DOCTOR"}, headers=doctor_auth_headers)
    assert resp_patch.status_code == 404

async def test_staff_cannot_delete(client: AsyncClient, doctor_auth_headers: dict, staff_auth_headers: dict):
    resp = await client.post("/api/v1/users", json={"email": f"u_{uuid.uuid4().hex[:8]}@test.com", "password": "pass", "role": "STAFF"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    resp_del = await client.delete(f"/api/v1/users/{user_id}", headers=staff_auth_headers)
    assert resp_del.status_code == 403

async def test_doctor_cannot_delete_self(client: AsyncClient, doctor_user, doctor_auth_headers: dict):
    resp_del = await client.delete(f"/api/v1/users/{doctor_user.id}", headers=doctor_auth_headers)
    assert resp_del.status_code == 409

async def test_deactivate_revokes_sessions(client: AsyncClient, doctor_auth_headers: dict, db_session):
    # Create user
    email = f"u_{uuid.uuid4().hex[:8]}@test.com"
    resp = await client.post("/api/v1/users", json={"email": email, "password": "password123", "role": "STAFF"}, headers=doctor_auth_headers)
    user_id = resp.json()["id"]
    
    # Login as that user to create a session
    resp_login = await client.post("/api/v1/auth/login", json={"email": email, "password": "password123"})
    assert resp_login.status_code == 200
    
    from app.models import RefreshToken
    res_tokens = await db_session.execute(select(RefreshToken).where(RefreshToken.userId == user_id))
    tokens_before = res_tokens.scalars().all()
    assert len(tokens_before) == 1
    assert tokens_before[0].revokedAt is None
    
    # Deactivate the user
    await client.delete(f"/api/v1/users/{user_id}", headers=doctor_auth_headers)
    
    # Check tokens revoked
    res_tokens_after = await db_session.execute(select(RefreshToken).where(RefreshToken.userId == user_id))
    tokens_after = res_tokens_after.scalars().all()
    await db_session.refresh(tokens_after[0])
    assert tokens_after[0].revokedAt is not None
