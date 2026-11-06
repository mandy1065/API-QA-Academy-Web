"""A browser automation exercise against the deployed Academy site.

Set ACADEMY_URL to the deployment URL before running. Skipped otherwise.
"""
import os
import pytest

@pytest.mark.ui
def test_academy_homepage(page):
    url = os.getenv("ACADEMY_URL")
    if not url:
        pytest.skip("Set ACADEMY_URL to your deployed academy URL")
    page.goto(url)
    assert page.get_by_role("heading", name="What is an API?").is_visible()
    page.get_by_role("button", name="API Lab").click()
    assert page.get_by_text("Build your API request").is_visible()
