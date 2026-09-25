import asyncio
import os
from sqlalchemy import text
from app.db.session import engine

async def delete_leads():
    async with engine.begin() as conn:
        await conn.execute(text('TRUNCATE TABLE "Lead" CASCADE;'))
        print("All leads have been successfully deleted.")

if __name__ == "__main__":
    asyncio.run(delete_leads())
