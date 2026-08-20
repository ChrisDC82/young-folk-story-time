# Young Folk: Story Time — Carnival Choices

This local browser game is built with Phaser, TypeScript, and Vite. Through Milestone 6 it includes the branching CC Club opening, Carnival Costume Challenge, Story Time transition, Carnival arrival, adaptive Pan Jam rhythm game, Rhythm Star, and a trust-sensitive Moko Jumbie emotional sequence with Lexi, Angel, and Junior.

## Requirements

- Node.js 20.19+ or 22.12+
- pnpm 10+

## Install and run

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite. Use a landscape browser window for the intended 16:9 experience.

## Validate and build

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm preview
```

The production output is written to `dist/`.

## Controls

- Tap/click the large controls, or use the displayed keyboard shortcuts.
- Press `H` to activate the steelpan hotspot.
- Press `1`–`4` for Pan Jam zones and currently available story choices.
- Press `Enter` or `Space` to advance.
- Press `M` or select the speaker button to mute/unmute.

Pan Jam audio is synthesized locally with the browser Web Audio API. The MVP uses no downloaded recording, paid service, backend, analytics, or network API.

## Protected artwork

Files in `assets-original/` are protected source artwork and must not be modified. Runtime copies and derivatives live under `public/assets/`. See `docs/ASSET_MANIFEST.md` for details.
