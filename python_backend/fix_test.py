import re

with open('tests/test_appointment_service.py', 'r') as f:
    content = f.read()

content = re.sub(r'create_appointment\(db_session,\s*', r'create_appointment(db_session, actor_id=doc.id, apt_in=', content)
content = re.sub(r'update_appointment_status\(db_session,\s*', r'update_appointment_status(db_session, actor_id=doc.id, ', content)

with open('tests/test_appointment_service.py', 'w') as f:
    f.write(content)
