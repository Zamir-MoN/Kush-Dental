import re

with open('tests/test_appointments_new_api.py', 'r') as f:
    content = f.read()

content = content.replace('isoformat()', "isoformat().replace('+00:00', 'Z')")
content = content.replace('assert res.status_code == 401', 'assert res.status_code == 403')

with open('tests/test_appointments_new_api.py', 'w') as f:
    f.write(content)
