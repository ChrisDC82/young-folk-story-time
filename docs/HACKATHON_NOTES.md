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

## Milestone 6 additions

- Newly written episode-owned Moko Jumbie reveal dialogue, four emotional choices, trust-dependent Angel disclosure, supportive/defensive/help-seeking reactions, and a deliberate pre-crisis endpoint built on the existing typed narrative engine.
- Five typed emotional-state fields plus guarded scene progression, with complete retention of Milestones 1–5 state and no shortcut consequence, broken strap, Carnival Crisis, or ending.
- Reusable character depth/movement presentation for Angel’s retreat behind Lexi, large pointer/touch/keyboard choice controls, reduced-motion behavior, and global mute access.
- Byte-for-byte runtime copy of the pre-existing creator-supplied `Kiddies Carnival scene.png`; protected source artwork remains unchanged.
- Cultural wording checked against public National Carnival Commission and NALIS traditional-mas references. No cultural media, audio, asset, API, or paid service was imported.
- Twelve additional automated test cases, full local browser validation, and no new dependency.

## Milestone 5 additions

- Newly written deterministic Pan Jam sequence/game rules, four-zone Phaser interface, positive adaptive assistance, Rhythm Star completion, responsive input orchestration, and reduced-motion support.
- Original runtime-generated Web Audio synthesis using oscillator fundamentals and partials, rapid attack/natural decay envelopes, filtering, and global mute integration. No audio file, sample pack, paid library, external API, or downloaded recording was used.
- Byte-for-byte runtime copy of the pre-existing creator-supplied `pan kids.png`; protected source artwork remains unchanged.
- Three new typed Pan Jam state fields with complete preservation of Milestones 1–4 narrative and Creator Badge state.
- Eighteen additional automated tests plus three-branch desktop/wide-phone browser validation through the Rhythm Star endpoint.

## Milestone 4 additions

- Reusable, tested Story Time/Carnival progression and Carnival exploration models, with no new narrative or Milestone 5 state.
- Newly written `StoryTimeScene` and `CarnivalScene` cinematic/interactive implementation using lightweight Phaser tweens, overlays, camera motion, particles, hotspots, dialogue, character expression swaps, and reduced-motion fallbacks.
- Byte-for-byte runtime copies of the pre-existing creator-supplied `Story pot.png` and `Kiddies Carnival Background.png`; the source artwork remains protected and unchanged.
- Three brief Carnival exploration hotspots and a Milestone 4 endpoint. No steelpan gameplay, delayed consequence, later narrative branch, audio download, or external service was added.
- Twelve additional automated flow/Carnival tests plus three-branch desktop and landscape-phone browser validation.

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

Codex was used to inspect the supplied project and artwork, implement the game code through Milestone 6, prepare deterministic runtime derivatives and unchanged runtime copies from supplied originals, synthesize temporary runtime audio in code, and validate the resulting local browser experience. No supplied character or environment was regenerated or uploaded to an external service.
