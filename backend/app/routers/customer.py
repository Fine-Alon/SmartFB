from fastapi import APIRouter
from app.core.db import get_database

router = APIRouter()

@router.get("/")
async def get_all_customers():
    db = get_database()
    # Query the 'customers' collection in the SmartFB database
    customers = await db["customers"].find().to_list(100)
    
    # Convert BSON ObjectIds to string for JSON serialization
    for customer in customers:
        customer["_id"] = str(customer["_id"])
        
    return customers