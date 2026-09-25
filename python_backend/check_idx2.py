import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()
async def check():
    engine = create_async_engine(os.getenv("TEST_DATABASE_URL"))
    async with engine.begin() as conn:
        res = await conn.execute(text("SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'Contact'"))
        for r in res.fetchall():
            print(r)
    await engine.dispose()

asyncio.run(check())
