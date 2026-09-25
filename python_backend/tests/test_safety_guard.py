import pytest
import sys
from unittest.mock import patch
from io import StringIO
from tests.conftest import verify_test_db_safety

def test_safety_guard_success():
    # Should not raise or exit
    verify_test_db_safety('test', 'postgresql://user:pass@localhost/kush_dental_test')

@pytest.mark.parametrize("env, url, expected_err", [
    ('development', 'postgresql://user:pass@localhost/kush_dental_test', "NODE_ENV must be 'test'"),
    ('test', '', "TEST_DATABASE_URL is missing"),
    ('test', 'postgresql://user:pass@localhost/kush_dental_dev', "Safety guard tripped! Target DB is 'kush_dental_dev'"),
    ('test', 'postgresql://user:pass@localhost/production_db', "Target DB is 'production_db'"),
])
def test_safety_guard_failures(env, url, expected_err):
    with patch('sys.stderr', new_callable=StringIO) as mock_stderr:
        with patch('sys.exit', side_effect=SystemExit) as mock_exit:
            with pytest.raises(SystemExit):
                verify_test_db_safety(env, url)
            mock_exit.assert_called_once_with(1)
            assert expected_err in mock_stderr.getvalue()
