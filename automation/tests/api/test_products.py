"""Playwright Python API tests. DummyJSON writes are simulated and not persisted."""
import pytest

@pytest.mark.api
def test_get_product_status_and_schema(api):
    response = api.get("/products/1")
    assert response.status == 200, response.text()
    body = response.json()
    assert body["id"] == 1
    assert isinstance(body["title"], str) and body["title"].strip()
    assert isinstance(body["price"], (int, float))

@pytest.mark.api
@pytest.mark.parametrize("product_id,expected_status", [(1, 200), (999999, 404)])
def test_product_status_cases(api, product_id, expected_status):
    response = api.get(f"/products/{product_id}")
    assert response.status == expected_status, response.text()

@pytest.mark.api
def test_products_pagination(api):
    response = api.get("/products", params={"limit": 5, "skip": 5})
    assert response.status == 200
    data = response.json()
    assert data["limit"] == 5
    assert data["skip"] == 5
    assert len(data["products"]) <= 5

@pytest.mark.api
def test_post_product_simulated(api):
    payload = {"title": "Academy QA Example", "price": 25}
    response = api.post("/products/add", data=payload)
    assert response.status == 201, response.text()
    data = response.json()
    assert isinstance(data["id"], int)
    assert data["title"] == payload["title"]
    # DummyJSON does not persist this newly created product.

@pytest.mark.api
def test_patch_product_simulated(api):
    response = api.patch("/products/1", data={"title": "Updated by QA"})
    assert response.status == 200, response.text()
    assert response.json()["title"] == "Updated by QA"

@pytest.mark.api
def test_delete_product_simulated(api):
    response = api.delete("/products/1")
    assert response.status == 200, response.text()
    data = response.json()
    assert data["id"] == 1
    assert data["isDeleted"] is True
    assert data.get("deletedOn")
