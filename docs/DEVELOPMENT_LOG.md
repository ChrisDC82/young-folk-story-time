# Development Log

## 2026-08-17 — Milestone 3: Carnival Costume Challenge

### Scope completed

- Transitioned directly from each Milestone 2 opening-choice reaction into a new `CostumeGameScene`; Story Time and all later scenes remain unimplemented.
- Added a reusable, Phaser-independent `CostumeSequenceGame` model with typed steps, slot placement, sequence evaluation, invisible attempt counting, progressive hints, board reset, and costume-only restart behavior.
- Added four large illustrated step cards for **Shape the wings**, **Colour the wings**, **Decorate the wings**, and **Attach the straps**, with First → Next → Then → Last target slots.
- Added mouse drag-and-drop plus single-tap placement through Phaser's unified pointer input, making the same controls available to mouse and touch devices.
- Added gentle wobble-and-return feedback and encouraging copy for incomplete sequences. No red X, harsh buzzer, punitive wording, or visible score is used.
- Added a subtle pulsing card-and-slot hint after two unsuccessful sequence attempts.
- Added a successful wing-card motion, falling multicolour confetti, and a prominently animated **Creator Badge**.
- Repurposed the existing completion scene as the Milestone 3 stopping point, showing the Creator Badge and the preserved opening branch without advancing the story.
- Added costume-only replay behavior that clears `costumeAttempts` and `costumeCompleted` while retaining trust, cooperation, instructions, combined ideas, `usedShortcut`, and `openingChoice`.
- Corrected the responsive shell so the full 16:9 canvas remains reachable on wide landscape phones rather than clipping the bottom card tray.

### Artwork and provenance

- Added the newly supplied `assets-original/lexi making wings.png` to the canonical asset record as a protected creator-supplied Young Folk original.
- Created `public/assets/backgrounds/cc-club/lexi-making-wings.png` as a byte-for-byte runtime copy. Both files are 1672×941 RGB PNGs with the same SHA-256; no visual transformation was applied.
- Used the artwork as the full-frame challenge backdrop so Lexi, the butterfly wings, craft table, and CC Club setting remain central to play.
- Added no generated, downloaded, paid, trial, or externally hosted assets.

### State changes

- Added `costumeAttempts: number`, initially `0`. It increases once for each complete four-card sequence submission and is never displayed to the player.
- Added `costumeCompleted: boolean`, initially `false`, set to `true` only by the correct sequence.
- The mini-game changes no Milestone 2 narrative fields. In particular, `usedShortcut === true` is preserved without triggering the delayed strap consequence.

### Automated coverage

- Added eight costume-system tests covering the correct sequence, incorrect sequence reset, attempt counting, progressive hint activation, successful completion, `costumeCompleted`, narrative-state preservation, board reset, and costume-only restart behavior.
- Updated existing state and choice expectations for the expanded typed state.
- Full suite: 22 tests passed across 4 test files.

### Validation

- Strict TypeScript (`tsc --noEmit`): passed.
- Production build (`tsc --noEmit && vite build`): passed. The existing Phaser bundle-size advisory remains non-blocking and unchanged in nature.
- Desktop browser: mouse dragging, tap placement, gentle retry, hint activation, correct completion, confetti, Creator Badge, replay, and opening-branch presentation validated.
- Landscape phone viewport (844×390): full canvas and card tray fit; the correct sequence completed using touch-style single-tap interactions.
- Browser console: no warnings or errors.
- Free/open-source dependencies added: none.

### Explicitly deferred

- The delayed shortcut consequence and any broken wing strap.
- Story Time transition, Carnival exploration, steelpan gameplay, Moko Jumbies, Carnival Crisis, endings, AI, backend services, authentication, and analytics.

## 2026-08-17 — Milestone 2: Narrative Engine

### Scope completed

- Added typed character IDs, expression IDs, story nodes, story choices, story conditions, state effects, and Carnival episode state.
- Added reusable `GameStateManager`, `ChoiceSystem`, and `NarrativeEngine` classes that do not depend on Phaser and can be tested independently.
- Added dialogue progression, conditional-choice filtering, guarded choice selection, node conditions, node actions, and scene-independent state snapshots.
- Added Angel trust, Junior trust, cooperation, instruction, combined-ideas, selected-opening-choice, and shortcut state.
- Moved the CC Club opening conversation, three player choices, effects, reactions, character definitions, texture mappings, and branch text into episode-specific data modules.
- Preserved the existing Boot, Preload, Title, CC Club, and Completion scene architecture plus the Milestone 1 hotspot, dialogue box, choice button, responsive canvas, keyboard controls, and mute control.
- Added a reusable `CharacterStage` that displays Lexi, Angel, and Junior, swaps expression textures, highlights the current speaker, and shows visibly different branch reactions.
- Added separate runtime derivatives for the exact character expressions required by this conversation. Protected source artwork remains unchanged.
- Added 14 automated tests covering initial/reset state, typed effects, trust persistence, all three opening-choice outcomes, conditional choices, invalid choices, dialogue progression, branch destinations, required-choice guards, and state shared across scene-level engines.

### Opening choice effects

- **Follow Junior:** Junior trust +1; instructions followed; shortcut not used.
- **Follow Angel:** Angel trust +1; shortcut used; instructions not followed.
- **Work Together:** Angel trust +1, Junior trust +1, cooperation +1; instructions followed; ideas combined; shortcut not used.

The numeric values remain internal and are not displayed to children.

### Architecture decisions

- Reusable narrative types live in `src/types/`; reusable state and story behavior live in `src/game/systems/`; episode-owned copy and configuration live in `src/episodes/carnival-choices/`.
- The narrative engine receives a state manager instead of owning global state, allowing tests and future episodes to create isolated state while scenes share the singleton manager.
- Choices are filtered by typed conditions before display and revalidated before effects are applied.
- A story node applies actions only when entered, preventing repeated reads from applying effects more than once.
- Starting a new playthrough from the title resets episode state; transitioning to another scene does not.
- Vitest was added as a local-only MIT-licensed development dependency. No API or hosted service is used.

### Explicitly deferred

- Later consequences of the shortcut.
- Costume and steelpan mini-games.
- Trust-dependent later scenes, ending resolution, saving, and persistence.
- Additional hotspots and full character animation.

### Validation

- Automated tests: 14 passed.
- Strict TypeScript check: passed.
- Browser validation: all three reactions and scene-to-scene branch summaries passed with no console errors.
- Production build: passed.

## 2026-08-17 — Milestone 1: Playable Skeleton

### Scope completed

- Boot and preload scene architecture with a visible loading indicator.
- Responsive 1280×720 Phaser canvas using 16:9 fit scaling, centered layout, touch support, and a portrait-orientation message.
- Title screen for **Young Folk: Story Time — Carnival Choices** with pointer and keyboard start controls.
- CC Club scene using the supplied club interior and a runtime-only Lexi front-pose derivative.
- Light Lexi entrance and idle motion without skeletal animation or character redesign.
- Reusable steelpan hotspot with visible pulse/activation feedback and pointer or `H` activation.
- Reusable dialogue box supporting speaker, short text, and continue interaction.
- Three-option choice display with pointer and number-key selection, selected-option feedback, and explicit continue control.
- Fade transition into a temporary completion scene.
- Reusable audio manager with music, ambience, dialogue, and sound-effect channels plus a global pointer/`M` mute control. No audio content was added.
- Large child-friendly controls and readable text with visible hover/selection feedback.

### Major files created

- Phaser/Vite bootstrap: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `src/main.ts`, `src/style.css`.
- Reusable game foundation: `src/game/Game.ts`, `src/game/config.ts`, five Milestone 1 scenes, four reusable interface components, and `AudioManager`.
- Episode-specific content: `src/episodes/carnival-choices/episode.ts`.
- Shared types: `src/types/dialogue.ts`.
- Runtime asset preparation: `scripts/prepare-assets.py` and files under `public/assets/`.
- Documentation: `README.md`, `docs/ASSET_MANIFEST.md`, `docs/DEVELOPMENT_LOG.md`, and `docs/HACKATHON_NOTES.md`.

### Assets used

- `Community Cultural Club Background.png`: copied unchanged into the runtime asset tree.
- `Lexi Character Sheet.png`: used to produce a non-destructive front-pose derivative with transparent background.

### Technical decisions

- Reusable systems and components live under `src/game/`; Carnival Choices copy and asset references live under `src/episodes/carnival-choices/`.
- Only the two assets needed for this milestone are preloaded.
- The CC Club source image almost exactly matches 16:9, so it fills the game canvas without distortion.
- The steelpan already visible in the CC Club illustration was chosen as the hotspot; no extra object artwork was invented.
- No permanent narrative state, consequence engine, trust system, mini-game, or audio files were added.

### Unresolved issues and later asset work

- The current Lexi sprite is a safe static derivative. Other poses and the remaining character sheets still need careful manual/reviewed extraction before animation work.
- The Phaser production bundle is larger than Vite's default warning threshold because Phaser is the main runtime. This is acceptable for the skeleton; future episodes should consider scene-level asset loading and measured code-splitting only if it improves real device startup time.
- Audio channels are established, but licensed/original music, ambience, dialogue, and effects are intentionally absent.
- Portrait mode currently shows a rotate-device message rather than a portrait layout.
