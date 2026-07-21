from typing import List
from fastapi import APIRouter, HTTPException, status, Depends

from ..core.db import get_database
from ..schema.survey_schema import SurveyCreate, SurveyOut
from ..CRUD.survey_crud import (
    db_create_survey,
    db_get_survey_by_id,
    db_get_all_surveys,
    db_delete_survey
)
from ..core.security import require_admin

router = APIRouter(
    prefix="/surveys", 
    tags=["Surveys"]
)


@router.post("/", response_model=SurveyOut, status_code=status.HTTP_201_CREATED)
async def create_survey(
    payload: SurveyCreate,
    user_data: tuple = Depends(require_admin),
):
    admin_id, role = user_data
    db = get_database()

    survey_dict = payload.model_dump()
    survey_dict["owner_id"] = admin_id

    # QR code, link, and all fields are generated inside db_create_survey
    new_survey = await db_create_survey(db, survey_dict)
    
    return new_survey


@router.get("/{survey_id}", response_model=SurveyOut)
async def get_survey(survey_id: str):
    """
    Customer endpoint: Returns survey layout to render on client screen.
    """
    db = get_database()
    survey = await db_get_survey_by_id(db, survey_id)

    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Survey '{survey_id}' not found.",
        )

    return survey


@router.get("/", response_model=List[SurveyOut])
async def list_surveys(user_data: tuple = Depends(require_admin)):
    """
    Lists all active surveys available for the logged-in admin.
    """
    admin_id, role = user_data
    db = get_database()
    return await db_get_all_surveys(db, admin_id)

@router.delete("/{survey_id}", status_code=status.HTTP_200_OK)
async def delete_survey(
    survey_id: str, 
    user_data: tuple = Depends(require_admin)
):
    db = get_database()
    success = await db_delete_survey(db, survey_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Survey not found")
        
    return {"message": "Survey deleted successfully"}