from fastapi import APIRouter, Depends, HTTPException, status
from ..core.security import RoleChecker
from ..services.analist_service import get_form_statistics, get_global_statistics

router = APIRouter(prefix="/analytics", tags=["Analytics"])

# רק אדמין מורשה לראות נתונים עסקיים
allow_admin = RoleChecker(["admin"])

@router.get("/forms/{form_id}/stats")
async def get_analytics(form_id: str, current_user: tuple = Depends(allow_admin)):
    """נתיב מוגן לאדמין - קורא לפונקציית הסטטיסטיקות ומחזיר נתונים לדאשבורד"""
    try:
        stats = await get_form_statistics(form_id)
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving analytics data: {str(e)}"
        )

@router.get("/global-stats")
async def get_global_stats(current_user: tuple = Depends(allow_admin)):
    """נתיב מוגן לאדמין - קורא לפונקציית הסטטיסטיקות הכלליות של כל הטפסים והפניות"""
    try:
        stats = await get_global_statistics()
        return stats
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving global analytics: {str(e)}"
        )