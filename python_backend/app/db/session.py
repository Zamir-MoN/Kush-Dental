from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings

url = settings.DATABASE_URL
if settings.NODE_ENV == 'test' and settings.TEST_DATABASE_URL:
    url = settings.TEST_DATABASE_URL

SQLALCHEMY_DATABASE_URL = url.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
)
AsyncSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
