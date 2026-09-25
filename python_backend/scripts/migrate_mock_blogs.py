import json
import os
import sys
import re
from datetime import datetime, timezone

# Add python_backend to sys.path so we can import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import asyncio
from app.db.session import AsyncSessionLocal
from sqlalchemy.future import select
from app.models import Blog, User, Role, BlogStatus

def generate_slug(title: str) -> str:
    # Lowercase, replace non-alphanumeric with hyphens
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
    return slug

def parse_date(date_str: str) -> datetime:
    # Example format: "24 Aug 2026"
    try:
        dt = datetime.strptime(date_str, "%d %b %Y")
        return dt.replace(tzinfo=timezone.utc)
    except ValueError:
        return datetime.now(timezone.utc)

def convert_to_html(post: dict) -> str:
    html_parts = []
    
    # Introduction
    if post.get("introduction"):
        html_parts.append(f"<p>{post['introduction']}</p>")
        
    # Sections
    sections = post.get("sections", [])
    for section in sections:
        if section.get("heading"):
            html_parts.append(f"<h2>{section['heading']}</h2>")
        for para in section.get("body", []):
            html_parts.append(f"<p>{para}</p>")
        if section.get("highlight"):
            html_parts.append(f"<blockquote><strong>Highlight:</strong> {section['highlight']}</blockquote>")
            
    # Quote
    quote = post.get("quote")
    if quote:
        html_parts.append(f"<blockquote><em>\"{quote['text']}\"</em><br/>- {quote['author']}</blockquote>")
        
    # Key Takeaways
    takeaways = post.get("keyTakeaways", [])
    if takeaways:
        html_parts.append("<h2>Key Takeaways</h2>")
        html_parts.append("<ul>")
        for item in takeaways:
            html_parts.append(f"<li>{item}</li>")
        html_parts.append("</ul>")
        
    return "".join(html_parts)

async def migrate():
    async with AsyncSessionLocal() as db:
        try:
            # Find the test DOCTOR user
            result = await db.execute(select(User).filter(User.role == Role.DOCTOR))
            doctor = result.scalars().first()
            if not doctor:
                print("ERROR: No DOCTOR user found in database.")
                sys.exit(1)
                
            print(f"Resolved DOCTOR user ID: {doctor.id}")

            json_path = os.path.join(os.path.dirname(__file__), 'mock_blogs.json')
            with open(json_path, 'r', encoding='utf-8') as f:
                mock_blogs = json.load(f)
                
            print(f"EXPECTED SOURCE COUNT = {len(mock_blogs)}")
            
            imported = 0
            for data in mock_blogs:
                slug = generate_slug(data["title"])
                content_html = convert_to_html(data)
                
                result = await db.execute(select(Blog).filter(Blog.slug == slug))
                existing_post = result.scalars().first()
                now = datetime.now(timezone.utc)
                if existing_post:
                    # Update existing (Idempotent)
                    existing_post.title = data["title"]
                    existing_post.excerpt = data.get("excerpt")
                    existing_post.content = content_html
                    existing_post.coverImage = data.get("image")
                    existing_post.category = data.get("category")
                    existing_post.tags = data.get("tags", [])
                    existing_post.publishedAt = parse_date(data.get("date"))
                    existing_post.updatedAt = now
                    existing_post.status = BlogStatus.PUBLISHED
                    existing_post.authorId = doctor.id
                    print(f"Updated existing post: {slug}")
                else:
                    # Insert new
                    new_post = Blog(
                        title=data["title"],
                        slug=slug,
                        excerpt=data.get("excerpt"),
                        content=content_html,
                        coverImage=data.get("image"),
                        category=data.get("category"),
                        tags=data.get("tags", []),
                        publishedAt=parse_date(data.get("date")),
                        updatedAt=now,
                        status=BlogStatus.PUBLISHED,
                        authorId=doctor.id
                    )
                    db.add(new_post)
                    print(f"Inserted new post: {slug}")
                    
                imported += 1
                
            await db.commit()
            print(f"SUCCESS: Migrated {imported} posts.")

        except Exception as e:
            await db.rollback()
            print(f"ERROR: {e}")
            raise

if __name__ == "__main__":
    asyncio.run(migrate())
