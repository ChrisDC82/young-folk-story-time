# Young Folk: Story Time — Carnival Choices

Milestone 2 is a local, browser-based narrative game foundation built with Phaser, TypeScript, and Vite. It includes the Milestone 1 scene stack plus a reusable typed narrative engine, episode state, conditional choices, state effects, character expressions, automated tests, and the first branching CC Club conversation with Lexi, Angel, and Junior.

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
- Press `1`, `2`, or `3` to select a currently available choice.
- Press `Enter` or `Space` to advance.
- Press `M` or select the speaker button to mute/unmute.

## Protected artwork

Files in `assets-original/` are protected source artwork and must not be modified. Runtime copies and derivatives live under `public/assets/`. See `docs/ASSET_MANIFEST.md` for details.
