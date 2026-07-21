from typing import List
from fastapi import APIRouter, HTTPException, status, Depends
from fastapi import APIRouter, HTTPException, status, Depends
import qrcode
import base64
import io

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


# Add these to your imports at the top
@router.post("/", response_model=SurveyOut, status_code=status.HTTP_201_CREATED)
async def create_survey(
    payload: SurveyCreate,
    user_data: tuple = Depends(require_admin),
):
    admin_id, role = user_data
    db = get_database()

    survey_dict = payload.model_dump()
    survey_dict["owner_id"] = admin_id

    # 1. Create the survey in DB
    new_survey = await db_create_survey(db, survey_dict)
    
    # 2. Generate QR Code
    # Assuming new_survey is a dictionary containing the _id
    survey_id = str(new_survey["_id"]) 
    survey_url = f"https://smartfb.com/share/{survey_id}"
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(survey_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save to buffer and encode
    buffered = io.BytesIO()
    img.save(buffered, "PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    # 3. Inject the QR code and link into the survey dictionary
    # These match the fields you just added to SurveyOut
    new_survey["qr_code"] = img_str
    new_survey["link"] = survey_url
    
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