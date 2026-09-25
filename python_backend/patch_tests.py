import re

with open('tests/test_public_leads.py', 'r') as f:
    content = f.read()

# Replace headers={"X-Forwarded-For": ...} with headers={"X-Forwarded-For": ..., "Idempotency-Key": str(uuid.uuid4())}
content = re.sub(r'headers=\{"X-Forwarded-For": "([^"]+)"\}', r'headers={"X-Forwarded-For": "\1", "Idempotency-Key": str(uuid.uuid4())}', content)
content = re.sub(r'headers=\{"X-Forwarded-For": "100.100.100.100"\}', r'headers={"X-Forwarded-For": "100.100.100.100", "Idempotency-Key": str(uuid.uuid4())}', content)
content = re.sub(r'headers=headers', r'headers={**headers, "Idempotency-Key": str(uuid.uuid4())}', content)

with open('tests/test_public_leads.py', 'w') as f:
    f.write(content)
