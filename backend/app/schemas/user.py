"""
Pydantic schemas for User-related API requests and responses.
Kept strictly separate from the DB model so hashed_password never leaks.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Literal


class UserRegister(BaseModel):
    """Payload for registering a new internal system user."""
    email: EmailStr
    password: str = Field(min_length=4, max_length=128)
    role: Literal["admin", "support"] = "support"


class UserLogin(BaseModel):
    """Payload for user login — email + password only."""
    email: EmailStr
    password: str


class UserOut(BaseModel):
    """
    Safe user representation returned to the frontend.
    Never includes hashed_password.
    """
    id: str
    email: str
    role: str
