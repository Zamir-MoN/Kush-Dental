import asyncio
from sqlalchemy import text
from app.db.session import engine

async def count():
    async with engine.begin() as conn:
        res = await conn.execute(text('SELECT count(*) FROM "Lead"'))
        print("Count:", res.scalar())

asyncio.run(count())
