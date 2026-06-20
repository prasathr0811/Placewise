from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

_client: AsyncIOMotorClient = None


async def connect_db():
    global _client
    _client = AsyncIOMotorClient(settings.mongodb_uri)
    print("Connected to MongoDB Atlas")


async def close_db():
    global _client
    if _client:
        _client.close()
        print("MongoDB connection closed")


def get_database():
    return _client["placewise"]
