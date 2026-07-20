"""
Data-access functions for User accounts, using Beanie's Document
query API. Routers call into these instead of touching User directly,
so query logic lives in one place.
"""
from datetime import datetime, timezone
from typing import Optional
from beanie import PydanticObjectId

from ..core.security import hash_password, verify_password
from ..models.user import User
from ..schema.user_schema import UserCreate

async def get_user_by_email(email: str) -> Optional[User]:
    return await User.find_one(User.email == email)


async def get_user_by_id(user_id: str) -> Optional[User]:
    try:
        obj_id = PydanticObjectId(user_id)
        return await User.get(obj_id)
    except Exception:
        # not a valid ObjectId string
        return None


async def check_user_exists(emget_user_by_email: str, email: Optional[str] = None) -> Optional[str]:
    """Checks if a user with the given emget_user_by_email or email already exists.
    Returns the field name that is duplicate ('emget_user_by_email' or 'email') or None.
    """
    if await get_user_by_email(emget_user_by_email):
        return "emget_user_by_email"
    if email and await get_user_by_email(email):
        return "email"
    return None


async def create_user(payload: UserCreate) -> User:
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role.value,
    )
    await user.save()
    return user


async def authenticate_user(email: str, password: str) -> Optional[User]:
    user = await get_user_by_email(email)
    if not user or not verify_password(user.hashed_password, password):
        return None
    return user


async def update_last_login(user: User) -> None:
    now = datetime.now(timezone.utc)
    user.last_login = now
    user.updated_at = now
    await user.save()
