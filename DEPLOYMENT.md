# Galatians Commentary deployment

The production site is configured for:

`https://galatians.mybibleexplorer.com`

The Next.js application creates a static export in `out/`. A push to `main`
runs TypeScript, lint, and production-build checks, verifies every public route,
and deploys the generated site through GitHub Pages.

## One-time GitHub setup

1. Create the GitHub repository and push this project to its `main` branch.
2. Open **Settings → Pages** and select **GitHub Actions** as the publishing source.
3. In the Pages custom-domain field, enter `galatians.mybibleexplorer.com`.
4. At the DNS provider for `mybibleexplorer.com`, add:

   | Type | Host | Target |
   | --- | --- | --- |
   | CNAME | `galatians` | `samirtharaj7-creator.github.io` |

5. After GitHub provisions the certificate, enable **Enforce HTTPS**.

Verifying `mybibleexplorer.com` in the GitHub account settings is recommended
to protect its Pages subdomains from takeover.

## Local production check

```bash
npm ci
npm run typecheck
npm run lint
NEXT_PUBLIC_SITE_URL=https://galatians.mybibleexplorer.com npm run build
```

The generated `out/` directory must contain:

- `index.html`, `404.html`, `.nojekyll`, and `CNAME`
- `background/index.html`
- `articles/index.html`
- all six chapter pages under `out/galatians/`

## Deploying

Push to `main`, then follow the **Deploy Galatians Commentary to GitHub Pages**
workflow under the repository’s **Actions** tab. The workflow can also be run
manually with **Run workflow**.
