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
    @property
    def COOKIE_SECURE(self) -> bool:
        return self.NODE_ENV == 'production'
    ENABLE_HSTS: bool = False
    DXGEN_API_KEY: Optional[str] = None
    DXGEN_BASE_URL: str = "http://127.0.0.1:3101/api/v1"
    
    # Celery & Queue settings
    CELERY_BROKER_URL: str = 'redis://localhost:6379/0'
    CELERY_RESULT_BACKEND: str = 'redis://localhost:6379/0'
    CELERY_TASK_RATE_LIMIT: str = '30/m'
    
    # Public Rate Limits
    PUBLIC_LEAD_RATE_LIMIT: str = '5/minute'
    
    # Security / CAPTCHA
    TURNSTILE_SECRET_KEY: str = "1x0000000000000000000000000000000AA"
    
    # Initial User Seed Credentials
    SEED_STAFF_EMAIL: str = "staff@kushdental.com"
    SEED_STAFF_PASSWORD: str = "staff"
    SEED_DOCTOR_EMAIL: str = "doctor@kushdental.com"
    SEED_DOCTOR_PASSWORD: str = "doctor"
    
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env'),
        env_file_encoding='utf-8',
        extra='ignore'
    )

settings = Settings()
