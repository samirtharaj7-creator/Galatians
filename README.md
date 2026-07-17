# Galatians Commentary

A static, responsive study of Paul’s letter to the Galatians with the King
James Version, verse-by-verse commentary, historical introduction, cross
references, and word notes.

## Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

The production build is exported to `out/` for static hosting.

## Deployment

The repository includes an automated GitHub Pages workflow for
`https://galatians.mybibleexplorer.com`. See [DEPLOYMENT.md](DEPLOYMENT.md) for
the one-time GitHub and DNS setup.
