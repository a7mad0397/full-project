from pathlib import Path
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from functools import lru_cache

# 🔹 تأكد من وجود شرطتين تحت كلمة file
BASE_DIR = Path(__file__).resolve().parent.parent.parent
ENV_PATH = BASE_DIR / ".env"

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_ALG: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REDIS_URL: str = None
    ENV: str = "development"

    model_config = ConfigDict(env_file=str(ENV_PATH))

@lru_cache()
def get_settings():
    return Settings()


if __name__ == "main":
    settings = get_settings()
    print("✅ Loaded settings:")
    print(settings.model_dump())
     

     