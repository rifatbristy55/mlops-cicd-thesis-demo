# ML CI/CD Lab — Thesis Demonstration

A lightweight static website explaining CI/CD for MLOps, with an interactive release-gate simulation and a real GitHub Actions workflow.

## What this demonstrates

- **CI:** GitHub Actions runs Python smoke tests and checks required website assets on pushes and pull requests.
- **CD:** After CI succeeds on a push to `main` (or a manual workflow run), the workflow publishes the site to GitHub Pages.
- **ML-specific concept:** The browser playground illustrates how a model-quality gate can block a release. It uses example numbers only; it does not train or evaluate a real ML model.
- **CT distinction:** The site explains that model retraining is a separate configured workflow.

## Run locally

Requires Python 3.9+.

```bash
python -m http.server 8000
```

Open http://localhost:8000 in your browser.

Run the automated tests:

```bash
python -m unittest discover -s tests -v
```

## Set up real CI/CD on GitHub

1. Create a new **public** GitHub repository, for example `mlops-cicd-thesis-demo`.
2. Upload all files and folders from this project to the repository root. Keep `.github/workflows/ci-cd.yml` at exactly that path.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Source: GitHub Actions**.
5. Open **Actions**, select **Website CI and CD**, and run it (or push a commit to `main`).
6. Wait for the CI test job to pass and then the CD deployment job to finish.
7. Open **Settings → Pages** to find the published website URL. It normally resembles `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.
8. Make a tiny edit to `index.html`, commit and push it, then show your supervisor the new successful run in **Actions** and the updated live site.

If GitHub asks for Pages permissions, ensure the workflow has Pages write permission and the repository's Pages source is set to GitHub Actions.

## What to demonstrate to your supervisor

1. Open the live website and explain the six pipeline stages.
2. Use the interactive playground: make tests fail, then show that deployment becomes blocked.
3. Open the repository's `.github/workflows/ci-cd.yml`.
4. Open **Actions** and show the actual `CI - Validate website` job passing before `CD - Publish to GitHub Pages` runs.
5. Change a heading, push the change, and show the workflow running again.

## Important scope statement

The CI/CD implementation here is real for the **static website**: automated checks run and successful pushes are deployed to GitHub Pages. The model-quality gate on the page is a **front-end simulation** and must not be presented as an actual trained-model evaluation. To extend this to a thesis model, add tests and a reproducible evaluation script for the real model, dataset, and metrics.

## Suggested explanation

"I built a small website to demonstrate CI/CD concepts for MLOps. GitHub Actions runs automated smoke tests when I push code or open a pull request. The deployment job depends on the test job, so the site is published only after CI succeeds. GitHub Pages hosts the deployed website. The interactive panel illustrates an ML quality gate; it is explicitly simulated, while the CI/CD workflow itself is implemented and verifiable in GitHub Actions."
