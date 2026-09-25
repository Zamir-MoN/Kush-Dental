import asyncio
from app.core.config import settings
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

async def check(url, name):
    try:
        engine = create_async_engine(url)
        async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        async with async_session_maker() as db:
            result = await db.execute(text('SELECT email FROM "User" WHERE email LIKE \'%test_%\''))
            rows = result.fetchall()
            print(f"Users in {name}: {[r[0] for r in rows]}")
    except Exception as e:
        print(f"Error {name}: {e}")

async def main():
    await check(settings.DATABASE_URL, 'DEV')
    await check(settings.TEST_DATABASE_URL, 'TEST')

asyncio.run(main())
