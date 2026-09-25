import re

with open('tests/test_appointment_service.py', 'r') as f:
    content = f.read()

content = content.replace('update_appointment_status(db_session, actor_id=doc.id, ', 'update_appointment_status(db_session, ')
content = content.replace('AppointmentUpdateStatus(status=AppointmentStatus', 'AppointmentUpdateStatus(status=AppointmentStatus') # no-op just for spacing
content = re.sub(r'update_appointment_status\(([^,]+),\s*([^,]+),\s*AppointmentUpdateStatus\(([^)]+)\)\)', 
                 r'update_appointment_status(\1, \2, AppointmentUpdateStatus(\3), actor_id=doc.id)', content)

with open('tests/test_appointment_service.py', 'w') as f:
    f.write(content)
