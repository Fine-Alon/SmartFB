from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from ..core.security import RoleChecker
from ..services.analist_service import get_pending_reviews, resolve_submission, get_all_reviews

router = APIRouter(prefix="/reviews", tags=["Human Review Queue"])

# מאשרים גם לאדמין וגם לתמיכה לטפל בפניות חריגות
allow_internal_staff = RoleChecker(["admin", "support"])

class ResolveRequest(BaseModel):
    reviewer_notes: str

@router.get("/queue")
async def get_review_queue(current_user: tuple = Depends(allow_internal_staff)):
    """שליפת כל הפניות המסומנות בדגל אדום וממתינות לטיפול אנושי"""
    queue_data = await get_pending_reviews()
    return queue_data

@router.get("/all")
async def get_all_submissions(current_user: tuple = Depends(allow_internal_staff)):
    """שליפת כל הפניות (כולל פתורות אוטומטית)"""
    all_data = await get_all_reviews()
    return all_data

@router.patch("/{submission_id}/resolve", status_code=status.HTTP_200_OK)
async def resolve_flagged_submission(
    submission_id: str, 
    payload: ResolveRequest, 
    current_user: tuple = Depends(allow_internal_staff)
):
    """עדכון סטטוס הפנייה לפתורה בצירוף הערות הבודק האנושי"""
    await resolve_submission(submission_id, payload.reviewer_notes)
    return {"message": "Submission resolved successfully"}