"""
Mongo connection setups for both MongoEngine and PyMongo.
"""
from mongoengine import connect, disconnect
from pymongo import MongoClient
from ..core.config import settings

_mongo_client = None


async def connect_to_mongo() -> None:
    """Call once on app startup (e.g. in main.py's lifespan handler)."""
    global _mongo_client
    # Connect MongoEngine
    connect(db=settings.DB_NAME, host=settings.MONGODB_URI)
    # Connect PyMongo Client
    _mongo_client = MongoClient(settings.MONGODB_URI)


async def close_mongo_connection() -> None:
    """Call once on app shutdown."""
    global _mongo_client
    # Disconnect MongoEngine
    disconnect()
    # Close PyMongo Client
    if _mongo_client:
        _mongo_client.close()


def get_database():
    """Returns the PyMongo Database instance for synchronous collections query."""
    global _mongo_client
    if _mongo_client is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo first.")
    return _mongo_client[settings.DB_NAME]
