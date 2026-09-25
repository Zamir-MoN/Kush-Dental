import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import os
from dotenv import load_dotenv

load_dotenv()
async def test_dup():
    engine = create_async_engine(os.getenv("TEST_DATABASE_URL"))
    async with engine.begin() as conn:
        await conn.execute(text("""
            INSERT INTO "Patient" (id, "fullName", phone, "updatedAt") 
            VALUES ('11111111-1111-1111-1111-111111111111', 'T', '11', NOW()) ON CONFLICT DO NOTHING
        """))
        await conn.execute(text("""
            INSERT INTO "Lead" (id, name, phone, "updatedAt", "createdAt", status) 
            VALUES ('22222222-2222-2222-2222-222222222222', 'T', '11', NOW(), NOW(), 'NEW') ON CONFLICT DO NOTHING
        """))
        try:
            await conn.execute(text("""
                INSERT INTO "Contact" (id, "patientId", "leadId", status, "updatedAt") 
                VALUES ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'OPEN', NOW())
            """))
            print("FIRST INSERT OK")
            await conn.execute(text("""
                INSERT INTO "Contact" (id, "patientId", "leadId", status, "updatedAt") 
                VALUES ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'OPEN', NOW())
            """))
            print("SECOND INSERT OK?! THIS IS BAD!")
        except Exception as e:
            print(f"FAILED AS EXPECTED: {e}")
    await engine.dispose()

asyncio.run(test_dup())
