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
    user.last_login = nowfrom typing import Optional
from DB.models.User import User, PatientData
from classes.schema import UserRegister, UserLogin
from core.security import hash_password as get_password_hash, verify_password

async def check_user_exists(username: str, phone: str) -> bool:
    """
    Checks if a user with the given username or phone already exists in the database.
    """
    user = await User.find_one({
        "$or": [
            {"username": username},
            {"phone": phone}
        ]
    })
    return user is not None


async def create_user(user_data: UserRegister) -> User:
    """
    Creates a new user document.
    Encrypts the password using core.security.hash_password.
    If the role is 'patient', initializes an empty PatientData object (with active status).
    Saves and returns the new user.
    """
    hashed_password = get_password_hash(user_data.password)
    
    patient_data = None
    is_approved = False
    if user_data.role == "patient":
        is_approved = True
        patient_data = PatientData(
            badges=[],
            status="active"
        )
        
    new_user = User(
        username=user_data.username,
        phone=user_data.phone,
        password_hash=hashed_password,
        telegram_id=user_data.telegram_id,
        role=user_data.role,
        is_approved=is_approved,
        patient_data=patient_data
    )
    
    await new_user.insert()
    return new_user

async def authenticate_user(user_login: UserLogin) -> Optional[User]:
    """
    Authenticates a user by matching their username and verifying the plaintext password
    against the stored password_hash.
    """
    user = await User.find_one({"username": user_login.username})
    if not user:
        return None
        
    if not verify_password(user.password_hash, user_login.password):
        return None
        
    return user
