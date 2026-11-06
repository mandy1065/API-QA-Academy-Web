# Save as test_product_get.py
# Install: python -m pip install pytest requests
# Run: python -m pytest -v test_product_get.py
# An actual PASS requires executing pytest; the browser cannot run this file.
import pytest
import requests

BASE_URL = "https://dummyjson.com"

def test_existing_product():
    response = requests.get(BASE_URL + "/products/1", timeout=10)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1

@pytest.mark.parametrize("path", ["/products/999999", "/products/not-a-number"])
def test_missing_or_invalid_product(path):
    response = requests.get(BASE_URL + path, timeout=10)
    assert response.status_code == 404
    assert "message" in response.json()

def test_product_response_structure():
    response = requests.get(BASE_URL + "/products/1", timeout=10)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["id"], int)
    assert isinstance(data["title"], str) and data["title"].strip()
    assert isinstance(data["price"], (int, float))

# NEXT LESSON: move BASE_URL into configuration and reuse requests.Session
# NEXT LESSON: pytest fixtures and reusable API clients
