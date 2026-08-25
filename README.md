# Young Folk: Story Time — Carnival Choices

**Young Folk: Story Time** is a child-friendly browser narrative game set around a Caribbean Community and Cultural Club and Kiddies Carnival. Players guide Lexi through creative activities, friendship choices, a steelpan rhythm challenge, and a Carnival costume problem. The story remembers how the player treated Angel and Junior, then resolves into one of four positive endings and a personal Story Card.

**Live Demo:** [Play Young Folk: Story Time](https://youngfolk.forwardeverfoundation.org)

The public release is designed for children and families. It uses calm, non-punitive feedback: mistakes can be retried, help appears after repeated difficulty, and no path uses scores, failure screens, advertising, accounts, or in-app purchases.

## Playable experience

- Meet Lexi, Angel, and Junior at the CC Club and choose whether to follow instructions, try Angel's shortcut, or combine both ideas.
- Sequence four illustrated steps to make Lexi's Carnival wings and earn the Creator Badge.
- Travel through the Story Pot to Kiddies Carnival and explore the scene.
- Listen and play back visual steelpan patterns in Pan Jam to earn the Rhythm Star.
- Respond to Angel during a respectful Moko Jumbie sequence.
- Resolve a shortcut-dependent Carnival Crisis with a three-step costume repair.
- Reach **Together on the Road**, **One Little Step**, **We Fixed It**, or **CC Club Team**, then review the journey on a Story Card.

Choices update typed trust, cooperation, and story state. They shape later dialogue, crisis behavior, Angel's willingness to explain, and the ending; they are not presented as points or moral grades.

## Accessibility and controls

The game supports mouse, touch-style pointer input, and keyboard controls. It uses large landscape controls, visible text instructions, persistent mute, symbols and labels in addition to colour, and non-audio success cues. Motion follows the operating system's reduced-motion preference; append `?motion=reduce` to the URL to request it explicitly.

- `Enter` or `Space`: start, advance dialogue, or activate the primary action
- `H`: join the opening group at the steelpan hotspot
- `1`–`4`: select visible choices and Pan Jam zones
- `R`: play again from the final Story Card
- `T`: return to the title from the final Story Card
- `M`: mute or unmute
- Tap/click the large on-screen controls for the equivalent actions

Landscape orientation is recommended. Portrait devices receive a rotate-device message.

## Technology

- [Phaser](https://phaser.io/) 3.90 for browser presentation and input
- TypeScript 5.9 for typed narrative and game state
- Vite 7 for local development and production builds
- Vitest 4 for deterministic automated tests
- Browser Web Audio for locally synthesized Pan Jam tones

Narrative rules, ending resolution, Story Card generation, and mini-game models are plain TypeScript without Phaser dependencies. Episode-specific characters, dialogue, choices, and conditions live under `src/episodes/carnival-choices/`; Phaser scenes focus on presentation and input.

## Run locally

Requirements: Node.js 20.19+ or 22.12+, and pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite (normally `http://127.0.0.1:5173/`).

## Test and build

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm preview
```

The static production site is written to `dist/`. Production hosting and build settings are documented in [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Project structure

```text
assets-original/                  protected creator-supplied source artwork
public/assets/                    documented runtime copies and derivatives
src/episodes/carnival-choices/    episode-owned story and activity data
src/game/minigames/               reusable Phaser-independent game rules
src/game/scenes/                  Phaser presentation and orchestration
src/game/systems/                 narrative, state, audio, and flow systems
tests/                            automated state, branch, activity, and flow tests
docs/                             design, architecture, provenance, and submission notes
```

## Cost, privacy, and provenance

The project uses free and open-source development libraries and requires no paid API, backend, hosted database, analytics, advertising, account, or player-data collection. Pan Jam audio is synthesized in the browser; no copyrighted third-party music or downloaded sample pack is included.

The Young Folk characters and supplied illustrations predate this game and remain the creator's protected artwork. Files in `assets-original/` must not be modified. Runtime copies and technical derivatives are recorded in [`docs/ASSET_MANIFEST.md`](docs/ASSET_MANIFEST.md); the manifest does not grant broader reuse rights.

Hackathon presentation drafts are in [`docs/DEVPOST_SUBMISSION.md`](docs/DEVPOST_SUBMISSION.md), [`docs/SCREENSHOT_PLAN.md`](docs/SCREENSHOT_PLAN.md), and [`docs/DEMO_VIDEO_PLAN.md`](docs/DEMO_VIDEO_PLAN.md).
