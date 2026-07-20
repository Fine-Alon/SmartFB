"""
User document model, defined with Beanie.
"""
from datetime import datetime
from typing import Annotated, Optional
from beanie import Document, Indexed
from pydantic import EmailStr

ROLE_ADMIN = "admin"
ROLE_SUPPORT = "support"
USER_ROLES = (ROLE_ADMIN, ROLE_SUPPORT)


class User(Document):
    email: Annotated[EmailStr, Indexed(unique=True)]
    hashed_password: str
    role: str = ROLE_SUPPORT
    last_login: Optional[datetime] = None  # 👈 Add this field
    updated_at: Optional[datetime] = None  # 👈 Add this field (optional)

    class Settings:
        name = "users"