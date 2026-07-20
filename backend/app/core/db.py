"""
Install: pip install mongoengine
"""
from mongoengine import connect, disconnect

from app.core.config import settings


def connect_to_mongo() -> None:
    """Call once on app startup (e.g. in main.py's lifespan handler)."""
    connect(db=settings.MONGO_DB_NAME, host=settings.MONGO_URI)


def close_mongo_connection() -> None:
    """Call once on app shutdown."""
    disconnect()
