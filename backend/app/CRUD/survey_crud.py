from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from pymongo.database import Database

from app.core.qr import generate_qr_code_base64
from app.core.config import settings


async def db_create_survey(db: Database, survey_dict: Dict[str, Any]) -> Dict[str, Any]:
    survey_id = ObjectId()
    
    # 1. Prepare data
    survey_dict["_id"] = survey_id
    survey_dict["is_active"] = True
    survey_dict["created_at"] = datetime.now(timezone.utc)

    # 2. Build URL and QR Code using dynamic FRONTEND_PUBLIC_URL
    frontend_url = f"{settings.FRONTEND_PUBLIC_URL}/survey/{str(survey_id)}"
    
    survey_dict["link"] = frontend_url
    survey_dict["qr_code"] = generate_qr_code_base64(frontend_url)

    # 3. Insert to DB
    db["surveys"].insert_one(survey_dict)

    # 4. Prepare return object (convert _id to string for JSON)
    survey_dict["_id"] = str(survey_id)
    
    return survey_dict


async def db_get_survey_by_id(db: Database, survey_id: str) -> Optional[Dict[str, Any]]:
    if not ObjectId.is_valid(survey_id):
        return None
    survey = db["surveys"].find_one({"_id": ObjectId(survey_id)})
    if survey:
        survey["_id"] = str(survey["_id"])
    return survey


async def db_get_all_surveys(db: Database, admin_id: str) -> List[Dict[str, Any]]:
    surveys = list(db["surveys"].find({"owner_id": admin_id}).limit(100))
    for survey in surveys:
        survey["_id"] = str(survey["_id"])
    return surveys

async def db_delete_survey(db: Database, survey_id: str) -> bool:
    print(f"-> Active Database Name: {db.name}")
    
    # Print the first few IDs currently in the database to debug connection/collection mismatches
    existing_docs = list(db["surveys"].find({}, {"_id": 1}).limit(10))
    print(f"-> IDs currently in backend 'surveys' collection: {[str(d['_id']) for d in existing_docs]}")
    print(f"-> Target ID requested for deletion: {survey_id}")

    try:
        obj_id = ObjectId(survey_id)
        query = {"$or": [{"_id": obj_id}, {"_id": survey_id}]}
    except Exception:
        query = {"_id": survey_id}

    result = db["surveys"].delete_one(query)
    print(f"-> Delete count result: {result.deleted_count}")
    
    return result.deleted_count > 0