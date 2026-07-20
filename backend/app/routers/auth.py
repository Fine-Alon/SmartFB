"""
Auth router: exposes /auth/register, /auth/login, /auth/logout.
All database work is delegated to app.services.auth_service.
"""
from fastapi import APIRouter, Response, status
from ..schemas.user import UserRegister, UserLogin, UserOut
from ..services import auth_service
from ..core.security import create_token

router = APIRouter(prefix="/auth", tags=["auth"])

COOKIE_NAME = "my_access_token"


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegister):
    """
    Register a new internal user (admin or support).
    Returns the created user object (no password).
    """
    user = await auth_service.create_user(payload)
    return user


@router.post("/login", response_model=UserOut)
async def login(payload: UserLogin, response: Response):
    """
    Authenticate with email + password.
    - Sets an HttpOnly cookie named 'my_access_token'.
    - Also returns the token and user details in the JSON body.
    """
    user = await auth_service.authenticate_user(payload.email, payload.password)

    token = create_token(user.id, user.role)

    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,  # set True in production (HTTPS)
    )

    return user


@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(response: Response):
    """
    Clear the auth cookie and end the session.
    """
    response.delete_cookie(key=COOKIE_NAME, httponly=True, samesite="lax")
    return {"message": "Logged out successfully"}
