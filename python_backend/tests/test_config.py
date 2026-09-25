import pytest
from app.core.config import settings

def test_settings_loaded():
    assert settings.NODE_ENV == 'test'
    assert settings.PORT == 8000
    assert 'kush_dental_test' in settings.TEST_DATABASE_URL
    assert len(settings.JWT_SECRET) >= 32
