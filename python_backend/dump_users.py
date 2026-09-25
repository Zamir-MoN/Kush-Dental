import asyncio
from app.core.config import settings
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

async def check_db(url, name):
    engine = create_async_engine(url)
    async_session_maker = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session_maker() as db:
        result = await db.execute(text('SELECT email, "passwordHash" FROM "User"'))
        rows = result.fetchall()
        print(f"Users in {name}:")
        for row in rows:
            print(f" - {row[0]}")

async def main():
    await check_db(settings.DATABASE_URL, 'DEV')
    await check_db(settings.TEST_DATABASE_URL, 'TEST')

if __name__ == "__main__":
    asyncio.run(main())
