from app.main import app

for route in app.routes:
    if hasattr(route, "methods"):
        methods = ", ".join(route.methods)
        print(f"{methods} {route.path} - {route.name}")
