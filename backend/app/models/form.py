from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

# Represents a single question in your survey
class Question(BaseModel):
    question_id: str
    label: str
    type: str  # e.g., "text", "number", "rating"
    is_required: bool = True

# The structure used to create a new survey (for the API route)
class SurveyCreate(BaseModel):
    title: str
    description: str
    questions: List[Question]

# The structure representing the saved survey (for the Database)
class Survey(SurveyCreate):
    id: Optional[str] = Field(None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # This config allows Pydantic to use "id" in code and "_id" in MongoDB
    model_config = ConfigDict(populate_by_name=True)