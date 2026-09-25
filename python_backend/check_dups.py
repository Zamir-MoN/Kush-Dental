import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()
async def check():
    engine = create_async_engine(os.getenv("TEST_DATABASE_URL"))
    async with engine.begin() as conn:
        res = await conn.execute(text('SELECT "leadId", COUNT(*) FROM "Contact" WHERE "leadId" IS NOT NULL GROUP BY "leadId" HAVING COUNT(*) > 1'))
        rows = res.fetchall()
        for r in rows:
            print(f"DUPLICATE: {r}")
        if not rows:
            print("NO DUPLICATES")
    await engine.dispose()

asyncio.run(check())
