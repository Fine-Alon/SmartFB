from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .app.core.db import connect_to_mongo, close_mongo_connection
from .app.routers import customer,auth,forms


# Lifespan context manager handles DB connection on startup & shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
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

# Register routers
app.include_router(auth.router)
app.include_router(customer.router)
app.include_router(forms.router)

