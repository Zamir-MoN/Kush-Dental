import requests
import json

s = requests.Session()
login_data = {"email": "doctor@kushdental.com", "password": "doctor"}
r1 = s.post("http://localhost:8000/api/v1/auth/login", json=login_data)
print("Login status:", r1.status_code)
print("Login headers:", r1.headers)
print("Login response:", r1.text)

r2 = s.post("http://localhost:8000/api/v1/auth/refresh", headers={"X-CSRF-Token": s.cookies.get("csrf_token")})
print("Refresh status:", r2.status_code)
print("Refresh response:", r2.text)
