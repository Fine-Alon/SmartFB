from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Dict, Any
from datetime import datetime, timezone
from ..services.ai_service import analyze_submission_text
from ..core.db import get_database 

router = APIRouter(prefix="/submissions", tags=["Submissions"])

class SubmissionCreate(BaseModel):
    guest_email: EmailStr
    answers: Dict[str, Any]

@router.post("/{form_id}", status_code=status.HTTP_201_CREATED)
async def submit_feedback(form_id: str, submission: SubmissionCreate):
    """
    נתיב ציבורי לקבלת טפסים מלקוחות.
    מנתח את הטקסט עם AI, מחליט על סטטוס, ושומר ב-MongoDB.
    """
    
    db = get_database()
    
    import json
    
    # 2. Convert the entire answers dictionary to a JSON string for the AI
    full_text = json.dumps(submission.answers, ensure_ascii=False)
    
    # 3. הפעלת מנוע ה-AI (Ollama)
    ai_result = await analyze_submission_text(full_text)
    
    # 4. לוגיקת ניתוב (Routing) לפי החלטת ה-AI
    ai_category = ai_result.get("category", "SAFE")
    
    is_urgent = False
    if ai_category == "URGENT":
        submission_status = "pending_human_review"
        is_urgent = True
    elif ai_category == "NEEDS_REVIEW":
        submission_status = "pending_human_review"
    else:
        submission_status = "auto_processed"
        
    # 5. הכנת הדוקומנט המלא לשמירה במונגו
    new_submission = {
        "form_id": form_id,
        "guest_email": submission.guest_email,
        "original_answers": submission.answers,
        "ai_analysis": ai_result,
        "status": submission_status,
        "is_urgent": is_urgent,
        "created_at": datetime.now(timezone.utc),
        "reviewer_notes": None,
        "resolved_at": None
    }
    
    # 6. שמירה פיזית בקולקשן submissions ב-DB שלך
    result = db.submissions.insert_one(new_submission)
    
    return {
        "message": "הפנייה התקבלה ועובדה בהצלחה",
        "submission_id": str(result.inserted_id),
        "status": submission_status
    }