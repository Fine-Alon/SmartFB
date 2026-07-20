"""
Install: pip install pydantic-settings
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # MongoDB
    MONGO_URI: str = "mongodb://localhost:27017"
    MONGO_DB_NAME: str = "smartfb"

    # JWT
    JWT_SECRET_KEY: str = "change-this-in-.env"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()