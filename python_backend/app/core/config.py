from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Literal, Optional
import os

class Settings(BaseSettings):
    NODE_ENV: Literal['development', 'production', 'test'] = 'development'
    PORT: int = 8010
    CORS_ORIGIN: str = 'http://localhost:3000'
    LOG_LEVEL: Literal['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'] = 'info'
    CLINIC_TIMEZONE: str = 'Asia/Kolkata'
    PAGINATION_DEFAULT_LIMIT: int = 20
    DATABASE_URL: str
    TEST_DATABASE_URL: str = ''
    JWT_SECRET: str
    JWT_ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    TRUSTED_PROXIES: list[str] = ['127.0.0.1']
    MAX_REQUEST_BODY_SIZE: int = 1048576 # 1 MB default
    COOKIE_SECURE: bool = True
    DXGEN_API_KEY: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'),
        env_file_encoding='utf-8',
        extra='ignore'
    )

settings = Settings()
