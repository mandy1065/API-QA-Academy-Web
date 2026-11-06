# Real Playwright Python Automation

This folder contains **real** pytest + Playwright Python API tests. Unlike the website's offline simulator, these tests call `https://dummyjson.com` and require internet access.

## Windows / VS Code

```powershell
cd automation
py -m venv .venv
.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m playwright install chromium
python -m pytest tests/api -v
```

If activation is blocked, use `.venv\Scripts\python.exe` instead of `python` in the commands.

Run one test:

```powershell
python -m pytest tests/api/test_products.py::test_get_product_status_and_schema -v
```

Run browser UI test against your own Vercel deployment:

```powershell
$env:ACADEMY_URL="https://your-deployment.vercel.app"
python -m pytest tests/ui -v
```

## CI

The GitHub Actions workflow is at `.github/workflows/qa.yml`. Copy it to the **repository root** `.github/workflows/qa.yml` when you upload the entire app repository. It runs API tests, not browser UI tests, by default.

## Important

DummyJSON POST/PATCH/DELETE are simulated and do not persist. The tests validate the returned response only. Do not commit real passwords, bearer tokens or student data.
