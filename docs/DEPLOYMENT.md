# Deployment Handoff

## Current status

The game is deployment-ready as a static Vite site. `pnpm build` creates a self-contained `dist/` directory, Vite uses a relative `./` asset base, the game has no client-side URL routes, and no environment variables, API keys, backend, database, account system, or server process are required.

No Git remote or hosting configuration is present, and no public hosting account has been authorized. Milestone 10 therefore does not publish the repository or game. This avoids guessing Chris's repository ownership, hosting provider, account, or public URL.

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

## Settings for any free static host

Use a provider/account selected and controlled by Chris with these settings:

| Setting | Value |
|---|---|
| Project type | Static site |
| Production branch | Chris's chosen default branch (currently local `main`) |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `pnpm build` |
| Publish/output directory | `dist` |
| Node version | `22` (22.12 or later) |
| Environment variables | None |
| Serverless functions | None |
| SPA redirect rule | None required; the game uses one `index.html` and no URL router |
| Billing/paid add-ons | Do not enable |

An equivalent manual upload is valid: build locally and upload the contents of `dist/` to a free static-site project. The selected provider must offer a genuinely free non-expiring tier that does not require billing for this small static site.

## Remaining owner-authorized steps

1. Choose a free static host and create or select the project under Chris's account.
2. If repository-based deployment is preferred, create the remote repository, add it as a Git remote, and push the accepted release only after reviewing its visibility and artwork permissions.
3. Apply the exact settings above, or upload the built `dist/` contents manually.
4. Do not enable analytics, access logs beyond provider defaults, paid build minutes, paid bandwidth, or a custom domain purchase for the MVP.
5. Open the public URL in a fresh browser and validate initial load, assets, sound after user interaction, one choice, both mini-games, crisis repair, ending, Story Card, replay, landscape phone sizing, and the console.
6. Replace the `PUBLIC_DEPLOYMENT_URL` placeholder in `docs/DEVPOST_SUBMISSION.md` and add the final repository URL only after publication is authorized.

## Cost

The project itself has no hosting-specific dependency and requires no paid service. The remaining account action must use a free static-host tier. If the chosen provider requests a credit card, billing activation, purchased build credits, an expiring trial, or a paid upgrade, stop and choose another provider.
