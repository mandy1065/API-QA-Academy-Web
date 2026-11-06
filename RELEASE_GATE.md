# Release gate: DO NOT DEPLOY until both scores are at least 9/10

This is a release candidate, not production approval. The 9/10 scores must be demonstrated, not assumed.

## Teaching design rubric (10 points)
1. Beginner understands the goal and prerequisite (1)
2. Diagram and plain-language explanation agree (1)
3. Student predicts expected outcome before executing (1)
4. Real API and simulated practice are unmistakably distinguished (1)
5. Both positive and negative scenarios are taught (1)
6. Student inspects actual JSON and status (1)
7. Test case specification is separate from execution evidence (1)
8. Failed result teaches debugging and defect reproduction (1)
9. Python exercise gives corrective feedback without false execution claims (1)
10. Student can independently repeat the scenario and explain it (1)

## Release readiness rubric (10 points)
1. npm ci succeeds (1)
2. npm test succeeds (1)
3. npm run build succeeds (1)
4. Manual live GET /products/1 works in production-like browser (1)
5. Manual live GET /products/999999 works in production-like browser (1)
6. Simulator is correctly labeled and isolated from live evidence (1)
7. Switching scenarios during a request cannot misattribute results (1)
8. Execution history survives reload and evidence export works (1)
9. Defect drafts save and can be reviewed; no misleading pass claim (1)
10. Python generated tests run under pytest, with actual output inspected (1)

**Approval rule:** both rubrics must score >= 9/10, all critical issues closed, and reviewer sign-off recorded. CI alone does not prove the browser and pedagogy checks.

## Required manual smoke steps
- Start at dashboard and follow the first API lesson without guessing navigation.
- In Manual Testing, select LIVE; predict 200; execute /products/1; inspect ID and evidence; evaluate PASS.
- Select LIVE; predict 404; execute /products/999999; inspect not-found response; evaluate PASS.
- Switch to SIMULATED and confirm all labels and recorded evidence say SIMULATED.
- Force a network failure and confirm it is not recorded as an API defect or PASS.
- Inspect and export a past execution, save a draft defect, refresh and verify persistence.
- In Automation, submit missing assertions, commented assertions, wrong response variable, and a correct example; only the last must pass the structural check.
- Run a generated Python test locally with pytest; verify output separately from static checker.

## Deployment rule
Do not merge into main or deploy from feature branches. Enable branch protection requiring the quality-gate workflow and human review. If Vercel is connected to feature branches, disable automatic production deployment and treat preview deployments separately. This repository change does not itself modify Vercel account settings.

## Additional mandatory coverage for this PR
- Confirm the prediction answer is hidden until the student executes and evaluates.
- Validate four GET scenarios against LIVE DummyJSON in a real browser; verify actual invalid-ID status and error body rather than assuming a contract.
- Validate POST, PUT, PATCH, DELETE responses and explain DummyJSON's non-persistent writes.
- Validate unauthenticated /auth/me behavior and distinguish authentication from authorization.
- Review the illustrative defect report for steps, expected/actual, evidence, and reproducibility.
- Confirm independent assessment rejects simulated requests and incomplete explanations, and persists progress.
- Inspect GitHub Actions results for the checked-in live pytest suite. A workflow definition is not evidence that tests passed.
- Verify no production deployment is triggered from this feature branch or its PR. Keep production disabled until both rubrics are independently verified >=9/10.
