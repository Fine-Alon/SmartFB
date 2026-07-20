from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db_instance.db = db_instance.client[settings.DB_NAME]
    
    # Send a ping to confirm connection
    await db_instance.client.admin.command('ping')
    print(f"✅ Connected to MongoDB: {settings.DB_NAME}")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("🔒 MongoDB connection closed")

# Helper function to access the DB in your API routes
def get_database():
    return db_instance.db