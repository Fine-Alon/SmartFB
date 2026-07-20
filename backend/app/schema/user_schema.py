"""
API-facing schemas for users and auth. Kept separate from the DB model
(models/user.py) so hashed_password can never leak into a response.
"""
from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRole(str, Enum):
    ADMIN = "admin"
    SUPPORT_EMPLOYEE = "support_employee"
    HUMAN_REVIEWER = "human_reviewer"
    BUSINESS_OWNER = "business_owner"
    CUSTOMER_SERVICE = "customer_service"
    CUSTOMER = "customer"


# ---- User ----

class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.CUSTOMER  # adjust if registration should default elsewhere


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    """Safe user representation returned by the API — never includes the password."""
    id: str
    name: str
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    model_config = {
        "from_attributes": True,  # lets FastAPI build this straight from a User Document
    }

    @field_validator("id", mode="before")
    @classmethod
    def _stringify_id(cls, v):
        return str(v)


class UserUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None


# ---- Auth tokens ----

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str  # user id
    role: str
    exp: int