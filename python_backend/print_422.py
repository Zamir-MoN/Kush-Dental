import asyncio
from httpx import AsyncClient, ASGITransport
from datetime import datetime, timedelta, timezone
from app.main import app

async def test():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        start = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
        end = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
        res = await client.get(f"/api/v1/appointments?startDate={start}&endDate={end}")
        print(res.status_code)
        print(res.json())

asyncio.run(test())
