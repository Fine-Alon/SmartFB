"""
API-facing schemas for users and auth. Kept separate from the DB model
(models/user.py) so hashed_password can never leak into a response.
"""
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


class UserRole(str, Enum):
    ADMIN = "admin"
    SUPPORT = "support"


# ---- User ----

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=4, max_length=128)
    role: UserRole = UserRole.SUPPORT


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    """Safe user representation returned by the API – never includes the password."""
    id: str
    email: EmailStr
    role: UserRole

    model_config = {
        "from_attributes": True,  # lets FastAPI build this straight from a User Document
    }

    @field_validator("id", mode="before")
    @classmethod
    def stringify_id(cls, v):
        return str(v)


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None


# ---- Auth tokens ----

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str  # user id
    role: str
    exp: int