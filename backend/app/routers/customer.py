from fastapi import APIRouter
from ..core.db import get_database

router = APIRouter(
prefix="/customers", 
tags=["customers"]
)



@router.get("/")
def get_all_customers():
    db = get_database()
    # Query the 'customers' collection in the SmartFB database
    customers = list(db["customers"].find().limit(100))
    
    # Convert BSON ObjectIds to string for JSON serialization
    for customer in customers:
        customer["_id"] = str(customer["_id"])
        
    return customers