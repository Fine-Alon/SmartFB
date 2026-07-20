"""
MongoDB connection setup using PyMongo (AsyncMongoClient) and Beanie.
"""
from typing import Optional
from pymongo import AsyncMongoClient
from beanie import init_beanie

from app.core.config import settings
from app.models.user import User  # Must inherit from beanie.Document!

_mongo_client: Optional[AsyncMongoClient] = None


async def connect_to_mongo() -> None:
    """Initializes PyMongo AsyncMongoClient and Beanie ODM on app startup."""
    global _mongo_client
    
    # 1. Create native PyMongo Async Client
    _mongo_client = AsyncMongoClient(settings.MONGODB_URI)
    
    # 2. Initialize Beanie with your database & document models
    await init_beanie(
        database=_mongo_client[settings.DB_NAME],
        document_models=[User]
    )


async def close_mongo_connection() -> None:
    """Closes the MongoDB connection on app shutdown."""
    global _mongo_client
    if _mongo_client is not None:
        await _mongo_client.close()


def get_database():
    """Returns the PyMongo Async Database instance."""
    global _mongo_client
    if _mongo_client is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo first.")
    return _mongo_client[settings.DB_NAME]