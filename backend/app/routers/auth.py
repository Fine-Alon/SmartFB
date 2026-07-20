from fastapi import APIRouter, HTTPException, status, Response
from app.schema.user_schema import UserCreate, UserLogin
from app.services import auth_service as auth
from app.core.security import create_token

router = APIRouter(
   prefix="/auth",
   tags=["auth"]
)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserCreate):
    new_user, error_msg = auth.user_register(user_data)
    if error_msg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
   
    return {"message": "User created successfully", "user_id": str(new_user.id)}
 

@router.post("/login")
def login_user(user_data: UserLogin, response: Response):
    user = auth.user_login(user_data)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
   
    access_token = create_token(str(user.id), user.role)
   
    response.set_cookie(
        key="my_access_token",
        value=access_token,
        httponly=True,   
        samesite="lax",
        secure=False
    )

    return {
        "user_id": str(user.id),
        "username": user.username,
        "name": user.name,
        "email": user.email,
        "role": user.role,
    }