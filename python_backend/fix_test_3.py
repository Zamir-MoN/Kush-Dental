import re

with open('tests/test_appointment_service.py', 'r') as f:
    content = f.read()

# I am replacing "apt_in=apt_in=" to just "apt_in="
content = content.replace('apt_in=apt_in=AppointmentCreate', 'apt_in=AppointmentCreate')
content = content.replace('apt_in=apt_in=apt_in', 'apt_in=apt_in1')

with open('tests/test_appointment_service.py', 'w') as f:
    f.write(content)
