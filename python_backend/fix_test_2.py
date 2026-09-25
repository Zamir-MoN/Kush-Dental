import re

with open('tests/test_appointment_service.py', 'r') as f:
    content = f.read()

content = content.replace('apt_in=apt_in=apt_in', 'apt_in=apt_in')

with open('tests/test_appointment_service.py', 'w') as f:
    f.write(content)
