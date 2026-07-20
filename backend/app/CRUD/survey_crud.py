from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase

from app.core.qr import generate_qr_code_base64


async def db_create_survey(db: AsyncDatabase, survey_dict: Dict[str, Any]) -> Dict[str, Any]:
    survey_id = ObjectId()
    
    # Pre-populate required SurveyOut defaults before database insertion
    survey_dict["_id"] = survey_id
    survey_dict["is_active"] = True
    survey_dict["created_at"] = datetime.now(timezone.utc)

    # Build QR code URL (adjust frontend host/port if needed)
    frontend_url = f"http://localhost:5173/surveys/{str(survey_id)}"
    survey_dict["qr_code"] = generate_qr_code_base64(frontend_url)

    await db["surveys"].insert_one(survey_dict)

    survey_dict["_id"] = str(survey_id)
    return survey_dict


async def db_get_survey_by_id(db: AsyncDatabase, survey_id: str) -> Optional[Dict[str, Any]]:
    if not ObjectId.is_valid(survey_id):
        return None
    survey = await db["surveys"].find_one({"_id": ObjectId(survey_id)})
    if survey:
        survey["_id"] = str(survey["_id"])
    return survey


async def db_get_all_surveys(db: AsyncDatabase) -> List[Dict[str, Any]]:
    surveys = await db["surveys"].find().to_list(100)
    for survey in surveys:
        survey["_id"] = str(survey["_id"])
    return surveys