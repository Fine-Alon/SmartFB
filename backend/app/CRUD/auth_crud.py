"""
Data-access functions for User accounts, using MongoEngine's Document
query API. Routers call into these instead of touching User.objects
directly, so query logic lives in one place.
"""
from datetime import datetime, timezone
from typing import Optional

from mongoengine import DoesNotExist, ValidationError

from app.core.security import hash_password, verify_password
from app.models.user import User
from app.schema.user_schema import UserCreate


def get_user_by_email(email: str) -> Optional[User]:
    return User.objects(email=email).first()


def get_user_by_id(user_id: str) -> Optional[User]:
    try:
        return User.objects(id=user_id).first()
    except ValidationError:
        # not a valid ObjectId string
        return None


def create_user(payload: UserCreate) -> User:
    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role.value,
    )
    user.save()
    return user


def authenticate_user(email: str, password: str) -> Optional[User]:
    user = get_user_by_email(email)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user


def update_last_login(user: User) -> None:
    now = datetime.now(timezone.utc)
    user.update(last_login=now, updated_at=now)
    user.last_login = now