from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime, timezone
from ..services.ai_service import analyze_submission_text

from ..core.db import get_database # לדוגמה, אם הקובץ יושב ב-app/db/mongodb.py

router = APIRouter(prefix="/submissions", tags=["Submissions"])

class SubmissionCreate(BaseModel):
    # המבנה שמצפים לקבל מה-Frontend (מילון דינמי של שאלות ותשובות)
    answers: Dict[str, Any]

@router.post("/{form_id}", status_code=status.HTTP_201_CREATED)
async def submit_feedback(form_id: str, submission: SubmissionCreate):
    """
    נתיב ציבורי לקבלת טפסים מלקוחות.
    מנתח את הטקסט עם AI, מחליט על סטטוס, ושומר ב-MongoDB.
    """
    
    # 1. שליפת אובייקט ה-Database בעזרת הפונקציה שלך
    db = get_database()
    
    # 2. איסוף כל התשובות הטקסטואליות כדי שה-AI ינתח אותן כבלוק אחד
    text_values = [str(val) for val in submission.answers.values() if isinstance(val, str)]
    full_text = " ".join(text_values)
    
    if not full_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="הטופס ריק או לא מכיל טקסט לניתוח"
        )

    # 3. הפעלת מנוע ה-AI (Ollama)
    ai_result = await analyze_submission_text(full_text)
    
    # 4. לוגיקת ניתוב (Routing) לפי החלטת ה-AI
    if ai_result.get("is_flagged") is True:
        submission_status = "pending_human_review"  # עובר לתור המאובטח של העובדים
    else:
        submission_status = "auto_processed"        # נסגר אוטומטית וממתין לסטטיסטיקות
        
    # 5. הכנת הדוקומנט המלא לשמירה במונגו
    new_submission = {
        "form_id": form_id,
        "original_answers": submission.answers,
        "ai_analysis": ai_result,  # מכיל קטגוריה, סיכום, טקסט מתוקן וסיבת דגל
        "status": submission_status,
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