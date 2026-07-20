from ..core.db import get_database
from bson import ObjectId
from datetime import datetime, timezone
from fastapi import HTTPException, status

async def get_form_statistics(form_id: str) -> dict:
    db = get_database()
    
    total_submissions = await db.submissions.count_documents({"form_id": form_id})
    if total_submissions == 0:
        return {
            "form_id": form_id,
            "total_submissions": 0,
            "flagged_count": 0,
            "flagged_percentage": 0.0,
            "average_user_rating": 0.0,
            "average_ai_sentiment": 0.0,
            "categories_breakdown": {},
            "status_breakdown": {}
        }

    category_pipeline = [
        {"$match": {"form_id": form_id}},
        {"$group": {"_id": "$ai_analysis.category", "count": {"$sum": 1}}}
    ]
    categories_cursor = await db.submissions.aggregate(category_pipeline)
    categories_breakdown: dict[str, int] = {
        str(doc["_id"]): int(doc["count"]) 
        async for doc in categories_cursor 
        if doc.get("_id")
    }

    status_pipeline = [
        {"$match": {"form_id": form_id}},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    status_cursor = await db.submissions.aggregate(status_pipeline)
    status_breakdown: dict[str, int] = {
        str(doc["_id"]): int(doc["count"]) 
        async for doc in status_cursor 
        if doc.get("_id")
    }

    metrics_pipeline = [
        {"$match": {"form_id": form_id}},
        {
            "$group": {
                "_id": None,
                "avg_ai_sentiment": {"$avg": "$ai_analysis.sentiment_score"},
                "avg_user_rating": {"$avg": "$original_answers.rating"} 
            }
        }
    ]
    metrics_cursor = await db.submissions.aggregate(metrics_pipeline)
    metrics_list = [doc async for doc in metrics_cursor]
    
    avg_ai_sentiment = 0.0
    avg_user_rating = 0.0
    
    if metrics_list and len(metrics_list) > 0:
        metrics_doc: dict = metrics_list[0]
        avg_ai_sentiment = metrics_doc.get("avg_ai_sentiment") or 0.0
        avg_user_rating = metrics_doc.get("avg_user_rating") or 0.0

    flagged_count = status_breakdown.get("pending_human_review", 0)
    flagged_percentage = (flagged_count / total_submissions * 100)

    return {
        "form_id": form_id,
        "total_submissions": total_submissions,
        "flagged_count": flagged_count,
        "flagged_percentage": round(flagged_percentage, 2),
        "average_user_rating": round(avg_user_rating, 2),      
        "average_ai_sentiment": round(avg_ai_sentiment, 2),    
        "categories_breakdown": categories_breakdown,
        "status_breakdown": status_breakdown
    }


async def get_form_statistics(form_id: str) -> dict:
    db = get_database()
    
    total_submissions = await db.submissions.count_documents({"form_id": form_id})
    if total_submissions == 0:
        return {
            "form_id": form_id,
            "total_submissions": 0,
            "flagged_count": 0,
            "flagged_percentage": 0.0,
            "average_user_rating": 0.0,
            "average_ai_sentiment": 0.0,
            "categories_breakdown": {},
            "status_breakdown": {}
        }

    category_pipeline = [
        {"$match": {"form_id": form_id}},
        {"$group": {"_id": "$ai_analysis.category", "count": {"$sum": 1}}}
    ]
    categories_cursor = await db.submissions.aggregate(category_pipeline)
    categories_breakdown: dict[str, int] = {
        str(doc["_id"]): int(doc["count"]) 
        async for doc in categories_cursor 
        if doc.get("_id")
    }

    status_pipeline = [
        {"$match": {"form_id": form_id}},
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    status_cursor = await db.submissions.aggregate(status_pipeline)
    status_breakdown: dict[str, int] = {
        str(doc["_id"]): int(doc["count"]) 
        async for doc in status_cursor 
        if doc.get("_id")
    }

    metrics_pipeline = [
        {"$match": {"form_id": form_id}},
        {
            "$group": {
                "_id": None,
                "avg_ai_sentiment": {"$avg": "$ai_analysis.sentiment_score"},
                "avg_user_rating": {"$avg": "$original_answers.rating"} 
            }
        }
    ]
    metrics_cursor = await db.submissions.aggregate(metrics_pipeline)
    metrics_list = [doc async for doc in metrics_cursor]
    
    avg_ai_sentiment = 0.0
    avg_user_rating = 0.0
    
    if metrics_list and len(metrics_list) > 0:
        metrics_doc: dict = metrics_list[0]
        avg_ai_sentiment = metrics_doc.get("avg_ai_sentiment") or 0.0
        avg_user_rating = metrics_doc.get("avg_user_rating") or 0.0

    flagged_count = status_breakdown.get("pending_human_review", 0)
    flagged_percentage = (flagged_count / total_submissions * 100)

    return {
        "form_id": form_id,
        "total_submissions": total_submissions,
        "flagged_count": flagged_count,
        "flagged_percentage": round(flagged_percentage, 2),
        "average_user_rating": round(avg_user_rating, 2),      
        "average_ai_sentiment": round(avg_ai_sentiment, 2),    
        "categories_breakdown": categories_breakdown,
        "status_breakdown": status_breakdown
    }

# --- הפונקציות החסרות של תור הבדיקה האנושית (הוספנו אותן כאן) ---

async def get_pending_reviews() -> list[dict]:
    db = get_database()
    cursor = db.submissions.find({"status": "pending_human_review"}).sort("created_at", -1)
    
    reviews = []
    async for doc in cursor:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
        reviews.append(doc)
        
    return reviews

async def resolve_submission(submission_id: str, reviewer_notes: str) -> bool:
    db = get_database()
    
    if not ObjectId.is_valid(submission_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid submission ID format"
        )
        
    result = await db.submissions.update_one(
        {"_id": ObjectId(submission_id), "status": "pending_human_review"},
        {
            "$set": {
                "status": "resolved",
                "reviewer_notes": reviewer_notes,
                "resolved_at": datetime.now(timezone.utc)
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found or already resolved"
        )
        
    return True