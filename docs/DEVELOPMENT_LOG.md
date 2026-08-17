# Development Log

## 2026-08-17 — Milestone 5: Pan Jam

### Scope completed

- Continued naturally from Carnival exploration into a concise Lexi, Junior, and Angel exchange, then transitioned into **PAN JAM** without implementing any later Carnival storyline.
- Added a tutorial with one-note and two-note demonstrations followed by deterministic 2-note, 3-note, and 4-note rounds.
- Added four large playable pan zones—Sun, Diamond, Moon, and Heart—distinguished by position, colour, symbol, outline shape, written label, number key, illumination, and a distinct tone.
- Added unified pointer/touch-style activation and keyboard keys 1–4, with immediate visual depression/glow and responsive synthesized sound.
- Added positive character encouragement, incremental input comparison, no failure screen, no score, no lives, no countdown, and no punitive feedback.
- Added a restrained or performance-enhanced musical-note/star celebration and persistent `panCompleted` Rhythm Star achievement signal.
- Added Pan-only replay and a clear Milestone 5 Carnival endpoint; Milestone 6 content was not started.

### Audio implementation

- Added `SteelpanSynth`, which creates four original runtime tones with the browser Web Audio API. Each note combines sine/triangle oscillators at a fundamental plus tuned partials, a rapid exponential attack, natural layered decay, low-pass filtering, and a final gain envelope.
- The implementation creates no audio files, downloads no samples, and contacts no API or service. It uses no external or commercial sample library.
- Synthesis checks the existing global `AudioManager` mute state before creating or playing an audio context. Visual cues remain complete while muted or if Web Audio is unavailable.
- These steelpan-like MVP tones are temporary and can later be replaced with creator-owned or properly licensed authentic recordings.

### Adaptive difficulty and accessibility

- The first missed note triggers a friendly replay; repeated difficulty slows playback from 640 ms to 740/900 ms and extends cue illumination from 380 ms to 500/650 ms.
- After three misses on the same expected note, Lexi plays that note together with the child and advances the pattern. Repeating this assistance can complete every sequence, so rhythm difficulty never blocks the story.
- Strong no-mistake performance slightly quickens later playback to 520 ms and increases the final lightweight celebration, without showing a numerical score.
- Every sound has a simultaneous visible zone cue and accumulating symbol display. Pan zones never depend on colour alone.
- Reduced motion honors `prefers-reduced-motion` and the explicit `?motion=reduce` fallback, removing scale-heavy cues and animated celebration travel while retaining lights, symbols, text, audio, state, and controls.

### Artwork and provenance

- Reused `assets-original/pan kids.png`, the creator-supplied 1672×941 Young Folk steelpan illustration, as the prominent Pan Jam backdrop.
- Created `public/assets/backgrounds/carnival/pan-kids.png` as a byte-for-byte runtime copy with the same SHA-256. No supplied artwork was edited, regenerated, uploaded, or processed externally.
- Reused the existing Carnival background and prepared Lexi, Angel, and Junior derivatives for the narrative handoff.

### State and architecture

- Added `panRoundsCompleted: number`, `panMistakes: number`, and `panCompleted: boolean` to the existing typed state. Rhythm Star availability is represented by `panCompleted` for later Story Card systems.
- `SteelpanGame` and `RhythmSequence` contain deterministic, Phaser-independent rules. `PanGameScene` owns only presentation/timing/input orchestration, `PanZone` owns reusable controls, and `SteelpanSynth` owns Web Audio synthesis.
- Pan Jam changes only its three fields. All opening choice, trust, cooperation, shortcut, instructions, combined ideas, costume attempts/completion, and Creator Badge state remain unchanged. `usedShortcut` has no Milestone 5 consequence.
- A full new story still resets all episode state; Pan-only replay resets only the three Pan Jam fields.

### Automated coverage and validation

- Added 18 tests for sequence generation/validation, correct and incorrect incremental input, mistake counting, slow/long assistance, guided progress, round advancement, completion, strong performance, state preservation, Pan-only restart, guaranteed assisted completion, global mute behavior, reduced-motion fallback, and guarded flow completion.
- Full suite: 52 tests passed across 10 test files.
- Strict TypeScript and production build passed; the existing Phaser bundle-size advisory remains non-blocking.
- Browser: complete Milestones 1–5 playthroughs passed for Follow Junior, Follow Angel, and Work Together. The Junior path included deliberate mistakes and assistance; the Angel path verified strong-performance celebration; the Work Together path completed at 844×390 with `?motion=reduce`.
- Mouse/pointer, touch-style taps, keyboard, mute/unmute, visual-only note cues, Pan replay, desktop landscape, wide-phone landscape, and the Rhythm Star endpoint passed. Browser console showed no warnings or errors caused by the game.
- Free/open-source dependencies added: none.

### Explicitly deferred

- Authentic creator-owned/licensed steelpan recordings.
- Moko Jumbie emotional sequence, Angel fear storyline, broken wing strap, delayed shortcut consequence, Carnival Crisis, endings, Story Card, AI, backend, authentication, database, analytics, payments, and external services.

## 2026-08-17 — Milestone 4: Story Time Transition + Carnival Arrival

### Scope completed

- Replaced the Milestone 3 stopping copy with a deliberate child-friendly **STORY TIME!** continuation action after the Creator Badge.
- Added a reusable `StoryProgression` controller for guarded Club → Costume → Story Time → Carnival → Milestone 4 completion flow. It changes no narrative values.
- Added episode-owned Story Time bridge dialogue, magical-reaction dialogue, Carnival arrival dialogue, and Carnival hotspot definitions.
- Added `StoryTimeScene` as a cinematic interactive transition: the CC Club dims, the story pot glows, lightweight sparkles rise, the Caribbean map is outlined, Trinidad & Tobago is highlighted and labelled, Lexi says “Story time is here!”, Angel and Junior react, and the supplied story-pot close-up performs a gentle camera push before Carnival.
- Added `CarnivalScene` using the supplied empty Kiddies Carnival environment with proportional cover scaling, a subtle background push, low-count drifting confetti, floating musical notes, slide/fade character arrival, expression swaps, and gentle idle motion.
- Added three large pointer/touch/keyboard hotspots for the steelpan stage, Carnival banner, and festival flags. Each provides brief visual/dialogue feedback only; Pan Jam was not implemented.
- Added a clear Milestone 4 completion overlay after at least one hotspot interaction, with Pan Jam named only as the next milestone.
- Added `prefers-reduced-motion` fallbacks that shorten scene fades and transition tweens, remove camera movement and repeating idle/pulse motion, and reduce static particle counts without removing textual or visual meaning.
- Fixed Phaser scene-instance replay state so repeated full stories reset scene-local locks, cards, stages, and hotspot collections correctly.

### Artwork and provenance

- Reused the creator-supplied CC Club background and existing Lexi, Angel, and Junior runtime derivatives without alteration.
- Created `public/assets/backgrounds/cc-club/story-pot.png` as a byte-for-byte copy of `assets-original/Story pot.png`.
- Created `public/assets/backgrounds/carnival/kiddies-carnival-background.png` as a byte-for-byte copy of `assets-original/Kiddies Carnival Background.png`.
- The 3:2 Carnival source is never stretched. Phaser scales it proportionally to cover the 16:9 canvas, with only a reversible top/bottom presentation crop.
- No supplied image was edited, regenerated, uploaded, or processed by an external service.

### State preservation

- Story Time, Carnival arrival, hotspot exploration, and Milestone 4 completion add no fields to `CarnivalGameState` and apply no state effects.
- Angel trust, Junior trust, cooperation, opening choice, `usedShortcut`, instructions followed, combined ideas, `costumeAttempts`, and `costumeCompleted` remain unchanged through the complete transition.
- `costumeCompleted` remains the Creator Badge/completed-costume signal.
- `usedShortcut === true` is preserved without triggering a strap failure or any delayed consequence.
- Starting a new full story still resets the complete episode state.

### Architecture and automated coverage

- Added Phaser-independent `StoryProgression` and `CarnivalExperience` systems so transition guards, Carnival initialization, hotspot visits, state preservation, and restart behavior can be tested without rendering Phaser.
- Added 12 tests covering completed-costume transition, all three opening branches through Story Time, shortcut and attempt preservation, Carnival arrival readiness, full-story reset, absence of Milestone 5 state, Carnival initialization, hotspot visits, and incomplete-costume rejection.
- Full suite: 34 tests passed across 6 test files.

### Validation

- Strict TypeScript (`tsc --noEmit`): passed.
- Production build (`tsc --noEmit && vite build`): passed; the existing Phaser bundle-size advisory remains non-blocking.
- Browser end-to-end: Follow Junior, Follow Angel, and Work Together each completed opening → costume → Creator Badge → Story Time → Carnival.
- Desktop: keyboard narrative flow, pointer costume controls, keyboard and pointer hotspots, mute toggle, transition visuals, Carnival exploration, milestone completion, and repeated full-story replay passed.
- Landscape phone viewport (844×390): full Work Together path passed with touch-style taps; canvas, dialogue, cards, Story Time, Carnival, hotspots, and endpoint remained reachable.
- Browser console: no warnings or errors.
- Reduced-motion implementation is code-complete and retains all text/state cues; the browser harness did not expose an operating-system motion-preference emulator for a separate visual pass.
- Free/open-source dependencies added: none.

### Explicitly deferred

- Pan Jam and adaptive rhythm difficulty.
- Moko Jumbie emotional choices and Angel's fear storyline.
- Delayed shortcut consequence, broken wing strap, Carnival Crisis, endings, Story Card, AI, backend services, authentication, databases, analytics, payments, and paid services.

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
