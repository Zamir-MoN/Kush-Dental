from playwright.sync_api import sync_playwright
import time

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Capture console messages
        def handle_console(msg):
            print(f"BROWSER CONSOLE [{msg.type}]: {msg.text}")
        page.on("console", handle_console)
        
        # Capture page errors
        def handle_error(err):
            print(f"BROWSER ERROR: {err}")
        page.on("pageerror", handle_error)
        
        print("Navigating to login...")
        page.goto("http://localhost:3000/staff/login")
        time.sleep(2)
        
        print("Logging in...")
        page.fill("input[name='email']", "doctor@kushdental.com")
        page.fill("input[name='password']", "doctor")
        page.click("button[type='submit']")
        time.sleep(3)
        
        print("Current URL after login:", page.url)
        
        print("Navigating to blog...")
        page.goto("http://localhost:3000/staff/blog")
        time.sleep(2)
        
        print("Current URL on blog:", page.url)
        
        print("Refreshing page...")
        page.reload()
        time.sleep(3)
        
        print("Current URL after refresh:", page.url)
        
        browser.close()

if __name__ == "__main__":
    main()
