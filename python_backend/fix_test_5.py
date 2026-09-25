import re

with open('tests/test_appointments_new_api.py', 'r') as f:
    content = f.read()

content = content.replace('async_client: AsyncClient', 'client: AsyncClient')
content = content.replace('async_client.get', 'client.get')
content = content.replace('async_client.patch', 'client.patch')
content = content.replace('staff_token', 'staff_auth_headers')
content = content.replace('doctor_token', 'doctor_auth_headers')
content = content.replace('headers={"Authorization": f"Bearer {staff_auth_headers}"', 'headers=staff_auth_headers')
content = content.replace('headers={"Authorization": f"Bearer {staff_auth_headers}", "X-CSRF-Token": "test-csrf-token"}', 'headers={**staff_auth_headers, "X-CSRF-Token": "test-csrf-token"}')
content = content.replace('headers={"Authorization": f"Bearer {doctor_auth_headers}", "X-CSRF-Token": "test-csrf-token"}', 'headers={**doctor_auth_headers, "X-CSRF-Token": "test-csrf-token"}')

with open('tests/test_appointments_new_api.py', 'w') as f:
    f.write(content)
