

from fastapi.middleware.cors import CORSMiddleware # הוספת הייבוא הזה
from fastapi import FastAPI

app = FastAPI()

origins = [
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)