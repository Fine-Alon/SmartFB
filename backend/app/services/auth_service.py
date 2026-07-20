"""
Auth service: all business logic and async DB interactions for user auth.
Routers call this layer — never the model directly.
"""
from fastapi import HTTPException, status
from app.core.db import get_database
from app.core.security import hash_password, verify_password
from app.schema.user_schema import UserCreate, UserOut


async def create_user(payload: UserCreate) -> UserOut:
    db = get_database()
    users = db["users"]

    # ADD AWAIT HERE
    existing = await users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed = hash_password(payload.password)
    doc = {
        "email": payload.email,
        "hashed_password": hashed,
        "role": payload.role,
    }
    # ADD AWAIT HERE
    result = await users.insert_one(doc)

    return UserOut(
        id=str(result.inserted_id),
        email=payload.email,
        role=payload.role,
    )


async def authenticate_user(email: str, password: str) -> UserOut:
    db = get_database()
    users = db["users"]

    # ADD AWAIT HERE
    doc = await users.find_one({"email": email})
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    if not verify_password(doc["hashed_password"], password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    return UserOut(
        id=str(doc["_id"]),
        email=doc["email"],
        role=doc["role"],
    )
