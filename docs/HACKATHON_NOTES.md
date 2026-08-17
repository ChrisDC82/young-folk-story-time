# Hackathon Notes

## Project provenance

- Interactive game development began: 2026-08-17.
- The underlying **Young Folk** characters, artwork, and source illustrations predate this browser game and this implementation work.
- The Phaser/TypeScript interaction code, scene architecture, UI components, episode wiring, and Milestone 1 interactive content were newly created for the game.
- Original artwork remains protected in `assets-original/`; runtime copies and derivatives are documented in `docs/ASSET_MANIFEST.md`.

## External libraries

- Phaser 3.90.0
- Vite 7.x
- TypeScript 5.9.x
- Vitest 4.x (MIT-licensed, local automated testing only)

No paid APIs, backends, analytics, advertising, authentication, tracking, or personal-data collection were added.

## Milestone 3 additions

- A reusable, deterministic sequencing mini-game model and a Phaser presentation scene for the Carnival Costume Challenge.
- Four code-drawn illustrated step cards with mouse drag, tap/touch-style placement, large targets, gentle retry motion, progressive visual hints, confetti, and the Creator Badge.
- Two typed costume state fields that preserve the complete Milestone 2 narrative snapshot through challenge completion and costume-only replay.
- A byte-for-byte runtime copy of the creator-supplied `lexi making wings.png`; no external image generation, asset service, or paid tooling was used.
- Eight additional automated mini-game tests and live desktop/landscape-phone browser validation.

## Milestone 2 additions

- Reusable typed narrative, state, condition, effect, choice, and dialogue-progression systems.
- Episode-owned opening conversation and three tested branches.
- Newly prepared runtime-only expression derivatives for Lexi, Angel, and Junior; the underlying supplied artwork remains unchanged.
- Automated state, choice, condition, progression, reset, and scene-state tests.

## AI-assisted development

Codex was used to inspect the supplied project and artwork, implement the game code through Milestone 3, prepare deterministic runtime derivatives and unchanged runtime copies from supplied originals, and validate the resulting local browser experience. No supplied character or environment was regenerated or uploaded to an external service.
