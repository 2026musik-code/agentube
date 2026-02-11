from playwright.sync_api import Page, expect, sync_playwright
import time

def test_client_fetch(page: Page):
    # 1. Open App
    page.goto("http://localhost:3005")

    # 2. Login
    page.fill("#access-key", "secret")
    page.press("#access-key", "Enter")

    # 3. Wait for Dashboard
    expect(page.locator("#app")).to_be_visible(timeout=5000)

    # 4. Check if key was injected
    # We can check by evaluating JS in the page context
    key = page.evaluate("window.UPSTREAM_KEY")
    assert key == "MOCK_KEY"

    # 5. Check Error Message (Because we are using a Mock Key against real API, or network failure)
    # The frontend will try to fetch https://api.ferdev.my.id/... with key MOCK_KEY
    # This will likely fail or return error. We just want to see that it tried.
    # We can wait for the loading spinner to disappear.
    expect(page.locator("#loading")).to_be_hidden(timeout=10000)

    # 6. Screenshot
    time.sleep(1)
    page.screenshot(path="verification/verification_client.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_client_fetch(page)
        finally:
            browser.close()
