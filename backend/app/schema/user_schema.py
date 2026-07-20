from pydantic import BaseModel, Field
from typing import Optional


class UserRegister(BaseModel):
    """Payload for registering a new user."""
    username: str = Field(..., min_length=2, description="Username must contain at least 2 characters")
    password: str = Field(..., min_length=4, description="Password must contain at least 4 characters")
    role: str = Field(default="support")

class UserLogin(BaseModel):
    """Payload for user authentication credentials."""
    username: str = Field(..., min_length=2)
    password: str = Field(..., min_length=4)