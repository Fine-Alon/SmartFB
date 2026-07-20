"""
Data-access functions for User accounts using Beanie ODM.
"""
from datetime import datetime, timezone
from typing import Optional

from beanie import PydanticObjectId

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schema.user_schema import UserCreate


async def get_user_by_email(email: str) -> Optional[User]:
    """Retrieves a user by email using Beanie."""
    return await User.find_one(User.email == email)


async def get_user_by_id(user_id: str) -> Optional[User]:
    """Retrieves a single user by ID string."""
    try:
        return await User.get(PydanticObjectId(user_id))
    except Exception:
        # Returns None if user_id is not a valid ObjectId string or not found
        return None


async def check_user_exists(email: str) -> Optional[str]:
    """Checks if a user with the given email already exists.
    Returns the field name that is duplicate ('email') or None.
    """
    if await get_user_by_email(email):
        return "email"
    return None


async def create_user(payload: UserCreate) -> User:
    """Creates and saves a new user to MongoDB using Beanie."""
    role_str = payload.role.value if hasattr(payload.role, "value") else payload.role

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=role_str,
    )
    await user.insert()
    return user


async def authenticate_user(email: str, password: str) -> Optional[User]:
    """Authenticates user credentials."""
    user = await get_user_by_email(email)
    if not user or not verify_password(user.hashed_password, password):
        return None
    return user


async def update_last_login(user: User) -> None:
    """Updates user last_login timestamp."""
    now = datetime.now(timezone.utc)
    user.last_login = now
    user.updated_at = now
    await user.save()