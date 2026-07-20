from ..core.db import get_database

def get_form_statistics(form_id: str) -> dict:
    """
    מבצעת אגרגציה מתקדמת ב-MongoDB כולל חישוב ממוצעי דירוגים ומדדי שביעות רצון (CSAT).
    """
    db = get_database()
    
    # בדיקה בסיסית: האם יש בכלל פניות לטופס הזה?
    total_submissions = db.submissions.count_documents({"form_id": form_id})
    if total_submissions == 0:
        return {
            "form_id": form_id,
            "total_submissions": 0,
            "flagged_count": 0,
            "flagged_percentage": 0,
            "average_user_rating": 0,
            "average_ai_sentiment": 0,
            "categories_breakdown": {},
            "status_breakdown": {}
        }

    # 1. פילוח לפי קטגוריות
    category_pipeline = [
        {"$match": {"form_id": form_id}},
        {"$group": {"_id": "$ai_analysis.category", "count": {"$sum": 1}}}
    ]
    categories_cursor = db.submissions.aggregate(category_pipeline)
    categories_breakdown: dict[str, int] = {doc["_id"]: doc["count"] for doc in categories_cursor if doc["_id"]}

    # 2. פילוח לפי סטטוסים
    status_pipeline = [
        {"$match": {"form_id": form_id}},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    status_cursor = db.submissions.aggregate(status_pipeline)
    status_breakdown: dict[str, int] = {doc["_id"]: doc["count"] for doc in status_cursor}

    # 3. חישוב ממוצעים (דירוג משתמשים + סנטימנט AI)
    # אנחנו משתמשים ב-$avg של מונגו. אם שדה ה-rating מגיע בתוך original_answers.rating
    metrics_pipeline = [
        {"$match": {"form_id": form_id}},
        {
            "$group": {
                "_id": None,
                "avg_ai_sentiment": {"$avg": "$ai_analysis.sentiment_score"},
                # מונגו יודע להמיר ערכים מספריים מתוך התשובות הדינמיות
                "avg_user_rating": {"$avg": "$original_answers.rating"} 
            }
        }
    ]
    metrics_cursor = list(db.submissions.aggregate(metrics_pipeline))
    
    # חילוץ הממוצעים מתוך תוצאת האגרגציה
    avg_ai_sentiment = 0
    avg_user_rating = 0
    
    if metrics_cursor:
        avg_ai_sentiment = metrics_cursor[0].get("avg_ai_sentiment") or 0
        avg_user_rating = metrics_cursor[0].get("avg_user_rating") or 0

    flagged_count = status_breakdown.get("pending_human_review", 0)
    flagged_percentage = (flagged_count / total_submissions * 100)

    return {
        "form_id": form_id,
        "total_submissions": total_submissions,
        "flagged_count": flagged_count,
        "flagged_percentage": round(flagged_percentage, 2),
        "average_user_rating": round(avg_user_rating, 2),      # ממוצע הכוכבים שהלקוחות לחצו
        "average_ai_sentiment": round(avg_ai_sentiment, 2),    # ממוצע ה"מצב רוח" שה-AI זיהה בטקסט
        "categories_breakdown": categories_breakdown,
        "status_breakdown": status_breakdown
    }