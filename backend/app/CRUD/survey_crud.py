from typing import List, Optional, Dict, Any
from bson import ObjectId
from pymongo.asynchronous.database import AsyncDatabase


async def db_create_survey(db: AsyncDatabase, survey_dict: Dict[str, Any]) -> Dict[str, Any]:
    result = await db["surveys"].insert_one(survey_dict)
    survey = await db["surveys"].find_one({"_id": result.inserted_id})
    
    if survey is None:
        raise RuntimeError("Failed to retrieve created survey document.")
        
    survey["_id"] = str(survey["_id"])
    return survey


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