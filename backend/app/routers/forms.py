from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime, timezone
from ..services.ai_service import analyze_submission_text
# ייבוא ה-DB (תתאים לחיבור המונגו שלך)
# from app.db.database import db

router = APIRouter(prefix="/submissions", tags=["Submissions"])

class SubmissionCreate(BaseModel):
    # המבנה של הטופס שנשלח מהלקוח. זה דיקשנרי כי השאלות דינמיות.
    answers: Dict[str, Any]

@router.post("/{form_id}", status_code=status.HTTP_201_CREATED)
async def submit_feedback(form_id: str, submission: SubmissionCreate):
    """
    נתיב ציבורי לקבלת טפסים מלקוחות.
    מנתח את הטקסט עם AI, מחליט על סטטוס, ושומר במסד הנתונים.
    """
    
    # 1. איסוף כל התשובות הטקסטואליות כדי שה-AI יוכל לקרוא אותן כבלוק אחד
    text_values = [str(val) for val in submission.answers.values() if isinstance(val, str)]
    full_text = " ".join(text_values)
    
    if not full_text.strip():
        raise HTTPException(status_code=400, detail="הטופס ריק או לא מכיל טקסט לניתוח")

    # 2. שליחה ל-AI לניתוח
    ai_result = await analyze_submission_text(full_text)
    
    # 3. לוגיקת הניתוב (Routing) בהתאם לדגל האדום
    if ai_result.get("is_flagged") is True:
        submission_status = "pending_human_review" # יעבור לתור של העובדים
    else:
        submission_status = "auto_processed" # יטופל אוטומטית וישמר לסטטיסטיקות
        
    # 4. הכנת המסמך לשמירה במונגו
    new_submission = {
        "form_id": form_id,
        "original_answers": submission.answers,
        "ai_analysis": ai_result,  # מכיל את הקטגוריה, הסיכום והטקסט המתוקן
        "status": submission_status,
        "created_at": datetime.now(timezone.utc),
        "reviewer_notes": None, # העובד ימלא את זה בהמשך
        "resolved_at": None
    }
    
    # 5. שמירה ב-Database
    # result = await db.submissions.insert_one(new_submission)
    
    return {
        "message": "הפנייה התקבלה בהצלחה",
        # "submission_id": str(result.inserted_id),
        "status": submission_status
    }