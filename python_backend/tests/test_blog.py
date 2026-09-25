import pytest
from httpx import AsyncClient
import uuid

@pytest.mark.asyncio
async def test_blog_crud_workflow(client: AsyncClient, doctor_auth_headers: dict):
    unique_id = str(uuid.uuid4())
    slug = f"test-blog-post-{unique_id}"
    
    # 1. Create a draft blog
    create_data = {
        "title": "Test Blog Post",
        "slug": slug,
        "excerpt": "This is a test blog post",
        "content": "<p>Hello <b>World</b>!</p><script>alert('xss')</script>",
        "coverImage": "https://example.com/image.jpg"
    }
    response = await client.post("/api/v1/blog", json=create_data, headers=doctor_auth_headers)
    assert response.status_code == 201
    blog = response.json()
    assert blog["title"] == "Test Blog Post"
    assert blog["status"] == "DRAFT"
    # Verify sanitization
    assert "<script>" not in blog["content"]
    assert "<b>World</b>" in blog["content"]
    
    blog_id = blog["id"]

    # 2. Get the blog
    response = await client.get(f"/api/v1/blog/{blog_id}", headers=doctor_auth_headers)
    assert response.status_code == 200

    # 3. Update the blog
    update_data = {"title": "Updated Blog Post"}
    response = await client.patch(f"/api/v1/blog/{blog_id}", json=update_data, headers=doctor_auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Blog Post"

    # 4. Check public endpoint (should be hidden)
    response = await client.get("/api/v1/public/blog")
    assert response.status_code == 200
    assert len([b for b in response.json() if b["id"] == blog_id]) == 0

    # 5. Publish the blog
    response = await client.post(f"/api/v1/blog/{blog_id}/publish", headers=doctor_auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "PUBLISHED"
    assert response.json()["publishedAt"] is not None

    # 6. Check public endpoint (should be visible)
    response = await client.get(f"/api/v1/public/blog/{slug}")
    assert response.status_code == 200
    assert response.json()["id"] == blog_id

    # 7. Unpublish the blog
    response = await client.post(f"/api/v1/blog/{blog_id}/unpublish", headers=doctor_auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "DRAFT"

    # 8. Check public endpoint (should be hidden again)
    response = await client.get(f"/api/v1/public/blog/{slug}")
    assert response.status_code == 404

    # 9. Delete the blog
    response = await client.delete(f"/api/v1/blog/{blog_id}", headers=doctor_auth_headers)
    assert response.status_code == 204

@pytest.mark.asyncio
async def test_blog_duplicate_slug(client: AsyncClient, doctor_auth_headers: dict):
    slug = f"duplicate-slug-{str(uuid.uuid4())}"
    create_data = {
        "title": "Slug 1",
        "slug": slug,
        "content": "<p>Content</p>"
    }
    response = await client.post("/api/v1/blog", json=create_data, headers=doctor_auth_headers)
    assert response.status_code == 201

    create_data_2 = {
        "title": "Slug 2",
        "slug": slug,
        "content": "<p>Content</p>"
    }
    response = await client.post("/api/v1/blog", json=create_data_2, headers=doctor_auth_headers)
    assert response.status_code == 400

@pytest.mark.asyncio
async def test_blog_staff_access_denied(client: AsyncClient, staff_auth_headers: dict):
    response = await client.get("/api/v1/blog", headers=staff_auth_headers)
    assert response.status_code == 403

    response = await client.post("/api/v1/blog", json={"title": "T", "slug": "t", "content": "c"}, headers=staff_auth_headers)
    assert response.status_code == 403
