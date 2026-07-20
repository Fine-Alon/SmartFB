from enum import Enum
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field, model_validator


# 1. Defined enum for the 3 allowed question types
class QuestionType(str, Enum):
    OPEN_ANSWER = "open_answer"
    RATING = "rating"            # 1 to 5 rating scale
    MULTIPLE_CHOICE = "multiple_choice"


class QuestionSchema(BaseModel):
    question_id: str = Field(..., description="Unique frontend question identifier, e.g., 'q1'")
    label: str = Field(..., description="The question prompt shown to the user")
    type: QuestionType
    is_required: bool = True
    options: Optional[List[str]] = Field(
        default=None, 
        description="Required list of choices if type is 'multiple_choice'"
    )

    # Validation rule for multiple choice questions
    @model_validator(mode="after")
    def validate_options(self):
        if self.type == QuestionType.MULTIPLE_CHOICE:
            if not self.options or len(self.options) < 2:
                raise ValueError("Multiple choice questions must include at least 2 options.")
        return self


class SurveyCreate(BaseModel):
    title: str = Field(..., min_length=3, examples=["Customer Satisfaction Survey"])
    description: Optional[str] = Field(default=None, examples=["We value your feedback!"])
    questions: List[QuestionSchema] = Field(..., min_length=1)


class SurveyOut(SurveyCreate):
    id: str = Field(..., alias="_id")  # 👈 Added alias so PyMongo's '_id' maps directly to 'id'
    is_active: bool = True
    created_at: datetime
    created_by: Optional[str] = None
    qr_code: Optional[str] = None      # 👈 Added Base64 QR code image string field
    

    model_config = {
        "from_attributes": True,
        "populate_by_name": True        # 👈 Allows FastAPI to map '_id' -> 'id' automatically
    }