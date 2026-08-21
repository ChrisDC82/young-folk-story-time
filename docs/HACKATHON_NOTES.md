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

## Milestone 10 release candidate

- Froze the completed Milestones 1–9 story and gameplay architecture. The only runtime change corrects a verified accessibility gap by making the generated Phaser canvas keyboard-focusable and giving it an application role and accessible name; a regression test covers the exact attributes.
- Replaced the stale README with an accurate public overview and prepared `DEVPOST_SUBMISSION.md`, `SCREENSHOT_PLAN.md`, `DEMO_VIDEO_PLAN.md`, and `DEPLOYMENT.md` for human review and account-owner action.
- Production QA completed full normal-motion and reduced-motion routes across desktop and landscape-phone layouts, including the shortcut and non-shortcut crises, trust-dependent disclosure, repair assistance, two distinct endings, Story Cards, replay, mute, pointer/touch-style input, keyboard input, and clean console checks.
- Final automated coverage is 95 passing tests across 15 files. Strict TypeScript, production build, dependency audits, asset integrity checks, secret/privacy/network scans, and repository release audits pass. The only build advisory is the already accepted Phaser chunk-size warning.
- Cultural wording remains unchanged and respectful. The Moko Jumbie description was rechecked against the [National Carnival Commission](https://ncctt.org/traditional-mas-characters-moko-jumbie/) and [NALIS Carnival guide](https://www.nalis.gov.tt/resources/tt-content-guide/carnival/); the game presents Moko Jumbies as skilled traditional Carnival masqueraders balancing and dancing on tall stilts.
- No source or runtime artwork changed. No new asset, derivative, dependency, recording, API, backend, analytics, tracking, hosted service, paid service, credit, trial, subscription, or personal-data feature was introduced.
- The static `dist/` build is ready for a free host, but no repository or game was published because the local repository has no remote and hosting requires Chris's account, repository-visibility, and provider decisions. Exact cost-free settings and verification steps are in `docs/DEPLOYMENT.md`.

## Milestone 9 additions

- Polished the existing presentation rather than creating new story or gameplay content: shared button selection/press feedback, child-friendly minimum interaction targets, mute feedback, canvas focus visibility, reduced-motion-safe dialogue, consistent character motion handling, and more readable Story Card typography.
- Extended reduced-motion behavior through the earlier title, CC Club, costume, completion, Story Time, and Carnival presentation. The costume game keeps the same rules while substituting immediate card state changes, a steady hint, and a small static success treatment for nonessential motion.
- Reviewed the four-channel audio manager and code-generated steelpan profile. The four distinct notes, persistent mute, Web Audio behavior, and cleanup remained correct, so no new recording, audio file, audio library, or synthesis redesign was introduced.
- Browser QA covered the full journey and representative ending route in normal and reduced motion, desktop, 844×390 and 740×360 landscape phones, mouse, keyboard, touch-style pointer input, mute, replay, and clean console checks. The existing 94-test suite, strict TypeScript check, and production build pass.
- Reused every existing Young Folk source/runtime image unchanged. No derivative, dependency, API, backend, hosted service, paid service, purchased credit, expiring trial, subscription, commercial asset, or personal-data feature was added.

## Milestone 8 additions

- Newly written episode-owned dialogue and reflections for Together on the Road, One Little Step, We Fixed It, and CC Club Team, preserving the four names and priority previously established in the game design.
- Reusable Phaser-independent `EndingResolver` and `StoryCardBuilder` models, typed ending/achievement metadata, and read-only use of the complete Milestones 1–7 narrative snapshot. No new mutable run-state field or duplicate badge framework was introduced.
- A newly written `EndingScene` with concise emotional payoff, code-drawn Story Card and achievement seals, existing Creator Badge/Rhythm Star signals, one ending badge, Play Again, Title, persistent mute, reduced motion, and responsive pointer/touch/keyboard controls.
- Eleven additional tests plus all-four-ending desktop/wide-phone browser validation, including replay into a second run and clean endpoint consoles.
- Existing artwork was reused unchanged. No new image, derivative, dependency, API, paid service, credit, trial, subscription, commercial asset, external audio, or hosted service was introduced.

## Milestone 7 additions

- Newly written episode-owned shortcut and non-shortcut Carnival Crisis stories, three shared choices, a conditional fourth Angel-disclosure choice, trust/emotional-history-dependent responses, branch-specific post-repair dialogue, and a temporary Milestone 8 continuation point.
- Ten typed crisis-state fields with complete preservation of opening, trust, cooperation, costume, badge, Pan Jam, and Moko Jumbie state. The delayed shortcut consequence is now implemented without falsely breaking Lexi’s wings on careful non-shortcut paths.
- Reusable Phaser-independent `CarnivalCrisisRepair` rules for three-material selection, invisible attempt counting, subtle assistance after two unsuccessful selections, a three-press safety-clip interaction, completion, and repair-only reset/restart behavior.
- A newly written Phaser presentation using the existing Carnival background, costume illustration, and character derivatives with code-drawn problem/repair visuals, gentle feedback, large pointer/touch/keyboard controls, mute, reduced motion, and responsive landscape layouts.
- Eighteen additional tests and complete local browser validation. No dependency, API, paid service, credit, trial, commercial asset, external audio, new runtime image, or asset derivative was introduced.

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

Codex was used to inspect the supplied project and artwork, implement and validate the game through Milestone 10, prepare deterministic runtime derivatives and unchanged runtime copies from supplied originals, synthesize runtime Pan Jam audio in code, and prepare local release documentation. No supplied character or environment was regenerated or uploaded to an external service, and no repository, game build, screenshot, or video was published automatically.
