from playwright.sync_api import Page, expect, sync_playwright
import time

def test_key_injection_and_ui(page: Page):
    page.goto("http://localhost:3011")
    page.fill("#access-key", "secret")
    page.press("#access-key", "Enter")

    # Wait for dashboard
    expect(page.locator("#app")).to_be_visible(timeout=5000)

    # Verify Key Injection
    key = page.evaluate("window.UPSTREAM_KEY")
    assert key == "MOCK_KEY"

    # Verify Profile Tab loads
    page.click("#nav-profile")
    expect(page.locator("#profile-view")).to_be_visible()
    expect(page.get_by_text("NINA KURNIASIH")).to_be_visible()

    # Verify Home Tab reload
    page.click("#nav-home")
    expect(page.locator("#video-grid")).to_be_visible()

    time.sleep(1)
    page.screenshot(path="verification/verification_final_fix.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_key_injection_and_ui(page)
        finally:
            browser.close()
