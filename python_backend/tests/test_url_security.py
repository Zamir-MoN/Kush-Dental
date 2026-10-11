import pytest
from pydantic import ValidationError
from app.schemas.blog import BlogCreate, BlogUpdate

def test_blog_cover_image_accepts_valid_urls():
    valid_urls = [
        "https://example.com/image.png",
        "http://example.com/image.jpg",
        "https://pixazo.com/generated/123",
        "  https://example.com/image.png  "
    ]
    for url in valid_urls:
        blog = BlogCreate(
            title="Title",
            slug="title-slug",
            content="Content here",
            coverImage=url
        )
        assert blog.coverImage == url.strip()

def test_blog_cover_image_rejects_dangerous_urls():
    dangerous_urls = [
        "javascript:alert(1)",
        "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTs8L3NjcmlwdD4=",
        "file:///etc/passwd",
        "about:blank",
        "ftp://example.com/file",
        "//example.com/evil"
    ]
    for url in dangerous_urls:
        with pytest.raises(ValidationError):
            BlogCreate(
                title="Title",
                slug="title-slug",
                content="Content here",
                coverImage=url
            )

        with pytest.raises(ValidationError):
            BlogUpdate(
                coverImage=url
            )
