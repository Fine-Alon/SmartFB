"""
Data-access functions for User accounts, using MongoEngine's Document
query API. Routers call into these instead of touching User.objects
directly, so query logic lives in one place.
"""
from datetime import datetime, timezone
from typing import Optional

from mongoengine import ValidationError

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schema.user_schema import UserCreate


def get_user_by_username(username: str) -> Optional[User]:
    return User.objects(username=username).first()


def get_user_by_email(email: str) -> Optional[User]:
    return User.objects(email=email).first()


def get_user_by_id(user_id: str) -> Optional[User]:
    try:
        return User.objects(id=user_id).first()
    except ValidationError:
        # not a valid ObjectId string
        return None


def check_user_exists(username: str, email: Optional[str] = None) -> Optional[str]:
    """Checks if a user with the given username or email already exists.
    Returns the field name that is duplicate ('username' or 'email') or None.
    """
    if get_user_by_username(username):
        return "username"
    if email and get_user_by_email(email):
        return "email"
    return None


def create_user(payload: UserCreate) -> User:
    user = User(
        username=payload.username,
        name=payload.name,
        email=payload.email,
        telegram_id=payload.telegram_id,
        hashed_password=hash_password(payload.password),
        role=payload.role.value,
    )
    user.save()
    return user


def authenticate_user(username: str, password: str) -> Optional[User]:
    user = get_user_by_username(username)
    if not user or not verify_password(user.hashed_password, password):
        return None
    return user


def update_last_login(user: User) -> None:
    now = datetime.now(timezone.utc)
    user.update(last_login=now, updated_at=now)
    user.last_login = now
    user.updated_at = now
