# API QA Academy — Vercel Edition

An interactive, beginner-first API QA learning website, inspired by the existing curriculum in [mandy1065/API-QA-Academy](https://github.com/mandy1065/API-QA-Academy).

## What works
- 63 navigable lessons: 36 original API/pytest topics, 15 Python QA topics, 12 Playwright Python topics.
- Visual client → API → response diagrams, explanatory lesson steps, sample code.
- Interactive **offline simulated** HTTP lab for GET/POST/PUT/PATCH/DELETE, response status and JSON inspection. **This is not a live API client.**
- Per-lesson quiz with immediate feedback, hints, reference code, editable practice notes and code drafts.
- Browser localStorage progress, exportable JSON, downloadable `.py` code drafts.
- Mobile responsive interface; no accounts, database, API keys, or paid services required.
- Separate real pytest + Playwright Python project in `automation/` with GitHub Actions workflow.

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Create a new GitHub repository and upload **the contents of this folder** (including `src/`, `index.html`, `package.json`, and `vercel.json`).
2. In Vercel, **Add New → Project → Import Git Repository**.
3. Framework preset: **Vite**; Build command: `npm run build`; Output directory: `dist`.
4. Deploy. Subsequent commits to the repository will deploy automatically.

## What is not yet implemented

- Full Python code execution inside the website. The code editor is a **draft editor**, not an execution sandbox.
- Automatic grading of Python/Playwright code. Quizzes are graded, but code is not claimed to have passed unless tested externally.
- Real HTTP calls in the browser lab; it intentionally simulates a small supported subset of DummyJSON responses.
- Student sign-in, cross-device sync, teacher dashboard, centralized submissions.
- Individual deep-dive walkthroughs and multiple graded coding tasks for every lesson; these need additional curriculum authoring.

## Real automation

Open `automation/README.md` for setup and running Playwright Python tests in VS Code. The API examples call DummyJSON and require network access. Its writes are simulated by DummyJSON and do not persist.

## Safety

Do not paste real credentials, tokens, or sensitive student information into public source code or progress exports. Progress stays in the browser until the student exports it.
