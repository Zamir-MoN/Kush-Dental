import asyncio
from sqlalchemy import text
from app.db.session import engine

async def query():
    async with engine.begin() as conn:
        res = await conn.execute(text('SELECT id, name, phone, email, status FROM "Lead"'))
        print("Leads:", res.fetchall())

asyncio.run(query())
