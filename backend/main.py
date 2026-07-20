from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import connect_to_mongo, close_mongo_connection

# Lifespan context manager handles DB connection on startup & shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Runs when FastAPI starts up
    await connect_to_mongo()
    yield
    # Runs when FastAPI shuts down
    await close_mongo_connection()

# Pass lifespan into FastAPI
app = FastAPI(title="SmartFB API", lifespan=lifespan)

# CORS setup
origins = [
    "http://localhost:5173",  # Vite/React dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# You can add your routers below (e.g., auth, customer, forms)
