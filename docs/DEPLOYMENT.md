# Production Deployment

## Current status

The game is publicly deployed at [https://youngfolk.forwardeverfoundation.org](https://youngfolk.forwardeverfoundation.org). HTTPS and the custom domain are confirmed operational.

The production deployment is a self-contained Vite static build. Vite uses a relative `./` asset base, the game has no client-side URL routes, and no environment variables, API keys, backend, database, account system, or server process are required.

## Production configuration

| Setting | Production value |
|---|---|
| Production host | Vercel |
| Account tier | Free / Hobby |
| Custom domain | `youngfolk.forwardeverfoundation.org` |
| DNS provider | Hostinger |
| Deployment type | Vite static production build |
| Publish/output directory | `dist` |
| Paid services | None enabled |
| HTTPS/custom domain | Confirmed |

## Exact local release commands

From the repository root, with Node.js 20.19+ or 22.12+ and pnpm 11 installed:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm build
pnpm preview
```

Verify the preview URL printed by Vite. The files to publish are the **contents of `dist/`**, not the repository root.

## Build settings

The production deployment uses these static-build settings:

| Setting | Value |
|---|---|
| Project type | Static site |
| Production branch | `main` |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Publish/output directory | `dist` |
| Node version | `22` (22.12 or later) |
| Environment variables | None |
| Serverless functions | None |
| SPA redirect rule | None required; the game uses one `index.html` and no URL router |
| Billing/paid add-ons | None enabled |

The files published are the **contents of `dist/`**, not the repository root.

## Release verification

- HTTPS and the custom-domain route load successfully.
- The title, runtime artwork, pointer and keyboard controls, audio initialization, mute/unmute, Pan Jam, Carnival Crisis repair, ending, Story Card, replay, desktop layout, and landscape-phone layout have been checked on the public origin.
- The browser console has no release-blocking errors.
- The source repository URL remains intentionally unset until repository publication is separately authorized.

## Cost

The project has no hosting-specific dependency and requires no paid service. Vercel remains on its free/Hobby tier, and no billing, paid add-on, purchased build credit, expiring trial, or paid upgrade is enabled.
