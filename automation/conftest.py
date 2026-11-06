import os
import pytest

@pytest.fixture(scope="session")
def base_url():
    return os.getenv("API_BASE_URL", "https://dummyjson.com")

@pytest.fixture
def api(playwright, base_url):
    context = playwright.request.new_context(base_url=base_url, timeout=15000)
    yield context
    context.dispose()
