from fastapi import APIRouter, Depends, status, HTTPException
from bson import ObjectId
from pydantic import BaseModel
from ..core.security import RoleChecker
from ..core.db import get_database
from ..services.analist_service import get_pending_reviews, resolve_submission, get_all_reviews

router = APIRouter(prefix="/reviews", tags=["Human Review Queue"])

# מאשרים גם לאדמין וגם לתמיכה לטפל בפניות חריגות
allow_internal_staff = RoleChecker(["admin", "support"])

class ResolveRequest(BaseModel):
    reviewer_notes: str

@router.get("/queue")
async def get_review_queue(current_user: tuple = Depends(allow_internal_staff)):
    """שליפת כל הפניות המסומנות בדגל אדום וממתינות לטיפול אנושי"""
    try:
        queue_data = await get_pending_reviews()
        return queue_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.get("/all")
async def get_all_submissions(current_user: tuple = Depends(allow_internal_staff)):
    """שליפת כל הפניות (כולל פתורות אוטומטית)"""
    try:
        all_data = await get_all_reviews()
        return all_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.patch("/{submission_id}/resolve", status_code=status.HTTP_200_OK)
async def resolve_flagged_submission(
    submission_id: str, 
    payload: ResolveRequest, 
    current_user: tuple = Depends(allow_internal_staff)
):
    """עדכון סטטוס הפנייה לפתורה בצירוף הערות הבודק האנושי"""
    try:
        await resolve_submission(submission_id, payload.reviewer_notes)
        return {"message": "Submission resolved successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@router.delete("/{submission_id}", status_code=status.HTTP_200_OK)
async def delete_submission(
    submission_id: str,
    current_user: tuple = Depends(allow_internal_staff)
):
    """מחיקת פנייה מהמערכת"""
    db = get_database()
    try:
        obj_id = ObjectId(submission_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid submission ID format")
        
    # Ensure this matches the collection name where your reviews/submissions are stored (e.g., "submissions" or "reviews")
    try:
        result = db["submissions"].delete_one({"_id": obj_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Submission not found")
            
        return {"message": "Submission deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")