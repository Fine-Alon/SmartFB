from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import connect_to_mongo, close_mongo_connection
from app.routers import customer, auth, forms, surveys, analist, reviews


# Lifespan context manager handles DB connection on startup & shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


# Pass lifespan into FastAPI
app = FastAPI(title="SmartFB API", lifespan=lifespan)

# CORS setup - מאפשרים את כל הכתובות המקומיות האפשריות של השרתים שלכם
origins = [
    "http://localhost:5173",
    "http://localhost:5175",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5175",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(customer.router)
app.include_router(forms.router)
app.include_router(analist.router)
app.include_router(reviews.router)
app.include_router(surveys.router)